import { describe, expect, it } from "vitest";
import { bacaRespons, GalatPrediksi, kelasTertinggi, kirimFoto, persenBulat } from "./predict";

describe("bacaRespons", () => {
  it("membaca respons yang benar", () => {
    const hasil = bacaRespons({ label: "pustula", probabilities: { papula: 0.11, pustula: 0.86, non_acne: 0.03 } });
    expect(hasil).toEqual({
      status: "berhasil",
      label: "pustula",
      probabilitas: { papula: 0.11, pustula: 0.86, non_acne: 0.03 },
    });
  });

  it("label null berarti tidak terdeteksi (tidak ada keypoint)", () => {
    expect(bacaRespons({ label: null, reason: "no_keypoint" })).toEqual({ status: "tidak_terdeteksi" });
  });

  it("menolak label yang bukan probabilitas tertinggi", () => {
    expect(() =>
      bacaRespons({ label: "papula", probabilities: { papula: 0.1, pustula: 0.8, non_acne: 0.1 } }),
    ).toThrow(GalatPrediksi);
  });

  it("menolak total probabilitas yang jauh dari 1", () => {
    expect(() =>
      bacaRespons({ label: "papula", probabilities: { papula: 0.9, pustula: 0.5, non_acne: 0.1 } }),
    ).toThrow(GalatPrediksi);
  });

  it("menerima total yang sedikit meleset karena pembulatan", () => {
    const hasil = bacaRespons({ label: "papula", probabilities: { papula: 0.34, pustula: 0.33, non_acne: 0.32 } });
    expect(hasil.status).toBe("berhasil");
  });

  it("menolak label tak dikenal, probabilitas rusak, dan bentuk data salah", () => {
    expect(() => bacaRespons({ label: "komedo", probabilities: { papula: 1, pustula: 0, non_acne: 0 } })).toThrow();
    expect(() => bacaRespons({ label: "papula", probabilities: { papula: "1", pustula: 0, non_acne: 0 } })).toThrow();
    expect(() => bacaRespons({ label: "papula", probabilities: { papula: 1.2, pustula: 0, non_acne: 0 } })).toThrow();
    expect(() => bacaRespons({ label: "papula" })).toThrow();
    expect(() => bacaRespons(null)).toThrow();
    expect(() => bacaRespons("teks")).toThrow();
  });
});

describe("persenBulat", () => {
  it("selalu berjumlah tepat 100", () => {
    const kasus = [
      { papula: 1 / 3, pustula: 1 / 3, non_acne: 1 / 3 },
      { papula: 0.335, pustula: 0.335, non_acne: 0.33 },
      { papula: 0.004, pustula: 0.006, non_acne: 0.99 },
      { papula: 0.5, pustula: 0.49, non_acne: 0.0 }, // total 0.99
      { papula: 0.51, pustula: 0.5, non_acne: 0.0 }, // total 1.01
    ];
    for (const p of kasus) {
      const h = persenBulat(p);
      expect(h.papula + h.pustula + h.non_acne).toBe(100);
    }
  });

  it("membulatkan dengan wajar", () => {
    expect(persenBulat({ papula: 0.11, pustula: 0.86, non_acne: 0.03 })).toEqual({ papula: 11, pustula: 86, non_acne: 3 });
  });
});

describe("kelasTertinggi", () => {
  it("memilih kelas dengan probabilitas terbesar", () => {
    expect(kelasTertinggi({ papula: 0.2, pustula: 0.1, non_acne: 0.7 })).toBe("non_acne");
  });
});

describe("kirimFoto mode demo", () => {
  it("bisa dibatalkan lewat AbortSignal", async () => {
    const ctrl = new AbortController();
    const janji = kirimFoto(new File(["x"], "a.jpg", { type: "image/jpeg" }), { demo: true, signal: ctrl.signal });
    ctrl.abort();
    await expect(janji).rejects.toMatchObject({ name: "AbortError" });
  });
});
