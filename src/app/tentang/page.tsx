import type { Metadata } from "next";
import Image from "next/image";
import { Halaman } from "@/components/motion/halaman";
import { SiteHeader } from "@/components/site-header";
import { FooterSitus } from "@/components/footer-situs";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Baris, Reveal } from "@/components/motion/reveal";
import { Eyebrow, GambarParallax, GarisLengkung, TombolTurun } from "@/components/bagian";
import { PillLink } from "@/components/ui";
import { SectionAjakan } from "@/components/beranda/section-ajakan";
import { GAMBAR } from "@/lib/gambar";
import { KELAS, type KelasId } from "@/lib/kelas";
import {
  AKURASI,
  CELLSIZE,
  DATASET,
  JURNAL_ACUAN,
  KESALAHAN_UJI,
  PARAMETER,
  SIMILARITY,
  TERBAIK,
  persen,
} from "@/lib/penelitian";

export const metadata: Metadata = {
  title: "Tentang",
  description:
    "Latar belakang, metode, dataset, dan hasil penelitian SURF + HOG + SVM yang menjadi dasar AcneLens.",
};

/* ------------------------------------------------------------------ */
/* Data halaman                                                        */
/* ------------------------------------------------------------------ */

const CELAH = [
  {
    judul: "GLCM + SVM",
    isi: "Menekankan tekstur statistik, tetapi belum memakai gabungan keypoint lokal dan orientasi gradien untuk membedakan papula, pustula, dan kulit normal.",
  },
  {
    judul: "CNN",
    isi: "Kuat untuk klasifikasi citra, tetapi butuh data besar, komputasi tinggi, dan fiturnya sulit ditafsirkan.",
  },
  {
    judul: "SURF atau HOG saja",
    isi: "Masing-masing hanya menangkap satu sisi: SURF unggul pada lokasi struktur lesi, HOG unggul pada pola tekstur tepi.",
  },
];

const ALUR = [
  {
    judul: "Ubah ke grayscale",
    isi: "Foto RGB diubah ke skala abu-abu supaya komputasi lebih ringan dan fokus pada intensitas piksel.",
  },
  {
    judul: "Seragamkan ukuran",
    isi: "Citra diubah ke 256 × 300 piksel. Tiga cara interpolasi diuji: bicubic, bilinear, dan Lanczos3.",
  },
  {
    judul: "Cari titik penting (SURF)",
    isi: "Citra integral dan determinan Hessian dipakai untuk mencari keypoint. Hanya keypoint dengan det(H) ≥ 1000 yang dipakai.",
  },
  {
    judul: "Bentuk area fokus",
    isi: "Keypoint terkuat menjadi pusat region of interest (ROI). Respons Haar wavelet pada 4 × 4 subregion menghasilkan 64 fitur SURF.",
  },
  {
    judul: "Baca tekstur (HOG)",
    isi: "ROI dinormalisasi ke 64 × 64 piksel. Arah gradien dikelompokkan ke 9 bin, dengan cell 8 × 8 dan blok 2 × 2.",
  },
  {
    judul: "Gabungkan fitur",
    isi: "Fitur SURF dan HOG disatukan menjadi satu vektor, lalu dinormalisasi.",
  },
  {
    judul: "Klasifikasi SVM",
    isi: "SVM kernel linear menentukan kelasnya: kulit normal, papula, atau pustula. Model divalidasi dengan cross-validation.",
  },
];

const KETERBATASAN = [
  {
    judul: "Hanya tiga kelas",
    isi: "Komedo, nodul, dan kista tidak dikenali. Foto dengan jenis jerawat lain bisa salah ditebak.",
  },
  {
    judul: "Papula paling sulit",
    isi: "Warna dan tonjolan papula bisa samar, sehingga kadang dianggap kulit normal.",
  },
  {
    judul: "Peka terhadap cahaya",
    isi: "Pencahayaan yang tidak merata atau foto yang buram dapat menurunkan ketepatan hasil.",
  },
  {
    judul: "Bukan diagnosis",
    isi: "AcneLens membantu skrining awal. Keputusan perawatan tetap sebaiknya bersama dokter kulit.",
  },
];

