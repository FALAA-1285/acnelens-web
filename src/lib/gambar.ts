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
  // Dari truekindskincare.com (explore-2.jpg) — BUKAN lisensi bebas, lihat SUMBER.md.
  // Foto lama: "/img/kelas-sorotan.jpg"
  kelasSorotan: "/img/kelas-sorotan-2.jpg",
  kelas: {
    non_acne: ["/img/kelas-normal-1.jpg", "/img/kelas-normal-2.jpg"],
    // gambar ke-2 = wajah utuh (dulu close-up: kelas-papula-2.jpg)
    papula: ["/img/kelas-papula-1.jpg", "/img/kelas-papula-wajah.jpg"],
    // Model berbeda dari papula. Foto lama: kelas-pustula-1.jpg / kelas-pustula-2.jpg
    pustula: ["/img/kelas-pustula-dekat.jpg", "/img/kelas-pustula-utuh.jpg"],
  },

  // Section "Tahapan" — foto di dalam bentuk oval
  // Dari truekindskincare.com (ingredients-clip.jpg) — BUKAN lisensi bebas, lihat SUMBER.md.
  // Foto lama: "/img/proses-sorotan.jpg"
  prosesSorotan: "/img/proses-sorotan-2.jpg",

  tekstur: "/img/tekstur.jpg",
  etos: "/img/etos.jpg",
  metode: "/img/metode.jpg",
  ajakan: "/img/ajakan.jpg",

  jurnal: ["/img/panduan-1.jpg", "/img/panduan-2.jpg", "/img/panduan-3.jpg"],


  footer: "/img/footer.jpg",

  // Halaman cek kulit
  cekBanner: "/img/cek-banner.jpg",
  cekTips: {
    dekat: "/img/cek-tips-dekat.jpg",
    cahaya: "/img/cek-tips-cahaya.jpg",
    bersih: "/img/cek-tips-bersih.jpg",
  },

  // Halaman tentang (Pexels, lihat SUMBER.md)
  tentang: {
    hero: "/img/tentang-hero.jpg",
    cermin: "/img/tentang-cermin.jpg",
    tekstur: "/img/tentang-tekstur.jpg",
    riset: "/img/tentang-riset.jpg",
  },

  ikon: {
    surf: "/icon-clean-beyond-reproach.svg",
    transparan: "/icon-radical-transparency.svg",
    hog: "/icon-potent-multi-tasking.svg",
    svm: "/icon-conscious-responsible.svg",
    akurasi: "/icon-highest-standards.svg",
    hasil: "/icon-real-results.svg",
  },
} as const;
