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
 *
 * Mode demo ditentukan di server (lib/backend.ts) lalu diteruskan sebagai prop
 * ke komponen halaman cek — bukan dibaca dari env di browser.
 */

const JEDA_DEMO_MS = 3500;

/** Galat yang pesannya aman ditampilkan langsung ke pengguna. */
export class GalatPrediksi extends Error {
  constructor(
    pesan: string,
    readonly status?: number,
  ) {
    super(pesan);
    this.name = "GalatPrediksi";
  }
}

export async function kirimFoto(
  file: File,
  { demo, signal }: { demo: boolean; signal?: AbortSignal },
): Promise<HasilPrediksi> {
  if (demo) return hasilDemo(signal);

  const form = new FormData();
  form.append("file", file);

  // Lewat route internal /api/predict supaya alamat backend tidak terlihat di browser
  const res = await fetch("/api/predict", { method: "POST", body: form, signal });
  if (!res.ok) {
    const info = (await res.json().catch(() => null)) as { error?: unknown } | null;
    const pesan =
      typeof info?.error === "string" && info.error
        ? info.error
        : "Server memberi respons yang tidak terduga. Coba lagi beberapa saat lagi.";
    throw new GalatPrediksi(pesan, res.status);
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

/** Kelas dengan probabilitas terbesar. */
export function kelasTertinggi(p: Probabilitas): KelasId {
  return URUTAN_KELAS.reduce((a, b) => (p[a] >= p[b] ? a : b));
}

const TOLERANSI_TOTAL = 0.02;

/**
 * Respons API datang dari luar aplikasi, jadi bentuknya diperiksa saat runtime.
 * Label yang tidak dikenal, probabilitas rusak, total yang jauh dari 1, atau label
 * yang tidak sama dengan probabilitas tertinggi dianggap galat server — supaya
 * halaman hasil tidak pernah menampilkan dua jawaban yang saling bertentangan.
 */
export function bacaRespons(data: unknown): HasilPrediksi {
  const galat = new GalatPrediksi("Server memberi respons yang tidak terduga. Coba lagi beberapa saat lagi.");
  if (typeof data !== "object" || data === null) throw galat;

  const label: unknown = Reflect.get(data, "label");
  const probabilitas: unknown = Reflect.get(data, "probabilities");

  if (label === null || label === undefined) return { status: "tidak_terdeteksi" };
  if (!isKelasId(label) || !isProbabilitas(probabilitas)) throw galat;

  const total = URUTAN_KELAS.reduce((s, id) => s + probabilitas[id], 0);
  if (Math.abs(total - 1) > TOLERANSI_TOTAL) throw galat;
  if (probabilitas[label] < probabilitas[kelasTertinggi(probabilitas)]) throw galat;

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
  // ~12% kemungkinan tidak ada keypoint (SURF det(H) < 1000), supaya kondisi
  // 'tidak_terdeteksi' juga bisa didemonstrasikan
  if (Math.random() < 0.12) {
    return { status: "tidak_terdeteksi" };
  }

  const bobot = URUTAN_KELAS.map(() => Math.random() ** 3);
  const total = bobot.reduce((a, b) => a + b, 0);
  const probabilitas: Probabilitas = { papula: 0, pustula: 0, non_acne: 0 };
  URUTAN_KELAS.forEach((id, i) => {
    probabilitas[id] = bobot[i] / total;
  });
  return { status: "berhasil", label: kelasTertinggi(probabilitas), probabilitas };
}

/**
 * Persen bulat untuk tiap kelas yang jumlahnya selalu tepat 100
 * (metode sisa terbesar), supaya tidak muncul total 99% atau 101%.
 */
export function persenBulat(p: Probabilitas): Record<KelasId, number> {
  // normalisasi dulu: total dari backend boleh sedikit meleset dari 1
  const total = URUTAN_KELAS.reduce((s, id) => s + p[id], 0) || 1;
  const mentah = URUTAN_KELAS.map((id) => ({ id, nilai: (p[id] / total) * 100 }));
  const hasil = Object.fromEntries(mentah.map((m) => [m.id, Math.floor(m.nilai)])) as Record<KelasId, number>;
  let sisa = 100 - URUTAN_KELAS.reduce((s, id) => s + hasil[id], 0);
  const urutSisa = [...mentah].sort((a, b) => (b.nilai % 1) - (a.nilai % 1));
  for (const m of urutSisa) {
    if (sisa <= 0) break;
    hasil[m.id] += 1;
    sisa -= 1;
  }
  return hasil;
}
