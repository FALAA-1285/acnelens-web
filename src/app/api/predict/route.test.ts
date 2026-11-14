import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST, sanitasiNamaBerkas } from "./route";
import { UKURAN_MAKS } from "@/lib/validasi-foto";

const JPG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46]);
let ipKe = 0;

/** Buat request multipart sungguhan (lengkap dengan content-length) dari sebuah FormData. */
async function permintaan(isi: FormData | string | null, header: Record<string, string> = {}) {
  ipKe += 1;
  const h: Record<string, string> = { "x-forwarded-for": `10.0.0.${ipKe}`, ...header };
  let body: ArrayBuffer | string | undefined;
  if (isi instanceof FormData) {
    const res = new Response(isi);
    body = await res.arrayBuffer();
    h["content-type"] ??= res.headers.get("content-type")!;
    h["content-length"] ??= String(body.byteLength);
  } else if (typeof isi === "string") {
    body = isi;
    h["content-length"] ??= String(isi.length);
  }
  return new NextRequest("http://localhost/api/predict", { method: "POST", body, headers: h });
}

function formFoto(isi: Uint8Array<ArrayBuffer> = JPG, tipe = "image/jpeg", nama = "foto.jpg") {
  const f = new FormData();
  f.append("file", new File([isi], nama, { type: tipe }));
  return f;
}

beforeEach(() => {
  vi.stubEnv("BACKEND_API_URL", "http://backend.test");
  vi.stubEnv("NEXT_PUBLIC_API_URL", "");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/predict", () => {
  it("503 bila backend belum diatur (sebelum membaca body)", async () => {
    vi.stubEnv("BACKEND_API_URL", "");
    const res = await POST(await permintaan(formFoto()));
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({ kode: "BACKEND_BELUM_DIATUR" });
  });

  it("400 untuk request yang bukan multipart, tanpa membocorkan pesan internal", async () => {
    const res = await POST(await permintaan("halo", { "content-type": "text/plain" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data).toEqual({ error: "Permintaan tidak valid.", kode: "FORMAT_REQUEST" });
  });

  it("400 bila field file tidak ada atau berupa teks", async () => {
    const f = new FormData();
    f.append("file", "bukan file");
    const res = await POST(await permintaan(f));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ kode: "FILE_TIDAK_ADA" });
  });

  it("413 bila content-length melebihi batas", async () => {
    const res = await POST(
      await permintaan(formFoto(), { "content-length": String(UKURAN_MAKS * 2) }),
    );
    expect(res.status).toBe(413);
  });

  it("415 untuk file teks yang dinamai .jpg", async () => {
    const palsu = new TextEncoder().encode("bukan gambar sama sekali");
    const res = await POST(await permintaan(formFoto(palsu, "image/jpeg", "palsu.jpg")));
    expect(res.status).toBe(415);
    expect(await res.json()).toMatchObject({ kode: "FORMAT_FOTO" });
  });

  it("meneruskan foto valid ke backend dan mengembalikan JSON-nya", async () => {
    const fetchPalsu = vi.fn(async () =>
      Response.json({ label: "papula", probabilities: { papula: 0.7, pustula: 0.2, non_acne: 0.1 } }),
    );
    vi.stubGlobal("fetch", fetchPalsu);

    const res = await POST(await permintaan(formFoto()));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ label: "papula" });

    expect(fetchPalsu).toHaveBeenCalledTimes(1);
    const [url, opsi] = fetchPalsu.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("http://backend.test/predict");
    const terkirim = (opsi.body as FormData).get("file") as Blob;
    expect(terkirim.type).toBe("image/jpeg");
    expect(new Uint8Array(await terkirim.arrayBuffer())).toEqual(JPG);
  });

  it("502 generik bila backend membalas error atau bukan JSON", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn(async () => new Response("Internal stack trace", { status: 500 })));
    let res = await POST(await permintaan(formFoto()));
    expect(res.status).toBe(502);
    expect(JSON.stringify(await res.json())).not.toContain("stack");

    vi.stubGlobal("fetch", vi.fn(async () => new Response("<html>", { status: 200 })));
    res = await POST(await permintaan(formFoto()));
    expect(res.status).toBe(502);
  });

  it("504 bila backend tidak merespons sebelum batas waktu", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new DOMException("waktu habis", "TimeoutError");
      }),
    );
    const res = await POST(await permintaan(formFoto()));
    expect(res.status).toBe(504);
  });

  it("429 setelah terlalu banyak permintaan dari IP yang sama", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ label: null })),
    );
    const ip = { "x-forwarded-for": "10.9.9.9" };
    const status: number[] = [];
    for (let i = 0; i < 13; i++) status.push((await POST(await permintaan(formFoto(), ip))).status);
    expect(status.slice(0, 12).every((s) => s === 200)).toBe(true);
    expect(status[12]).toBe(429);
  });
});

describe("sanitasiNamaBerkas", () => {
  it("membersihkan path traversal dan karakter ilegal", () => {
    expect(sanitasiNamaBerkas("../../etc/passwd.jpg", "image/jpeg")).toBe("passwd.jpg");
    expect(sanitasiNamaBerkas("..\\..\\foto<script>.png", "image/png")).toBe("foto_script_.png");
    expect(sanitasiNamaBerkas("foto normal_12.webp", "image/webp")).toBe("foto_normal_12.webp");
  });

  it("mengganti nama anonim bila string nama kosong atau hanya titik", () => {
    expect(sanitasiNamaBerkas("", "image/jpeg")).toMatch(/^foto_\d+\.jpg$/);
    expect(sanitasiNamaBerkas("...", "image/png")).toMatch(/^foto_\d+\.png$/);
  });
});
