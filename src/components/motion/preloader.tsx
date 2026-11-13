"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    __preloaderSelesai?: boolean;
  }
}

// total durasi harus sama dengan animasi .preloader di globals.css
const DURASI_MS = 2300;

/**
 * Layar pembuka saat situs pertama kali dimuat (tidak muncul lagi saat pindah
 * halaman karena ada di layout, dan disimpan di sessionStorage agar tidak
 * memblokir layar lagi saat halaman di-refresh).
 */
export function Preloader() {
  const [tampil, setTampil] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      if (sessionStorage.getItem("preloader_selesai") === "true") {
        window.__preloaderSelesai = true;
        return false;
      }
    } catch {}
    return true;
  });

  useEffect(() => {
    if (!tampil) {
      window.__preloaderSelesai = true;
      window.dispatchEvent(new Event("preloader:selesai"));
      return;
    }

    const selesai = () => {
      window.__preloaderSelesai = true;
      try {
        sessionStorage.setItem("preloader_selesai", "true");
      } catch {}
      window.dispatchEvent(new Event("preloader:selesai"));
      setTampil(false);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      selesai();
      return;
    }

    // konten mulai beranimasi sedikit sebelum tirai benar-benar hilang
    const t = setTimeout(selesai, DURASI_MS - 500);
    return () => clearTimeout(t);
  }, [tampil]);

  if (!tampil) return null;

  return (
    <div className="preloader" aria-hidden="true">
      <span className="preloader-garis" />
      <span className="preloader-logo">
        <span>
          acne<span className="serif-em">Lens</span>
        </span>
      </span>
    </div>
  );
}

/** Dipakai komponen lain untuk menunggu preloader selesai. */
export function tungguPreloader(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  try {
    if (window.__preloaderSelesai || sessionStorage.getItem("preloader_selesai") === "true") {
      cb();
      return () => {};
    }
  } catch {}

  window.addEventListener("preloader:selesai", cb, { once: true });
  // cadangan bila preloader tidak pernah dirender
  const t = setTimeout(cb, DURASI_MS + 400);
  return () => {
    window.removeEventListener("preloader:selesai", cb);
    clearTimeout(t);
  };
}
