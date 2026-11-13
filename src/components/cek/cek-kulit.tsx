"use client";

import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Baris, Reveal } from "@/components/motion/reveal";
import { FooterSitus } from "@/components/footer-situs";
import { kirimFoto, type HasilPrediksi } from "@/lib/predict";
import { LangkahUnggah } from "./langkah-unggah";
import { LangkahAnalisis } from "./langkah-analisis";
import { LangkahHasil } from "./langkah-hasil";
import { AlurSingkat, KelasSingkat, TipsFoto } from "./info-cek";

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
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase transition-all duration-700 ease-halus sm:px-4 sm:py-2 ${
                status === "aktif"
                  ? "border-ink bg-ink text-white"
                  : status === "selesai"
                    ? "border-ink/40 text-ink"
                    : "border-ink/15 text-muted"
              }`}
            >
              <span className="font-mono">0{i + 1}</span>
              <span className={status === "aktif" ? "" : "hidden sm:inline"}>{l.label}</span>
            </span>
            {i < LANGKAH.length - 1 && (
              <span
                aria-hidden="true"
                className={`h-px w-5 transition-colors duration-700 sm:w-10 ${i < aktif ? "bg-ink" : "bg-ink/15"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

// [kata serif, kata kapital, deskripsi] — gaya judul sama dengan halaman Jurnal & Tentang
const JUDUL: Record<Tahap, [string, string, string]> = {
  unggah: [
    "cek",
    "kulitmu",
    "Unggah satu foto close-up kulit wajah. AcneLens akan memperkirakan apakah itu papula, pustula, atau kulit normal.",
  ],
  analisis: [
    "sedang",
    "diperiksa",
    "Fotomu sedang dibaca tahap demi tahap. Biasanya hanya butuh beberapa detik.",
  ],
  hasil: [
    "hasil",
    "pengecekan",
    "Ini perkiraan AcneLens untuk fotomu, lengkap dengan saran yang bisa kamu lakukan.",
  ],
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

  const [serif, kapital, deskripsi] = JUDUL[tahap];

  return (
    <>
      <SiteHeader aktif="cek" />

      <main className="overflow-x-clip">
        {/* ---------- Pembuka: judul besar di tengah ---------- */}
        <section className="relative mx-auto max-w-[1280px] px-5 pt-24 text-center sm:px-6 sm:pt-32">
          {/* key = tahap, supaya animasi judul diputar ulang setiap ganti langkah */}
          <Reveal
            key={tahap}
            as="h1"
            varian="lines"
            className="text-[clamp(52px,9vw,128px)] leading-[0.82] font-normal tracking-[-0.04em] text-ink"
          >
            <Baris>
              <span className="serif-em text-[1.25em]">{serif}</span>
            </Baris>
            <Baris>
              <span className="uppercase">{kapital}</span>
            </Baris>
          </Reveal>
          <Reveal key={`d-${tahap}`} delay={250} className="mx-auto mt-8 max-w-[520px]">
            <p className="leading-relaxed text-muted">{deskripsi}</p>
          </Reveal>
          <Reveal delay={350} className="mt-10 flex justify-center">
            <Stepper tahap={tahap} />
          </Reveal>

          {/* Garis lengkung dekoratif, sama seperti halaman Jurnal */}
          <Reveal varian="fade" className="pointer-events-none absolute top-[14%] -right-[6%] hidden w-[38%] lg:block">
            <svg viewBox="0 0 600 300" fill="none" className="garis-anim h-auto w-full text-ink/60" aria-hidden="true">
              <path
                pathLength={1}
                d="M10 40 C 180 -10, 420 10, 520 120 C 600 210, 560 290, 470 296"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </Reveal>
        </section>

        <div ref={konten} className="mx-auto max-w-[1280px] scroll-mt-24 px-5 pt-16 pb-8 sm:px-6 sm:pt-24">
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

        {/* Bacaan pendukung hanya di langkah pertama */}
        {tahap === "unggah" && (
          <>
            <TipsFoto />
            <AlurSingkat />
            <KelasSingkat />
          </>
        )}
        {tahap !== "unggah" && <div className="h-24 sm:h-32" />}
      </main>

      <FooterSitus tanpaAjakan />
    </>
  );
}
