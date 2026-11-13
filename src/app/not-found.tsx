import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { FooterSitus } from "@/components/footer-situs";
import { PillLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
};

export default function TidakDitemukan() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[70vh] max-w-[1280px] flex-col items-center justify-center px-5 py-24 text-center sm:px-6">
        <h1 className="text-[clamp(52px,9vw,128px)] leading-[0.82] font-normal tracking-[-0.04em] text-ink">
          <span className="serif-em block text-[1.25em]">ups,</span>
          <span className="block uppercase">404</span>
        </h1>
        <p className="mt-8 max-w-[440px] leading-relaxed text-muted">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan. Coba kembali ke beranda, atau
          langsung cek kulitmu.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <PillLink href="/">Ke beranda</PillLink>
          <PillLink href="/cek" varian="terang">
            Cek kulit
          </PillLink>
        </div>
      </main>
      <FooterSitus tanpaAjakan />
    </>
  );
}
