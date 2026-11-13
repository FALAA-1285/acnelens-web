import type { Metadata } from "next";
import { Halaman } from "@/components/motion/halaman";
import { CekKulit } from "@/components/cek/cek-kulit";
import { SmoothScroll } from "@/components/motion/smooth-scroll";

export const metadata: Metadata = {
  title: "Cek kulit",
};

export default function HalamanCek() {
  return (
    <Halaman>
      <SmoothScroll />
      <CekKulit />
    </Halaman>
  );
}
