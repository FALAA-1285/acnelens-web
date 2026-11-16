"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type Varian = "up" | "fade" | "buka" | "scale" | "lines";

type GayaReveal = CSSProperties & { "--reveal-delay": string };

/*
 * Semua <Reveal> di halaman memakai SATU IntersectionObserver bersama.
 * Menggunakan rootMargin positif (250px di bawah) agar elemen mulai dibuka dan
 * gambar mulai diunduh SEBELUM masuk ke viewport. Hal ini mencegah gambar
 * telat terender saat pengguna menggulir.
 *
 * Listener scroll dihapus dari pemeriksaan frame-per-frame agar tidak memicu
 * layout thrashing (getBoundingClientRect pada puluhan elemen sekaligus).
 */
const menunggu = new Set<Element>();
let observerBersama: IntersectionObserver | null = null;
let frame = 0;

function buka(el: Element) {
  el.classList.add("is-in");
  menunggu.delete(el);
  observerBersama?.unobserve(el);
}

function periksa() {
  frame = 0;
  if (menunggu.size === 0) return;
  const batas = window.innerHeight + 250;
  // Buka elemen yang sudah berada di dalam atau dekat viewport (mis. anchor link / reload)
  const siap = [...menunggu].filter((el) => {
    const top = el.getBoundingClientRect().top;
    return top < batas;
  });
  siap.forEach(buka);
}

function jadwalkanPeriksa() {
  if (!frame) frame = requestAnimationFrame(periksa);
}

function amati(el: Element): () => void {
  if (typeof IntersectionObserver === "undefined") {
    el.classList.add("is-in");
    return () => {};
  }
  observerBersama ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) buka(entry.target);
      }
    },
    // Margin 250px di bawah agar konten siap sebelum terlihat pengguna
    { rootMargin: "250px 0px 50px 0px", threshold: 0 },
  );

  menunggu.add(el);
  observerBersama.observe(el);
  // Periksa sekali saat mount (untuk elemen yang berada di atas viewport awal)
  jadwalkanPeriksa();

  return () => {
    menunggu.delete(el);
    observerBersama?.unobserve(el);
  };
}

/**
 * Menambahkan kelas `.is-in` saat elemen masuk viewport (sekali saja).
 * Gaya animasinya ada di globals.css ([data-reveal="..."]).
 *
 * Untuk varian "lines", bungkus setiap baris dengan <Baris>.
 */
export function Reveal({
  as: Tag = "div",
  varian = "up",
  delay = 0,
  className,
  style,
  children,
  id,
  "aria-labelledby": ariaLabelledby,
}: {
  as?: ElementType;
  varian?: Varian;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  id?: string;
  "aria-labelledby"?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    return el ? amati(el) : undefined;
  }, []);

  const gaya: GayaReveal = { ...style, "--reveal-delay": `${delay}ms` };

  return (
    <Tag
      ref={ref}
      id={id}
      aria-labelledby={ariaLabelledby}
      data-reveal={varian}
      className={className}
      style={gaya}
    >
      {children}
    </Tag>
  );
}

/** Satu baris teks untuk <Reveal varian="lines">. */
export function Baris({ children }: { children: ReactNode }) {
  return (
    <span className="baris">
      <span>{children}</span>
    </span>
  );
}
