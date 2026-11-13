"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { IconCamera, IconCheck, IconClose, IconImage, IconInfo, IconShield, IconUpload } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/bagian";
import { PillButton } from "@/components/ui";
import { cekFile, UKURAN_MAKS_TEKS } from "@/lib/validasi-foto";
import type { Foto } from "./cek-kulit";

const TIPS = ["Foto dari dekat", "Cahaya merata", "Tanpa filter", "Tidak buram"];

function ukuranFile(byte: number) {
  if (byte < 1024 * 1024) return `${Math.max(1, Math.round(byte / 1024))} KB`;
  return `${(byte / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
}

type Props = {
  demo: boolean;
  foto: Foto | null;
  galat: string | null;
  onPilih: (file: File) => void;
  onHapus: () => void;
  onGalat: (pesan: string | null) => void;
  onAnalisis: () => void;
};

export function LangkahUnggah({ demo, foto, galat, onPilih, onHapus, onGalat, onAnalisis }: Props) {
  const [diseret, setDiseret] = useState(false);
  // dragenter/dragleave juga terpicu oleh elemen anak, jadi dihitung
  const hitungSeret = useRef(0);

  function terima(file: File | undefined) {
    if (!file) return;
    const pesan = cekFile(file);
    if (pesan) {
      onGalat(pesan);
      return;
    }
    onPilih(file);
  }

  function saatPilih(e: ChangeEvent<HTMLInputElement>) {
    terima(e.target.files?.[0]);
    e.target.value = ""; // supaya file yang sama bisa dipilih lagi
  }

  function saatDrop(e: DragEvent) {
    e.preventDefault();
    hitungSeret.current = 0;
    setDiseret(false);
    terima(e.dataTransfer.files?.[0]);
  }

  return (
    <div
      onDragEnter={(e) => {
        e.preventDefault();
        hitungSeret.current += 1;
        setDiseret(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => {
        hitungSeret.current -= 1;
        if (hitungSeret.current <= 0) setDiseret(false);
      }}
      onDrop={saatDrop}
      className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16"
    >
      {/* ---------- Bingkai lengkung: tempat seret / pratinjau ---------- */}
      <Reveal varian="scale" className="relative lg:col-span-6">
        <div className="relative mx-auto w-full max-w-[460px]">
          <div
            className={`relative aspect-[4/5] w-full overflow-hidden rounded-t-full rounded-b-[28px] transition-all duration-700 ease-halus ${
              foto
                ? "bg-blush shadow-[0_30px_70px_-30px_rgba(37,37,37,0.45)]"
                : diseret
                  ? "scale-[1.02] bg-[#ecd9d7]"
                  : "bg-blush"
            }`}
          >
            {/* garis putus-putus di dalam bingkai (hanya saat kosong) */}
            {!foto && (
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-3 rounded-t-full rounded-b-[20px] border-[1.5px] border-dashed transition-colors duration-500 ${
                  diseret ? "border-ink" : "border-ink/25"
                }`}
              />
            )}
            {foto ? (
              <>
                <Image
                  key={foto.url}
                  src={foto.url}
                  alt="Pratinjau foto yang dipilih"
                  fill
                  unoptimized
                  className="animate-[muncul_0.9s_var(--ease-halus)] object-cover"
                />
                <button
                  type="button"
                  onClick={onHapus}
                  aria-label="Hapus foto"
                  className="absolute top-[18%] right-4 inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink backdrop-blur transition-transform duration-500 ease-halus hover:scale-110"
                >
                  <IconClose size={15} />
                </button>
              </>
            ) : (
              <label
                htmlFor="pilih-foto"
                className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-4 px-6 text-center"
              >
                <span
                  className={`inline-flex size-16 items-center justify-center rounded-full bg-white text-ink shadow-[0_12px_30px_-12px_rgba(37,37,37,0.35)] transition-transform duration-700 ease-halus ${
                    diseret ? "-translate-y-2 scale-110" : "animate-melayang"
                  }`}
                >
                  <IconUpload size={24} />
                </span>
                <span className="text-[clamp(24px,2.4vw,32px)] leading-tight font-normal tracking-[-0.02em] text-ink">
                  {diseret ? (
                    <>
                      Lepaskan <span className="serif-em">di sini</span>
                    </>
                  ) : (
                    <>
                      <span className="md:hidden">
                        Ketuk untuk <span className="serif-em">memilih</span>
                      </span>
                      <span className="hidden md:inline">
                        Seret foto <span className="serif-em">ke sini</span>
                      </span>
                    </>
                  )}
                </span>
                <span className="text-[11px] tracking-[0.12em] text-muted uppercase">JPG / PNG / WEBP · maks {UKURAN_MAKS_TEKS}</span>
              </label>
            )}
          </div>
        </div>
      </Reveal>

      {/* ---------- Aksi ---------- */}
      <Reveal delay={150} className="flex flex-col gap-8 lg:col-span-6">
          <div>
            <Eyebrow>Langkah 1 dari 3</Eyebrow>
            <h2 className="mt-4 text-[clamp(36px,4.6vw,64px)] leading-[1.02] font-normal tracking-[-0.035em] text-ink">
              {foto ? (
                <>
                  Foto siap <span className="serif-em">diperiksa</span>
                </>
              ) : (
                <>
                  Pilih foto <span className="serif-em">kulitmu</span>
                </>
              )}
            </h2>
            <p className="mt-5 max-w-[460px] leading-relaxed text-muted">
              {foto
                ? "Pastikan area yang berjerawat terlihat jelas, lalu tekan tombol di bawah."
                : "Pilih foto dari galeri, ambil langsung dengan kamera, atau seret fotonya ke dalam bingkai."}
            </p>
          </div>

          {foto ? (
            <div className="flex items-center gap-3 border-y border-ink/10 py-4">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                <IconCheck size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <strong className="block truncate text-sm font-medium text-ink">{foto.file.name}</strong>
                <span className="text-xs text-muted">{ukuranFile(foto.file.size)}</span>
              </div>
              <label
                htmlFor="pilih-foto"
                className="link-garis cursor-pointer pb-0.5 text-[11px] font-semibold tracking-[0.1em] text-ink uppercase"
              >
                Ganti
              </label>
            </div>
          ) : (
            <div className="grid max-w-[520px] grid-cols-1 gap-3 sm:grid-cols-2">
              <label
                htmlFor="pilih-foto"
                className="group inline-flex min-h-14 cursor-pointer items-center justify-center gap-2.5 rounded-full bg-ink px-6 text-xs font-semibold tracking-[0.1em] text-white uppercase transition-all duration-500 ease-halus hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] has-focus-visible:outline-2"
              >
                <IconImage />
                Dari galeri
              </label>
              <label
                htmlFor="ambil-foto"
                className="inline-flex min-h-14 cursor-pointer items-center justify-center gap-2.5 rounded-full border border-ink/20 px-6 text-xs font-semibold tracking-[0.1em] text-ink uppercase transition-colors duration-500 ease-halus hover:border-ink has-focus-visible:outline-2"
              >
                <IconCamera />
                Pakai kamera
              </label>
            </div>
          )}

          <input id="pilih-foto" type="file" accept="image/png, image/jpeg, image/webp" className="sr-only" onChange={saatPilih} />
          <input
            id="ambil-foto"
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={saatPilih}
          />

          {galat && (
            <p role="alert" className="flex items-center gap-2 rounded-2xl bg-rose px-4 py-3 text-sm text-ink">
              <IconInfo />
              {galat}
            </p>
          )}

          {foto && (
            <PillButton onClick={onAnalisis} className="w-full max-w-[520px]">
              Periksa foto
            </PillButton>
          )}

          {/* Tips ringkas — penjelasan lengkap ada di bagian #tips di bawah */}
          <ul className="grid max-w-[520px] grid-cols-2 border-t border-ink/15" aria-label="Tips foto">
            {TIPS.map((t, i) => (
              <li
                key={t}
                className={`flex items-center gap-2.5 border-b border-ink/15 py-3.5 text-sm text-ink ${
                  i % 2 === 0 ? "pr-4" : "pl-4"
                }`}
              >
                <IconCheck size={14} className="shrink-0 text-ink/60" />
                {t}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2.5">
            <p className="inline-flex items-center gap-2 text-xs text-muted">
              <IconShield size={14} />
              Fotomu hanya dipakai untuk pengecekan ini.
            </p>
            {demo && (
              <p className="text-xs text-muted">Mode demo: server belum terhubung, jadi hasilnya masih acak.</p>
            )}
            <a href="#tips" className="link-garis self-start pb-0.5 text-[11px] font-semibold tracking-[0.1em] text-ink uppercase">
              Lihat tips memotret
            </a>
          </div>
      </Reveal>
    </div>
  );
}
