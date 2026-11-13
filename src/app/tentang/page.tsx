import type { Metadata } from "next";
import { Halaman } from "@/components/motion/halaman";
import { SiteHeader } from "@/components/site-header";
import { FooterSitus } from "@/components/footer-situs";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Tag } from "@/components/ui";
import { IkonKelas } from "@/components/skin-art";
import { KELAS, URUTAN_KELAS } from "@/lib/kelas";

export const metadata: Metadata = {
  title: "Tentang",
};

const TAHAP = [
  { judul: "Grayscale", isi: "Foto RGB diubah ke skala abu-abu." },
  { judul: "Resize", isi: "256 × 300 piksel dengan interpolasi Lanczos3." },
  { judul: "SURF", isi: "Keypoint dengan det(H) ≥ 1000 menjadi pusat ROI." },
  { judul: "HOG", isi: "ROI 64 × 64, cell 8 × 8, 9 bin orientasi." },
  { judul: "Gabung fitur", isi: "Fitur SURF dan HOG disatukan lalu dinormalisasi." },
  { judul: "SVM linear", isi: "Menentukan papula, pustula, atau kulit normal." },
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

function Subjudul({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-7 text-[clamp(28px,3vw,40px)] font-semibold tracking-[-0.02em] text-ink">
      {children}
    </h2>
  );
}

function Angka({ nilai, ket }: { nilai: string; ket: string }) {
  return (
    <div>
      <strong className="block text-[30px] font-semibold tracking-[-0.02em] text-ink">
        {nilai}
      </strong>
      <span className="text-[13px] text-muted">{ket}</span>
    </div>
  );
}

export default function Tentang() {
  return (
    <Halaman>
      <SmoothScroll />
      <SiteHeader aktif="tentang" />
      <main>
        <section className="mx-auto flex max-w-[1280px] flex-col gap-6 px-6 pt-18">
          <Tag>TENTANG APLIKASI</Tag>
          <h1 className="max-w-[900px] text-[clamp(44px,6vw,84px)] leading-[1.02] font-semibold tracking-[-0.035em] text-ink">
            Cara <span className="serif-em">AcneLens</span> membaca foto kulit
          </h1>
          <p className="max-w-[620px] text-lg leading-relaxed text-muted">
            AcneLens memakai metode ekstraksi fitur klasik, SURF dan HOG, lalu
            mengklasifikasikan hasilnya dengan Support Vector Machine. Alurnya
            mengikuti penelitian yang sudah diuji pada data yang sama.
          </p>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 pt-18">
          <Subjudul>
            Enam tahap <span className="serif-em">pengolahan</span>
          </Subjudul>
          <ol className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
            {TAHAP.map((t, i) => {
              const terakhir = i === TAHAP.length - 1;
              return (
                <li
                  key={t.judul}
                  className={`flex flex-col gap-2.5 rounded-3xl p-6 ${
                    terakhir ? "bg-ink text-white" : "bg-mist"
                  }`}
                >
                  <span className={`text-[13px] font-semibold ${terakhir ? "text-[#c9c9c9]" : "text-muted"}`}>
                    0{i + 1}
                  </span>
                  <strong className={`text-lg font-semibold ${terakhir ? "" : "text-ink"}`}>
                    {t.judul}
                  </strong>
                  <span className={`text-sm leading-normal ${terakhir ? "text-[#dadada]" : "text-muted"}`}>
                    {t.isi}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        <section id="jenis" className="mx-auto max-w-[1280px] scroll-mt-6 px-6 pt-24">
          <Subjudul>
            Tiga kelas yang <span className="serif-em">dikenali</span>
          </Subjudul>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
            {URUTAN_KELAS.map((id) => (
              <div key={id} className={`flex flex-col gap-3.5 rounded-[28px] p-7 ${KELAS[id].warna}`}>
                <IkonKelas jenis={id} size={72} />
                <h3 className="serif-em text-4xl text-ink">{KELAS[id].nama}</h3>
                <p className="text-[15px] leading-relaxed">{KELAS[id].detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24 bg-mist">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-7 px-6 py-22">
            <h2 className="text-[clamp(28px,3vw,40px)] font-semibold tracking-[-0.02em] text-ink">
              Data dan <span className="serif-em">acuan</span>
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
              <div className="flex flex-col gap-4.5 rounded-[28px] bg-white p-8">
                <span className="text-[11px] font-semibold tracking-[0.12em] text-muted">DATASET</span>
                <div>
                  <strong className="block text-[17px] font-semibold text-ink">Acne_dataset (Kaggle)</strong>
                  <span className="text-sm text-muted">Folder Papules dan Pustules</span>
                </div>
                <div>
                  <strong className="block text-[17px] font-semibold text-ink">
                    Skin Disease Detection Dataset (Kaggle)
                  </strong>
                  <span className="text-sm text-muted">Folder Normal Skin</span>
                </div>
                <div className="grid grid-cols-3 gap-3 border-t border-[#ececec] pt-4.5">
                  <Angka nilai="1.500" ket="citra, 500 per kelas" />
                  <Angka nilai="1.200" ket="data latih (80%)" />
                  <Angka nilai="300" ket="data uji (20%)" />
                </div>
              </div>

              <div className="flex flex-col gap-4.5 rounded-[28px] bg-white p-8">
                <span className="text-[11px] font-semibold tracking-[0.12em] text-muted">JURNAL ACUAN</span>
                <p className="serif-em text-2xl leading-tight text-ink">
                  Analisis Kinerja Ekstraksi Fitur SURF dan HOG pada Deteksi Acne Vulgaris
                </p>
                <span className="text-sm leading-relaxed text-muted">
                  A. Luthfi dan M. Ali. Jurnal Andalas: Rekayasa dan Penerapan
                  Teknologi, Vol. 6 No. 1, 2026.{" "}
                  <a
                    href="https://doi.org/10.25077/jarpet.v6i1.147"
                    className="underline underline-offset-2"
                    target="_blank"
                    rel="noreferrer"
                  >
                    doi:10.25077/jarpet.v6i1.147
                  </a>
                </span>
                <div className="grid grid-cols-2 gap-3 border-t border-[#ececec] pt-4.5">
                  <Angka nilai="93,33%" ket="akurasi uji di jurnal acuan" />
                  <Angka nilai="92,00%" ket="akurasi uji model AcneLens" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 pt-24 pb-28">
          <Subjudul>
            Tim <span className="serif-em">pengembang</span>
          </Subjudul>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
            {TIM.map((t) => (
              <div key={t.nama} className="flex items-start gap-4.5 rounded-[28px] border border-line p-7">
                <span
                  aria-hidden="true"
                  className={`inline-flex size-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-ink ${t.warna}`}
                >
                  {t.inisial}
                </span>
                <div className="flex flex-col gap-1.5">
                  <strong className="text-[17px] font-semibold text-ink">{t.nama}</strong>
                  <span className="text-sm leading-relaxed text-muted">{t.tugas}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <FooterSitus />
    </Halaman>
  );
}
