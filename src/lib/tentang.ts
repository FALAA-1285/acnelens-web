/** Isi halaman /tentang yang bukan data penelitian (lihat lib/penelitian.ts). */

export const KETERBATASAN = [
  {
    judul: "Hanya tiga kelas",
    isi: "Komedo, nodul, dan kista tidak dikenali. Foto dengan jenis jerawat lain bisa salah ditebak.",
  },
  {
    judul: "Papula paling sulit",
    isi: "Warna dan tonjolan papula bisa samar, sehingga kadang dianggap kulit normal.",
  },
  {
    judul: "Peka terhadap cahaya",
    isi: "Pencahayaan yang tidak merata atau foto yang buram dapat menurunkan ketepatan hasil.",
  },
  {
    judul: "Bukan diagnosis",
    isi: "AcneLens membantu skrining awal. Keputusan perawatan tetap sebaiknya bersama dokter kulit.",
  },
];

export const RENCANA = [
  "Menambah jumlah dan variasi dataset",
  "Mengendalikan variasi pencahayaan foto",
  "Mencoba kombinasi fitur lain atau deep learning ringan",
];

export const TIM = [
  {
    nama: "Ahmad Falahi",
    inisial: "AF",
    warna: "bg-rose",
    tugas: "Dataset, rancangan dan pengembangan aplikasi, integrasi model",
  },
  {
    nama: "Amin Aziz Sudjud",
    inisial: "AA",
    warna: "bg-sand",
    tugas: "Persiapan data, fitur SURF, penggabungan fitur, pelatihan SVM",
  },
  {
    nama: "Muhammad Faiq Nabil Saputra",
    inisial: "MF",
    warna: "bg-sage",
    tugas: "Preprocessing, fitur HOG, evaluasi dan penyimpanan model",
  },
];
