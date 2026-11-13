import Link from "next/link";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { IconBulat, JudulSeksi, PillLink, Tag } from "@/components/ui";
import { IkonKelas, KulitIlustrasi } from "@/components/skin-art";
import {
  IconArrowUpRight,
  IconCheck,
  IconFile,
  IconFocus,
  IconGrid,
  IconKeypoint,
  IconSearch,
  IconSplit,
  IconUpload,
} from "@/components/icons";
import { KELAS, URUTAN_KELAS } from "@/lib/kelas";

const LANGKAH = [
  {
    no: "01",
    judul: "Unggah foto",
    isi: "Pilih foto close-up area kulit yang ingin dicek, dari galeri atau langsung dari kamera.",
    icon: <IconUpload size={22} />,
  },
  {
    no: "02",
    judul: "Sistem membaca tekstur",
    isi: "Foto diproses, lalu SURF mencari titik penting dan HOG membaca pola tekstur di sekitarnya.",
    icon: <IconSearch size={22} />,
  },
  {
    no: "03",
    judul: "Lihat hasilnya",
    isi: "Model SVM menentukan kelasnya, lengkap dengan penjelasan singkat dan saran langkah berikutnya.",
    icon: <IconCheck size={22} />,
  },
];

const METODE = [
  {
    judul: "Fitur SURF",
    isi: "Mencari titik penting pada kulit dan menentukan area yang paling informatif.",
    icon: <IconKeypoint size={20} />,
  },
  {
    judul: "Fitur HOG",
    isi: "Membaca pola tekstur dan tepi lesi dari arah gradien di area tersebut.",
    icon: <IconGrid size={20} />,
  },
  {
    judul: "Klasifikasi SVM",
    isi: "Fitur gabungan dipisahkan menjadi tiga kelas dengan kernel linear.",
    icon: <IconSplit size={20} />,
  },
  {
    judul: "Berdasarkan jurnal acuan",
    isi: "Konfigurasi yang sama mencapai akurasi uji 93,33% pada 300 citra uji di jurnal acuan.",
    icon: <IconFile size={20} />,
  },
];

function KartuMengambang({
  className,
  icon,
  judul,
  sub,
}: {
  className: string;
  icon: ReactNode;
  judul: string;
  sub: string;
}) {
  return (
    <div
      className={`absolute hidden items-center gap-3 rounded-[20px] bg-white py-3 pr-4 pl-3 shadow-[0_10px_30px_rgba(37,37,37,0.08)] sm:flex ${className}`}
    >
      <IconBulat size="sm" className="bg-mist">{icon}</IconBulat>
      <span className="flex flex-col">
        <strong className="text-sm font-semibold text-ink">{judul}</strong>
        <span className="text-xs text-muted">{sub}</span>
      </span>
    </div>
  );
}

