"use client";

import { useState } from "react";

/** Tombol bagikan: salin tautan, WhatsApp, dan X. URL diambil saat diklik. */
export function Bagikan({
  judul,
  tegak = false,
  gelap = false,
}: {
  judul: string;
  tegak?: boolean;
  /** true = dipakai di atas latar gelap */
  gelap?: boolean;
}) {
  const [tersalin, setTersalin] = useState(false);

  async function salin() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 1800);
    } catch {
      // clipboard tidak tersedia (mis. bukan HTTPS) — abaikan
    }
  }

  function buka(jenis: "wa" | "x") {
    const url = encodeURIComponent(window.location.href);
    const teks = encodeURIComponent(judul);
    const tujuan =
      jenis === "wa"
        ? `https://wa.me/?text=${teks}%20${url}`
        : `https://twitter.com/intent/tweet?text=${teks}&url=${url}`;
    window.open(tujuan, "_blank", "noopener,noreferrer");
  }

  const tombol = `relative flex size-11 cursor-pointer items-center justify-center rounded-full border transition-all duration-500 ease-halus hover:scale-110 ${
    gelap
      ? "border-white/30 text-white hover:border-white hover:bg-white hover:text-ink"
      : "border-ink/15 bg-white text-ink hover:border-ink hover:bg-ink hover:text-white"
  }`;

  return (
    <div className={`flex gap-2.5 ${tegak ? "flex-col" : "flex-row items-center"}`}>
      <button type="button" onClick={() => buka("wa")} aria-label="Bagikan ke WhatsApp" className={tombol}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 20l1.3-3.9A8 8 0 1 1 8 19.1L4 20Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M9.2 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .4-.1.6l-.5.6c.6 1.1 1.4 1.9 2.5 2.5l.6-.5c.2-.1.4-.2.6-.1l1.5.6c.3.1.4.3.4.5v.5c0 .3 0 .6-.5.8-.5.3-1.6.5-3.4-.6-1.4-.9-2.7-2.3-3.3-3.6-.6-1.4-.4-2.4-.2-2.7Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <button type="button" onClick={() => buka("x")} aria-label="Bagikan ke X" className={tombol}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.8-6.3L5.5 21H2.4l7.2-8.3L2 3h6.3l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" />
        </svg>
      </button>
      <button type="button" onClick={salin} aria-label="Salin tautan" className={tombol}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span
          role="status"
          className={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-full bg-ink px-3 py-1 text-[11px] whitespace-nowrap text-white transition-all duration-500 ease-halus ${
            tersalin ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
          }`}
        >
          {tersalin ? "Tersalin" : ""}
        </span>
      </button>
    </div>
  );
}
