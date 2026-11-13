"use client";

import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { kirimFoto, type HasilPrediksi } from "@/lib/predict";
import { LangkahUnggah } from "./langkah-unggah";
import { LangkahAnalisis } from "./langkah-analisis";
import { LangkahHasil } from "./langkah-hasil";

export type Foto = { file: File; url: string };

type Tahap = "unggah" | "analisis" | "hasil";

const NOMOR_TAHAP: Record<Tahap, number> = { unggah: 1, analisis: 2, hasil: 3 };

export function CekKulit() {
  const [tahap, setTahap] = useState<Tahap>("unggah");
  const [foto, setFoto] = useState<Foto | null>(null);
  const [hasil, setHasil] = useState<HasilPrediksi | null>(null);
  const [selesai, setSelesai] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);

  const kontrol = useRef<AbortController | null>(null);
  const urlFoto = useRef<string | null>(null);

  // hapus object URL foto saat halaman ditinggalkan
  useEffect(() => {
    return () => {
      kontrol.current?.abort();
      if (urlFoto.current) URL.revokeObjectURL(urlFoto.current);
    };
  }, []);

  function pindah(t: Tahap) {
    setTahap(t);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function pilihFoto(file: File) {
    if (urlFoto.current) URL.revokeObjectURL(urlFoto.current);
    const url = URL.createObjectURL(file);
    urlFoto.current = url;
    setFoto({ file, url });
    setGalat(null);
  }

  function hapusFoto() {
    if (urlFoto.current) URL.revokeObjectURL(urlFoto.current);
    urlFoto.current = null;
    setFoto(null);
  }

  async function analisis() {
    if (!foto) return;

    const ctrl = new AbortController();
    kontrol.current = ctrl;
    setSelesai(false);
    setGalat(null);
    pindah("analisis");

    try {
      const res = await kirimFoto(foto.file, ctrl.signal);
      setHasil(res);
      setSelesai(true);
      // beri jeda sebentar supaya semua tahap terlihat selesai
      setTimeout(() => pindah("hasil"), 700);
    } catch (err) {
      if (ctrl.signal.aborted) return;
      console.error(err);
      setGalat("Gagal menghubungi server. Periksa koneksi lalu coba lagi.");
      pindah("unggah");
    }
  }

  function batal() {
    kontrol.current?.abort();
    pindah("unggah");
  }

  function ulang() {
    hapusFoto();
    setHasil(null);
    pindah("unggah");
  }

  return (
    <>
      <SiteHeader
        aktif="cek"
        kanan={
          <span className="inline-flex min-h-12 items-center rounded-full border border-[#dadada] px-5 text-[13px] font-semibold">
            Langkah {NOMOR_TAHAP[tahap]} dari 3
          </span>
        }
      />

      <main className="mx-auto max-w-[1280px] px-6 pt-12 pb-28">
        {tahap === "unggah" && (
          <LangkahUnggah
            foto={foto}
            galat={galat}
            onPilih={pilihFoto}
            onHapus={hapusFoto}
            onGalat={setGalat}
            onAnalisis={analisis}
          />
        )}

        {tahap === "analisis" && foto && (
          <LangkahAnalisis foto={foto} selesai={selesai} onBatal={batal} />
        )}

        {tahap === "hasil" && foto && hasil && (
          <LangkahHasil foto={foto} hasil={hasil} onUlang={ulang} />
        )}
      </main>
    </>
  );
}
