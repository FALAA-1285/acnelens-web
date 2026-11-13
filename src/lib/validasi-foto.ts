/**
 * Aturan foto yang boleh dikirim — dipakai bersama oleh browser (cekFile)
 * dan oleh route /api/predict (jenisGambar), supaya batasnya selalu sama.
 */

export const TIPE_FOTO = ["image/jpeg", "image/png", "image/webp"] as const;
export const EKSTENSI_FOTO = ["jpg", "jpeg", "png", "webp"] as const;
export const UKURAN_MAKS = 5 * 1024 * 1024; // 5 MB
export const UKURAN_MAKS_TEKS = "5 MB";

export const PESAN_FORMAT = "Format foto harus JPG, PNG, atau WebP.";
export const PESAN_UKURAN = `Ukuran foto maksimal ${UKURAN_MAKS_TEKS}.`;

/** Pemeriksaan cepat di browser. Mengembalikan pesan galat, atau null bila valid. */
export function cekFile(file: { name: string; type: string; size: number }): string | null {
  const ekstensi = file.name.split(".").pop()?.toLowerCase() ?? "";
  const tipeCocok = (TIPE_FOTO as readonly string[]).includes(file.type);
  // sebagian browser/OS tidak mengisi file.type, jadi ekstensi dipakai sebagai cadangan
  const ekstensiCocok = file.type === "" && (EKSTENSI_FOTO as readonly string[]).includes(ekstensi);

  if (!tipeCocok && !ekstensiCocok) return PESAN_FORMAT;
  if (file.size === 0) return "File foto kosong.";
  if (file.size > UKURAN_MAKS) return PESAN_UKURAN;
  return null;
}

/**
 * Mengenali jenis gambar dari isi file (magic bytes), bukan dari nama/tipe yang
 * dikirim klien. Dipakai di server. Mengembalikan null bila bukan JPG/PNG/WebP.
 */
export function jenisGambar(b: Uint8Array): (typeof TIPE_FOTO)[number] | null {
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (
    b.length >= 8 &&
    b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
    b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a
  ) {
    return "image/png";
  }
  if (
    b.length >= 12 &&
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && // "RIFF"
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50 // "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}
