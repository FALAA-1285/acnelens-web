"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { IconArrowRight, IconCheck } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { TAHAP_METODE } from "@/lib/penelitian";
import type { Foto } from "./cek-kulit";

// sumber yang sama dengan halaman Tentang (#alur)
const TAHAP = TAHAP_METODE;

// Backend hanya mengirim hasil akhir, jadi tahap di layar dimajukan dengan timer
// dan berhenti di tahap terakhir sampai respons datang.
const JEDA_TAHAP = 480;

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
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
      {/* Foto dengan garis pindai */}
      <Reveal varian="scale" className="lg:col-span-6">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-[200px_200px_28px_28px] bg-blush">
          <Image src={foto.url} alt="Foto yang sedang diperiksa" fill unoptimized className="object-cover" />
          <div className="absolute inset-0 bg-black/10" />
          {!selesai && (
            <div
              aria-hidden="true"
              className="absolute inset-x-0 h-[2px] bg-white/90 shadow-[0_0_28px_10px_rgba(255,255,255,0.35)] motion-safe:animate-pindai"
              style={{ top: "50%" }}
            />
          )}
          <span className="absolute bottom-5 left-1/2 inline-flex max-w-[80%] -translate-x-1/2 items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-ink backdrop-blur">
            <span className={`size-2 shrink-0 rounded-full ${selesai ? "bg-emerald-500" : "bg-ink motion-safe:animate-pulse"}`} />
            <span className="truncate">{selesai ? "Selesai diperiksa" : "Sedang diperiksa…"}</span>
          </span>
        </div>
      </Reveal>

      <div className="flex min-w-0 flex-col gap-8 lg:col-span-6">
        <Reveal>
          <span className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">Langkah 2</span>
          <h2 className="mt-3 text-[clamp(32px,4vw,52px)] leading-[1.04] font-normal tracking-[-0.035em] text-ink">
            {selesai ? (
              <>
                Pemeriksaan <span className="serif-em">selesai</span>
              </>
            ) : (
              <>
                Fotomu sedang <span className="serif-em">diperiksa</span>
              </>
            )}
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            Ada {TAHAP.length} tahap yang dijalankan sebelum jenis jerawatnya ditentukan. Urutan di
            bawah adalah gambaran prosesnya, bukan laporan langsung dari server.
          </p>
        </Reveal>

        {/* Progres: garis tipis seperti slider di beranda */}
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
              Tahap {Math.min(aktif + 1, TAHAP.length)} dari {TAHAP.length}
            </span>
            <span className="font-mono text-sm text-ink">{persen}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Kemajuan pemeriksaan"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={persen}
            className="relative h-px bg-ink/15"
          >
            <div
              className="absolute inset-y-[-1px] left-0 bg-ink transition-[width] duration-700 ease-halus"
              style={{ width: `${persen}%` }}
            />
          </div>
        </div>

        <ol className="flex flex-col border-t border-ink/10" aria-live="polite">
          {TAHAP.map((t, i) => {
            const status = i < aktif ? "selesai" : i === aktif ? "berjalan" : "menunggu";
            return (
              <li
                key={t.judul}
                className={`grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-4 border-b border-ink/10 py-3.5 transition-opacity duration-500 ${
                  status === "menunggu" ? "opacity-45" : "opacity-100"
                }`}
              >
                <span
                  className={`inline-flex size-9 items-center justify-center rounded-full transition-all duration-500 ease-halus ${
                    status === "selesai"
                      ? "bg-ink text-white"
                      : status === "berjalan"
                        ? "border border-ink bg-white"
                        : "border border-ink/25 font-mono text-xs text-muted"
                  }`}
                >
                  {status === "selesai" && <IconCheck size={15} />}
                  {status === "berjalan" && <span className="size-2 rounded-full bg-ink motion-safe:animate-pulse" />}
                  {status === "menunggu" && `0${i + 1}`}
                </span>

                <div className="min-w-0">
                  <strong className="block font-medium text-ink">{t.judul}</strong>
                  <span className="text-xs text-muted">{t.teknis}</span>
                </div>

                {status === "berjalan" ? (
                  <span className="rounded-full bg-[#f6efe9] px-3 py-1 text-[11px] font-semibold tracking-[0.06em] text-ink uppercase">
                    Berjalan
                  </span>
                ) : (
                  <span className="text-[11px] tracking-[0.06em] text-muted uppercase">
                    {status === "selesai" ? "Selesai" : "Menunggu"}
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        {!selesai && (
          <button
            type="button"
            onClick={onBatal}
            className="link-garis cursor-pointer self-start pb-0.5 text-xs font-semibold tracking-[0.1em] text-ink uppercase"
          >
            Batalkan
          </button>
        )}
        {selesai && (
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-ink uppercase">
            Membuka hasil
            <IconArrowRight size={14} />
          </p>
        )}
      </div>
    </div>
  );
}
