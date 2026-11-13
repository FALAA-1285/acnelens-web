import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { IconArrowRight } from "./icons";

type Varian = "gelap" | "terang";

const pill = {
  gelap: "bg-ink text-white",
  terang: "bg-white text-ink shadow-[0_10px_30px_rgba(37,37,37,0.08)]",
};

const lingkaran = {
  gelap: "bg-white text-ink",
  terang: "bg-ink text-white",
};

const dasarPill =
  "inline-flex min-h-[60px] items-center justify-between gap-6 rounded-full py-2 pr-2 pl-7 text-[13px] font-semibold tracking-[0.1em] transition-opacity hover:opacity-90";

function Lingkaran({ varian, icon }: { varian: Varian; icon?: ReactNode }) {
  return (
    <span
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-full ${lingkaran[varian]}`}
    >
      {icon ?? <IconArrowRight />}
    </span>
  );
}

/* Tombol pill berisi teks dan panah di dalam lingkaran */
export function PillLink({
  href,
  varian = "gelap",
  icon,
  className = "",
  children,
}: {
  href: string;
  varian?: Varian;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={`${dasarPill} ${pill[varian]} ${className}`}>
      {children}
      <Lingkaran varian={varian} icon={icon} />
    </Link>
  );
}

export function PillButton({
  varian = "gelap",
  icon,
  className = "",
  children,
  ...props
}: ComponentProps<"button"> & { varian?: Varian; icon?: ReactNode }) {
  return (
    <button
      type="button"
      className={`${dasarPill} ${pill[varian]} cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
      <Lingkaran varian={varian} icon={icon} />
    </button>
  );
}

/* Label kecil berbingkai, misalnya "METODE" */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="self-start rounded-full border border-body px-4 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-ink">
      {children}
    </span>
  );
}

/* Ikon di dalam lingkaran putih */
export function IconBulat({
  children,
  size = "md",
  className = "bg-white",
}: {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const ukuran = { sm: "size-10", md: "size-12", lg: "size-14" }[size];
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full text-ink ${ukuran} ${className}`}
    >
      {children}
    </span>
  );
}

export function JudulSeksi({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-[clamp(32px,4vw,52px)] leading-[1.05] font-semibold tracking-[-0.03em] text-ink ${className}`}
    >
      {children}
    </h2>
  );
}
