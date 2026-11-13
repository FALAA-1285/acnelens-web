/**
 * Data dari jurnal acuan:
 * A. Luthfi & M. Ali, "Analisis Kinerja Ekstraksi Fitur SURF dan HOG pada Deteksi
 * Acne Vulgaris", Jurnal Andalas: Rekayasa dan Penerapan Teknologi, Vol. 6 No. 1 (2026) 069-075.
 * Angka di sini disalin apa adanya dari jurnal tersebut (PDF-nya tidak disimpan di repo;
 * buka lewat DOI di JURNAL_ACUAN).
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

/** Konfigurasi terbaik di jurnal (Tabel 4: Linear + Lanczos3 + cell 8×8). */
export const HASIL_TERBAIK = { uji: 93.33, latih: 94.75 };

/** Akurasi uji model yang dilatih ulang tim untuk aplikasi AcneLens. */
export const AKURASI_APLIKASI = 92;

/**
 * Tahap pemrosesan — satu-satunya sumber untuk halaman Tentang (#alur) dan
 * langkah analisis di halaman Cek, supaya jumlah dan urutannya selalu sama.
 */
export const TAHAP_METODE = [
  {
    judul: "Mengubah ke hitam-putih",
    teknis: "Grayscale",
    isi: "Foto RGB diubah ke skala abu-abu supaya komputasi lebih ringan dan fokus pada intensitas piksel.",
  },
  {
    judul: "Menyeragamkan ukuran foto",
    teknis: "Resize 256 × 300, Lanczos3",
    isi: "Citra diubah ke 256 × 300 piksel. Tiga cara interpolasi diuji: bicubic, bilinear, dan Lanczos3.",
  },
  {
    judul: "Mencari titik penting",
    teknis: "Keypoint SURF, det(H) ≥ 1000",
    isi: "Citra integral dan determinan Hessian dipakai untuk mencari keypoint. Hanya keypoint dengan det(H) ≥ 1000 yang dipakai.",
  },
  {
    judul: "Menentukan area fokus",
    teknis: "ROI + deskriptor SURF (64 fitur)",
    isi: "Keypoint terkuat menjadi pusat region of interest (ROI). Respons Haar wavelet pada 4 × 4 subregion menghasilkan 64 fitur SURF.",
  },
  {
    judul: "Membaca tekstur kulit",
    teknis: "Deskriptor HOG, ROI 64 × 64, cell 8 × 8",
    isi: "ROI dinormalisasi ke 64 × 64 piksel. Arah gradien dikelompokkan ke 9 bin, dengan cell 8 × 8 dan blok 2 × 2.",
  },
  {
    judul: "Menggabungkan hasil bacaan",
    teknis: "Gabung & normalisasi fitur",
    isi: "Fitur SURF dan HOG disatukan menjadi satu vektor, lalu dinormalisasi.",
  },
  {
    judul: "Menentukan jenisnya",
    teknis: "Klasifikasi SVM linear",
    isi: "SVM kernel linear menentukan kelasnya: kulit normal, papula, atau pustula. Model divalidasi dengan cross-validation.",
  },
] as const;

/** Pendekatan lain yang dibandingkan di bagian celah penelitian. */
export const CELAH = [
  {
    judul: "GLCM + SVM",
    isi: "Menekankan tekstur statistik, tetapi belum memakai gabungan keypoint lokal dan orientasi gradien untuk membedakan papula, pustula, dan kulit normal.",
  },
  {
    judul: "CNN",
    isi: "Kuat untuk klasifikasi citra, tetapi butuh data besar, komputasi tinggi, dan fiturnya sulit ditafsirkan.",
  },
  {
    judul: "SURF atau HOG saja",
    isi: "Masing-masing hanya menangkap satu sisi: SURF unggul pada lokasi struktur lesi, HOG unggul pada pola tekstur tepi.",
  },
];
