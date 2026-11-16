"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Menggeser isi secara vertikal relatif terhadap posisi elemen di viewport.
 * `speed` 0.1–0.3 cocok untuk gambar; nilai negatif = bergerak berlawanan arah.
 * Menggunakan pengukuran ter-cache (tidak memicu getBoundingClientRect saat scroll)
 * untuk menghindari forced reflow / layout thrashing yang menyebabkan scroll tersendat.
 */
export function Parallax({
  speed = 0.15,
  className = "",
  hanyaLebar = false,
  children,
}: {
  speed?: number;
  className?: string;
  /** true = parallax hanya aktif di layar ≥ 1024px */
  hanyaLebar?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (hanyaLebar && !window.matchMedia("(min-width: 1024px)").matches) return;

    let raf = 0;
    let visible = false;
    let lastAppliedY = NaN;

    // Cache layout agar tidak memicu DOM reflow saat event scroll
    let docTop = 0;
    let elHeight = 0;
    let sisa = 0;
    let vh = typeof window !== "undefined" ? window.innerHeight : 800;

    const ukur = () => {
      const rect = el.getBoundingClientRect();
      docTop = rect.top + window.scrollY;
      elHeight = rect.height;
      vh = window.innerHeight;
      const parent = el.parentElement;
      sisa = parent ? (el.offsetHeight - parent.clientHeight) / 2 : 0;
    };

    const update = () => {
      raf = 0;
      if (!visible) return;
      // Hitung posisi relatif ke viewport tanpa getBoundingClientRect()
      const currentTop = docTop - window.scrollY;
      const offset = currentTop + elHeight / 2 - vh / 2;
      let y = -offset * speed;
      if (sisa > 0) y = Math.max(-sisa, Math.min(sisa, y));

      // Abaikan jika perubahan subpixel terlalu kecil (hemat repaint GPU)
      if (Math.abs(y - lastAppliedY) >= 0.2 || isNaN(lastAppliedY)) {
        lastAppliedY = y;
        el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      }
    };

    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update);
    };

    const onResize = () => {
      ukur();
      update();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          ukur();
          onScroll();
        }
      },
      { rootMargin: "150px 0px 150px 0px" },
    );
    io.observe(el.parentElement ?? el);

    ukur();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [speed, hanyaLebar]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
