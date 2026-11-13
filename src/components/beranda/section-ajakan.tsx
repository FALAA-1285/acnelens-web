import Image from "next/image";
import { PillLink } from "@/components/ui";
import { GAMBAR } from "@/lib/gambar";
import { Parallax } from "@/components/motion/parallax";
import { Baris, Reveal } from "@/components/motion/reveal";

/** Banner ajakan penuh layar dengan latar parallax. */
export function SectionAjakan() {
  return (
    <section id="ajakan" className="relative flex min-h-[80vh] items-center overflow-hidden bg-ink text-white">
      <Parallax speed={0.18} className="absolute -inset-y-[18%] inset-x-0">
        <Image src={GAMBAR.ajakan} alt="" fill sizes="100vw" className="object-cover" />
      </Parallax>
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 py-28 text-center sm:px-6">
        <Reveal
          as="h2"
          varian="lines"
          className="mx-auto max-w-[900px] text-[clamp(40px,7vw,104px)] leading-[0.98] font-normal tracking-[-0.04em]"
        >
          <Baris>Coba cek</Baris>
          <Baris>
            <span className="serif-em">kulitmu</span> sekarang
          </Baris>
        </Reveal>
        <Reveal delay={200} className="mx-auto mt-6 max-w-[440px]">
          <p className="leading-relaxed text-white/80">
            Tidak perlu daftar akun. Cukup siapkan satu foto close-up kulit wajah dengan cahaya yang cukup terang.
          </p>
          <div className="mt-10">
            <PillLink href="/cek" varian="kaca">
              Mulai cek kulit
            </PillLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