const RENCANA = [
  "Menambah jumlah dan variasi dataset",
  "Mengendalikan variasi pencahayaan foto",
  "Mencoba kombinasi fitur lain atau deep learning ringan",
];

const TIM = [
  {
    nama: "Ahmad Falahi",
    inisial: "AF",
    warna: "bg-rose",
    tugas: "Dataset, rancangan dan pengembangan aplikasi, integrasi model",
  },
  {
    nama: "Amin Aziz Sudjud",
    inisial: "AA",
    warna: "bg-sand",
    tugas: "Persiapan data, fitur SURF, penggabungan fitur, pelatihan SVM",
  },
  {
    nama: "Muhammad Faiq Nabil Saputra",
    inisial: "MF",
    warna: "bg-sage",
    tugas: "Preprocessing, fitur HOG, evaluasi dan penyimpanan model",
  },
];

// urutan sesuai label di dataset: 0 normal, 1 papula, 2 pustula
const URUTAN_LABEL: KelasId[] = ["non_acne", "papula", "pustula"];

/* ------------------------------------------------------------------ */
/* Komponen kecil                                                      */
/* ------------------------------------------------------------------ */

function Angka({ nilai, ket, besar = false }: { nilai: string; ket: string; besar?: boolean }) {
  return (
    <div>
      <strong
        className={`block font-normal tracking-[-0.03em] text-ink ${
          besar ? "text-[clamp(44px,5vw,72px)] leading-none" : "text-[clamp(30px,3vw,40px)] leading-tight"
        }`}
      >
        {nilai}
      </strong>
      <span className="mt-2 block text-sm leading-snug text-muted">{ket}</span>
    </div>
  );
}

