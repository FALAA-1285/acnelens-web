import Image from "next/image";
import Link from "next/link";
import { PillLink } from "@/components/ui";
import { GAMBAR } from "@/lib/gambar";
import { Baris, Reveal } from "@/components/motion/reveal";

// Panduan singkat — semuanya mengarah ke halaman yang sudah ada.
const PANDUAN = [
  {
    label: "Tips foto",
    judul: "Tips memotret kulit supaya hasilnya akurat",
    isi: "Gunakan cahaya yang merata, ambil foto dari jarak dekat, dan pastikan gambarnya tidak buram.",
    href: "/cek",
  },
  {
    label: "Jenis jerawat",
    judul: "Apa bedanya papula dan pustula?",
    isi: "Keduanya sama-sama meradang. Bedanya, pustula punya titik putih atau kuning berisi nanah di tengahnya.",
    href: "/tentang#jenis",
  },
  {
    label: "Kesehatan kulit",
    judul: "Kapan perlu ke dokter kulit?",
    isi: "Saat jerawat terasa sakit, makin menyebar, atau tidak membaik setelah beberapa minggu.",
    href: "/tentang",
  },
];

function Kartu({
  p,
  gambar,
  besar = false,
}: {
  p: (typeof PANDUAN)[number];
  gambar: string;
  besar?: boolean;
}) {
  return (
    <Link
      href={p.href}
      className={`group block ${besar ? "" : "lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:items-center lg:gap-6"}`}
    >
      <div
        className={`relative overflow-hidden rounded-[24px] bg-mist ${
          besar ? "aspect-[16/10]" : "aspect-[4/3] lg:aspect-[4/5]"
        }`}
      >
        <Image
          src={gambar}
          alt=""
          fill
          sizes={besar ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 1024px) 50vw, 20vw"}
          className="object-cover transition-transform duration-[1.2s] ease-halus group-hover:scale-105"
        />
      </div>
      <div className={besar ? "mt-5" : "mt-5 lg:mt-0"}>
        <span className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">{p.label}</span>
        <h3
          className={`mt-2 font-medium tracking-[-0.02em] text-ink ${besar ? "text-2xl sm:text-3xl" : "text-lg"}`}
        >
          <span className="link-garis">{p.judul}</span>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{p.isi}</p>
      </div>
    </Link>
  );
}

export function SectionPanduan() {
  return (
    <section id="panduan" className="py-24 sm:py-36">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <Reveal
            as="h2"
            varian="lines"
            className="text-[clamp(38px,5.6vw,76px)] leading-[1.02] font-normal tracking-[-0.035em] text-ink"
          >
            <Baris>Baca dulu</Baris>
            <Baris>
              <span className="serif-em garis-gambar">sebelum mulai</span>
            </Baris>
          </Reveal>
          <Reveal delay={150}>
            <PillLink href="/jurnal" varian="garis">
              Lihat semua
            </PillLink>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Kartu p={PANDUAN[0]} gambar={GAMBAR.jurnal[0]} besar />
          </Reveal>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:content-between lg:gap-8">
            <Reveal delay={120}>
              <Kartu p={PANDUAN[1]} gambar={GAMBAR.jurnal[1]} />
            </Reveal>
            <Reveal delay={220}>
              <Kartu p={PANDUAN[2]} gambar={GAMBAR.jurnal[2]} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
