/**
 * Konfigurasi backend Python — HANYA dibaca di server (route /api/predict dan
 * halaman /cek). Jangan diimpor dari komponen "use client".
 *
 * BACKEND_API_URL  : alamat backend (disarankan, tidak ikut ke bundle browser)
 * NEXT_PUBLIC_API_URL : nama lama, masih dibaca supaya .env.local lama tetap jalan
 *
 * Bila keduanya kosong, aplikasi berjalan dalam mode demo (hasil acak).
 */
export function urlBackend(): string | null {
  const url = (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "").trim();
  return url ? url.replace(/\/+$/, "") : null;
}

export function modeDemo(): boolean {
  return urlBackend() === null;
}

/** Batas waktu menunggu backend sebelum dianggap tidak merespons. */
export const BATAS_WAKTU_BACKEND_MS = 30_000;
