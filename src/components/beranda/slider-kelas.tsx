"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { IconArrowRight } from "@/components/icons";

/**
 * Judul blok + tombol panah bulat besar (menggeser kartu) + deretan kartu
 * yang "bocor" ke tepi kanan layar, dengan garis progres tipis di bawahnya.
 */
export function SliderKelas({ judul, children }: { judul: ReactNode; children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [progres, setProgres] = useState(0);
  const [diUjung, setDiUjung] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const sync = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgres(max > 0 ? el.scrollLeft / max : 1);
      setDiUjung(el.scrollLeft >= max - 4);
    };
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  function geser() {
    const el = track.current;
    if (!el) return;
    // di ujung kanan → kembali ke awal
    if (diUjung) {
      el.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    const kartu = el.querySelector<HTMLElement>("[data-slide]");
    el.scrollBy({ left: kartu ? kartu.offsetWidth + 20 : el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-6 pr-5 sm:pr-6 lg:pr-[max(24px,calc((100vw-1280px)/2+24px))]">
        {judul}
        <button
          type="button"
          onClick={geser}
          aria-label={diUjung ? "Kembali ke kartu pertama" : "Kartu berikutnya"}
          className="group flex size-14 shrink-0 cursor-pointer items-center justify-center rounded-full bg-ink text-white transition-all duration-700 ease-halus hover:scale-110 sm:size-16"
        >
          <span className={`transition-transform duration-700 ease-halus ${diUjung ? "rotate-180" : ""}`}>
            <IconArrowRight size={20} />
          </span>
        </button>
      </div>

      <div
        ref={track}
        role="region"
        aria-label="Daftar kondisi kulit"
        tabIndex={0}
        data-lenis-prevent-wheel
        className="tanpa-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pr-5 pb-2 sm:pr-6"
      >
        {children}
      </div>

      <div className="mt-8 mr-5 h-px bg-ink/15 sm:mr-6 lg:mr-[max(24px,calc((100vw-1280px)/2+24px))]">
        <div
          className="h-full bg-ink transition-[width] duration-500 ease-halus"
          style={{ width: `${Math.max(14, progres * 100)}%` }}
        />
      </div>
    </div>
  );
}
