"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Smooth scroll ala inersia (Lenis). Dimatikan bila pengguna memilih reduced motion. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 0.95,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Link anchor (#id) ikut di-scroll halus
    const onClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return;
      const href = e.target.closest("a")?.getAttribute("href");
      if (!href?.startsWith("#") || href.length < 2) return;
      // getElementById aman untuk id apa pun (querySelector melempar galat
      // bila id bukan selector CSS yang valid, mis. diawali angka)
      const tujuan = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!tujuan) return;
      e.preventDefault();
      lenis.scrollTo(tujuan, { offset: -80 });
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
