"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ChangeEvent, type DragEvent } from "react";
import {
  IconArrowLeft,
  IconBan,
  IconCamera,
  IconCheck,
  IconClose,
  IconEye,
  IconFocus,
  IconImage,
  IconInfo,
  IconShield,
  IconSun,
  IconUpload,
} from "@/components/icons";
import { KulitIlustrasi } from "@/components/skin-art";
import { IconBulat, PillButton } from "@/components/ui";
import { cekFile, MODE_DEMO } from "@/lib/predict";
import type { Foto } from "./cek-kulit";

const PANDUAN = [
  {
    judul: "Foto close-up",
    isi: "Dekatkan kamera ke area berjerawat. Foto wajah utuh membuat hasil kurang akurat.",
    icon: <IconFocus />,
  },
  {
    judul: "Cahaya merata",
    isi: "Pakai cahaya alami dan hindari flash yang membuat kulit mengilap.",
    icon: <IconSun />,
  },
  {
    judul: "Tanpa filter",
    isi: "Jangan pakai filter, efek beauty, atau riasan di area yang difoto.",
    icon: <IconBan />,
  },
  {
    judul: "Gambar tajam",
    isi: "Pastikan foto tidak buram dan jerawat terlihat jelas.",
    icon: <IconEye />,
  },
];

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
    setDiseret(false);
    terima(e.dataTransfer.files?.[0]);
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <Link href="/" className="inline-flex items-center gap-2 self-start text-sm text-muted hover:text-ink">
          <IconArrowLeft size={16} />
          Kembali ke beranda
        </Link>
        <h1 className="text-[clamp(40px,5vw,68px)] leading-[1.02] font-semibold tracking-[-0.035em] text-ink">
          Unggah foto <span className="serif-em">kulitmu</span>
        </h1>
        <p className="max-w-[520px] text-[17px] leading-relaxed text-muted">
          Satu foto close-up area yang ingin dicek sudah cukup. Ikuti panduan di
          samping supaya hasilnya lebih tepat.
        </p>
      </div>

      <div className="flex flex-wrap items-start gap-8">
        <div className="flex min-w-0 flex-[1_1_560px] flex-col gap-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDiseret(true);
            }}
            onDragLeave={() => setDiseret(false)}
            onDrop={saatDrop}
            className={`relative flex flex-col items-center gap-4 rounded-[32px] border-[1.5px] border-dashed px-8 py-[72px] text-center transition-colors ${
              diseret ? "border-ink bg-blush" : "border-[#b9aea2] bg-[#faf6f2]"
            }`}
          >
            <span className="inline-flex size-[76px] items-center justify-center rounded-full bg-white text-ink shadow-[0_10px_30px_rgba(37,37,37,0.06)]">
              <IconUpload size={28} />
            </span>
            <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.02em] text-ink">
              {diseret ? "Lepaskan foto di sini" : "Seret foto ke sini"}
            </h2>
            <p className="text-[15px] text-muted">atau pilih dari perangkatmu</p>

            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <label
                htmlFor="pilih-foto"
                className="inline-flex min-h-12 cursor-pointer items-center gap-2.5 rounded-full bg-ink px-6 text-sm font-semibold text-white has-focus-visible:outline-2"
              >
                <IconImage />
                Pilih foto
              </label>
              <input
                id="pilih-foto"
                type="file"
                accept="image/png, image/jpeg"
                className="sr-only"
                onChange={saatPilih}
              />

              <label
                htmlFor="ambil-foto"
                className="inline-flex min-h-12 cursor-pointer items-center gap-2.5 rounded-full border border-[#cfc6bc] bg-white px-6 text-sm font-semibold text-ink"
              >
                <IconCamera />
                Gunakan kamera
              </label>
              <input
                id="ambil-foto"
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={saatPilih}
              />
            </div>
            <p className="mt-1 text-xs tracking-[0.06em] text-muted">JPG ATAU PNG · MAKSIMAL 5 MB</p>
          </div>

          {galat && (
            <p role="alert" className="flex items-center gap-2 rounded-2xl bg-rose px-4 py-3 text-sm text-ink">
              <IconInfo />
              {galat}
            </p>
          )}

          {foto && (
            <div className="flex items-center gap-4 rounded-[22px] border border-line bg-white p-3">
              <span className="relative size-[60px] shrink-0 overflow-hidden rounded-2xl">
                <Image src={foto.url} alt="Pratinjau foto yang dipilih" fill unoptimized className="object-cover" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <strong className="truncate text-[15px] font-semibold text-ink">{foto.file.name}</strong>
                <span className="inline-flex items-center gap-1.5 text-[13px] text-muted">
                  <IconCheck size={14} />
                  {ukuranFile(foto.file.size)} · siap dianalisis
                </span>
              </div>
              <button
                type="button"
                onClick={onHapus}
                aria-label="Hapus foto"
                className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-mist text-body hover:bg-[#e9e9e9]"
              >
                <IconClose size={16} />
              </button>
            </div>
          )}

          <PillButton onClick={onAnalisis} disabled={!foto} className="w-full min-h-16">
            ANALISIS FOTO
          </PillButton>

          <p className="inline-flex items-center gap-2 text-[13px] text-muted">
            <IconShield size={16} />
            Foto hanya dipakai untuk analisis ini.
          </p>
          {MODE_DEMO && (
            <p className="text-[13px] text-muted">
              Mode demo: backend belum terhubung, jadi hasil yang muncul masih acak.
            </p>
          )}
        </div>

        <aside className="flex min-w-0 flex-[1_1_380px] flex-col gap-2 rounded-[32px] bg-mist p-9">
          <h2 className="mb-3 text-[30px] font-semibold tracking-[-0.02em] text-ink">
            Supaya hasilnya <span className="serif-em">tepat</span>
          </h2>

          <div className="divide-y divide-[#e0e0e0]">
            {PANDUAN.map((p) => (
              <div key={p.judul} className="grid grid-cols-[44px_minmax(0,1fr)] gap-4 py-4">
                <IconBulat size="sm" className="size-11 bg-white">
                  {p.icon}
                </IconBulat>
                <div>
                  <h3 className="mb-1 font-semibold text-ink">{p.judul}</h3>
                  <p className="text-sm leading-normal text-muted">{p.isi}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <figure className="flex flex-col gap-2.5">
              <div className="aspect-square overflow-hidden rounded-[20px]">
                <KulitIlustrasi />
              </div>
              <figcaption className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                <IconCheck size={14} />
                Sesuai: close-up
              </figcaption>
            </figure>
            <figure className="flex flex-col gap-2.5">
              <div className="aspect-square overflow-hidden rounded-[20px]">
                <svg viewBox="0 0 160 160" className="block size-full" aria-hidden="true">
                  <rect width="160" height="160" fill="#e8e1d8" />
                  <ellipse cx="80" cy="78" rx="34" ry="44" fill="#ead7c6" />
                  <path d="M46 70c4-30 64-30 68 0" fill="none" stroke="#c9b6a3" strokeWidth="3" />
                  <circle cx="68" cy="74" r="2.5" fill="#8c7a69" />
                  <circle cx="92" cy="74" r="2.5" fill="#8c7a69" />
                  <path d="M72 100c5 4 11 4 16 0" fill="none" stroke="#b88e86" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M40 160c4-20 20-30 40-30s36 10 40 30" fill="#e2d2c2" />
                </svg>
              </div>
              <figcaption className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                <IconClose size={14} />
                Kurang sesuai: wajah utuh
              </figcaption>
            </figure>
          </div>
        </aside>
      </div>
    </div>
  );
}
