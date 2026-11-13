"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconArrowRight } from "@/components/icons";

type Halaman = "beranda" | "cek" | "jurnal" | "tentang";

const MENU: { href: string; label: string; id?: Halaman; no: string }[] = [
  { href: "/", label: "Beranda", id: "beranda", no: "01" },
  { href: "/cek", label: "Cek kulit", id: "cek", no: "02" },
  { href: "/jurnal", label: "Jurnal", id: "jurnal", no: "03" },
  { href: "/tentang", label: "Tentang", id: "tentang", no: "04" },
];

export function Wordmark({ className = "text-[24px] sm:text-[26px]" }: { className?: string }) {
  return (
    <span className={`font-semibold tracking-[-0.03em] ${className}`}>
      acne<span className="serif-em">Lens</span>
    </span>
  );
}

// Garis bawah tipis yang "tergambar" dari kiri saat hover; penuh saat halaman aktif
const garisLink =
  "relative before:pointer-events-none before:absolute before:top-full before:left-0 before:mt-1 before:h-px before:w-full before:bg-current before:transition-transform before:duration-500 before:ease-halus";

export function SiteHeader({
  aktif,
  varian = "standar",
}: {
  aktif: Halaman;
  /** "hero": menempel di atas, transparan di atas foto/video, putih setelah di-scroll */
  varian?: "standar" | "hero";
}) {
  const [scrolled, setScrolled] = useState(false);
  const [tersembunyi, setTersembunyi] = useState(false);
  const [menuBuka, setMenuBuka] = useState(false);

  const isHero = varian === "hero";

  useEffect(() => {
    if (!isHero) return;
    let lastY = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // sembunyi saat scroll ke bawah, muncul lagi saat scroll ke atas
      if (Math.abs(y - lastY) > 6) {
        setTersembunyi(y > lastY && y > 160);
        lastY = y;
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHero]);

  // Kunci scroll & tutup dengan Escape saat menu mobile terbuka
  useEffect(() => {
    if (!menuBuka) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuBuka(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuBuka]);

  // Putih (teks terang) hanya saat di atas hero dan belum di-scroll
  const terang = isHero && !scrolled && !menuBuka;

  const cta = aktif !== "cek" && (
    <Link
      href="/cek"
      className={`group inline-flex items-center gap-2.5 rounded-full py-1.5 pr-1.5 pl-4 text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors duration-700 ease-halus sm:gap-3 sm:pl-5 sm:text-xs ${
        terang ? "bg-white text-ink" : "bg-ink text-white"
      }`}
    >
      <span className="hidden sm:inline">Mulai cek</span>
      <span className="sm:hidden">Cek</span>
      <span aria-hidden="true" className={`h-4 w-px ${terang ? "bg-ink/25" : "bg-white/30"}`} />
      <span
        className={`inline-flex size-7 items-center justify-center rounded-full transition-transform duration-500 ease-halus group-hover:-rotate-45 sm:size-8 ${
          terang ? "bg-ink text-white" : "bg-white text-ink"
        }`}
      >
        <IconArrowRight size={13} />
      </span>
    </Link>
  );

  return (
    <>
      <header
        style={{ viewTransitionName: "site-header" }}
        className={`top-0 right-0 left-0 z-50 transition-[background-color,box-shadow,transform] duration-[800ms] ease-halus ${
          isHero ? "fixed" : "sticky"
        } ${tersembunyi && !menuBuka ? "-translate-y-[120%]" : "translate-y-0"} ${
          !isHero ? "bg-white" : terang ? "bg-transparent" : "bg-white shadow-[0_0_10px_2px_rgba(184,184,184,0.17)]"
        }`}
      >
        <nav
          aria-label="Navigasi utama"
          className="relative mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5"
        >
          {/* Hamburger — kiri di HP */}
          <button
            type="button"
            onClick={() => setMenuBuka((v) => !v)}
            aria-label={menuBuka ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuBuka}
            aria-controls="menu-mobile"
            className="relative z-[60] flex h-10 w-9 cursor-pointer flex-col items-start justify-center gap-[5px] md:hidden"
          >
            <span
              className={`block h-[2px] w-[30px] transition-all duration-700 ease-halus ${terang ? "bg-white" : "bg-ink"} ${
                menuBuka ? "translate-y-[3.5px] scale-x-80 rotate-[40deg]" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-[30px] transition-all duration-700 ease-halus ${terang ? "bg-white" : "bg-ink"} ${
                menuBuka ? "-translate-y-[3.5px] scale-x-80 -rotate-[40deg]" : ""
              }`}
            />
          </button>

          {/* Logo — tengah di HP, kiri di desktop */}
          <Link
            href="/"
            onClick={() => setMenuBuka(false)}
            className={`relative z-[60] no-underline transition-colors duration-700 ease-halus max-md:absolute max-md:left-1/2 max-md:-translate-x-1/2 ${
              terang ? "text-white" : "text-ink"
            }`}
          >
            <Wordmark />
          </Link>

          {/* Menu desktop — di tengah */}
          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-12 md:flex">
            {MENU.map((m) => {
              const aktifIni = m.id === aktif;
              return (
                <li key={m.href}>
                  <Link
                    href={m.href}
                    aria-current={aktifIni ? "page" : undefined}
                    className={`${garisLink} text-xs font-semibold tracking-[0.06em] whitespace-nowrap uppercase transition-colors duration-700 ease-halus ${
                      terang ? "text-white" : "text-ink"
                    } ${
                      aktifIni
                        ? "before:origin-left before:scale-x-100"
                        : "before:origin-right before:scale-x-0 hover:before:origin-left hover:before:scale-x-100"
                    }`}
                  >
                    {m.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA — kanan */}
          <div className="relative z-[60] flex min-h-10 items-center">{cta}</div>
        </nav>
      </header>

      {/* Panel menu HP: putih, meluncur dari kiri */}
      <div
        id="menu-mobile"
        aria-hidden={!menuBuka}
        className={`fixed inset-0 z-40 flex flex-col bg-white px-5 pt-[16vh] pb-10 transition-transform duration-[800ms] ease-halus md:hidden ${
          menuBuka ? "translate-x-0" : "pointer-events-none -translate-x-full"
        }`}
      >
        <ul className="flex flex-col gap-1">
          {MENU.map((m, i) => {
            const aktifIni = m.id === aktif;
            return (
              <li
                key={m.href}
                className={`transition-all duration-700 ease-halus ${menuBuka ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                style={{ transitionDelay: menuBuka ? `${200 + i * 70}ms` : "0ms" }}
              >
                <Link
                  href={m.href}
                  tabIndex={menuBuka ? 0 : -1}
                  onClick={() => setMenuBuka(false)}
                  className="flex items-baseline justify-between border-b border-ink/10 py-4"
                >
                  <span
                    className={`text-[40px] leading-none font-normal tracking-[-0.03em] ${
                      aktifIni ? "serif-em text-ink" : "text-ink/80"
                    }`}
                  >
                    {m.label}
                  </span>
                  <span className="font-mono text-xs text-muted">{m.no}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-auto max-w-[260px] text-xs leading-relaxed text-muted">
          Klasifikasi papula, pustula, dan kulit normal dari satu foto.
        </p>
      </div>
    </>
  );
}
