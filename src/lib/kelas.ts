export type KelasId = "papula" | "pustula" | "non_acne";

export const URUTAN_KELAS: readonly KelasId[] = ["papula", "pustula", "non_acne"];

type InfoKelas = {
  nama: string;
  label: number;
  warna: string;
  ringkas: string;
  detail: string;
};

export const KELAS: Record<KelasId, InfoKelas> = {
  papula: {
    nama: "Papula",
    label: 1,
    warna: "bg-rose",
    ringkas: "Benjolan kecil yang meradang, padat, dan kemerahan, tanpa nanah.",
    detail:
      "Benjolan kecil yang meradang, padat, dan kemerahan, tanpa nanah. Kelas ini paling sering tertukar dengan kulit normal karena warna dan tonjolannya bisa samar.",
  },
  pustula: {
    nama: "Pustula",
    label: 2,
    warna: "bg-sand",
    ringkas: "Benjolan meradang dengan ujung berisi nanah putih atau kekuningan.",
    detail:
      "Benjolan meradang dengan ujung berisi nanah putih atau kekuningan, biasanya dikelilingi kulit kemerahan.",
  },
  non_acne: {
    nama: "Kulit normal",
    label: 0,
    warna: "bg-sage",
    ringkas: "Tidak ada lesi jerawat yang meradang pada area yang difoto.",
    detail:
      "Tidak ada lesi jerawat yang meradang pada area yang difoto. Pori dan tekstur kulit tetap terlihat seperti biasa.",
  },
};
