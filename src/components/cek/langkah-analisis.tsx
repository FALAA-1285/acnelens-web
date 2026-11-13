"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { IconArrowRight, IconCheck } from "@/components/icons";
import type { Foto } from "./cek-kulit";

const TAHAP = [
  { judul: "Grayscale", isi: "Foto diubah ke skala abu-abu" },
  { judul: "Resize", isi: "256 × 300 piksel, interpolasi Lanczos3" },
  { judul: "Fitur SURF", isi: "Keypoint dengan det(H) ≥ 1000, lalu ROI ditentukan" },
  { judul: "Fitur HOG", isi: "ROI 64 × 64, cell 8 × 8, 9 bin orientasi" },
  { judul: "Gabung dan normalisasi", isi: "Fitur SURF dan HOG disatukan menjadi satu vektor" },
  { judul: "Klasifikasi SVM", isi: "Kernel linear menentukan papula, pustula, atau kulit normal" },
];

// Backend hanya mengirim hasil akhir, jadi tahap di layar dimajukan dengan timer
// dan berhenti di tahap terakhir sampai respons datang.
const JEDA_TAHAP = 650;

type Props = { foto: Foto; selesai: boolean; onBatal: () => void };

export function LangkahAnalisis({ foto, selesai, onBatal }: Props) {
  const [jalan, setJalan] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setJalan((n) => Math.min(n + 1, TAHAP.length - 1));
    }, JEDA_TAHAP);
    return () => clearInterval(id);
  }, []);

  const aktif = selesai ? TAHAP.length : jalan;
  const persen = Math.round((aktif / TAHAP.length) * 100);

  return (
    <div className="flex flex-wrap items-center gap-14">
      <div className="min-w-0 flex-[1_1_440px]">
        <div className="relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden rounded-[36px] bg-blush">
          <Image src={foto.url} alt="Foto yang sedang dianalisis" fill unoptimized className="object-cover" />
          {!selesai && (
            <div
              aria-hidden="true"
              className="absolute inset-x-0 h-[3px] bg-white/90 shadow-[0_0_24px_8px_rgba(255,255,255,0.35)] motion-safe:animate-pindai"
              style={{ top: "50%" }}
            />
          )}
          <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-ink">
            <span className="size-2 rounded-full bg-ink" />
            {foto.file.name}
          </span>
        </div>
      </div>

      <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-7">
        <div className="flex flex-col gap-3.5">
          <h1 className="text-[clamp(40px,5vw,64px)] leading-[1.02] font-semibold tracking-[-0.035em] text-ink">
            {selesai ? (
              <>
                Analisis <span className="serif-em">selesai</span>
              </>
            ) : (
              <>
                Sedang <span className="serif-em">membaca</span> kulitmu
              </>
            )}
          </h1>
          <p className="leading-relaxed text-muted">
            Fotomu melewati enam tahap pengolahan sebelum diklasifikasikan.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between text-[13px] font-semibold">
            <span>
              Tahap {Math.min(aktif + 1, TAHAP.length)} dari {TAHAP.length}
            </span>
            <span>{persen}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Kemajuan analisis"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={persen}
            className="h-2 overflow-hidden rounded-full bg-[#efefef]"
          >
            <div className="h-full rounded-full bg-ink transition-[width] duration-500" style={{ width: `${persen}%` }} />
          </div>
        </div>

        <ol className="flex flex-col divide-y divide-[#ededed]" aria-live="polite">
          {TAHAP.map((t, i) => {
            const status = i < aktif ? "selesai" : i === aktif ? "berjalan" : "menunggu";
            return (
              <li key={t.judul} className="grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-4 py-3.5">
                {status === "selesai" && (
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-ink text-white">
                    <IconCheck size={16} />
                  </span>
                )}
                {status === "berjalan" && (
                  <span className="inline-flex size-9 items-center justify-center rounded-full border-2 border-ink">
                    <span className="size-2.5 rounded-full bg-ink motion-safe:animate-pulse" />
                  </span>
                )}
                {status === "menunggu" && (
                  <span className="inline-flex size-9 items-center justify-center rounded-full border-[1.5px] border-[#bdbdbd] text-[13px] font-semibold text-muted">
                    {i + 1}
                  </span>
                )}

                <div>
                  <strong className={`block font-semibold ${status === "menunggu" ? "text-muted" : "text-ink"}`}>
                    {t.judul}
                  </strong>
                  <span className="text-sm text-muted">{t.isi}</span>
                </div>

                {status === "berjalan" ? (
                  <span className="rounded-full bg-rose px-3 py-1.5 text-xs font-semibold text-ink">Berjalan</span>
                ) : (
                  <span className="text-xs text-muted">{status === "selesai" ? "Selesai" : "Menunggu"}</span>
                )}
              </li>
            );
          })}
        </ol>

        {!selesai && (
          <button
            type="button"
            onClick={onBatal}
            className="inline-flex cursor-pointer items-center gap-2 self-start text-sm font-medium underline underline-offset-4"
          >
            Batalkan
          </button>
        )}
        {selesai && (
          <p className="inline-flex items-center gap-2 text-sm font-medium text-ink">
            Membuka hasil
            <IconArrowRight size={16} />
          </p>
        )}
      </div>
    </div>
  );
}
