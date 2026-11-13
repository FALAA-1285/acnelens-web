/**
 * SEMUA gambar situs dikumpulkan di sini.
 *
 * Foto di /public/img berasal dari Unsplash (Unsplash License) dan Pexels (Pexels
 * License) — keduanya boleh dipakai gratis. Daftar sumbernya ada di
 * /public/img/SUMBER.md. Hero beranda & ikon masih file lama.
 *
 * Versi sebelumnya disimpan di .backup-gambar/gambar.ts.bak — salin balik untuk
 * mengembalikan gambar lama.
 */
export const GAMBAR = {
  // Hero beranda — sengaja tidak diubah
  heroVideo: "/hero.mp4",
  heroVideoMobile: "/hero-m.mp4",
  heroPoster: "/hero-poster.jpg",
  heroPosterMobile: "/hero-poster-m.jpg",

  // Section "Pendekatan"
  daun: "/leaf.png",
  pendekatanUtama: "/img/pendekatan-utama.jpg",
  pendekatanKecil: "/img/pendekatan-kecil.jpg",

  // Section "Kelas" — gambar utama + kartu (gambar ke-2 muncul saat hover)
  kelasSorotan: "/img/kelas-sorotan.jpg",
  kelas: {
    non_acne: ["/img/kelas-normal-1.jpg", "/img/kelas-normal-2.jpg"],
    papula: ["/img/kelas-papula-1.jpg", "/img/kelas-papula-2.jpg"],
    // SEMENTARA: stok gratis tidak punya contoh pustula yang jelas.
    // Ganti dengan contoh pustula dari dataset sendiri.
    pustula: ["/img/kelas-pustula-1.jpg", "/img/kelas-pustula-2.jpg"],
  },

  // Section "Tahapan" — foto di dalam bentuk oval
  prosesSorotan: "/img/proses-sorotan.jpg",

  tekstur: "/img/tekstur.jpg",
  etos: "/img/etos.jpg",
  metode: "/img/metode.jpg",
  ajakan: "/img/ajakan.jpg",

  jurnal: ["/img/panduan-1.jpg", "/img/panduan-2.jpg", "/img/panduan-3.jpg"],


  footer: "/img/footer.jpg",

  // Halaman cek kulit
  cekBanner: "/img/cek-banner.jpg",

  ikon: {
    surf: "/icon-clean-beyond-reproach.svg",
    transparan: "/icon-radical-transparency.svg",
    hog: "/icon-potent-multi-tasking.svg",
    svm: "/icon-conscious-responsible.svg",
    akurasi: "/icon-highest-standards.svg",
    hasil: "/icon-real-results.svg",
  },
} as const;
