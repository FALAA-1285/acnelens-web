import Image from "next/image";
import { PillLink } from "@/components/ui";
import type { ReactNode } from "react";
import { GAMBAR } from "@/lib/gambar";
import { IconCamera, IconCheck, IconShieldPlus, IconSplit } from "@/components/icons";
import { Parallax } from "@/components/motion/parallax";
import { Baris, Reveal } from "@/components/motion/reveal";

// Manfaat memakai AcneLens. Cara kerjanya (SURF, HOG, SVM) sudah dibahas di section Pendekatan.
type Tahap = { judul: string; isi: string; icon: ReactNode };

const TAHAP: Tahap[] = [
  {
    judul: "Langsung pakai",
    isi: "Buka di browser lalu unggah foto. Tanpa daftar akun atau instal aplikasi.",
    icon: <IconCamera size={30} />,
  },
  {
    judul: "Hasil dalam sekejap",
    isi: "Jenis jerawatmu muncul beberapa saat setelah foto diunggah.",
    icon: <IconCheck size={30} />,
  },
  {
    judul: "Bukan cuma satu jawaban",
    isi: "Lihat persentase keyakinan untuk tiap kelas: normal, papula, dan pustula.",
    icon: <IconSplit size={30} />,
  },
  {
    judul: "Tahu langkah berikutnya",
    isi: "Dapat saran perawatan dasar dan kapan sebaiknya ke dokter kulit.",
    icon: <IconShieldPlus size={30} />,
  },
];

// Kartu meniru web referensi: abu-abu muda, sudut 14px, ikon dalam lingkaran putih besar
function Kartu({ t }: { t: Tahap }) {
  return (
    <div className="group flex w-full flex-col items-center rounded-[14px] bg-[#f5f5f5] px-5 pt-9 pb-7 text-center transition-transform duration-700 ease-halus hover:-translate-y-1.5 sm:px-10 sm:pt-16 sm:pb-12 lg:max-w-[320px]">
      <span className="flex size-20 items-center justify-center rounded-full bg-white text-ink transition-transform duration-700 ease-halus group-hover:scale-105 group-hover:rotate-6 sm:size-28">
        {t.icon}
      </span>
      <h3 className="mx-auto mt-6 text-lg lg:max-w-[80%] leading-tight font-medium tracking-[-0.01em] text-ink sm:mt-8 sm:text-xl">
        {t.judul}
      </h3>
      <p className="mt-3 text-xs leading-relaxed text-muted sm:mt-5 sm:text-sm">{t.isi}</p>
    </div>
  );
}

// Bentuk elips miring (kiri-bawah → kanan-atas) seperti web referensi
const MASK_ELIPS = {
  WebkitMaskImage: "url(/img/elips.svg)",
  maskImage: "url(/img/elips.svg)",
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
} as const;

export function SectionProses() {
  return (
    <section id="proses" className="relative overflow-hidden bg-white pt-24 pb-16 sm:pt-36 sm:pb-20">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
        {/* ---------- Judul ---------- */}
        <div className="relative">
          <Reveal
            as="h2"
            varian="lines"
            className="text-[clamp(40px,7.4vw,108px)] leading-[0.95] font-normal tracking-[-0.035em] text-ink uppercase"
          >
            <Baris>Kenali kulitmu</Baris>
            <Baris>tanpa harus</Baris>
          </Reveal>

          <div className="mt-6 flex flex-col gap-6 md:mt-4 md:flex-row md:items-start md:gap-14">
            <Reveal delay={200} className="max-w-[300px] md:pt-6">
              <p className="text-[15px] leading-relaxed text-muted">
                AcneLens membantumu memahami jerawat di wajah sebelum memilih perawatan. Ini yang
                kamu dapat setiap kali memakainya.
              </p>
              <div className="mt-6">
                <PillLink href="/cek" varian="garis">
                  Coba sekarang
                </PillLink>
              </div>
            </Reveal>
            <Reveal
              as="p"
              varian="lines"
              delay={150}
              className="serif-em text-[clamp(72px,12vw,176px)] leading-[0.9] tracking-[-0.02em] text-ink"
            >
              <Baris>
                <span className="garis-tebal pb-1">menebak.</span>
              </Baris>
            </Reveal>
          </div>

          {/* Panah melengkung — digambar saat masuk layar */}
          <Reveal
            varian="fade"
            className="pointer-events-none absolute -top-16 right-[3%] hidden w-[30%] max-w-[380px] lg:block"
          >
            <svg viewBox="0 0 400 640" fill="none" className="garis-anim h-auto w-full text-ink" aria-hidden="true">
              <path
                pathLength={1}
                d="M6 30 C 150 -6, 330 30, 380 190 C 420 330, 330 520, 170 622"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                pathLength={1}
                d="M188 600 L 166 624 L 196 628"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Reveal>
        </div>

        {/* ---------- Panggung: foto elips di tengah, kartu di area kosongnya ---------- */}
        <div className="relative mt-16 lg:mt-24 lg:pb-28">
          {/* Foto dalam elips miring — di layar lebar berada DI BELAKANG kartu (70% lebar, tengah) */}
          <Reveal
            varian="scale"
            className="relative mx-auto mb-10 aspect-[826/725] w-full max-w-[560px] lg:absolute lg:top-[100px] lg:left-1/2 lg:mb-0 lg:aspect-auto lg:h-[760px] lg:w-[70%] lg:max-w-none lg:-translate-x-1/2"
          >
            <div className="absolute inset-0 overflow-hidden" style={MASK_ELIPS}>
              <Parallax speed={0.08} className="absolute -inset-y-[6%] inset-x-0">
                <Image
                  src={GAMBAR.prosesSorotan}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="object-cover object-[50%_30%]"
                />
              </Parallax>
            </div>
          </Reveal>

          {/* Kartu: 2×2 di HP; di layar lebar 2 di kiri-atas & 2 di kanan-bawah (luar elips) */}
          <div className="relative z-10 grid grid-cols-2 gap-3 sm:gap-5 lg:block">
            <div className="contents lg:flex lg:items-start lg:gap-7">
              {TAHAP.slice(0, 2).map((t, i) => (
                <Reveal key={t.judul} delay={i * 120} className={`[clip-path:none]! lg:w-[320px] ${i === 0 ? "lg:mt-[12%]" : ""}`}>
                  <Parallax hanyaLebar speed={i === 0 ? 0.06 : -0.04}>
                    <Kartu t={t} />
                  </Parallax>
                </Reveal>
              ))}
            </div>
            <div className="contents lg:-mt-[10%] lg:flex lg:items-start lg:justify-end lg:gap-7">
              {TAHAP.slice(2).map((t, i) => (
                <Reveal key={t.judul} delay={(i + 2) * 120} className={`[clip-path:none]! lg:w-[320px] ${i === 0 ? "lg:mt-[16rem]" : ""}`}>
                  <Parallax hanyaLebar speed={i === 0 ? -0.03 : 0.05}>
                    <Kartu t={t} />
                  </Parallax>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
