import type { Metadata } from "next";
import "@fontsource-variable/instrument-sans";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";

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
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
