import { ViewTransition, type ReactNode } from "react";

/**
 * Bungkus isi setiap page.tsx (bukan layout) supaya perpindahan halaman
 * memakai transisi "halaman" — gayanya ada di globals.css (::view-transition-*).
 * Elemen bernama di dalamnya (mis. foto jurnal) tetap ber-morph sendiri.
 */
export function Halaman({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="halaman-masuk" exit="halaman-keluar" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
