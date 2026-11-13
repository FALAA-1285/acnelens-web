# AcneLens Web

Frontend Next.js untuk proyek akhir PCVK Kelompok 7 (TI-3D, Politeknik Negeri Malang):
klasifikasi papula, pustula, dan kulit normal dengan SURF, HOG, dan SVM.

## Menjalankan

Butuh Node.js 20.9 atau lebih baru.

```bash
npm install
cp .env.example .env.local   # opsional, lihat bagian Backend
npm run dev
```

Buka http://localhost:3000.

| Perintah        | Fungsi                                  |
| --------------- | --------------------------------------- |
| `npm run dev`   | Server pengembangan                     |
| `npm run build` | Build produksi                          |
| `npm start`     | Menjalankan hasil build                 |
| `npm run lint`  | ESLint                                  |
| `npm test`      | Tes unit (Vitest)                       |

## Halaman

| Rute             | Isi                                                        |
| ---------------- | ---------------------------------------------------------- |
| `/`              | Beranda                                                    |
| `/cek`           | Unggah foto, proses analisis, dan hasil (satu halaman)     |
| `/jurnal`        | Daftar bacaan                                              |
| `/jurnal/[slug]` | Ringkasan artikel                                          |
| `/tentang`       | Latar belakang, metode, dataset, hasil penelitian, dan tim |
| `/api/predict`   | Proxy ke backend Python (POST, multipart, field `file`)    |

## Struktur

```
src/
├── app/                    rute halaman, API, style global (tema warna & font)
│   ├── api/predict/        proxy + validasi foto + batas laju
│   ├── not-found.tsx       halaman 404
│   └── error.tsx           halaman galat
├── components/
│   ├── beranda/            section-section beranda
│   ├── cek/                alur cek kulit: unggah → analisis → hasil
│   ├── jurnal/             foto, isi artikel, tombol bagikan
│   ├── tentang/            komponen kecil halaman tentang
│   ├── motion/             reveal, parallax, smooth scroll, preloader, transisi halaman
│   ├── bagian.tsx          potongan section yang dipakai ulang (eyebrow, gambar parallax, …)
│   ├── ui.tsx              tombol pill, tag, ikon bulat
│   ├── icons.tsx           ikon SVG
│   ├── site-header.tsx
│   └── footer-situs.tsx
└── lib/
    ├── backend.ts          konfigurasi backend (khusus server)
    ├── batas-laju.ts       rate limit sederhana untuk /api/predict
    ├── validasi-foto.ts    aturan format & ukuran foto (dipakai browser dan server)
    ├── predict.ts          kirim foto, baca & validasi respons, mode demo
    ├── penelitian.ts       angka & tahap dari jurnal acuan (satu sumber data)
    ├── kelas.ts            nama, warna, dan deskripsi tiap kelas
    ├── jurnal.ts           isi halaman jurnal
    ├── tentang.ts          isi halaman tentang (keterbatasan, tim)
    └── gambar.ts           semua path gambar/video
```

## Backend

Selama `BACKEND_API_URL` kosong, aplikasi berjalan dalam **mode demo**: hasil prediksi
diacak dan ada keterangan di layar.

Kalau backend sudah siap, isi `.env.local`:

```
BACKEND_API_URL=http://localhost:8000
```

`NEXT_PUBLIC_API_URL` (nama lama) masih dibaca sebagai cadangan, tetapi sebaiknya tidak
dipakai. Konfigurasi dibaca di server; halaman `/cek` dirender statis, jadi setelah mengubah
env di produksi jalankan `npm run build` ulang.

Browser mengirim `POST /api/predict`. Route ini:

1. menolak permintaan bila backend belum diatur (503) atau terlalu sering (429, 12/menit per IP);
2. memeriksa ukuran (maks 5 MB) dan isi file (harus benar-benar JPG, PNG, atau WebP);
3. meneruskan file ke `POST {BACKEND_API_URL}/predict` (form-data field `file`), batas waktu 30 detik;
4. mengembalikan galat sebagai `{ "error": "...", "kode": "..." }` tanpa detail internal.

Respons backend yang diharapkan:

```json
{ "label": "pustula", "probabilities": { "papula": 0.11, "pustula": 0.86, "non_acne": 0.03 } }
```

`label` harus sama dengan kelas berprobabilitas tertinggi dan total probabilitas ≈ 1;
kalau tidak, respons dianggap rusak.

Kalau SURF tidak menemukan keypoint dengan det(H) ≥ 1000 (foto dianggap tidak berjerawat):

```json
{ "label": null, "reason": "no_keypoint" }
```

Catatan untuk backend:

- Supaya SVM bisa mengeluarkan probabilitas, latih dengan `SVC(kernel="linear", probability=True)`.
- Praproses di backend harus sama persis dengan saat pelatihan (grayscale, resize 256 × 300, Lanczos3).

## Sumber data & aset

- Angka penelitian diambil dari jurnal acuan (A. Luthfi & M. Ali, JARPET Vol. 6 No. 1, 2026,
  doi:10.25077/jarpet.v6i1.147). File PDF-nya tidak disimpan di repo.
- Sumber foto tercatat di `public/img/SUMBER.md`.
