import { describe, expect, it } from "vitest";
import { buatBatasLaju } from "./batas-laju";

describe("buatBatasLaju", () => {
  it("menolak setelah melewati batas dalam satu jendela, lalu mengizinkan lagi", () => {
    const periksa = buatBatasLaju({ maks: 2, jendelaMs: 1000 });
    expect(periksa("a", 0).boleh).toBe(true);
    expect(periksa("a", 100).boleh).toBe(true);
    const ditolak = periksa("a", 200);
    expect(ditolak.boleh).toBe(false);
    expect(ditolak.tungguDetik).toBe(1);
    // klien lain tidak terpengaruh
    expect(periksa("b", 200).boleh).toBe(true);
    // jendela baru
    expect(periksa("a", 1000).boleh).toBe(true);
  });
});
