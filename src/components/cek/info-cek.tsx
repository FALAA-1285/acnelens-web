import Image from "next/image";
import Link from "next/link";
import { Baris, Reveal } from "@/components/motion/reveal";
import { Eyebrow, GarisLengkung } from "@/components/bagian";
import { PillLink } from "@/components/ui";
import { GAMBAR } from "@/lib/gambar";
import { KELAS, type KelasId } from "@/lib/kelas";

/* Bagian pendukung di bawah area unggah — hanya tampil di langkah 1. */

const TIPS = [
  {
    gambar: GAMBAR.cekTips.dekat,
    judul: "Foto dari dekat",
    isi: "Arahkan kamera ke area yang berjerawat sampai memenuhi sebagian besar foto.",
  },
  {
    gambar: GAMBAR.cekTips.cahaya,
    judul: "Cari cahaya alami",
    isi: "Berdiri dekat jendela supaya cahayanya merata. Matikan flash agar kulit tidak mengilap.",
  },
  {
    gambar: GAMBAR.cekTips.bersih,
    judul: "Wajah bersih, tanpa filter",
    isi: "Bersihkan riasan dan jangan pakai filter atau mode kecantikan. Pastikan fotonya tidak buram.",
  },
];

const ALUR = [
  {
    judul: "Kamu mengunggah foto",
    isi: "Format JPG, PNG, atau WebP, maksimal 5 MB. Foto dipakai hanya untuk pengecekan ini.",
  },
  {
    judul: "Sistem membaca kulitnya",
    isi: "Foto diubah ke hitam-putih, lalu titik penting (SURF) dan teksturnya (HOG) dibaca.",
  },
  {
    judul: "Hasil dan saran muncul",
    isi: "SVM menentukan kelasnya, lengkap dengan persentase keyakinan dan saran perawatan dasar.",
  },
];

const KELAS_TAMPIL: KelasId[] = ["papula", "pustula", "non_acne"];

export function TipsFoto() {
  return (
    <section id="tips" className="scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="relative">
            <Reveal varian="fade">
              <Eyebrow>Sebelum memotret</Eyebrow>
            </Reveal>
            <Reveal
              as="h2"
              varian="lines"
              className="mt-4 text-[clamp(38px,5.6vw,76px)] leading-[1.02] font-normal tracking-[-0.035em] text-ink"
            >
              <Baris>Foto yang baik,</Baris>
              <Baris>
                hasil yang <span className="serif-em garis-gambar">tepat</span>
              </Baris>
            </Reveal>
          </div>
          <Reveal delay={150} className="max-w-[380px]">
            <p className="text-sm leading-relaxed text-muted">
              Model membaca tekstur dan tepi jerawat. Foto yang buram atau gelap membuat bagian itu
              sulit terbaca, jadi tiga hal ini paling berpengaruh.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-3">
          {TIPS.map((t, i) => (
            <Reveal key={t.judul} delay={i * 120} className={i === 1 ? "md:mt-16" : ""}>
              <div className="group relative aspect-[4/5] overflow-hidden rounded-[20px] bg-mist">
                <Image
                  src={t.gambar}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[1.2s] ease-halus group-hover:scale-105"
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="serif-em text-[30px] leading-none text-ink">{t.judul}</h3>
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{t.isi}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AlurSingkat() {
  return (
    <section className="relative overflow-hidden bg-[#f3e8e7] py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: `url('${GAMBAR.tekstur}')`, backgroundSize: "cover" }}
      />
      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-6">
        <div className="text-center">
          <Reveal varian="fade">
            <Eyebrow>Di balik layar</Eyebrow>
          </Reveal>
          <Reveal
            as="h2"
            varian="lines"
            className="mt-4 text-[clamp(40px,6.4vw,96px)] leading-[0.95] font-normal tracking-[-0.035em] text-ink"
          >
            <Baris>
              <span className="uppercase">Yang terjadi pada</span>
            </Baris>
            <Baris>
              <span className="serif-em">fotomu</span>
            </Baris>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
          {ALUR.map((a, i) => (
            <Reveal key={a.judul} delay={i * 120} className="border-t border-ink/20 pt-6">
              <span className="serif-em text-[56px] leading-none text-ink/30">{i + 1}</span>
              <h3 className="mt-4 text-2xl font-medium tracking-[-0.02em] text-ink">{a.judul}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{a.isi}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-14 flex justify-center">
          <PillLink href="/tentang#alur" varian="garis">
            Lihat metodenya
          </PillLink>
        </Reveal>
      </div>
    </section>
  );
}

export function KelasSingkat() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-center">
          <div className="relative lg:col-span-5">
            <Reveal
              as="h2"
              varian="lines"
              className="text-[clamp(38px,5vw,68px)] leading-[1.02] font-normal tracking-[-0.035em] text-ink"
            >
              <Baris>Tiga kondisi</Baris>
              <Baris>
                yang <span className="serif-em">dikenali</span>
              </Baris>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-6 max-w-[420px] leading-relaxed text-muted">
                AcneLens hanya membedakan tiga kondisi ini. Jerawat jenis lain, seperti komedo atau
                nodul, belum bisa dikenali.
              </p>
            </Reveal>
            <GarisLengkung className="pointer-events-none absolute -right-2 -bottom-24 hidden w-28 text-ink/50 lg:block" />
          </div>

          <div className="grid grid-cols-3 gap-3 lg:col-span-7">
            {KELAS_TAMPIL.map((id, i) => {
              const k = KELAS[id];
              return (
                <Reveal key={id} delay={i * 120}>
                  <Link href="/tentang#jenis" className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[999px_999px_20px_20px] bg-mist">
                      <Image
                        src={GAMBAR.kelas[id][0]}
                        alt={`Contoh ${k.nama.toLowerCase()}`}
                        fill
                        sizes="(max-width: 640px) 33vw, 20vw"
                        className="object-cover transition-transform duration-[1.2s] ease-halus group-hover:scale-105"
                      />
                    </div>
                    <h3 className="serif-em mt-4 text-[20px] leading-none text-ink sm:text-[26px]">{k.nama}</h3>
                    <p className="mt-2 hidden text-sm leading-relaxed text-muted sm:block">{k.ringkas}</p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
