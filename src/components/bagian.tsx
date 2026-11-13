import Image from "next/image";
import type { ReactNode } from "react";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";

export function Eyebrow({ children, terang = false }: { children: ReactNode; terang?: boolean }) {
  return (
    <span
      className={`text-[11px] font-semibold tracking-[0.16em] uppercase ${
        terang ? "text-white/70" : "text-muted"
      }`}
    >
      {children}
    </span>
  );
}

/** Gambar dengan reveal clip + parallax di dalam bingkai. */
export function GambarParallax({
  src,
  alt = "",
  speed = 0.12,
  sizes,
  className = "",
  priority = false,
}: {
  src: string;
  alt?: string;
  speed?: number;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Reveal varian="buka" className={`relative overflow-hidden ${className}`}>
      <Parallax speed={speed} className="absolute -inset-y-[14%] inset-x-0">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </Parallax>
    </Reveal>
  );
}

/** Garis lengkung dekoratif (orisinal), digambar ulang saat masuk viewport. */
export function GarisLengkung({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 40 C 90 10, 170 50, 160 120 S 110 190, 60 170"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path d="M68 162 L 58 171 L 71 176" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Tombol panah bulat yang menggulir ke bagian lain di halaman yang sama. */
export function TombolTurun({
  href,
  label,
  varian = "gelap",
}: {
  href: `#${string}`;
  label: string;
  varian?: "gelap" | "garis";
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className={`flex size-16 items-center justify-center rounded-full transition-all duration-700 ease-halus hover:scale-110 ${
        varian === "gelap"
          ? "bg-ink text-white"
          : "border border-ink/20 text-ink hover:bg-ink hover:text-white"
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 4v16m0 0-6-6m6 6 6-6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
