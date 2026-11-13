/**
 * Data halaman /jurnal dan /jurnal/[slug].
 *
 * Isi setiap artikel ditulis sendiri oleh tim AcneLens sebagai ringkasan
 * berdasarkan sumber yang dicantumkan — bukan salinan isi artikel aslinya.
 * Informasi bersifat umum dan bukan pengganti saran dokter.
 *
 * Foto: Unsplash/Pexels (lisensi gratis), sudah di-color-grade agar senada
 * dengan palet situs. Daftar sumber foto ada di /public/img/SUMBER.md.
 */
export type Kategori = "Riset" | "Perawatan" | "Mengatasi jerawat" | "Jenis jerawat";

export type Blok =
  | { t: "p"; teks: string }
  /** subjudul besar; `miring` ditulis dengan huruf serif miring */
  | { t: "h2"; teks: string; miring: string }
  | { t: "h3"; teks: string }
  | { t: "gambar"; src: string; keterangan?: string }
  | { t: "kutipan"; teks: string }
  | { t: "daftar"; isi: string[] };

export type Artikel = {
  slug: string;
  judul: string;
  ringkas: string;
  kategori: Kategori;
  sumber: string;
  tahun?: string;
  href: string;
  gambar: string;
  menitBaca: number;
  isi: Blok[];
};

/** tanggal ringkasan ditulis */
export const TANGGAL_TULIS = "13 Nov 2026";