function Hero() {
  return (
    <section className="mx-auto mt-6 max-w-[1280px] px-6">
      <div className="flex flex-wrap items-center gap-12 rounded-[36px] bg-blush p-[clamp(28px,5vw,72px)]">
        <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-7">
          <Tag>PENGENALAN JERAWAT BERBASIS CITRA</Tag>
          <h1 className="text-[clamp(44px,6vw,84px)] leading-[1.02] font-semibold tracking-[-0.035em] text-ink">
            Kenali jenis <span className="serif-em">jerawatmu</span> dari satu{" "}
            <span className="serif-em">foto</span>.
          </h1>
          <p className="max-w-[460px] text-lg leading-relaxed text-muted">
            Unggah foto close-up kulit wajah, lalu AcneLens memberi tahu apakah
            itu papula, pustula, atau kulit normal.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <PillLink href="/cek" varian="terang" className="min-w-[300px]">
              <span className="underline underline-offset-4">MULAI CEK KULIT</span>
            </PillLink>
            <Link href="/tentang" className="text-sm font-medium underline underline-offset-4">
              Lihat cara kerjanya
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {URUTAN_KELAS.map((id) => (
              <span
                key={id}
                className="rounded-full bg-white px-3.5 py-2 text-xs font-semibold tracking-[0.06em] text-ink uppercase"
              >
                {KELAS[id].nama}
              </span>
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-[1_1_420px]">
          <div className="relative mx-auto aspect-square w-full max-w-[560px]">
            <div className="absolute inset-x-[16%] inset-y-[4%] -rotate-[28deg] rounded-full bg-[#d8d0c4]" />
            <div className="absolute inset-x-[25%] inset-y-[14%] -rotate-[28deg] overflow-hidden rounded-full">
              <KulitIlustrasi />
            </div>

            <KartuMengambang
              className="top-[3%] left-0"
              icon={<IconFocus />}
              judul="Praproses"
              sub="Grayscale · 256 × 300"
            />
            <KartuMengambang
              className="top-[20%] right-0"
              icon={<IconKeypoint />}
              judul="Fitur SURF"
              sub="Keypoint lokal"
            />
            <KartuMengambang
              className="bottom-[20%] left-[2%]"
              icon={<IconGrid />}
              judul="Fitur HOG"
              sub="Tekstur gradien"
            />
            <div className="absolute right-[4%] bottom-[3%] flex items-center gap-3 rounded-[20px] bg-ink py-3 pr-5 pl-3 text-white shadow-[0_10px_30px_rgba(37,37,37,0.16)]">
              <IconBulat size="sm">
                <IconCheck />
              </IconBulat>
              <span className="flex flex-col">
                <span className="text-xs text-[#c9c9c9]">Klasifikasi SVM</span>
                <strong className="serif-em text-[22px]">Pustula</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CaraKerja() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pt-28">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <JudulSeksi>
          Tiga langkah, <span className="serif-em">satu</span> hasil
        </JudulSeksi>
        <p className="max-w-[360px] text-[13px] leading-relaxed tracking-[0.06em] text-muted">
          TIDAK PERLU AKUN. CUKUP SATU FOTO KULIT YANG JELAS DAN CAHAYA YANG CUKUP.
        </p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
        {LANGKAH.map((l) => (
          <div key={l.no} className="flex flex-col gap-4 rounded-[28px] bg-mist p-8">
            <div className="flex items-center justify-between">
              <IconBulat size="lg">{l.icon}</IconBulat>
              <span className="text-[13px] font-semibold text-muted">{l.no}</span>
            </div>
            <h3 className="text-[22px] font-semibold text-ink">{l.judul}</h3>
            <p className="text-[15px] leading-relaxed text-muted">{l.isi}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function DaftarKelas() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pt-28">
      <JudulSeksi className="mb-12">
        Kondisi yang <span className="serif-em">dikenali</span>
      </JudulSeksi>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
        {URUTAN_KELAS.map((id) => (
          <div key={id} className={`overflow-hidden rounded-[28px] ${KELAS[id].warna}`}>
            <div className="flex h-[260px] items-center justify-center">
              <IkonKelas jenis={id} />
            </div>
            <div className="flex flex-col gap-2.5 px-6 pt-5 pb-7">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] font-semibold tracking-[0.08em] text-ink uppercase">
                  {KELAS[id].nama}
                </span>
                <span className="text-xs">Kelas {KELAS[id].label}</span>
              </div>
              <p className="text-[15px] leading-relaxed">{KELAS[id].ringkas}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs tracking-[0.06em] text-muted">
        HASIL APLIKASI BUKAN DIAGNOSIS MEDIS. PERIKSAKAN KE DOKTER KULIT BILA
        JERAWAT MELUAS ATAU TERASA NYERI.
      </p>
    </section>
  );
}

function Metode() {
  return (
    <section className="mt-28 bg-mist">
      <div className="mx-auto flex max-w-[1280px] flex-wrap gap-14 px-6 py-24">
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-6">
          <Tag>METODE</Tag>
          <JudulSeksi>
            Model yang <span className="serif-em">bisa dijelaskan</span>, bukan kotak hitam.
          </JudulSeksi>
          <p className="max-w-[440px] leading-relaxed text-muted">
            Setiap fitur dihitung dengan rumus yang jelas, jadi kita bisa melihat
            bagian foto mana yang dipakai model untuk mengambil keputusan.
          </p>
        </div>
        <div className="flex min-w-0 flex-[1_1_480px] flex-col divide-y divide-[#dedede]">
          {METODE.map((m) => (
            <div key={m.judul} className="grid grid-cols-[48px_minmax(0,1fr)] gap-5 py-6">
              <IconBulat>{m.icon}</IconBulat>
              <div>
                <h3 className="serif-em mb-1.5 text-[26px] text-ink">{m.judul}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{m.isi}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Ajakan() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-28">
      <div className="flex flex-wrap items-center justify-between gap-10 rounded-[36px] bg-oat p-[clamp(28px,5vw,64px)]">
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4">
          <h2 className="text-[clamp(40px,5.5vw,76px)] leading-none font-semibold tracking-[-0.035em] text-ink">
            SIAP CEK <span className="serif-em">kulitmu?</span>
          </h2>
          <p className="max-w-[420px] leading-relaxed">
            Siapkan satu foto close-up dengan cahaya merata. Hasilnya langsung
            muncul setelah analisis selesai.
          </p>
        </div>
        <Link href="/cek" className="flex flex-col items-center gap-3 text-ink">
          <span className="inline-flex size-[88px] items-center justify-center rounded-full bg-ink text-white transition-transform hover:scale-105">
            <IconArrowUpRight size={28} />
          </span>
          <span className="text-xs font-semibold tracking-[0.1em] underline underline-offset-4">
            MULAI SEKARANG
          </span>
        </Link>
      </div>
    </section>
  );
}

export default function Beranda() {
  return (
    <>
      <SiteHeader aktif="beranda" />
      <main>
        <Hero />
        <CaraKerja />
        <DaftarKelas />
        <Metode />
        <Ajakan />
      </main>
      <SiteFooter />
    </>
  );
}
