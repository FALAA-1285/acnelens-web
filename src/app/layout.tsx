import type { Metadata } from "next";
import "@fontsource-variable/instrument-sans";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { Preloader } from "@/components/motion/preloader";

export const metadata: Metadata = {
  title: {
    default: "AcneLens",
    template: "%s · AcneLens",
  },
  description:
    "Klasifikasi jerawat papula, pustula, dan kulit normal dari foto kulit menggunakan SURF, HOG, dan SVM.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <head>
        {/* Tanpa JavaScript, animasi reveal tidak pernah dipicu — tampilkan kontennya langsung */}
        <noscript>
          <style>{`[data-reveal],[data-reveal="buka"]>*,[data-reveal] .baris>span{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full font-sans">
        <Preloader />
        {children}
      </body>
    </html>
  );
}
