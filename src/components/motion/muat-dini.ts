/**
 * Mulai mengunduh gambar `loading="lazy"` lebih awal — sekitar dua tinggi layar
 * sebelum terlihat.
 *
 * Jarak lazy-load bawaan browser berbeda-beda: Chrome cukup jauh, tetapi Safari
 * dan Firefox baru mengunduh saat gambar hampir masuk layar. Di Vercel, permintaan
 * pertama tiap ukuran gambar juga harus dioptimasi dulu di server, jadi gambar
 * sering baru muncul setelah area kosongnya sudah terlihat. Mengganti atribut
 * `loading` menjadi "eager" membuat browser langsung melanjutkan unduhan yang
 * sedang ditunda, tanpa mengubah src atau ukuran yang dipilih next/image.
 *
 * Gambar di bagian bawah halaman tetap malas dimuat sampai pengguna mendekat,
 * jadi muatan awal halaman tidak bertambah.
 */
const JARAK = "200% 0px 200% 0px";

export function muatGambarLebihAwal(akar: ParentNode = document): () => void {
  if (typeof IntersectionObserver === "undefined") return () => {};

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const img = entry.target as HTMLImageElement;
        img.loading = "eager";
        io.unobserve(img);
      }
    },
    { rootMargin: JARAK },
  );

  const amati = (root: ParentNode) => {
    root.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => io.observe(img));
  };
  amati(akar);

  // Gambar yang dirender belakangan (mis. setelah navigasi atau state berubah)
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node instanceof HTMLImageElement && node.loading === "lazy") io.observe(node);
        else amati(node);
      }
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });

  return () => {
    io.disconnect();
    mo.disconnect();
  };
}
