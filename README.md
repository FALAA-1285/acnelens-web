# AcneLens Web

Frontend Next.js untuk proyek akhir PCVK Kelompok 7: klasifikasi papula, pustula,
dan kulit normal dengan SURF, HOG, dan SVM.

## Menjalankan

```bash
npm install
cp .env.example .env.local   # opsional, lihat bagian Backend
npm run dev
```

Buka http://localhost:3000.

## Halaman

| Rute       | Isi                                                    |
| ---------- | ------------------------------------------------------ |
| `/`        | Beranda                                                |
| `/cek`     | Unggah foto, proses analisis, dan hasil (satu halaman) |
| `/tentang` | Cara kerja, tiga kelas, data dan acuan, tim            |

## Struktur

```
src/
├── app/                  rute halaman dan style global (tema warna & font)
├── components/
│   ├── cek/              alur cek kulit: unggah → analisis → hasil
│   ├── icons.tsx         ikon SVG
│   ├── skin-art.tsx      ilustrasi kulit pengganti foto
│   ├── site-header.tsx
│   ├── site-footer.tsx
│   └── ui.tsx            tombol pill, tag, ikon bulat, judul seksi
└── lib/
    ├── kelas.ts          nama, warna, dan deskripsi tiap kelas
    └── predict.ts        kirim foto ke backend + mode demo
```

## Backend

Selama `NEXT_PUBLIC_API_URL` kosong, aplikasi berjalan dalam **mode demo**:
hasil prediksi diacak dan ada keterangan di layar.

Kalau backend sudah siap, isi `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Frontend mengirim `POST /api/predict` yang bertindak sebagai API Proxy (BFF)
ke backend Python dengan form-data field `file` (JPG, PNG, atau WebP, maksimal 5 MB).
Respons yang diharapkan:

```json
{ "label": "pustula", "probabilities": { "papula": 0.11, "pustula": 0.86, "non_acne": 0.03 } }
```

Kalau SURF tidak menemukan keypoint dengan det(H) ≥ 1000:

```json
{ "label": null, "reason": "no_keypoint" }
```

Catatan untuk backend:

- Supaya SVM bisa mengeluarkan probabilitas, latih dengan `SVC(kernel="linear", probability=True)`.
- Praproses di backend harus sama persis dengan saat pelatihan (grayscale, resize 256 × 300, Lanczos3).
