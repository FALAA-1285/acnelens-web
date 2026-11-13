import { KESALAHAN_UJI } from "@/lib/penelitian";

/* Komponen kecil halaman Tentang */

export function Angka({ nilai, ket, besar = false }: { nilai: string; ket: string; besar?: boolean }) {
  return (
    <div>
      <strong
        className={`block font-normal tracking-[-0.03em] text-ink ${
          besar ? "text-[clamp(44px,5vw,72px)] leading-none" : "text-[clamp(30px,3vw,40px)] leading-tight"
        }`}
      >
        {nilai}
      </strong>
      <span className="mt-2 block text-sm leading-snug text-muted">{ket}</span>
    </div>
  );
}

/** 300 titik = 300 citra uji. Titik berwarna = salah klasifikasi. */
export function TitikUji() {
  const { total, papulaJadiNormal, papulaJadiPustula } = KESALAHAN_UJI;
  const benar = total - papulaJadiNormal - papulaJadiPustula;
  const titik = [
    ...Array.from({ length: benar }, () => "bg-ink/15"),
    ...Array.from({ length: papulaJadiNormal }, () => "bg-[#d98f96]"),
    ...Array.from({ length: papulaJadiPustula }, () => "bg-[#b8925f]"),
  ];
  return (
    <div>
      <div
        className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1.5 sm:grid-cols-[repeat(30,minmax(0,1fr))]"
        role="img"
        aria-label={`${benar} dari ${total} citra uji benar, ${papulaJadiNormal} papula terbaca kulit normal, ${papulaJadiPustula} papula terbaca pustula`}
      >
        {titik.map((warna, i) => (
          <span key={i} className={`aspect-square rounded-full ${warna}`} />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-ink/15" /> {benar} benar
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#d98f96]" /> {papulaJadiNormal} papula → kulit normal
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#b8925f]" /> {papulaJadiPustula} papula → pustula
        </span>
      </div>
    </div>
  );
}