export const JURNAL: Artikel[] = [
  {
    slug: "jurnal-acuan-surf-hog-svm",
    judul: "Jurnal acuan AcneLens: menggabungkan fitur SURF dan HOG untuk mendeteksi jerawat",
    ringkas:
      "Penelitian yang menjadi dasar aplikasi ini. Fitur SURF dan HOG digabung, lalu diklasifikasikan dengan SVM untuk mengenali papula, pustula, dan kulit normal.",
    kategori: "Riset",
    sumber: "Jurnal Andalas: Rekayasa dan Penerapan Teknologi",
    tahun: "2026",
    href: "https://doi.org/10.25077/jarpet.v6i1.147",
    gambar: "/img/artikel-riset-hero.jpg",
    menitBaca: 4,
    isi: [
      {
        t: "p",
        teks: "AcneLens tidak dirancang dari nol. Seluruh alurnya mengikuti sebuah penelitian tentang deteksi acne vulgaris dari foto kulit, sehingga hasil aplikasi bisa dibandingkan dengan angka yang dilaporkan di jurnal tersebut.",
      },
      {
        t: "p",
        teks: "Pertanyaan utama penelitian itu sederhana: apakah dua jenis fitur yang berbeda, bila digabung, bisa mengenali jerawat lebih baik daripada dipakai sendiri-sendiri?",
      },
      { t: "h2", teks: "Dua cara membaca", miring: "tekstur kulit" },
      { t: "h3", teks: "SURF: mencari titik yang paling menonjol" },
      {
        t: "p",
        teks: "Setelah foto diubah ke skala abu-abu dan diseragamkan ukurannya, SURF mencari titik-titik penting di permukaan kulit. Titik ini dipilih karena tetap stabil walaupun foto diambil dari jarak atau sudut yang sedikit berbeda.",
      },
      { t: "h3", teks: "HOG: membaca arah garis dan tepi" },
      {
        t: "p",
        teks: "Di sekitar titik-titik tadi, HOG menghitung arah perubahan terang-gelap pada kulit. Dari situ bentuk dan tekstur lesi bisa digambarkan sebagai deretan angka yang bisa dibandingkan satu sama lain.",
      },
      { t: "gambar", src: "/img/kelas-papula-1.jpg", keterangan: "Contoh papula: benjolan merah kecil yang meradang." },
      { t: "h3", teks: "SVM: memisahkan tiga kelas" },
      {
        t: "p",
        teks: "Gabungan fitur SURF dan HOG kemudian diberikan ke SVM dengan kernel linear. Model ini mencari batas terbaik untuk memisahkan foto ke dalam tiga kelas: papula, pustula, dan kulit normal.",
      },
      {
        t: "kutipan",
        teks: "Pada data uji di penelitian tersebut, konfigurasi ini mencapai akurasi 93,33% pada 300 citra uji.",
      },
      { t: "h2", teks: "Yang perlu", miring: "diingat" },
      {
        t: "daftar",
        isi: [
          "Angka akurasi berlaku untuk data penelitian; hasil di aplikasi bisa berbeda karena kualitas foto pengguna beragam.",
          "Model hanya mengenali tiga kelas, jadi jenis jerawat lain tidak akan terdeteksi dengan benar.",
          "Hasil AcneLens adalah perkiraan berbasis gambar, bukan diagnosis medis.",
        ],
      },
    ],
  },
  {
    slug: "kebiasaan-merawat-kulit-berjerawat",
    judul: "Kebiasaan sederhana untuk merawat kulit berjerawat",
    ringkas:
      "Cuci wajah dengan lembut, pilih produk berlabel non-comedogenic, dan beri waktu beberapa minggu sebelum menilai apakah sebuah perawatan berhasil.",
    kategori: "Perawatan",
    sumber: "American Academy of Dermatology",
    href: "https://www.aad.org/public/diseases/acne/skin-care/tips",
    gambar: "/img/artikel-rawat-isi.jpg",
    menitBaca: 4,
    isi: [
      {
        t: "p",
        teks: "Merawat kulit berjerawat tidak harus rumit atau mahal. Yang paling berpengaruh justru kebiasaan kecil yang dilakukan setiap hari dengan konsisten.",
      },
      {
        t: "p",
        teks: "Berikut beberapa kebiasaan dasar yang umum disarankan dokter kulit untuk membantu jerawat lebih cepat tenang.",
      },
      { t: "h2", teks: "Mulai dari", miring: "cara mencuci wajah" },
      { t: "h3", teks: "Lembut, bukan keras" },
      {
        t: "p",
        teks: "Cuci wajah cukup dua kali sehari dan setelah berkeringat. Pakai pembersih yang lembut dan ujung jari saja. Menggosok dengan spons, handuk kasar, atau scrub justru bisa membuat kulit iritasi dan jerawat tampak lebih merah.",
      },
      { t: "gambar", src: "/img/artikel-rawat-hero.jpg", keterangan: "Cukup air dan pembersih yang lembut, tanpa digosok keras." },
      { t: "h3", teks: "Pilih produk yang tidak menyumbat pori" },
      {
        t: "p",
        teks: "Untuk pelembap, tabir surya, maupun riasan, cari label non-comedogenic atau oil-free. Produk seperti ini dibuat agar tidak mudah menyumbat pori.",
      },
      { t: "h3", teks: "Jangan lupa tabir surya" },
      {
        t: "p",
        teks: "Beberapa obat jerawat membuat kulit lebih sensitif terhadap sinar matahari. Tabir surya setiap pagi membantu melindungi kulit sekaligus mencegah bekas jerawat menjadi lebih gelap.",
      },
      {
        t: "kutipan",
        teks: "Sebagian besar perawatan jerawat butuh beberapa minggu sebelum hasilnya terlihat. Kesabaran adalah bagian dari perawatan.",
      },
      { t: "h2", teks: "Ringkasnya", miring: "setiap hari" },
      {
        t: "daftar",
        isi: [
          "Cuci wajah dengan lembut, maksimal dua kali sehari dan setelah berkeringat.",
          "Pakai produk non-comedogenic dan tabir surya.",
          "Beri waktu beberapa minggu sebelum mengganti produk.",
        ],
      },
    ],
  },
  {
    slug: "kebiasaan-yang-memperparah-jerawat",
    judul: "Kebiasaan merawat kulit yang justru memperparah jerawat",
    ringkas:
      "Menggosok terlalu keras, memencet jerawat, atau mencoba terlalu banyak produk sekaligus bisa membuat kulit makin iritasi.",
    kategori: "Perawatan",
    sumber: "American Academy of Dermatology",
    href: "https://www.aad.org/public/diseases/acne/skin-care/habits-stop",
    gambar: "/img/artikel-kebiasaan-hero.jpg",
    menitBaca: 4,
    isi: [
      {
        t: "p",
        teks: "Niat baik merawat kulit kadang berbalik membuat jerawat bertambah. Beberapa kebiasaan yang terasa membantu ternyata membuat kulit iritasi atau peradangan berlangsung lebih lama.",
      },
      { t: "h2", teks: "Kebiasaan yang", miring: "sebaiknya dihentikan" },
      { t: "h3", teks: "Memencet atau memecahkan jerawat" },
      {
        t: "p",
        teks: "Ini kebiasaan yang paling sering terjadi. Memencet jerawat mendorong peradangan lebih dalam ke kulit, sehingga risiko bekas luka dan noda gelap menjadi lebih besar.",
      },
      { t: "gambar", src: "/img/artikel-kebiasaan-isi.jpg", keterangan: "Memeriksa kulit di cermin boleh, asal tidak sambil memencet." },
      { t: "h3", teks: "Menggosok dan mencuci berlebihan" },
      {
        t: "p",
        teks: "Wajah yang digosok keras atau dicuci terlalu sering kehilangan lapisan pelindung alaminya. Kulit yang iritasi justru lebih mudah meradang.",
      },
      { t: "h3", teks: "Terlalu banyak produk sekaligus" },
      {
        t: "p",
        teks: "Mencampur beberapa produk aktif dalam waktu bersamaan bisa membuat kulit kewalahan. Begitu pula berganti produk sebelum sempat bekerja: hasilnya sulit dinilai dan kulit terus beradaptasi.",
      },
      {
        t: "kutipan",
        teks: "Kulit yang tenang lebih cepat pulih daripada kulit yang terus diganggu.",
      },
      { t: "h2", teks: "Kebiasaan kecil", miring: "yang sering terlupa" },
      {
        t: "daftar",
        isi: [
          "Sering menyentuh atau menopang wajah dengan tangan.",
          "Tidur tanpa membersihkan riasan.",
          "Jarang mengganti sarung bantal dan handuk wajah.",
        ],
      },
    ],
  },
  {
    slug: "beda-jenis-jerawat-beda-cara",
    judul: "Beda jenis jerawat, beda pula cara mengatasinya",
    ringkas:
      "Komedo, papula, pustula, hingga nodul membutuhkan penanganan yang berbeda. Panduan ini membahas bahan aktif yang cocok untuk tiap jenis.",
    kategori: "Mengatasi jerawat",
    sumber: "American Academy of Dermatology",
    href: "https://www.aad.org/public/diseases/acne/diy/types-breakouts",
    gambar: "/img/artikel-jenis-hero.jpg",
    menitBaca: 4,
    isi: [
      {
        t: "p",
        teks: "Tidak semua jerawat sama. Mengenali jenisnya membantu memilih perawatan yang tepat, karena bahan yang efektif untuk satu jenis belum tentu cocok untuk jenis lain.",
      },
      { t: "h2", teks: "Kenali dulu", miring: "jenisnya" },
      { t: "h3", teks: "Komedo hitam dan putih" },
      {
        t: "p",
        teks: "Komedo terjadi karena pori tersumbat minyak dan sel kulit mati, tanpa peradangan berat. Bahan seperti asam salisilat atau retinoid topikal umumnya dipakai untuk membantu membuka sumbatan ini.",
      },
      { t: "h3", teks: "Papula dan pustula" },
      {
        t: "p",
        teks: "Keduanya adalah jerawat yang meradang. Benzoil peroksida dan retinoid sering menjadi pilihan awal karena membantu mengurangi bakteri dan peradangan.",
      },
      { t: "gambar", src: "/img/metode.jpg", keterangan: "Mulai dari satu produk, lalu amati reaksi kulit." },
      { t: "h3", teks: "Nodul dan jerawat yang dalam" },
      {
        t: "p",
        teks: "Jerawat yang besar, dalam, dan nyeri sebaiknya tidak ditangani sendiri. Jenis ini lebih berisiko meninggalkan bekas luka, sehingga perlu diperiksa dokter kulit.",
      },
      {
        t: "kutipan",
        teks: "Perawatan yang tepat dimulai dari mengenali jerawat yang sedang kamu hadapi.",
      },
      { t: "h2", teks: "Ringkasnya,", miring: "per jenis" },
      {
        t: "daftar",
        isi: [
          "Komedo: fokus membuka pori yang tersumbat.",
          "Papula dan pustula: fokus meredakan peradangan.",
          "Nodul dan jerawat dalam: periksakan ke dokter kulit.",
        ],
      },
    ],
  },
  {
    slug: "mengenal-papula-dan-pustula",
    judul: "Mengenal lesi jerawat yang meradang: papula dan pustula",
    ringkas:
      "Papula berupa benjolan merah kecil yang nyeri, sedangkan pustula punya titik putih atau kuning di tengahnya. Keduanya termasuk jerawat meradang.",
    kategori: "Jenis jerawat",
    sumber: "DermNet",
    href: "https://dermnetnz.org/topics/inflammatory-lesions-in-acne",
    gambar: "/img/artikel-lesi-hero.jpg",
    menitBaca: 3,
    isi: [
      {
        t: "p",
        teks: "Papula dan pustula adalah dua kelas jerawat yang dikenali AcneLens. Keduanya termasuk lesi yang meradang, tetapi tampilannya berbeda dan cukup mudah dibedakan bila tahu ciri-cirinya.",
      },
      { t: "h2", teks: "Dua lesi,", miring: "dua ciri" },
      { t: "h3", teks: "Papula" },
      {
        t: "p",
        teks: "Papula berupa benjolan kecil berwarna kemerahan, terasa padat, dan sering nyeri saat disentuh. Tidak ada titik nanah yang terlihat di permukaannya.",
      },
      { t: "gambar", src: "/img/kelas-papula-1.jpg", keterangan: "Papula: benjolan merah tanpa titik nanah." },
      { t: "h3", teks: "Pustula" },
      {
        t: "p",
        teks: "Pustula juga meradang, tetapi bagian tengahnya berisi nanah sehingga tampak titik putih atau kekuningan. Lesi yang lebih besar dan dalam disebut nodul, dan biasanya bertahan lebih lama.",
      },
      { t: "h3", teks: "Pada kulit yang lebih gelap" },
      {
        t: "p",
        teks: "Kemerahan sering tidak terlalu terlihat, tetapi noda gelap setelah jerawat sembuh cenderung bertahan lebih lama. Karena itu penanganan sejak dini cukup penting.",
      },
      {
        t: "kutipan",
        teks: "Titik putih atau kuning di tengah benjolan adalah pembeda utama pustula dari papula.",
      },
      { t: "h2", teks: "Ringkasnya", miring: "" },
      {
        t: "daftar",
        isi: [
          "Papula: benjolan merah, padat, tanpa titik nanah.",
          "Pustula: benjolan meradang dengan titik putih atau kuning.",
          "Lesi yang besar dan dalam (nodul) perlu perhatian dokter.",
        ],
      },
    ],
  },
  {
    slug: "perawatan-jerawat-di-rumah",
    judul: "Jerawat: gejala, perawatan di rumah, dan kapan perlu ke dokter",
    ringkas:
      "Ringkasan praktis tentang perawatan jerawat ringan di rumah, serta tanda-tanda kapan sebaiknya memeriksakan diri ke tenaga kesehatan.",
    kategori: "Mengatasi jerawat",
    sumber: "NHS",
    href: "https://www.nhs.uk/conditions/acne/",
    gambar: "/img/artikel-rumah-hero.jpg",
    menitBaca: 4,
    isi: [
      {
        t: "p",
        teks: "Jerawat ringan umumnya bisa dirawat di rumah. Kuncinya adalah membersihkan wajah secara lembut, memilih produk yang tepat, dan tidak memperparah peradangan.",
      },
      { t: "h2", teks: "Perawatan", miring: "di rumah" },
      { t: "h3", teks: "Bersihkan dengan rutin" },
      {
        t: "p",
        teks: "Bersihkan wajah dua kali sehari dengan pembersih yang lembut dan hapus riasan sebelum tidur. Mencuci terlalu sering atau memakai air yang terlalu panas justru bisa membuat kulit iritasi.",
      },
      { t: "gambar", src: "/img/artikel-rumah-isi.jpg", keterangan: "Pembersih lembut sudah cukup untuk perawatan harian." },
      { t: "h3", teks: "Produk yang dijual bebas" },
      {
        t: "p",
        teks: "Produk dengan kandungan seperti benzoil peroksida atau asam salisilat bisa membantu jerawat ringan. Bila ragu memilih, apoteker dapat memberi saran yang sesuai.",
      },
      { t: "h3", teks: "Bersabar dengan hasilnya" },
      {
        t: "p",
        teks: "Perawatan jerawat butuh waktu, sering kali beberapa minggu sampai beberapa bulan. Gunakan secara teratur sebelum menyimpulkan apakah sebuah produk bekerja.",
      },
      {
        t: "kutipan",
        teks: "Jerawat yang mengganggu rasa percaya diri juga merupakan alasan yang sah untuk mencari bantuan.",
      },
      { t: "h2", teks: "Kapan perlu", miring: "ke dokter" },
      {
        t: "daftar",
        isi: [
          "Jerawat makin banyak atau tidak membaik setelah perawatan rutin.",
          "Jerawat terasa sakit, besar, dan dalam.",
          "Mulai muncul bekas luka atau noda yang menetap.",
        ],
      },
    ],
  },
  {
    slug: "bahan-aktif-produk-tanpa-resep",
    judul: "Produk jerawat tanpa resep: bahan mana yang efektif?",
    ringkas:
      "Benzoil peroksida, asam salisilat, dan retinoid adalah bahan yang umum dijual bebas. Artikel ini menjelaskan cara kerja dan efek sampingnya.",
    kategori: "Mengatasi jerawat",
    sumber: "Mayo Clinic",
    href: "https://www.mayoclinic.org/diseases-conditions/acne/in-depth/acne-treatments/art-20045814",
    gambar: "/img/artikel-bahan-hero.jpg",
    menitBaca: 4,
    isi: [
      {
        t: "p",
        teks: "Rak produk jerawat penuh dengan pilihan, tetapi bahan aktif yang benar-benar umum dipakai sebenarnya tidak banyak. Mengenal cara kerjanya membantu memilih produk dengan lebih tepat.",
      },
      { t: "h2", teks: "Tiga bahan", miring: "yang paling umum" },
      { t: "h3", teks: "Benzoil peroksida" },
      {
        t: "p",
        teks: "Bekerja mengurangi bakteri penyebab jerawat dan cocok untuk jerawat yang meradang. Efek sampingnya bisa berupa kulit kering atau mengelupas, dan bahan ini dapat memudarkan warna kain.",
      },
      { t: "gambar", src: "/img/artikel-bahan-isi.jpg", keterangan: "Gunakan sedikit dulu, lalu tambah perlahan." },
      { t: "h3", teks: "Asam salisilat" },
      {
        t: "p",
        teks: "Membantu meluruhkan sel kulit mati dan membersihkan pori yang tersumbat, sehingga lebih cocok untuk komedo.",
      },
      { t: "h3", teks: "Retinoid topikal" },
      {
        t: "p",
        teks: "Membantu mencegah sumbatan baru terbentuk. Di awal pemakaian kulit bisa terasa kering atau sedikit kemerahan, jadi mulailah perlahan.",
      },
      {
        t: "kutipan",
        teks: "Mulailah dari konsentrasi rendah agar kulit sempat beradaptasi.",
      },
      { t: "h2", teks: "Tips", miring: "memakainya" },
      {
        t: "daftar",
        isi: [
          "Coba satu bahan dulu, jangan langsung dicampur.",
          "Pakai pelembap dan tabir surya untuk mengurangi iritasi.",
          "Bila beberapa bulan tidak membaik, konsultasikan ke dokter.",
        ],
      },
    ],
  },
  {
    slug: "pedoman-penanganan-acne-vulgaris-2024",
    judul: "Pedoman terbaru penanganan acne vulgaris untuk dokter",
    ringkas:
      "Pedoman berbasis bukti dari asosiasi dermatologi Amerika yang merangkum pilihan terapi topikal dan oral untuk acne vulgaris.",
    kategori: "Riset",
    sumber: "Journal of the American Academy of Dermatology",
    tahun: "2024",
    href: "https://doi.org/10.1016/j.jaad.2023.12.017",
    gambar: "/img/artikel-dokter-hero.jpg",
    menitBaca: 4,
    isi: [
      {
        t: "p",
        teks: "Pedoman ini disusun oleh American Academy of Dermatology sebagai acuan bagi dokter dalam menangani acne vulgaris. Isinya merangkum hasil tinjauan sistematis terhadap berbagai penelitian tentang terapi jerawat.",
      },
      { t: "h2", teks: "Isi utama", miring: "pedoman" },
      { t: "h3", teks: "Terapi dengan rekomendasi kuat" },
      {
        t: "p",
        teks: "Di antaranya benzoil peroksida, retinoid topikal, antibiotik topikal, dan doksisiklin oral. Pedoman juga mendukung pemakaian beberapa terapi topikal sekaligus.",
      },
      { t: "gambar", src: "/img/artikel-dokter-isi.jpg", keterangan: "Pilihan terapi ditentukan bersama dokter." },
      { t: "h3", teks: "Antibiotik oral dibatasi" },
      {
        t: "p",
        teks: "Penggunaan antibiotik oral dianjurkan untuk dibatasi waktunya dan didampingi terapi topikal, agar tidak memicu resistansi.",
      },
      { t: "h3", teks: "Untuk jerawat berat" },
      {
        t: "p",
        teks: "Untuk jerawat berat, berbekas, atau yang tidak membaik dengan pengobatan biasa, isotretinoin menjadi salah satu pilihan dengan pengawasan ketat.",
      },
      {
        t: "kutipan",
        teks: "Pedoman ini ditujukan untuk tenaga medis. Obat resep di dalamnya harus dipakai dengan pengawasan dokter.",
      },
      { t: "h2", teks: "Ringkasnya", miring: "" },
      {
        t: "daftar",
        isi: [
          "Pedoman berbasis bukti untuk dokter, diterbitkan 2024.",
          "Terapi kombinasi topikal dianjurkan; antibiotik oral dibatasi.",
          "Jangan memulai obat resep tanpa konsultasi.",
        ],
      },
    ],
  },
  {
    slug: "jerawat-pada-kulit-sawo-matang",
    judul: "Tips mengatasi jerawat pada kulit sawo matang dan gelap",
    ringkas:
      "Pada kulit yang lebih gelap, bekas jerawat sering meninggalkan noda kehitaman. Penanganan sejak dini membantu mencegahnya.",
    kategori: "Perawatan",
    sumber: "American Academy of Dermatology",
    href: "https://www.aad.org/public/diseases/acne/diy/skin-color",
    gambar: "/img/artikel-sawo-hero.jpg",
    menitBaca: 3,
    isi: [
      {
        t: "p",
        teks: "Kulit sawo matang dan gelap punya tantangan tersendiri saat berjerawat. Selain jerawatnya, noda gelap yang tertinggal setelah jerawat sembuh sering lebih mengganggu dan butuh waktu lama untuk memudar.",
      },
      { t: "h2", teks: "Cegah", miring: "noda gelap" },
      { t: "h3", teks: "Tangani sejak awal" },
      {
        t: "p",
        teks: "Semakin cepat peradangan mereda, semakin kecil kemungkinan noda gelap terbentuk. Jangan menunggu jerawat menumpuk sebelum mulai merawatnya.",
      },
      { t: "gambar", src: "/img/artikel-sawo-isi.jpg", keterangan: "Perawatan lembut dan konsisten membantu menjaga warna kulit merata." },
      { t: "h3", teks: "Pilih yang lembut" },
      {
        t: "p",
        teks: "Iritasi juga bisa memicu noda gelap, jadi perkenalkan bahan aktif secara bertahap dan hindari produk yang terlalu keras.",
      },
      { t: "h3", teks: "Tabir surya setiap hari" },
      {
        t: "p",
        teks: "Sinar matahari dapat membuat noda yang sudah ada menjadi lebih gelap. Tabir surya membantu noda memudar lebih cepat.",
      },
      {
        t: "kutipan",
        teks: "Pada kulit yang lebih gelap, mencegah noda sering lebih mudah daripada menghilangkannya.",
      },
      { t: "h2", teks: "Ringkasnya", miring: "" },
      {
        t: "daftar",
        isi: [
          "Tangani jerawat sejak awal.",
          "Gunakan produk lembut dan tabir surya setiap hari.",
          "Jangan memencet jerawat; konsultasi bila noda menetap.",
        ],
      },
    ],
  },
];

export function cariArtikel(slug: string) {
  return JURNAL.find((a) => a.slug === slug);
}
