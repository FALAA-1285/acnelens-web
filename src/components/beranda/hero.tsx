"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IconArrowRight } from "@/components/icons";
import { GAMBAR } from "@/lib/gambar";
import { tungguPreloader } from "@/components/motion/preloader";

export function HeroBeranda() {
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  // null = belum diketahui (SSR / sebelum mount): tampilkan poster saja
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 767px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setIsMobile(mqMobile.matches);
      setReduceMotion(mqMotion.matches);
    };
    sync();
    mqMobile.addEventListener("change", sync);
    mqMotion.addEventListener("change", sync);

    // judul & CTA mulai beranimasi setelah layar pembuka selesai
    const lepas = tungguPreloader(() => setLoaded(true));

    // Parallax: maksimal satu update per frame
    let rafId = 0;
    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const el = sectionRef.current;
        if (!el) return;
        if (el.getBoundingClientRect().bottom > 0) {
          setScrollY(window.scrollY);
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      lepas();
      mqMobile.removeEventListener("change", sync);
      mqMotion.removeEventListener("change", sync);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const y = reduceMotion ? 0 : scrollY;
  const parallaxVideoY = y * (isMobile ? 0.15 : 0.28);
  const textOpacity = Math.max(0, 1 - y / (isMobile ? 480 : 650));
  const textTranslateY = y * (isMobile ? 0.16 : 0.22);

  const poster = isMobile ? GAMBAR.heroPosterMobile : GAMBAR.heroPoster;

  return (
    <section
      ref={sectionRef}
      id="intro"
      className="relative flex h-[100dvh] min-h-[560px] w-full items-center justify-center overflow-hidden bg-[#f3e8e7]"
    >
      {/* VIDEO LATAR DENGAN PARALLAX */}
      <div className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden">
        <div className="absolute inset-0 z-[2] bg-black/30" />

        <div
          className="absolute -top-[12%] left-0 h-[124%] w-full will-change-transform"
          style={{ transform: `translate3d(0, ${parallaxVideoY}px, 0)` }}
        >
          {isMobile === null ? (
            <picture>
              <source media="(max-width: 767px)" srcSet={GAMBAR.heroPosterMobile} />
              <img src={GAMBAR.heroPoster} alt="" className="h-full w-full object-cover" />
            </picture>
          ) : (
            // Hanya satu video yang dirender, jadi browser tidak mengunduh keduanya
            <video
              key={isMobile ? "m" : "d"}
              loop
              muted
              autoPlay={!reduceMotion}
              playsInline
              preload={reduceMotion ? "none" : "auto"}
              poster={poster}
              aria-hidden="true"
              className="h-full w-full object-cover"
            >
              <source src={isMobile ? GAMBAR.heroVideoMobile : GAMBAR.heroVideo} type="video/mp4" />
            </video>
          )}
        </div>
      </div>

      {/* JUDUL */}
      <div
        className="relative z-[3] mx-auto mb-16 flex max-w-[960px] flex-col items-center px-5 text-center will-change-transform sm:mb-20 md:mb-28 md:px-6"
        style={{
          opacity: textOpacity,
          transform: `translate3d(0, -${textTranslateY}px, 0)`,
        }}
      >
        <h1 className="text-[clamp(36px,8.5vw,90px)] font-normal leading-[1.08] tracking-[-0.035em] text-white sm:leading-[1.04]">
          <span className="block overflow-hidden">
            <span
              className={`block transition-transform duration-1200 ease-halus motion-reduce:transition-none ${
                loaded ? "translate-y-0" : "translate-y-[115%]"
              }`}
            >
              Kenali Jenis <span className="serif-em">Jerawatmu</span>
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className={`block transition-transform delay-150 duration-1200 ease-halus motion-reduce:transition-none ${
                loaded ? "translate-y-0" : "translate-y-[115%]"
              }`}
            >
              dari Satu <span className="serif-em">Foto</span>
            </span>
          </span>
        </h1>
      </div>

      {/* CTA MENGAMBANG */}
      <div className="absolute bottom-[5%] left-1/2 z-[3] w-[calc(100%-2.5rem)] max-w-[460px] -translate-x-1/2 sm:bottom-[6%]">
        <div
          className={`transition-all delay-350 duration-1200 ease-halus motion-reduce:transition-none ${
            loaded ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-90 opacity-0"
          }`}
        >
          <Link
            href="/cek"
            className="group relative flex items-center justify-between rounded-full border border-white/60 bg-[#ffffffe6] py-2 pr-2 pl-5 text-ink shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur-[24px] transition-all duration-300 hover:bg-white hover:shadow-[0_25px_60px_rgba(0,0,0,0.38)] sm:py-2.5 sm:pr-2.5 sm:pl-7"
          >
            <span className="text-[11px] font-semibold tracking-[0.08em] text-ink uppercase underline decoration-ink/40 underline-offset-4 transition-colors group-hover:decoration-ink sm:text-[13px] sm:tracking-[0.1em]">
              MULAI CEK KULIT SEKARANG
            </span>
            <span className="flex size-10 items-center justify-center rounded-full bg-[#3b3b3b] text-white shadow-sm transition-transform duration-300 ease-out group-hover:scale-110 sm:size-12">
              <IconArrowRight size={15} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
