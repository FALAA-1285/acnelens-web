"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Parallax } from "@/components/motion/parallax";
import { Baris, Reveal } from "@/components/motion/reveal";
import { FooterSitus } from "@/components/footer-situs";
import { IconArrowLeft } from "@/components/icons";
import { GAMBAR } from "@/lib/gambar";
import { kirimFoto, type HasilPrediksi } from "@/lib/predict";
import { LangkahUnggah } from "./langkah-unggah";
import { LangkahAnalisis } from "./langkah-analisis";
import { LangkahHasil } from "./langkah-hasil";

export type Foto = { file: File; url: string };

type Tahap = "unggah" | "analisis" | "hasil";

const LANGKAH: { id: Tahap; label: string }[] = [
  { id: "unggah", label: "Unggah foto" },
  { id: "analisis", label: "Analisis" },
  { id: "hasil", label: "Hasil" },
];

function Stepper({ tahap }: { tahap: Tahap }) {
  const aktif = LANGKAH.findIndex((l) => l.id === tahap);
  return (
    <ol className="flex items-center gap-2 sm:gap-3" aria-label="Langkah">
      {LANGKAH.map((l, i) => {
        const status = i < aktif ? "selesai" : i === aktif ? "aktif" : "nanti";
        return (
          <li key={l.id} className="flex items-center gap-2 sm:gap-3">
            <span
              aria-current={status === "aktif" ? "step" : undefined}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase backdrop-blur-md transition-all duration-700 ease-halus sm:px-4 sm:py-2 ${
                status === "aktif"
                  ? "border-white bg-white text-ink"
                  : status === "selesai"
                    ? "border-white/50 bg-white/15 text-white"
                    : "border-white/25 bg-white/5 text-white/60"
              }`}
            >
              <span className="font-mono">0{i + 1}</span>
              <span className={status === "aktif" ? "" : "hidden sm:inline"}>{l.label}</span>
            </span>
            {i < LANGKAH.length - 1 && (
              <span
                aria-hidden="true"
                className={`h-px w-5 transition-colors duration-700 sm:w-10 ${i < aktif ? "bg-white" : "bg-white/30"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

const JUDUL: Record<Tahap, [string, string]> = {
  unggah: ["Cek jenis", "jerawatmu"],
  analisis: ["Sedang", "memproses"],
  hasil: ["Ini hasil", "pengecekanmu"],
};

export function CekKulit() {
  const [tahap, setTahap] = useState<Tahap>("unggah");
  const [foto, setFoto] = useState<Foto | null>(null);
  const [hasil, setHasil] = useState<HasilPrediksi | null>(null);
  const [selesai, setSelesai] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);

  const kontrol = useRef<AbortController | null>(null);
  const urlFoto = useRef<string | null>(null);
  const konten = useRef<HTMLDivElement>(null);
  const timerHasil = useRef<ReturnType<typeof setTimeout> | null>(null);

  // hapus object URL foto saat halaman ditinggalkan
  useEffect(() => {
    return () => {
      kontrol.current?.abort();
      if (timerHasil.current) clearTimeout(timerHasil.current);
      if (urlFoto.current) URL.revokeObjectURL(urlFoto.current);
    };
  }, []);

  function pindah(t: Tahap) {
    setTahap(t);
    // gulir ke awal konten (di bawah banner), bukan ke paling atas
    const el = konten.current;
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90;
      if (window.scrollY > y || t !== "unggah") window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  function pilihFoto(file: File) {
    if (urlFoto.current) URL.revokeObjectURL(urlFoto.current);
    const url = URL.createObjectURL(file);
    urlFoto.current = url;
    setFoto({ file, url });
    setGalat(null);
  }

  function hapusFoto() {
    if (urlFoto.current) URL.revokeObjectURL(urlFoto.current);
    urlFoto.current = null;
    setFoto(null);
  }

  async function analisis() {
    if (!foto) return;

    const ctrl = new AbortController();
    kontrol.current = ctrl;
    setSelesai(false);
    setGalat(null);
    pindah("analisis");

    try {
      const res = await kirimFoto(foto.file, ctrl.signal);
      setHasil(res);
      setSelesai(true);
      // beri jeda sebentar supaya semua tahap terlihat selesai
      timerHasil.current = setTimeout(() => pindah("hasil"), 700);
    } catch (err) {
      if (ctrl.signal.aborted) return;
      console.error(err);
      // fetch melempar TypeError bila jaringan gagal; galat lain berasal dari respons server
      setGalat(
        err instanceof TypeError
          ? "Gagal menghubungi server. Periksa koneksi lalu coba lagi."
          : "Server memberi respons yang tidak terduga. Coba lagi beberapa saat lagi.",
      );
      pindah("unggah");
    }
  }

  function batal() {
    kontrol.current?.abort();
    pindah("unggah");
  }

  function ulang() {
    hapusFoto();
    setHasil(null);
    pindah("unggah");
  }

  const [judul, serif] = JUDUL[tahap];

  return (
    <>
      <SiteHeader aktif="cek" varian="hero" />

      {/* Banner foto, gaya sama dengan hero beranda */}
      <section className="relative flex min-h-[440px] items-end overflow-hidden bg-ink text-white sm:min-h-[520px] lg:h-[62vh]">
        <Parallax speed={0.18} className="absolute -inset-y-[20%] inset-x-0">
          <Image src={GAMBAR.cekBanner} alt="" fill priority sizes="100vw" className="object-cover" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/55" />

        <div className="relative mx-auto w-full max-w-[1280px] px-5 pt-32 pb-12 sm:px-6 sm:pb-16">
          <Reveal varian="fade">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-white/75 uppercase transition-colors hover:text-white"
            >
              <IconArrowLeft size={14} />
              Beranda
            </Link>
          </Reveal>

          {/* key = tahap, supaya animasi judul diputar ulang setiap ganti langkah */}
          <Reveal
            key={tahap}
            as="h1"
            varian="lines"
            className="mt-5 text-[clamp(44px,8vw,104px)] leading-[0.98] font-normal tracking-[-0.04em]"
          >
            <Baris>{judul}</Baris>
            <Baris>
              <span className="serif-em">{serif}</span>
            </Baris>
          </Reveal>

          <Reveal delay={250} className="mt-8 sm:mt-10">
            <Stepper tahap={tahap} />
          </Reveal>
        </div>
      </section>

      <main ref={konten} className="bg-[#faf6f2]">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-6 sm:py-24">
          {tahap === "unggah" && (
            <LangkahUnggah
              foto={foto}
              galat={galat}
              onPilih={pilihFoto}
              onHapus={hapusFoto}
              onGalat={setGalat}
              onAnalisis={analisis}
            />
          )}

          {tahap === "analisis" && foto && (
            <LangkahAnalisis foto={foto} selesai={selesai} onBatal={batal} />
          )}

          {tahap === "hasil" && foto && hasil && (
            <LangkahHasil foto={foto} hasil={hasil} onUlang={ulang} />
          )}
        </div>
      </main>

      <FooterSitus />
    </>
  );
}
