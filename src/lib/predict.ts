import { URUTAN_KELAS, type KelasId } from "./kelas";

export type Probabilitas = Record<KelasId, number>;

export type HasilPrediksi =
  | { status: "berhasil"; label: KelasId; probabilitas: Probabilitas }
  | { status: "tidak_terdeteksi" };

/*
 * Respons yang diharapkan dari backend (POST /predict, field "file"):
 *
 *   { "label": "pustula",
 *     "probabilities": { "papula": 0.11, "pustula": 0.86, "non_acne": 0.03 } }
 *
 * Kalau SURF tidak menemukan keypoint dengan det(H) >= 1000:
 *
 *   { "label": null, "reason": "no_keypoint" }
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

// selama NEXT_PUBLIC_API_URL belum diisi, aplikasi memakai hasil acak
export const MODE_DEMO = !API_URL;

const TIPE_FILE = ["image/jpeg", "image/png", "image/webp"];
const UKURAN_MAKS = 5 * 1024 * 1024; // 5 MB
const JEDA_DEMO_MS = 3500;

/** Mengembalikan pesan galat bila file tidak valid, atau null bila valid. */
export function cekFile(file: File): string | null {
  const ekstensi = file.name.split(".").pop()?.toLowerCase();
  const formatDidukung =
    TIPE_FILE.includes(file.type) ||
    (ekstensi && ["jpg", "jpeg", "png", "webp"].includes(ekstensi));

  if (!formatDidukung) return "Format foto harus JPG, PNG, atau WebP.";
  if (file.size > UKURAN_MAKS) return "Ukuran foto maksimal 5 MB.";
  return null;
}

export async function kirimFoto(file: File, signal?: AbortSignal): Promise<HasilPrediksi> {
  if (MODE_DEMO) return hasilDemo(signal);

  const form = new FormData();
  form.append("file", file);

  // Menggunakan API route proxy internal (/api/predict) agar tidak terkena kendala CORS atau Mixed Content
  const res = await fetch("/api/predict", { method: "POST", body: form, signal });
  if (!res.ok) {
    const info = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(info?.error || `Server membalas dengan status ${res.status}`);
  }

  return bacaRespons(await res.json());
}

function isKelasId(nilai: unknown): nilai is KelasId {
  return typeof nilai === "string" && (URUTAN_KELAS as readonly string[]).includes(nilai);
}

function isProbabilitas(nilai: unknown): nilai is Probabilitas {
  if (typeof nilai !== "object" || nilai === null) return false;
  return URUTAN_KELAS.every((id) => {
    const p: unknown = Reflect.get(nilai, id);
    return typeof p === "number" && Number.isFinite(p) && p >= 0 && p <= 1;
  });
}

/**
 * Respons API datang dari luar aplikasi, jadi bentuknya diperiksa saat runtime.
 * Label yang tidak dikenal atau probabilitas yang rusak dianggap galat server,
 * bukan dibiarkan merusak halaman hasil.
 */
function bacaRespons(data: unknown): HasilPrediksi {
  if (typeof data !== "object" || data === null) {
    throw new Error("Respons server tidak valid");
  }
  const label: unknown = Reflect.get(data, "label");
  const probabilitas: unknown = Reflect.get(data, "probabilities");

  if (label === null || label === undefined) return { status: "tidak_terdeteksi" };
  if (!isKelasId(label) || !isProbabilitas(probabilitas)) {
    throw new Error("Respons server tidak sesuai format");
  }
  return { status: "berhasil", label, probabilitas };
}

function hasilDemo(signal?: AbortSignal): Promise<HasilPrediksi> {
  return new Promise((resolve, reject) => {
    const batal = () => {
      clearTimeout(timer);
      reject(new DOMException("Dibatalkan", "AbortError"));
    };
    if (signal?.aborted) {
      reject(new DOMException("Dibatalkan", "AbortError"));
      return;
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", batal);
      resolve(acakHasil());
    }, JEDA_DEMO_MS);

    signal?.addEventListener("abort", batal, { once: true });
  });
}

function acakHasil(): HasilPrediksi {
  // Simulasi realistis: ~12% kemungkinan tidak ada keypoint yang terdeteksi (SURF det(H) < 1000)
  // agar kondisi 'tidak_terdeteksi' dapat diuji dan didemonstrasikan
  if (Math.random() < 0.12) {
    return { status: "tidak_terdeteksi" };
  }

  const bobot = URUTAN_KELAS.map(() => Math.random() ** 3);
  const total = bobot.reduce((a, b) => a + b, 0);
  const probabilitas: Probabilitas = { papula: 0, pustula: 0, non_acne: 0 };
  URUTAN_KELAS.forEach((id, i) => {
    probabilitas[id] = bobot[i] / total;
  });
  const label = URUTAN_KELAS.reduce((a, b) => (probabilitas[a] >= probabilitas[b] ? a : b));
  return { status: "berhasil", label, probabilitas };
}

export function formatPersen(n: number): string {
  return `${Math.round(n * 100)}%`;
}
