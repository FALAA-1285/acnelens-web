import { SiteHeader } from "@/components/site-header";
import { Halaman } from "@/components/motion/halaman";
import { HeroBeranda } from "@/components/beranda/hero";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { SectionPendekatan } from "@/components/beranda/section-pendekatan";
import { SectionKelas } from "@/components/beranda/section-kelas";
import { SectionProses } from "@/components/beranda/section-proses";
import { SectionEtos } from "@/components/beranda/section-etos";
import { SectionMetode } from "@/components/beranda/section-metode";
import { SectionAjakan } from "@/components/beranda/section-ajakan";
import { SectionPanduan } from "@/components/beranda/section-panduan";
import { FooterSitus } from "@/components/footer-situs";

export default function Beranda() {
  return (
    <Halaman>
      <SmoothScroll />
      <SiteHeader aktif="beranda" varian="hero" />
      <main className="overflow-x-clip">
        {/* 1. Hero video + judul per baris */}
        <HeroBeranda />
        {/* 2. Pendekatan: judul besar, gambar berlapis, 4 pilar */}
        <SectionPendekatan />
        {/* 3. Kelas: gambar sorotan sticky + slider kartu */}
        <SectionKelas />
        {/* 3b. Tahapan: judul besar, panah lengkung, foto oval + kartu zig-zag */}
        <SectionProses />
        {/* 4. Etos: latar tekstur + 2 poin */}
        <SectionEtos />
        {/* 5. Metode: grid setengah gambar / setengah teks */}
        <SectionMetode />
        {/* 6. Ajakan: banner penuh dengan latar parallax */}
        <SectionAjakan />
        {/* 7. Panduan: 1 kartu besar + 2 kartu */}
        <SectionPanduan />
      </main>
      {/* 9. Footer: foto parallax, kartu ajakan gelap, kolom link */}
      <FooterSitus />
    </Halaman>
  );
}
