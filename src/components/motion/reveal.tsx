"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type Varian = "up" | "fade" | "buka" | "scale" | "lines";

type GayaReveal = CSSProperties & { "--reveal-delay": string };

/*
 * Semua <Reveal> di halaman memakai SATU IntersectionObserver dan SATU pemeriksa
 * scroll bersama (sebelumnya tiap elemen punya observer + listener scroll sendiri,
 * sehingga setiap event scroll memicu puluhan getBoundingClientRect()).
 *
 * Pemeriksa scroll tetap dibutuhkan: saat scroll cepat (lempar scroll, tombol End,
 * anchor link) elemen kecil bisa melompati viewport di antara dua pemeriksaan
 * observer dan tidak pernah terbuka. Pemeriksa ini juga membuka elemen yang sudah
 * terlewat di atas viewport. Ia hanya membaca elemen yang belum terbuka, maksimal
 * sekali per frame, dan berhenti sendiri saat semua sudah terbuka.
 */
const BATAS_BAWAH = 0.92; // elemen dibuka bila tepi atasnya < 92% tinggi viewport

const menunggu = new Set<Element>();
let observerBersama: IntersectionObserver | null = null;
let frame = 0;

function buka(el: Element) {
  el.classList.add("is-in");
  menunggu.delete(el);
  observerBersama?.unobserve(el);
  if (menunggu.size === 0) window.removeEventListener("scroll", jadwalkanPeriksa);
}

function periksa() {
  frame = 0;
  const batas = window.innerHeight * BATAS_BAWAH;
  // baca semua posisi dulu, baru ubah kelas (hindari layout thrashing)
  const siap = [...menunggu].filter((el) => el.getBoundingClientRect().top < batas);
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
      for (const entry of entries) if (entry.isIntersecting) buka(entry.target);
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0 },
  );
  if (menunggu.size === 0) window.addEventListener("scroll", jadwalkanPeriksa, { passive: true });
  menunggu.add(el);
  observerBersama.observe(el);
  jadwalkanPeriksa();

  return () => {
    menunggu.delete(el);
    observerBersama?.unobserve(el);
    if (menunggu.size === 0) window.removeEventListener("scroll", jadwalkanPeriksa);
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
