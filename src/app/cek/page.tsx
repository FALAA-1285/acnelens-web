import type { Metadata } from "next";
import { CekKulit } from "@/components/cek/cek-kulit";

export const metadata: Metadata = {
  title: "Cek kulit",
};

export default function HalamanCek() {
  return <CekKulit />;
}