/** 300 titik = 300 citra uji. Titik berwarna = salah klasifikasi. */
function TitikUji() {
  const { total, papulaJadiNormal, papulaJadiPustula } = KESALAHAN_UJI;
  const benar = total - papulaJadiNormal - papulaJadiPustula;
  const titik = [
    ...Array.from({ length: benar }, () => "bg-ink/15"),
    ...Array.from({ length: papulaJadiNormal }, () => "bg-[#d98f96]"),
    ...Array.from({ length: papulaJadiPustula }, () => "bg-[#b8925f]"),
  ];
  return (
    <div>
      <div
        className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1.5 sm:grid-cols-[repeat(30,minmax(0,1fr))]"
        role="img"
        aria-label={`${benar} dari ${total} citra uji benar, ${papulaJadiNormal} papula terbaca kulit normal, ${papulaJadiPustula} papula terbaca pustula`}
      >
        {titik.map((warna, i) => (
          <span key={i} className={`aspect-square rounded-full ${warna}`} />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-ink/15" /> {benar} benar
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#d98f96]" /> {papulaJadiNormal} papula → kulit normal
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#b8925f]" /> {papulaJadiPustula} papula → pustula
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Halaman                                                             */
/* ------------------------------------------------------------------ */

export default function Tentang() {
  return (
    <Halaman>
      <SmoothScroll />
      <SiteHeader aktif="tentang" />

      <main className="overflow-x-clip">
        {/* ---------- 1. Intro ---------- */}
        <section className="relative mx-auto max-w-[1280px] px-5 pt-24 text-center sm:px-6 sm:pt-32">
          <Reveal
            as="h1"
            varian="lines"
            className="text-[clamp(52px,9vw,128px)] leading-[0.82] font-normal tracking-[-0.04em] text-ink"
          >
            <Baris>
              <span className="serif-em text-[1.25em]">tentang</span>
            </Baris>
            <Baris>
              <span className="uppercase">acnelens</span>
            </Baris>
          </Reveal>
          <Reveal delay={250} className="mx-auto mt-8 max-w-[560px]">
            <p className="leading-relaxed text-muted">
              AcneLens adalah aplikasi web yang memperkirakan jenis jerawat dari satu foto kulit wajah:
              papula, pustula, atau kulit normal. Cara kerjanya mengikuti penelitian tentang gabungan
              fitur SURF dan HOG yang diklasifikasikan dengan Support Vector Machine.
            </p>
          </Reveal>

          <Reveal varian="fade" className="pointer-events-none absolute top-[12%] -left-[6%] hidden w-[38%] lg:block">
            <svg viewBox="0 0 600 300" fill="none" className="garis-anim h-auto w-full text-ink/60" aria-hidden="true">
              <path
                pathLength={1}
                d="M590 40 C 420 -10, 180 10, 80 120 C 0 210, 40 290, 130 296"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </Reveal>
          <Reveal delay={400} className="mt-12 flex justify-center">
            <TombolTurun href="#latar" label="Baca latar belakang" />
          </Reveal>
        </section>

        {/* Foto lebar + angka ringkas */}
        <section className="mx-auto max-w-[1280px] px-5 pt-16 sm:px-6 sm:pt-24">
          <GambarParallax
            src={GAMBAR.tentang.hero}
            alt="Close-up mata dan kulit pipi"
            speed={0.1}
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="aspect-[4/3] w-full rounded-[28px] sm:aspect-[16/9] lg:aspect-[21/9]"
          />
          <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
            {[
              { nilai: "3", ket: "kelas: kulit normal, papula, pustula" },
              { nilai: "1.500", ket: "citra wajah, 500 per kelas" },
              { nilai: "93,33%", ket: "akurasi uji di jurnal acuan" },
              { nilai: "SURF + HOG", ket: "fitur yang digabungkan, lalu SVM" },
            ].map((a, i) => (
              <Reveal key={a.ket} delay={i * 90} className="border-t border-ink/15 pt-5">
                <Angka nilai={a.nilai} ket={a.ket} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- 2. Latar belakang ---------- */}
        <section id="latar" className="scroll-mt-24 py-24 sm:py-36">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-14 px-5 sm:px-6 lg:grid-cols-12">
            <div className="relative lg:col-span-6">
              <Reveal varian="fade">
                <Eyebrow>Latar belakang</Eyebrow>
              </Reveal>
              <Reveal
                as="h2"
                varian="lines"
                className="mt-4 text-[clamp(38px,5.2vw,72px)] leading-[1.02] font-normal tracking-[-0.035em] text-ink"
              >
                <Baris>Mirip di mata,</Baris>
                <Baris>beda</Baris>
                <Baris>
                  <span className="serif-em garis-gambar">penanganannya</span>
                </Baris>
              </Reveal>
              <Reveal delay={180} className="mt-7 max-w-[500px] space-y-4 leading-relaxed text-muted">
                <p>
                  Acne vulgaris adalah peradangan kronis pada kelenjar minyak dan folikel rambut yang
                  paling sering dialami remaja dan dewasa muda. Selain mengganggu penampilan, jerawat
                  yang meradang lama bisa meninggalkan noda gelap atau bekas permanen.
                </p>
                <p>
                  Papula dan pustula sama-sama lesi yang meradang dan tampak mirip, padahal
                  penanganannya bisa berbeda. Salah mengenali jenisnya dapat membuat penanganan
                  terlambat. Karena itu, alat bantu yang bisa membedakan keduanya secara konsisten
                  berguna untuk skrining awal.
                </p>
              </Reveal>
              <GarisLengkung className="pointer-events-none absolute -right-4 -bottom-24 hidden w-32 text-ink/50 lg:block" />
            </div>

            <div className="lg:col-span-6">
              <GambarParallax
                src={GAMBAR.tentang.cermin}
                alt="Perempuan memeriksa kulit pipinya di cermin"
                speed={0.12}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="aspect-[4/5] w-full rounded-t-full rounded-b-[28px]"
              />
            </div>
          </div>

          {/* Papula vs pustula */}
          <div className="mx-auto mt-20 grid max-w-[1280px] grid-cols-1 gap-5 px-5 sm:px-6 md:grid-cols-2">
            {[
              {
                id: "papula" as const,
                isi: "Benjolan padat kemerahan tanpa nanah. Umumnya lebih responsif terhadap terapi antiinflamasi topikal seperti retinoid.",
              },
              {
                id: "pustula" as const,
                isi: "Ada nanah di folikel yang meradang. Sering menandakan peradangan yang lebih lanjut dan bisa memerlukan penanganan berbeda.",
              },
            ].map((k, i) => (
              <Reveal key={k.id} delay={i * 120} className={`rounded-[28px] p-8 sm:p-10 ${KELAS[k.id].warna}`}>
                <span className="text-[11px] font-semibold tracking-[0.16em] text-ink/60 uppercase">
                  Lesi meradang
                </span>
                <h3 className="serif-em mt-3 text-[40px] leading-none text-ink">{KELAS[k.id].nama}</h3>
                <p className="mt-4 max-w-[440px] leading-relaxed text-ink/80">{k.isi}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- 3. Celah penelitian ---------- */}
        <section id="celah" className="relative overflow-hidden bg-[#f3e8e7] py-24 sm:py-36">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: `url('${GAMBAR.tekstur}')`, backgroundSize: "cover" }}
          />
          <div className="relative mx-auto max-w-[1280px] px-5 sm:px-6">
            <div className="text-center">
              <Reveal varian="fade">
                <Eyebrow>Celah penelitian</Eyebrow>
              </Reveal>
              <Reveal
                as="h2"
                varian="lines"
                className="mt-4 text-[clamp(40px,6.4vw,96px)] leading-[0.95] font-normal tracking-[-0.035em] text-ink"
              >
                <Baris>
                  <span className="uppercase">Kenapa memilih</span>
                </Baris>
                <Baris>
                  <span className="serif-em">SURF + HOG?</span>
                </Baris>
              </Reveal>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
              {CELAH.map((c, i) => (
                <Reveal key={c.judul} delay={i * 120} className="border-t border-ink/20 pt-6">
                  <span className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
                    Pendekatan lain
                  </span>
                  <h3 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-ink">{c.judul}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{c.isi}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200} className="mt-16 rounded-[28px] bg-white p-8 sm:p-12">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
                <h3 className="text-[clamp(28px,3vw,40px)] leading-[1.1] font-normal tracking-[-0.02em] text-ink lg:col-span-5">
                  Kontribusi <span className="serif-em">penelitian</span>
                </h3>
                <p className="leading-relaxed text-muted lg:col-span-7">
                  Menggabungkan lokasi struktur lokal lesi dari SURF dengan pola tekstur tepi dari HOG,
                  lalu menguji secara sistematis pengaruh interpolasi, ukuran cell HOG, dan kernel SVM.
                  Kestabilan fitur juga dinilai lewat similarity antara citra asli dan citra hasil
                  transformasi.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- 4. Tiga kelas ---------- */}
        <section id="jenis" className="scroll-mt-24 py-24 sm:py-36">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-8">
              <Reveal
                as="h2"
                varian="lines"
                className="text-[clamp(38px,5.6vw,76px)] leading-[1.02] font-normal tracking-[-0.035em] text-ink"
              >
                <Baris>Tiga kelas yang</Baris>
                <Baris>
                  <span className="serif-em">dikenali</span>
                </Baris>
              </Reveal>
              <Reveal delay={150} className="max-w-[380px]">
                <p className="text-sm leading-relaxed text-muted">
                  Setiap kelas berisi 500 citra wajah. Label angka di bawah adalah label yang dipakai
                  saat melatih model.
                </p>
              </Reveal>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-3">
              {URUTAN_LABEL.map((id, i) => {
                const k = KELAS[id];
                return (
                  <Reveal key={id} delay={i * 120} className={i === 1 ? "md:mt-16" : ""}>
                    <div className="group relative aspect-[4/5] overflow-hidden rounded-[20px] bg-mist">
                      <Image
                        src={GAMBAR.kelas[id][0]}
                        alt={`Contoh ${k.nama.toLowerCase()}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-[1.2s] ease-halus group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-5 flex items-baseline justify-between gap-4">
                      <h3 className="serif-em text-[32px] leading-none text-ink">{k.nama}</h3>
                      <span className="font-mono text-xs text-muted">label {k.label}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{k.detail}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- 5. Alur sistem ---------- */}
        <section id="alur" className="bg-[#faf7f4] py-24 sm:py-36">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-14 px-5 sm:px-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <Reveal varian="fade">
                  <Eyebrow>Metode</Eyebrow>
                </Reveal>
                <Reveal
                  as="h2"
                  varian="lines"
                  className="mt-4 text-[clamp(38px,5vw,68px)] leading-[1.02] font-normal tracking-[-0.035em] text-ink"
                >
                  <Baris>Dari satu foto</Baris>
                  <Baris>
                    jadi <span className="serif-em">jawaban</span>
                  </Baris>
                </Reveal>
                <Reveal delay={150}>
                  <p className="mt-6 max-w-[420px] leading-relaxed text-muted">
                    Proses pelatihan dan pengujian melewati tahap yang sama. Bedanya, saat pengujian
                    model yang sudah dilatih langsung menebak kelasnya.
                  </p>
                </Reveal>
                <GambarParallax
                  src={GAMBAR.tentang.tekstur}
                  alt="Makro tekstur kulit"
                  speed={0.1}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="mt-10 hidden aspect-[4/5] w-full max-w-[420px] rounded-[28px] lg:block"
                />
              </div>
            </div>

            <div className="lg:col-span-7">
              <ol className="border-t border-ink/15">
                {ALUR.map((a, i) => (
                  <Reveal
                    as="li"
                    key={a.judul}
                    delay={(i % 3) * 80}
                    className="grid grid-cols-[56px_1fr] gap-4 border-b border-ink/15 py-8 sm:grid-cols-[88px_1fr] sm:py-10"
                  >
                    <span className="serif-em text-[40px] leading-none text-ink/30 sm:text-[56px]">{i + 1}</span>
                    <div>
                      <h3 className="text-xl font-medium tracking-[-0.02em] text-ink sm:text-2xl">{a.judul}</h3>
                      <p className="mt-2 leading-relaxed text-muted">{a.isi}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>
              <Reveal className="mt-10 rounded-[24px] bg-white p-7 sm:p-8">
                <p className="text-sm leading-relaxed text-muted">
                  <strong className="font-medium text-ink">Saat foto diuji:</strong> kalau tidak ada
                  keypoint yang memenuhi det(H) ≥ 1000, sistem tidak menemukan lesi jerawat pada foto.
                  Kalau ada, sistem lanjut menentukan apakah itu papula atau pustula.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------- 6. Dataset ---------- */}
        <section id="dataset" className="bg-[#f3e8e7]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <GambarParallax
              src={GAMBAR.tentang.riset}
              alt="Meja kerja dengan keyboard dan buku catatan"
              speed={0.1}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="aspect-[4/3] w-full lg:aspect-auto lg:min-h-[760px]"
            />
            <div className="flex items-center px-5 py-20 sm:px-12 lg:px-20">
              <div className="w-full max-w-[520px]">
                <Reveal varian="fade">
                  <Eyebrow>Dataset</Eyebrow>
                </Reveal>
                <Reveal
                  as="h2"
                  varian="lines"
                  className="mt-4 text-[clamp(34px,4.2vw,56px)] leading-[1.04] font-normal tracking-[-0.03em] text-ink"
                >
                  <Baris>1.500 citra,</Baris>
                  <Baris>
                    <span className="serif-em">seimbang</span> tiap kelas
                  </Baris>
                </Reveal>

                <Reveal delay={150} className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8">
                  <Angka nilai="1.200" ket="data latih (80%)" />
                  <Angka nilai="300" ket="data uji (20%)" />
                  <Angka nilai="500" ket="citra per kelas" />
                  <Angka nilai="256×300" ket="piksel, ukuran seragam" />
                </Reveal>

                <Reveal delay={250} className="mt-12 border-t border-ink/15">
                  {DATASET.map((d) => (
                    <a
                      key={d.kelas}
                      href={d.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between gap-4 border-b border-ink/15 py-4"
                    >
                      <span>
                        <span className="block font-medium text-ink">{d.kelas}</span>
                        <span className="text-sm text-muted">{d.sumber}</span>
                      </span>
                      <span className="shrink-0 font-mono text-xs text-muted transition-transform duration-500 ease-halus group-hover:translate-x-1">
                        label {d.label} ↗
                      </span>
                    </a>
                  ))}
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- 7. Parameter yang diuji ---------- */}
        <section id="parameter" className="py-24 sm:py-36">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
            <div className="text-center">
              <Reveal varian="fade">
                <Eyebrow>Pengujian</Eyebrow>
              </Reveal>
              <Reveal
                as="h2"
                varian="lines"
                className="mt-4 text-[clamp(40px,6.4vw,96px)] leading-[0.95] font-normal tracking-[-0.035em] text-ink"
              >
                <Baris>
                  <span className="uppercase">Tiga hal yang</span>
                </Baris>
                <Baris>
                  <span className="serif-em">dicoba-coba</span>
                </Baris>
              </Reveal>
              <Reveal delay={150} className="mx-auto mt-6 max-w-[520px]">
                <p className="leading-relaxed text-muted">
                  Semua kombinasi diuji untuk mencari pengaturan yang paling akurat. Pilihan yang
                  dipakai AcneLens ditandai gelap.
                </p>
              </Reveal>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
              {PARAMETER.map((p, i) => (
                <Reveal key={p.nama} delay={i * 120} className="flex flex-col rounded-[28px] bg-mist p-8">
                  <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">{p.nama}</h3>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.variasi.map((v) => (
                      <span
                        key={v}
                        className={`rounded-full px-4 py-1.5 text-sm ${
                          v === p.terbaik ? "bg-ink text-white" : "border border-ink/15 text-ink"
                        }`}
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                  <p className="mt-6 text-sm leading-relaxed text-muted">{p.alasan}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 8. Hasil ---------- */}
        <section id="hasil" className="bg-ink py-24 text-white sm:py-36">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-6">
                <Reveal varian="fade">
                  <Eyebrow terang>Hasil</Eyebrow>
                </Reveal>
                <Reveal
                  as="h2"
                  varian="lines"
                  className="mt-4 text-[clamp(38px,5.2vw,72px)] leading-[1.02] font-normal tracking-[-0.035em]"
                >
                  <Baris>Lanczos3, cell 8×8,</Baris>
                  <Baris>
                    kernel <span className="serif-em">linear</span>
                  </Baris>
                </Reveal>
                <Reveal delay={150}>
                  <p className="mt-6 max-w-[460px] leading-relaxed text-white/70">
                    Kombinasi ini memberi akurasi tertinggi. Lanczos3 menjaga ketajaman tepi, cell 8×8
                    menyeimbangkan detail dan kestabilan, dan fitur gabungannya cukup terpisah secara
                    linear.
                  </p>
                </Reveal>
              </div>
              <Reveal delay={200} className="grid grid-cols-2 gap-8 lg:col-span-6">
                <div className="border-t border-white/20 pt-5">
                  <strong className="block text-[clamp(52px,6vw,88px)] leading-none font-normal tracking-[-0.04em]">
                    93,33%
                  </strong>
                  <span className="mt-2 block text-sm text-white/60">akurasi data uji</span>
                </div>
                <div className="border-t border-white/20 pt-5">
                  <strong className="block text-[clamp(52px,6vw,88px)] leading-none font-normal tracking-[-0.04em]">
                    94,75%
                  </strong>
                  <span className="mt-2 block text-sm text-white/60">akurasi data latih</span>
                </div>
              </Reveal>
            </div>

            {/* Similarity fitur */}
            <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-2">
              {SIMILARITY.map((s, i) => (
                <Reveal key={s.fitur} delay={i * 120}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-medium">Similarity {s.fitur}</span>
                    <span className="font-mono text-sm text-white/70">
                      {s.nilai.toLocaleString("id-ID", { minimumFractionDigits: 4 })}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[#e8daca]" style={{ width: `${s.nilai * 100}%` }} />
                  </div>
                  <p className="mt-3 text-sm text-white/60">{s.arti}</p>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-6">
              <p className="max-w-[760px] text-xs leading-relaxed text-white/50">
                Similarity mengukur seberapa mirip fitur citra asli dengan fitur citra yang sudah
                ditransformasi CLAHE. Nilai mendekati 1 berarti fiturnya stabil.
              </p>
            </Reveal>

            <Reveal className="mt-16 flex flex-col gap-6 rounded-[28px] bg-white/[0.06] p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
              <div className="max-w-[560px]">
                <span className="text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase">
                  Dari jurnal ke aplikasi
                </span>
                <p className="mt-3 leading-relaxed text-white/80">
                  Model yang kami latih ulang untuk AcneLens memakai alur dan pengaturan yang sama.
                  Hasilnya sedikit di bawah angka jurnal.
                </p>
              </div>
              <div className="shrink-0">
                <strong className="block text-[clamp(40px,4vw,56px)] leading-none font-normal tracking-[-0.03em]">
                  92,00%
                </strong>
                <span className="mt-2 block text-sm text-white/60">akurasi uji model AcneLens</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Tabel akurasi + sebaran kesalahan */}
        <section className="py-24 sm:py-36">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
            <Reveal
              as="h2"
              varian="lines"
              className="text-[clamp(34px,4.2vw,56px)] leading-[1.04] font-normal tracking-[-0.03em] text-ink"
            >
              <Baris>
                Akurasi tiap <span className="serif-em">kombinasi</span>
              </Baris>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-4 max-w-[560px] text-sm leading-relaxed text-muted">
                Angka atas adalah akurasi data uji, angka bawah akurasi data latih. Kernel polynomial
                dan RBF baru menyusul kernel linear pada cell 32×32.
              </p>
            </Reveal>

            <Reveal delay={200} className="mt-10 overflow-x-auto rounded-[24px] border border-line">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-mist text-xs tracking-[0.08em] text-muted uppercase">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Kernel</th>
                    <th className="px-5 py-4 font-semibold">Interpolasi</th>
                    {CELLSIZE.map((c) => (
                      <th key={c} className="px-5 py-4 text-right font-semibold">
                        Cell {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {AKURASI.map((b, r) => {
                    const awalKernel = r === 0 || AKURASI[r - 1].kernel !== b.kernel;
                    return (
                      <tr key={`${b.kernel}-${b.interpolasi}`} className={awalKernel ? "border-t border-line" : ""}>
                        <td className="px-5 py-3.5 font-medium text-ink">{awalKernel ? b.kernel : ""}</td>
                        <td className="px-5 py-3.5 text-muted">{b.interpolasi}</td>
                        {b.nilai.map(([uji, latih], c) => {
                          const terbaik =
                            b.kernel === TERBAIK.kernel && b.interpolasi === TERBAIK.interpolasi && c === TERBAIK.cell;
                          return (
                            <td key={c} className="px-3 py-2 text-right">
                              <span
                                className={`inline-block rounded-xl px-2.5 py-1.5 ${
                                  terbaik ? "bg-ink text-white" : ""
                                }`}
                              >
                                <span className={`block ${terbaik ? "" : "text-ink"}`}>{persen(uji)}</span>
                                <span className={`block text-xs ${terbaik ? "text-white/60" : "text-muted"}`}>
                                  {persen(latih)}
                                </span>
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Reveal>
            <p className="mt-3 text-xs text-muted">
              Sumber: Tabel 4 pada jurnal acuan. Baris RBF + Lanczos3 tidak dicantumkan di jurnal.
            </p>

            <div className="mt-24 grid grid-cols-1 gap-14 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <Reveal
                  as="h3"
                  varian="lines"
                  className="text-[clamp(30px,3.4vw,44px)] leading-[1.05] font-normal tracking-[-0.03em] text-ink"
                >
                  <Baris>20 dari 300</Baris>
                  <Baris>
                    foto <span className="serif-em">meleset</span>
                  </Baris>
                </Reveal>
                <Reveal delay={150}>
                  <p className="mt-5 leading-relaxed text-muted">
                    Semua kesalahan terjadi pada papula. Warna dan tonjolannya bisa samar sehingga mirip
                    kulit normal, atau mirip pustula yang ringan.
                  </p>
                </Reveal>
              </div>
              <Reveal delay={200} className="lg:col-span-8">
                <TitikUji />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------- 9. Keterbatasan & pengembangan ---------- */}
        <section id="keterbatasan" className="relative overflow-hidden bg-[#faf7f4] py-24 sm:py-36">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <Reveal
                  as="h2"
                  varian="lines"
                  className="text-[clamp(38px,5.2vw,72px)] leading-[1.02] font-normal tracking-[-0.035em] text-ink"
                >
                  <Baris>Yang masih</Baris>
                  <Baris>
                    <span className="serif-em">dikembangkan</span>
                  </Baris>
                </Reveal>
                <Reveal delay={150}>
                  <p className="mt-6 max-w-[420px] leading-relaxed text-muted">
                    Metode ini ringan dan mudah ditelusuri, tetapi tetap punya batas. Ini yang perlu
                    kamu ketahui, dan yang ingin kami perbaiki.
                  </p>
                </Reveal>
                <Reveal delay={250} className="mt-10 rounded-[24px] bg-white p-7">
                  <span className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
                    Rencana berikutnya
                  </span>
                  <ul className="mt-4 space-y-3">
                    {RENCANA.map((r) => (
                      <li key={r} className="flex gap-3 text-sm leading-relaxed text-ink">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ink" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
              <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:col-span-7">
                {KETERBATASAN.map((k, i) => (
                  <Reveal key={k.judul} delay={(i % 2) * 120} className="border-t border-ink/15 pt-6">
                    <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">{k.judul}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{k.isi}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- 10. Tim & acuan ---------- */}
        <section id="tim" className="py-24 sm:py-36">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-8">
              <Reveal
                as="h2"
                varian="lines"
                className="text-[clamp(38px,5.6vw,76px)] leading-[1.02] font-normal tracking-[-0.035em] text-ink"
              >
                <Baris>
                  Tim <span className="serif-em">pengembang</span>
                </Baris>
              </Reveal>
              <Reveal delay={150} className="max-w-[380px]">
                <p className="text-sm leading-relaxed text-muted">
                  AcneLens dibuat oleh Kelompok 7 kelas TI-3D untuk mata kuliah Pengolahan Citra dan
                  Visi Komputer, Politeknik Negeri Malang.
                </p>
              </Reveal>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
              {TIM.map((t, i) => (
                <Reveal key={t.nama} delay={i * 120} className="flex flex-col rounded-[28px] bg-mist p-8">
                  <span
                    aria-hidden="true"
                    className={`inline-flex size-16 items-center justify-center rounded-full text-lg font-medium text-ink ${t.warna}`}
                  >
                    {t.inisial}
                  </span>
                  <strong className="mt-8 text-xl font-medium tracking-[-0.02em] text-ink">{t.nama}</strong>
                  <span className="mt-2 text-sm leading-relaxed text-muted">{t.tugas}</span>
                </Reveal>
              ))}
            </div>

            {/* Jurnal acuan */}
            <Reveal className="mt-20 grid grid-cols-1 gap-8 border-t border-ink/15 pt-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <Eyebrow>Jurnal acuan</Eyebrow>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {JURNAL_ACUAN.penulis}
                  <br />
                  {JURNAL_ACUAN.instansi}
                </p>
              </div>
              <div className="lg:col-span-8">
                <p className="serif-em text-[clamp(24px,2.6vw,34px)] leading-[1.2] text-ink">{JURNAL_ACUAN.judul}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{JURNAL_ACUAN.terbitan}</p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <PillLink href={`https://doi.org/${JURNAL_ACUAN.doi}`} varian="terang">
                    Buka jurnal
                  </PillLink>
                  <span className="font-mono text-xs text-muted">doi:{JURNAL_ACUAN.doi}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- 11. Ajakan ---------- */}
        <SectionAjakan />
      </main>

      <FooterSitus />
    </Halaman>
  );
}
