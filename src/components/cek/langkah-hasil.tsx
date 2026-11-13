"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { IconBan, IconDrop, IconFocus, IconImage, IconInfo, IconRefresh, IconShieldPlus, IconSun } from "@/components/icons";
import { IconBulat, PillButton, PillLink, Tag } from "@/components/ui";
import { KELAS, URUTAN_KELAS, type KelasId } from "@/lib/kelas";
import { formatPersen, MODE_DEMO, type HasilPrediksi } from "@/lib/predict";
import type { Foto } from "./cek-kulit";

type Saran = { judul: string; isi: string; icon: ReactNode };

const SARAN_JERAWAT: Saran[] = [
  {
    judul: "Jangan dipencet",
    isi: "Memencet bisa memperparah peradangan dan meninggalkan bekas.",
    icon: <IconBan />,
  },
  {
    judul: "Bersihkan dengan lembut",
    isi: "Cuci wajah dua kali sehari dengan pembersih yang lembut.",
    icon: <IconDrop />,
  },
  {
    judul: "Periksakan bila perlu",
    isi: "Temui dokter kulit bila jerawat meluas, nyeri, atau tidak membaik.",
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
    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
      {daftar.map((s) => (
        <div key={s.judul} className="flex flex-col gap-2.5 rounded-[22px] bg-mist p-5.5">
          <IconBulat size="sm">{s.icon}</IconBulat>
          <strong className="text-[15px] font-semibold text-ink">{s.judul}</strong>
          <span className="text-sm leading-normal text-muted">{s.isi}</span>
        </div>
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
    <div className="flex flex-wrap items-start gap-10">
      <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-4">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[36px] bg-blush">
          <Image src={foto.url} alt="Foto kulit yang diunggah" fill unoptimized className="object-cover" />
          <span className="absolute top-5 left-5 inline-flex max-w-[80%] items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-ink">
            <IconImage size={14} />
            <span className="truncate">{foto.file.name}</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Lanczos3", "SURF + HOG", "SVM linear"].map((t) => (
            <span key={t} className="rounded-full bg-mist px-3.5 py-2 text-xs font-semibold">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-6">
        {berhasil && kelas ? (
          <>
            <section
              aria-labelledby="judul-hasil"
              className={`flex flex-col gap-3.5 rounded-[36px] p-[clamp(28px,4vw,44px)] ${kelas.warna}`}
            >
              <Tag>HASIL KLASIFIKASI</Tag>
              <p className="mt-2">Kemungkinan besar ini adalah</p>
              <h1
                id="judul-hasil"
                className="serif-em text-[clamp(64px,9vw,128px)] leading-[0.9] tracking-[-0.02em] text-ink"
              >
                {kelas.nama}
              </h1>
              <p className="mt-1.5 max-w-[460px] leading-relaxed">{kelas.ringkas}</p>
            </section>

            <section aria-labelledby="judul-keyakinan" className="flex flex-col gap-4.5 rounded-[28px] border border-line p-7">
              <h2 id="judul-keyakinan" className="text-lg font-semibold text-ink">
                Keyakinan model
              </h2>
              <div className="grid grid-cols-[110px_minmax(0,1fr)_48px] items-center gap-3.5">
                {peringkat.map((id, i) => {
                  const p = hasil.probabilitas[id];
                  const utama = i === 0;
                  return (
                    <div key={id} className="contents">
                      <span className={`text-sm ${utama ? "font-semibold text-ink" : ""}`}>{KELAS[id].nama}</span>
                      <div aria-hidden="true" className="h-2.5 overflow-hidden rounded-full bg-[#efefef]">
                        <div
                          className={`h-full rounded-full ${utama ? "bg-ink" : "bg-[#a8a8a8]"}`}
                          style={{ width: formatPersen(p) }}
                        />
                      </div>
                      <span className={`text-right text-sm ${utama ? "font-semibold text-ink" : ""}`}>{formatPersen(p)}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section aria-labelledby="judul-saran" className="flex flex-col gap-3.5">
              <h2 id="judul-saran" className="text-2xl font-semibold tracking-[-0.01em] text-ink">
                Yang bisa kamu <span className="serif-em">lakukan</span>
              </h2>
              <KartuSaran daftar={SARAN[hasil.label]} />
            </section>
          </>
        ) : (
          <>
            <section aria-labelledby="judul-hasil" className="flex flex-col gap-3.5 rounded-[36px] bg-oat p-[clamp(28px,4vw,44px)]">
              <Tag>HASIL KLASIFIKASI</Tag>
              <h1
                id="judul-hasil"
                className="serif-em mt-2 text-[clamp(56px,7vw,96px)] leading-[0.95] tracking-[-0.02em] text-ink"
              >
                Tidak terdeteksi
              </h1>
              <p className="max-w-[480px] leading-relaxed">
                Sistem tidak menemukan titik fitur yang cukup kuat di foto ini.
                Menurut alur jurnal acuan, kondisi ini dianggap kulit tanpa
                jerawat. Kalau kamu melihat jerawat di foto, coba foto ulang.
              </p>
            </section>
            <KartuSaran daftar={SARAN_FOTO_ULANG} />
          </>
        )}

        <div className="grid grid-cols-[24px_minmax(0,1fr)] gap-3 rounded-[20px] bg-blush px-5 py-4.5">
          <IconInfo size={22} className="text-ink" />
          <p className="text-sm leading-normal">
            Hasil ini bukan diagnosis medis. AcneLens hanya mengenali tiga kelas
            dan bisa keliru, terutama pada papula yang tampak mirip kulit normal.
            {MODE_DEMO && " Saat ini aplikasi berjalan dalam mode demo, jadi hasilnya masih acak."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <PillButton onClick={onUlang} icon={<IconRefresh />}>
            CEK FOTO LAIN
          </PillButton>
          <PillLink
            href="/tentang#jenis"
            varian="terang"
            className="border border-[#cfcfcf] shadow-none"
          >
            PELAJARI JENIS JERAWAT
          </PillLink>
        </div>
      </div>
    </div>
  );
}
