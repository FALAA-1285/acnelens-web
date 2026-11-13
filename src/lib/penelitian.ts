/**
 * Data dari jurnal acuan:
 * A. Luthfi & M. Ali, "Analisis Kinerja Ekstraksi Fitur SURF dan HOG pada Deteksi
 * Acne Vulgaris", Jurnal Andalas: Rekayasa dan Penerapan Teknologi, Vol. 6 No. 1 (2026) 069-075.
 * Angka di sini disalin apa adanya dari jurnal (docs/145 Prod-1.pdf).
 */

export const JURNAL_ACUAN = {
  judul: "Analisis Kinerja Ekstraksi Fitur Speeded Up Robust Features (SURF) dan Histogram of Oriented Gradients (HOG) pada Deteksi Acne Vulgaris",
  penulis: "Amirul Luthfi, Mutiara Ali",
  instansi: "Departemen Teknik Elektro, Universitas Andalas",
  terbitan: "Jurnal Andalas: Rekayasa dan Penerapan Teknologi, Vol. 06 No. 01 (2026), hlm. 69–75",
  doi: "10.25077/jarpet.v6i1.147",
};

export const DATASET = [
  {
    kelas: "Kulit normal",
    label: 0,
    jumlah: 500,
    sumber: "Kaggle Skin Disease Detection Dataset",
    href: "https://www.kaggle.com/datasets/mgmitesh/skin-disease-detection-dataset",
  },
  {
    kelas: "Papula",
    label: 1,
    jumlah: 500,
    sumber: "Kaggle Acne Dataset",
    href: "https://www.kaggle.com/datasets/anshchauhan248/acne-dataset",
  },
  {
    kelas: "Pustula",
    label: 2,
    jumlah: 500,
    sumber: "Kaggle Acne Dataset",
    href: "https://www.kaggle.com/datasets/anshchauhan248/acne-dataset",
  },
];

export type Parameter = { nama: string; variasi: string[]; terbaik: string; alasan: string };

export const PARAMETER: Parameter[] = [
  {
    nama: "Interpolasi citra",
    variasi: ["Bicubic", "Bilinear", "Lanczos3"],
    terbaik: "Lanczos3",
    alasan: "Kernel berbasis sinc menjaga ketajaman tepi, sehingga posisi keypoint dan arah gradien lebih informatif.",
  },
  {
    nama: "Ukuran cell HOG",
    variasi: ["4×4", "8×8", "16×16", "32×32"],
    terbaik: "8×8",
    alasan: "Seimbang antara detail lokal dan kestabilan. Cell kecil terlalu peka noise, cell besar menghilangkan detail lesi.",
  },
  {
    nama: "Kernel SVM",
    variasi: ["Linear", "Polynomial", "RBF"],
    terbaik: "Linear",
    alasan: "Fitur gabungan SURF-HOG pada konfigurasi terbaik cukup terpisah secara linear, jadi kernel sederhana sudah cukup.",
  },
];

/** Tabel 4 jurnal: akurasi [uji, latih] untuk cellsize 4×4, 8×8, 16×16, 32×32. */
export const CELLSIZE = ["4×4", "8×8", "16×16", "32×32"] as const;

export type BarisAkurasi = { kernel: string; interpolasi: string; nilai: [number, number][] };

export const AKURASI: BarisAkurasi[] = [
  { kernel: "Linear", interpolasi: "Bicubic", nilai: [[92.33, 94.75], [93, 94.75], [93, 94.74], [90, 92.08]] },
  { kernel: "Linear", interpolasi: "Bilinear", nilai: [[92, 94.75], [92.67, 94.75], [92.33, 94.74], [90, 93.08]] },
  { kernel: "Linear", interpolasi: "Lanczos3", nilai: [[91.67, 94.75], [93.33, 94.75], [92.33, 94.74], [90.67, 91.83]] },
  { kernel: "Polynomial", interpolasi: "Bicubic", nilai: [[70, 70.2], [54, 52.08], [23, 23.42], [92, 94.75]] },
  { kernel: "Polynomial", interpolasi: "Bilinear", nilai: [[73.67, 73.08], [57.67, 58.75], [45.67, 46.25], [92.67, 94.75]] },
  { kernel: "Polynomial", interpolasi: "Lanczos3", nilai: [[74, 75.33], [67, 67.25], [30.67, 34.58], [92.67, 94.75]] },
  { kernel: "RBF", interpolasi: "Bicubic", nilai: [[90.33, 94.75], [90.33, 94.75], [90.33, 94.75], [91.33, 94.75]] },
  { kernel: "RBF", interpolasi: "Bilinear", nilai: [[90.33, 94.75], [90.33, 94.75], [90.33, 94.75], [91.33, 94.75]] },
];

/** Konfigurasi terbaik: Linear + Lanczos3 + cell 8×8. */
export const TERBAIK = { kernel: "Linear", interpolasi: "Lanczos3", cell: 1 };

export const SIMILARITY = [
  { fitur: "SURF", nilai: 0.8858, arti: "Stabil dalam merepresentasikan keypoint lokal" },
  { fitur: "HOG", nilai: 0.9057, arti: "Lebih stabil dalam merepresentasikan tekstur gradien" },
];

/** Hasil uji model terbaik: 300 citra uji, 20 salah. */
export const KESALAHAN_UJI = {
  total: 300,
  papulaJadiNormal: 19,
  papulaJadiPustula: 1,
};

/** Format angka gaya Indonesia: 93.33 -> "93,33". */
export function persen(n: number) {
  return `${n.toLocaleString("id-ID", { maximumFractionDigits: 2 })}%`;
}
