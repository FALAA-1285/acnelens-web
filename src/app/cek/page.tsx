import type { Metadata } from "next";
import { connection } from "next/server";
import { Halaman } from "@/components/motion/halaman";
import { CekKulit } from "@/components/cek/cek-kulit";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { modeDemo } from "@/lib/backend";

export const metadata: Metadata = {
  title: "Cek kulit",
};

export const instant = false;

export default async function HalamanCek() {
  await connection();
  return (
    <Halaman>
      <SmoothScroll />
      {/* mode demo diputuskan di server, dari konfigurasi yang sama dengan /api/predict */}
      <CekKulit demo={modeDemo()} />
    </Halaman>
  );
}
