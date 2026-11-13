import Image from "next/image";
import { GAMBAR } from "@/lib/gambar";
import { Baris, Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { GambarParallax, GarisLengkung } from "@/components/bagian";

const PILAR = [
  {
    icon: GAMBAR.ikon.surf,
    judul: "Mencari titik penting",
    isi: "Sistem menandai bagian kulit yang paling menonjol, seperti tonjolan atau perubahan warna. Metode yang dipakai bernama SURF.",
  },
  {
    icon: GAMBAR.ikon.hog,
    judul: "Membaca tekstur",
    isi: "Di sekitar titik tersebut, sistem membaca pola garis dan tepi jerawat dengan metode HOG.",
  },
  {
    icon: GAMBAR.ikon.svm,
    judul: "Menentukan jenisnya",
    isi: "Model SVM lalu memasukkan hasil bacaan tadi ke salah satu kelas: kulit normal, papula, atau pustula.",
  },
  {
    icon: GAMBAR.ikon.transparan,
    judul: "Mudah ditelusuri",
    isi: "Metodenya cukup sederhana, jadi kita bisa melihat bagian foto mana yang memengaruhi hasil akhirnya.",
  },
];

export function SectionPendekatan() {
  return (
    <section id="pendekatan" className="relative overflow-hidden py-24 sm:py-36">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
          {/* Teks */}
          <div className="relative lg:col-span-6">
            <Reveal
              as="h2"
              varian="lines"
              className="text-[clamp(38px,5.6vw,76px)] leading-[1.02] font-normal tracking-[-0.035em] text-ink"
            >
              <Baris>Cara AcneLens</Baris>
              <Baris>mengenali</Baris>
              <Baris>
                <span className="serif-em garis-gambar">jerawatmu</span>
              </Baris>
            </Reveal>
            <Reveal delay={200} className="mt-7 max-w-[460px]">
              <p className="text-base leading-relaxed text-muted sm:text-lg">
                Foto yang kamu unggah diproses dalam beberapa tahap. Sistem mencari bagian kulit
                yang paling menonjol, membaca teksturnya, lalu membandingkannya dengan pola yang
                sudah dipelajari dari foto-foto contoh.
              </p>
            </Reveal>
            <GarisLengkung className="pointer-events-none absolute -right-4 -bottom-28 hidden w-36 text-ink/50 lg:block" />
          </div>

          {/* Komposisi gambar berlapis */}
          <div className="relative lg:col-span-6">
            <div className="relative mx-auto aspect-[4/5] w-[78%] max-w-[440px]">
              <GambarParallax
                src={GAMBAR.pendekatanUtama}
                speed={0.1}
                sizes="(max-width: 1024px) 70vw, 36vw"
                className="h-full w-full rounded-[200px_200px_28px_28px]"
              />
            </div>
            <div className="absolute bottom-[-8%] left-0 aspect-square w-[34%]">
              <GambarParallax
                src={GAMBAR.pendekatanKecil}
                speed={-0.08}
                sizes="20vw"
                className="h-full w-full rounded-full border-[6px] border-white"
              />
            </div>
            <Parallax speed={-0.25} className="pointer-events-none absolute -top-10 -right-6 w-[34%] opacity-80">
              <div className="animate-melayang">
                <Image src={GAMBAR.daun} alt="" width={320} height={320} style={{ width: "100%", height: "auto" }} />
              </div>
            </Parallax>
          </div>
        </div>

        {/* 4 pilar */}
        <div className="mt-28 grid grid-cols-1 border-t border-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {PILAR.map((p, i) => (
            <Reveal
              key={p.judul}
              delay={i * 110}
              className="group flex flex-col gap-5 border-b border-ink/10 py-10 sm:px-6 sm:[&:nth-child(odd)]:border-r lg:border-r lg:last:border-r-0 lg:first:pl-0"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-14 items-center justify-center rounded-full bg-[#f6efe9] transition-transform duration-700 ease-halus group-hover:-translate-y-1 group-hover:rotate-6">
                  <Image src={p.icon} alt="" width={26} height={26} style={{ width: 26, height: 26 }} />
                </span>
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
              </div>
              <h3 className="serif-em text-[28px] leading-tight text-ink">{p.judul}</h3>
              <p className="text-sm leading-relaxed text-muted">{p.isi}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
