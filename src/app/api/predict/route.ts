import { NextResponse, type NextRequest } from "next/server";
import { BATAS_WAKTU_BACKEND_MS, urlBackend } from "@/lib/backend";
import { buatBatasLaju } from "@/lib/batas-laju";
import { jenisGambar, PESAN_FORMAT, PESAN_UKURAN, UKURAN_MAKS } from "@/lib/validasi-foto";

/**
 * Proxy (BFF) ke backend Python: POST multipart/form-data, field "file".
 *
 * Semua galat dikembalikan sebagai { error, kode } dengan pesan yang aman
 * ditampilkan ke pengguna. Detail teknis hanya dicatat di log server.
 */

export type KodeGalat =
  | "BACKEND_BELUM_DIATUR"
  | "FORMAT_REQUEST"
  | "FILE_TIDAK_ADA"
  | "FORMAT_FOTO"
  | "UKURAN_FOTO"
  | "TERLALU_SERING"
  | "BACKEND_GALAT"
  | "BACKEND_TIMEOUT";

function galat(status: number, kode: KodeGalat, pesan: string, header?: HeadersInit) {
  return NextResponse.json({ error: pesan, kode }, { status, headers: header });
}

// multipart menambah sedikit header di sekitar file
const BATAS_BODY = UKURAN_MAKS + 64 * 1024;

// 12 permintaan per menit per alamat IP
const periksaLaju = buatBatasLaju({ maks: 12, jendelaMs: 60_000 });

function alamatKlien(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "lokal";
}

export async function POST(req: NextRequest) {
  // 1. Cek hal-hal murah dulu, sebelum membaca body
  const backend = urlBackend();
  if (!backend) {
    return galat(503, "BACKEND_BELUM_DIATUR", "Layanan analisis belum tersedia. Coba lagi nanti.");
  }

  const laju = periksaLaju(alamatKlien(req));
  if (!laju.boleh) {
    return galat(429, "TERLALU_SERING", "Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.", {
      "Retry-After": String(laju.tungguDetik),
    });
  }

  if (!req.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data")) {
    return galat(400, "FORMAT_REQUEST", "Permintaan tidak valid.");
  }

  const panjang = Number(req.headers.get("content-length"));
  if (!Number.isFinite(panjang) || panjang <= 0) {
    return galat(411, "FORMAT_REQUEST", "Permintaan tidak valid.");
  }
  if (panjang > BATAS_BODY) {
    return galat(413, "UKURAN_FOTO", PESAN_UKURAN);
  }

  // 2. Baca dan periksa file
  let file: FormDataEntryValue | null;
  try {
    file = (await req.formData()).get("file");
  } catch {
    return galat(400, "FORMAT_REQUEST", "Permintaan tidak valid.");
  }
  if (!(file instanceof Blob)) {
    return galat(400, "FILE_TIDAK_ADA", "File foto tidak ditemukan.");
  }
  if (file.size === 0 || file.size > UKURAN_MAKS) {
    return galat(413, "UKURAN_FOTO", PESAN_UKURAN);
  }

  const isi = new Uint8Array(await file.arrayBuffer());
  const tipe = jenisGambar(isi);
  if (!tipe) {
    return galat(415, "FORMAT_FOTO", PESAN_FORMAT);
  }

  // 3. Teruskan ke backend dengan batas waktu
  const form = new FormData();
  const nama = file instanceof File && file.name ? file.name : `foto.${tipe.split("/")[1]}`;
  form.append("file", new Blob([isi], { type: tipe }), nama);

  let res: Response;
  try {
    res = await fetch(`${backend}/predict`, {
      method: "POST",
      body: form,
      signal: AbortSignal.any([req.signal, AbortSignal.timeout(BATAS_WAKTU_BACKEND_MS)]),
    });
  } catch (err) {
    if (req.signal.aborted) {
      // klien membatalkan; tidak ada yang perlu dikirim balik
      return new NextResponse(null, { status: 499 });
    }
    const timeout = err instanceof DOMException && err.name === "TimeoutError";
    console.error("[api/predict] gagal menghubungi backend:", err);
    return timeout
      ? galat(504, "BACKEND_TIMEOUT", "Analisis terlalu lama. Coba lagi beberapa saat lagi.")
      : galat(502, "BACKEND_GALAT", "Layanan analisis sedang bermasalah. Coba lagi nanti.");
  }

  if (!res.ok) {
    console.error(`[api/predict] backend membalas status ${res.status}`);
    return galat(502, "BACKEND_GALAT", "Layanan analisis sedang bermasalah. Coba lagi nanti.");
  }

  try {
    return NextResponse.json(await res.json());
  } catch (err) {
    console.error("[api/predict] respons backend bukan JSON:", err);
    return galat(502, "BACKEND_GALAT", "Layanan analisis sedang bermasalah. Coba lagi nanti.");
  }
}
