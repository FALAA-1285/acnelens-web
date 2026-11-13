"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { IconCamera, IconCheck, IconClose, IconImage, IconInfo, IconShield, IconUpload } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { PillButton } from "@/components/ui";
import { cekFile, MODE_DEMO } from "@/lib/predict";
import type { Foto } from "./cek-kulit";

const TIPS = ["Foto dari dekat", "Cahaya merata", "Tanpa filter", "Tidak buram"];

function ukuranFile(byte: number) {
  if (byte < 1024 * 1024) return `${Math.max(1, Math.round(byte / 1024))} KB`;
  return `${(byte / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
}

type Props = {
  foto: Foto | null;
  galat: string | null;
  onPilih: (file: File) => void;
  onHapus: () => void;
  onGalat: (pesan: string | null) => void;
  onAnalisis: () => void;
};

export function LangkahUnggah({ foto, galat, onPilih, onHapus, onGalat, onAnalisis }: Props) {
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
    <Reveal className="mx-auto max-w-[1080px]">
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
        className={`grid grid-cols-1 overflow-hidden rounded-[32px] bg-white shadow-[0_30px_80px_-40px_rgba(37,37,37,0.25)] ring-1 transition-all duration-700 ease-halus md:grid-cols-2 ${
          diseret ? "scale-[1.01] ring-ink" : "ring-ink/5"
        }`}
      >
        {/* ---------- Panel pratinjau ---------- */}
        <div className="relative flex items-center justify-center bg-[#f3e8e7] px-8 py-10 sm:py-14">
          <div
            className={`relative aspect-[4/5] w-full max-w-[230px] sm:max-w-[300px] overflow-hidden rounded-[999px_999px_28px_28px] transition-all duration-700 ease-halus ${
              foto
                ? "shadow-[0_24px_60px_-20px_rgba(37,37,37,0.45)]"
                : `border-[1.5px] border-dashed ${diseret ? "border-ink bg-white/70" : "border-ink/35 bg-white/50"}`
            }`}
          >
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
                <span className="text-[22px] leading-tight font-normal tracking-[-0.02em] text-ink">
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
                <span className="text-[11px] tracking-[0.12em] text-muted uppercase">JPG / PNG / WEBP · maks 5 MB</span>
              </label>
            )}
          </div>
        </div>

        {/* ---------- Panel aksi ---------- */}
        <div className="flex flex-col justify-center gap-7 p-7 sm:p-10 lg:p-14">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">Langkah 1 dari 3</span>
            <h2 className="mt-3 text-[clamp(30px,3.6vw,46px)] leading-[1.04] font-normal tracking-[-0.035em] text-ink">
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
            <p className="mt-3 leading-relaxed text-muted">
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            <PillButton onClick={onAnalisis} className="w-full">
              Periksa foto
            </PillButton>
          )}

          <div className="flex flex-col gap-3">
            <ul className="flex flex-wrap gap-2" aria-label="Tips foto">
              {TIPS.map((t) => (
                <li
                  key={t}
                  className="rounded-full bg-[#f6efe9] px-3 py-1.5 text-[11px] font-medium tracking-[0.02em] text-ink/80"
                >
                  {t}
                </li>
              ))}
            </ul>
            <p className="inline-flex items-center gap-2 text-xs text-muted">
              <IconShield size={14} />
              Fotomu hanya dipakai untuk pengecekan ini.
            </p>
            {MODE_DEMO && (
              <p className="text-xs text-muted">Mode demo: server belum terhubung, jadi hasilnya masih acak.</p>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
