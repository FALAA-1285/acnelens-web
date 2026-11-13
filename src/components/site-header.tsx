import Link from "next/link";
import type { ReactNode } from "react";
import { IconArrowRight } from "./icons";

type Halaman = "beranda" | "cek" | "tentang";

const MENU: { href: string; label: string; id?: Halaman }[] = [
  { href: "/", label: "BERANDA", id: "beranda" },
  { href: "/cek", label: "CEK KULIT", id: "cek" },
  { href: "/tentang#jenis", label: "JENIS JERAWAT" },
  { href: "/tentang", label: "TENTANG", id: "tentang" },
];

export function Wordmark({ className = "text-[26px]" }: { className?: string }) {
  return (
    <span className={`font-semibold tracking-[-0.03em] ${className}`}>
      acne<span className="serif-em">Lens</span>
    </span>
  );
}

export function SiteHeader({
  aktif,
  kanan,
}: {
  aktif: Halaman;
  kanan?: ReactNode;
}) {
  return (
    <header className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-4 gap-y-3 px-6 pt-6">
      <Link href="/" className="text-ink no-underline">
        <Wordmark />
      </Link>

      <nav
        aria-label="Navigasi utama"
        className="order-last flex w-full justify-between gap-3 overflow-x-auto text-[11px] font-semibold tracking-[0.04em] sm:justify-start sm:gap-6 sm:text-xs sm:tracking-[0.08em] md:order-none md:w-auto md:gap-8"
      >
        {MENU.map((m) => (
          <Link
            key={m.label}
            href={m.href}
            aria-current={m.id === aktif ? "page" : undefined}
            className={`shrink-0 py-2 whitespace-nowrap ${
              m.id === aktif ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {m.label}
          </Link>
        ))}
      </nav>

      {kanan ?? (
        <Link
          href="/cek"
          className="inline-flex min-h-12 items-center gap-3.5 rounded-full bg-ink py-1.5 pr-1.5 pl-5 text-sm font-semibold text-white"
        >
          Mulai cek
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-white text-ink">
            <IconArrowRight size={16} />
          </span>
        </Link>
      )}
    </header>
  );
}
