"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { IconBan, IconDrop, IconFocus, IconInfo, IconRefresh, IconShieldPlus, IconSun } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { IconBulat, PillButton, PillLink } from "@/components/ui";
import { KELAS, URUTAN_KELAS, type KelasId } from "@/lib/kelas";
import { formatPersen, MODE_DEMO, type HasilPrediksi } from "@/lib/predict";
import type { Foto } from "./cek-kulit";

type Saran = { judul: string; isi: string; icon: ReactNode };

const SARAN_JERAWAT: Saran[] = [
  {
    judul: "Jangan dipencet",
    isi: "Memencet jerawat bisa memperparah peradangan dan meninggalkan bekas.",
    icon: <IconBan />,
  },
  {
    judul: "Bersihkan dengan lembut",
    isi: "Cuci wajah dua kali sehari dengan pembersih yang lembut.",
    icon: <IconDrop />,
  },
  {
    judul: "Periksakan bila perlu",
    isi: "Temui dokter kulit kalau jerawat makin banyak, terasa sakit, atau tidak membaik.",
    icon: <IconShieldPlus />,
  },
];

const SARAN: Record<KelasId, Saran[]> = {
  papula: SARAN_JERAWAT,
  pustula: SARAN_JERAWAT,
  non_acne: [
    {
      judul: "Rawat seperti biasa",
      isi: "Tetap bersihkan wajah dengan lembut dan pakai pelembap.",
      icon: <IconDrop />,
    },
    {
      judul: "Cek area lain",
      isi: "Kalau ada bagian lain yang berjerawat, foto dan cek area itu juga.",
      icon: <IconFocus />,
    },
  ],
};

const SARAN_FOTO_ULANG: Saran[] = [
  {
    judul: "Foto lebih dekat",
    isi: "Pastikan jerawat memenuhi sebagian besar foto.",
    icon: <IconFocus />,
  },
  {
    judul: "Perbaiki cahaya",
    isi: "Cari cahaya alami yang merata dan matikan flash.",
    icon: <IconSun />,
  },
];

