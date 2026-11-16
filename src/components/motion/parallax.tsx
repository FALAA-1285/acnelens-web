"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { pantauGulir } from "@/components/motion/gulir";

/**
 * Menggeser isi secara vertikal relatif terhadap posisi elemen di viewport.
 * `speed` 0.1–0.3 cocok untuk gambar; nilai negatif = bergerak berlawanan arah.
 *
 * - Posisi elemen diukur sekali (saat mendekati layar / ukuran berubah), bukan
 *   setiap scroll, supaya tidak ada forced reflow.
 * - Posisi scroll diambil dari pantauGulir() sehingga transform ditulis di frame
 *   yang sama dengan scroll Lenis (tidak tertinggal satu frame → tidak bergetar).
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

    let visible = false;
    let lastY = NaN;

    // Ukuran ter-cache; posisi dihitung relatif dokumen (tanpa transform parallax)
    let docTop = 0;
    let elHeight = 0;
    let sisa = 0;
    let vh = window.innerHeight;

    const ukur = () => {
      const rect = el.getBoundingClientRect();
      // rect sudah termasuk geseran parallax yang sedang dipasang — kurangi agar
      // yang tersimpan adalah posisi asli elemen di dokumen
      docTop = rect.top + window.scrollY - (Number.isNaN(lastY) ? 0 : lastY);
      elHeight = rect.height;
      vh = window.innerHeight;
      const parent = el.parentElement;
      sisa = parent ? (el.offsetHeight - parent.clientHeight) / 2 : 0;
    };

    const terapkan = (scrollY: number) => {
      const offset = docTop - scrollY + elHeight / 2 - vh / 2;
      let y = -offset * speed;
      if (sisa > 0) y = Math.max(-sisa, Math.min(sisa, y));
      // Abaikan perubahan subpixel (hemat repaint)
      if (Math.abs(y - lastY) < 0.1) return;
      lastY = y;
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    };

    const onGulir = (scrollY: number) => {
      if (visible) terapkan(scrollY);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          ukur();
          terapkan(window.scrollY);
        }
      },
      { rootMargin: "200px 0px 200px 0px" },
    );
    io.observe(el.parentElement ?? el);

    // Ukur ulang bila tata letak berubah (font termuat, resize, konten di atasnya berubah)
    let rafUkur = 0;
    const jadwalUkur = () => {
      if (rafUkur) return;
      rafUkur = requestAnimationFrame(() => {
        rafUkur = 0;
        ukur();
        terapkan(window.scrollY);
      });
    };
    const ro = new ResizeObserver(jadwalUkur);
    ro.observe(document.body);
    window.addEventListener("resize", jadwalUkur, { passive: true });

    const berhenti = pantauGulir(onGulir);

    ukur();
    terapkan(window.scrollY);

    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(rafUkur);
      berhenti();
      window.removeEventListener("resize", jadwalUkur);
    };
  }, [speed, hanyaLebar]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
