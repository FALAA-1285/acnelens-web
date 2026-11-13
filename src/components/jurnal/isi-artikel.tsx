import Image from "next/image";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import type { Blok } from "@/lib/jurnal";

/** Merender blok isi artikel dengan tipografi bergaya editorial. */
export function IsiArtikel({ isi }: { isi: Blok[] }) {
  let nomorParagraf = 0;
  return (
    <>
      {isi.map((b, i) => {
        switch (b.t) {
          case "p": {
            const pertama = nomorParagraf++ === 0;
            return (
              <Reveal
                key={i}
                as="p"
                className={`mb-7 text-[18px] leading-[1.75] text-body ${
                  pertama
                    ? "first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:font-serif first-letter:text-[72px] first-letter:leading-[0.8] first-letter:text-ink first-letter:italic"
                    : ""
                }`}
              >
                {b.teks}
              </Reveal>
            );
          }
          case "h2":
            return (
              <Reveal
                key={i}
                as="h2"
                className="mt-24 mb-14 text-[clamp(40px,5.2vw,68px)] leading-[0.95] font-normal tracking-[-0.03em] text-ink"
              >
                {b.teks} {b.miring && <em className="serif-em">{b.miring}</em>}
              </Reveal>
            );
          case "h3":
            return (
              <Reveal
                key={i}
                as="h3"
                className="mt-12 mb-5 text-[26px] leading-tight font-normal tracking-[-0.02em] text-ink"
              >
                {b.teks}
              </Reveal>
            );
          case "gambar":
            return (
              <figure key={i} className="my-20 -mx-5 sm:-mx-10 lg:-mx-28">
                <Reveal varian="buka" className="relative aspect-[16/10] overflow-hidden bg-mist">
                  <Parallax speed={0.08} className="absolute -inset-y-[10%] inset-x-0">
                    <Image src={b.src} alt="" fill sizes="(max-width: 1024px) 100vw, 1100px" className="object-cover" />
                  </Parallax>
                </Reveal>
                {b.keterangan && (
                  <figcaption className="mt-4 px-5 text-sm text-muted sm:px-10 lg:px-28">{b.keterangan}</figcaption>
                )}
              </figure>
            );
          case "kutipan":
            return (
              <Reveal key={i} as="blockquote" className="my-16 border-l border-ink/20 pl-7 sm:pl-10">
                <p className="serif-em text-[clamp(28px,3.4vw,40px)] leading-[1.15] text-ink">“{b.teks}”</p>
              </Reveal>
            );
          case "daftar":
            return (
              <Reveal key={i} as="ol" className="mb-8 flex flex-col border-t border-ink/10">
                {b.isi.map((item, j) => (
                  <li
                    key={j}
                    className="grid grid-cols-[44px_minmax(0,1fr)] items-baseline gap-3 border-b border-ink/10 py-5 text-[17px] leading-relaxed text-ink"
                  >
                    <span className="font-mono text-xs text-muted">0{j + 1}</span>
                    {item}
                  </li>
                ))}
              </Reveal>
            );
        }
      })}
    </>
  );
}
