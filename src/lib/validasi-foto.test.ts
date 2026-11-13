import { describe, expect, it } from "vitest";
import { cekFile, jenisGambar, PESAN_FORMAT, PESAN_UKURAN, UKURAN_MAKS } from "./validasi-foto";

const file = (name: string, type: string, size = 1000) => ({ name, type, size });

describe("cekFile (browser)", () => {
  it("menerima JPG, PNG, dan WebP", () => {
    expect(cekFile(file("a.jpg", "image/jpeg"))).toBeNull();
    expect(cekFile(file("a.png", "image/png"))).toBeNull();
    expect(cekFile(file("a.webp", "image/webp"))).toBeNull();
  });

  it("memakai ekstensi hanya bila browser tidak mengisi tipe", () => {
    expect(cekFile(file("a.jpeg", ""))).toBeNull();
    expect(cekFile(file("a.gif", ""))).toBe(PESAN_FORMAT);
  });

  it("menolak tipe lain walau namanya berakhiran .jpg", () => {
    expect(cekFile(file("foto.jpg", "image/heic"))).toBe(PESAN_FORMAT);
    expect(cekFile(file("dok.pdf", "application/pdf"))).toBe(PESAN_FORMAT);
  });

  it("menolak file kosong dan yang melebihi batas ukuran", () => {
    expect(cekFile(file("a.jpg", "image/jpeg", 0))).not.toBeNull();
    expect(cekFile(file("a.jpg", "image/jpeg", UKURAN_MAKS))).toBeNull();
    expect(cekFile(file("a.jpg", "image/jpeg", UKURAN_MAKS + 1))).toBe(PESAN_UKURAN);
  });
});

describe("jenisGambar (server, dari isi file)", () => {
  it("mengenali magic bytes JPG, PNG, dan WebP", () => {
    expect(jenisGambar(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe("image/jpeg");
    expect(jenisGambar(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe("image/png");
    const webp = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]);
    expect(jenisGambar(webp)).toBe("image/webp");
  });

  it("menolak teks biasa dan file terlalu pendek", () => {
    expect(jenisGambar(new TextEncoder().encode("bukan gambar"))).toBeNull();
    expect(jenisGambar(new Uint8Array([0xff, 0xd8]))).toBeNull();
    expect(jenisGambar(new Uint8Array([]))).toBeNull();
  });
});
