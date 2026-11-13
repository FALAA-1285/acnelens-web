import Link from "next/link";
import { Wordmark } from "./site-header";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-[#ededed]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-14 px-6 pt-20 pb-10">
        <div className="flex flex-wrap justify-between gap-10">
          <Wordmark className="text-[clamp(56px,9vw,120px)] leading-[0.9] tracking-[-0.04em]" />

          <div className="flex flex-wrap gap-16 text-sm">
            <nav aria-label="Navigasi footer" className="flex flex-col gap-3">
              <span className="text-[11px] font-semibold tracking-[0.12em] text-[#b3b3b3]">
                APLIKASI
              </span>
              <Link href="/" className="hover:underline">Beranda</Link>
              <Link href="/cek" className="hover:underline">Cek kulit</Link>
              <Link href="/tentang" className="hover:underline">Tentang</Link>
            </nav>
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-semibold tracking-[0.12em] text-[#b3b3b3]">
                PROYEK
              </span>
              <span>Kelompok 7 · TI-3D</span>
              <span>Politeknik Negeri Malang</span>
              <span>Pengolahan Citra dan Visi Komputer</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-4 border-t border-[#3f3f3f] pt-6 text-xs text-[#b3b3b3]">
          <span>Hasil aplikasi bukan diagnosis medis.</span>
          <span>© 2026 AcneLens</span>
        </div>
      </div>
    </footer>
  );
}