function KartuSaran({ daftar }: { daftar: Saran[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3">
      {daftar.map((s, i) => (
        <Reveal
          key={s.judul}
          delay={i * 90}
          className="group flex flex-col gap-3 rounded-[24px] bg-[#faf7f4] p-6 transition-transform duration-700 ease-halus hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <IconBulat size="sm" className="bg-white transition-transform duration-700 ease-halus group-hover:rotate-6">
              {s.icon}
            </IconBulat>
            <span className="font-mono text-xs text-muted">0{i + 1}</span>
          </div>
          <strong className="serif-em mt-1 text-[22px] leading-tight font-normal text-ink">{s.judul}</strong>
          <span className="text-sm leading-normal text-muted">{s.isi}</span>
        </Reveal>
      ))}
    </div>
  );
}

type Props = { foto: Foto; hasil: HasilPrediksi; onUlang: () => void };

export function LangkahHasil({ foto, hasil, onUlang }: Props) {
  const berhasil = hasil.status === "berhasil";
  const kelas = berhasil ? KELAS[hasil.label] : null;

  // urutkan kelas dari probabilitas terbesar
  const peringkat = berhasil
    ? [...URUTAN_KELAS].sort((a, b) => hasil.probabilitas[b] - hasil.probabilitas[a])
    : [];

  return (
    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
      {/* Foto yang diunggah — menempel saat menggulir di layar lebar */}
      <div className="lg:sticky lg:top-24 lg:col-span-5">
        <Reveal varian="scale">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[200px_200px_28px_28px] bg-blush">
            <Image src={foto.url} alt="Foto kulit yang diunggah" fill unoptimized className="object-cover" />
          </div>
        </Reveal>
        <p className="mt-4 truncate text-center text-xs text-muted">{foto.file.name}</p>
      </div>

      <div className="flex min-w-0 flex-col gap-6 lg:col-span-7">
        {berhasil && kelas ? (
          <>
            <Reveal
              as="section"
              aria-labelledby="judul-hasil"
              className={`relative overflow-hidden rounded-[28px] p-[clamp(28px,4vw,48px)] ${kelas.warna}`}
            >
              <span className="text-[11px] font-semibold tracking-[0.16em] text-ink/70 uppercase">
                Langkah 3 · Hasil
              </span>
              <p className="mt-5 text-ink/80">Kemungkinan besar ini adalah</p>
              <h2
                id="judul-hasil"
                className="serif-em mt-1 text-[clamp(60px,9vw,120px)] leading-[0.92] tracking-[-0.02em] text-ink"
              >
                {kelas.nama}
              </h2>
              <p className="mt-4 max-w-[460px] leading-relaxed text-ink/85">{kelas.ringkas}</p>
            </Reveal>

            <Reveal
              as="section"
              delay={120}
              aria-labelledby="judul-keyakinan"
              className="rounded-[28px] bg-[#faf7f4] p-7 sm:p-8"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 id="judul-keyakinan" className="text-xl font-normal tracking-[-0.02em] text-ink">
                  Seberapa <span className="serif-em">yakin</span> sistemnya?
                </h3>
              </div>
              <div className="mt-6 flex flex-col gap-5">
                {peringkat.map((id, i) => {
                  const p = hasil.probabilitas[id];
                  const utama = i === 0;
                  return (
                    <div key={id}>
                      <div className="flex items-baseline justify-between text-sm">
                        <span className={utama ? "font-medium text-ink" : "text-muted"}>{KELAS[id].nama}</span>
                        <span className={`font-mono ${utama ? "text-ink" : "text-muted"}`}>{formatPersen(p)}</span>
                      </div>
                      <div aria-hidden="true" className="relative mt-2 h-px bg-ink/15">
                        <div
                          className={`absolute inset-y-[-1px] left-0 transition-[width] duration-1000 ease-halus ${
                            utama ? "bg-ink" : "bg-ink/35"
                          }`}
                          style={{ width: formatPersen(p) }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>

            <section aria-labelledby="judul-saran" className="mt-4 flex flex-col gap-4">
              <h3 id="judul-saran" className="text-[clamp(26px,3vw,34px)] font-normal tracking-[-0.03em] text-ink">
                Yang bisa kamu <span className="serif-em">lakukan</span>
              </h3>
              <KartuSaran daftar={SARAN[hasil.label]} />
            </section>
          </>
        ) : (
          <>
            <Reveal
              as="section"
              aria-labelledby="judul-hasil"
              className="rounded-[28px] bg-oat p-[clamp(28px,4vw,48px)]"
            >
              <span className="text-[11px] font-semibold tracking-[0.16em] text-ink/70 uppercase">
                Langkah 3 · Hasil
              </span>
              <h2
                id="judul-hasil"
                className="serif-em mt-5 text-[clamp(52px,7vw,92px)] leading-[0.95] tracking-[-0.02em] text-ink"
              >
                Tidak terdeteksi
              </h2>
              <p className="mt-4 max-w-[480px] leading-relaxed">
                Sistem tidak menemukan bagian kulit yang cukup jelas untuk dibaca di foto ini. Menurut
                jurnal acuan, kondisi seperti ini dianggap kulit tanpa jerawat. Kalau kamu melihat
                jerawat di fotonya, coba foto ulang dari jarak yang lebih dekat.
              </p>
            </Reveal>
            <KartuSaran daftar={SARAN_FOTO_ULANG} />
          </>
        )}

        <div className="grid grid-cols-[24px_minmax(0,1fr)] gap-3 rounded-[20px] border border-ink/10 px-5 py-4.5">
          <IconInfo size={22} className="text-ink" />
          <p className="text-sm leading-normal text-muted">
            Hasil ini bukan diagnosis dokter. AcneLens hanya mengenali tiga kondisi dan bisa keliru,
            terutama pada papula yang kadang terlihat mirip kulit normal.
            {MODE_DEMO && " Saat ini aplikasi berjalan dalam mode demo, jadi hasilnya masih acak."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <PillButton onClick={onUlang} icon={<IconRefresh />}>
            Cek foto lain
          </PillButton>
          <PillLink href="/tentang#jenis" varian="terang">
            Pelajari jenis jerawat
          </PillLink>
        </div>
      </div>
    </div>
  );
}
