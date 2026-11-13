import { URUTAN_KELAS, type KelasId } from "./kelas";

export type HasilPrediksi =
  | { status: "berhasil"; label: KelasId; probabilitas: Record<KelasId, number> }
  | { status: "tidak_terdeteksi" };

/*
 * Respons yang diharapkan dari backend (POST {API_URL}/predict, field "file"):
 *
 *   { "label": "pustula",
 *     "probabilities": { "papula": 0.11, "pustula": 0.86, "non_acne": 0.03 } }
 *
 * Kalau SURF tidak menemukan keypoint dengan det(H) >= 1000:
 *
 *   { "label": null, "reason": "no_keypoint" }
 */
type ResponsApi = {
  label: KelasId | null;
  probabilities?: Record<KelasId, number>;
  reason?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

// selama NEXT_PUBLIC_API_URL belum diisi, aplikasi memakai hasil acak
export const MODE_DEMO = !API_URL;

export const TIPE_FILE = ["image/jpeg", "image/png"];
export const UKURAN_MAKS = 5 * 1024 * 1024; // 5 MB

export function cekFile(file: File): string | null {
  if (!TIPE_FILE.includes(file.type)) return "Format foto harus JPG atau PNG.";
  if (file.size > UKURAN_MAKS) return "Ukuran foto maksimal 5 MB.";
  return null;
}

export async function kirimFoto(file: File, signal?: AbortSignal): Promise<HasilPrediksi> {
  if (MODE_DEMO) return hasilDemo(signal);

  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_URL}/predict`, { method: "POST", body: form, signal });
  if (!res.ok) throw new Error(`Server membalas dengan status ${res.status}`);

  const data: ResponsApi = await res.json();
  if (!data.label || !data.probabilities) return { status: "tidak_terdeteksi" };

  return { status: "berhasil", label: data.label, probabilitas: data.probabilities };
}

function hasilDemo(signal?: AbortSignal): Promise<HasilPrediksi> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const nilai = URUTAN_KELAS.map(() => Math.random() ** 3);
      const total = nilai.reduce((a, b) => a + b, 0);

      const probabilitas = {} as Record<KelasId, number>;
      URUTAN_KELAS.forEach((id, i) => (probabilitas[id] = nilai[i] / total));

      const label = URUTAN_KELAS.reduce((a, b) => (probabilitas[a] >= probabilitas[b] ? a : b));
      resolve({ status: "berhasil", label, probabilitas });
    }, 3500);

    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Dibatalkan", "AbortError"));
    });
  });
}

export function formatPersen(n: number) {
  return `${Math.round(n * 100)}%`;
}
