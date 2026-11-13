import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { IconArrowRight } from "@/components/icons";

/**
 * gelap: latar gelap · terang: putih bergaris tepi · garis: transparan bergaris
 * tepi (untuk latar berwarna) · kaca: putih transparan di atas foto
 */
type Varian = "gelap" | "terang" | "garis" | "kaca";

const pill: Record<Varian, string> = {
  gelap: "bg-ink text-white",
  terang: "border border-ink/20 bg-white text-ink hover:border-ink",
  garis: "border border-ink/25 text-ink hover:border-ink",
  kaca: "bg-white/90 text-ink backdrop-blur-xl",
};

const lingkaran: Record<Varian, string> = {
  gelap: "bg-white text-ink",
  terang: "bg-ink text-white",
  garis: "bg-ink text-white",
  kaca: "bg-ink text-white",
};

const dasarPill =
  "group inline-flex min-h-14 items-center justify-between gap-5 rounded-full py-2 pr-2 pl-6 text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-500 ease-halus hover:shadow-[0_16px_40px_rgba(0,0,0,0.14)]";

function Lingkaran({ varian, icon, putar }: { varian: Varian; icon?: ReactNode; putar?: boolean }) {
  return (
    <span
      className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-transform duration-500 ease-halus group-hover:scale-110 ${
        putar ? "group-hover:-rotate-45" : ""
      } ${lingkaran[varian]}`}
    >
      {icon ?? <IconArrowRight size={14} />}
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
      <span className="link-garis pb-0.5">{children}</span>
      <Lingkaran varian={varian} icon={icon} putar={!icon} />
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
      className={`${dasarPill} ${pill[varian]} cursor-pointer disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:shadow-none ${className}`}
      {...props}
    >
      <span className="pb-0.5">{children}</span>
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
