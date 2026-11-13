"use client"; // error boundary wajib Client Component

import { useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { PillButton, PillLink } from "@/components/ui";
import { IconRefresh } from "@/components/icons";

/** Ditampilkan bila terjadi galat tak terduga saat merender halaman. */
export default function Galat({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // galat dari Server Component membawa digest untuk dicocokkan dengan log server
  const kode = error instanceof Error && "digest" in error ? String(error.digest) : null;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[70vh] max-w-[1280px] flex-col items-center justify-center px-5 py-24 text-center sm:px-6">
        <h1 className="text-[clamp(52px,9vw,128px)] leading-[0.82] font-normal tracking-[-0.04em] text-ink">
          <span className="serif-em block text-[1.25em]">maaf,</span>
          <span className="block uppercase">ada kendala</span>
        </h1>
        <p className="mt-8 max-w-[440px] leading-relaxed text-muted">
          Terjadi kesalahan saat memuat halaman ini. Coba muat ulang, atau kembali ke beranda.
        </p>
        {kode && <p className="mt-3 font-mono text-xs text-muted">Kode: {kode}</p>}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <PillButton onClick={() => retry()} icon={<IconRefresh />}>
            Coba lagi
          </PillButton>
          <PillLink href="/" varian="terang">
            Ke beranda
          </PillLink>
        </div>
      </main>
    </>
  );
}
