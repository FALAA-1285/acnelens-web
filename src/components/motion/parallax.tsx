"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Menggeser isi secara vertikal relatif terhadap posisi elemen di viewport.
 * `speed` 0.1–0.3 cocok untuk gambar; nilai negatif = bergerak berlawanan arah.
 * Pasang pada wrapper dengan overflow-hidden, dan buat anak sedikit lebih tinggi
 * (mis. `-inset-y-[12%]`) supaya tepi gambar tidak terlihat.
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

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 saat elemen tepat di tengah viewport
      const offset = rect.top + rect.height / 2 - vh / 2;
      // Batasi geseran ke sisa tepi gambar agar latar tidak pernah bolong.
      // Untuk wrapper yang tidak lebih tinggi dari induknya (mis. dekorasi), tanpa batas.
      const parent = el.parentElement;
      const sisa = parent ? (el.offsetHeight - parent.clientHeight) / 2 : 0;
      let y = -offset * speed;
      if (sisa > 0) y = Math.max(-sisa, Math.min(sisa, y));
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) onScroll();
    });
    io.observe(el.parentElement ?? el);

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed, hanyaLebar]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
