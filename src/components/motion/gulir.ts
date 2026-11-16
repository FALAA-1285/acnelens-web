/**
 * Satu sumber posisi scroll untuk semua efek (parallax, hero).
 *
 * Kenapa tidak cukup `window.addEventListener("scroll")`?
 * Lenis menggeser halaman lewat window.scrollTo() di dalam requestAnimationFrame.
 * Event scroll native untuk perubahan itu baru dikirim browser di frame BERIKUTNYA,
 * sehingga parallax selalu tertinggal satu frame dari isi halaman — terlihat
 * sebagai gambar yang "bergetar"/tersendat saat digulir. Dengan berlangganan ke
 * event scroll milik Lenis (dipancarkan sinkron tepat setelah posisi diubah),
 * semua transform dihitung di frame yang sama dengan scroll-nya.
 *
 * Bila Lenis tidak aktif (reduced motion, halaman tanpa <SmoothScroll>), modul ini
 * memakai event scroll native — yang memang dikirim sekali per frame, tepat
 * sebelum callback rAF, jadi tidak perlu rAF tambahan.
 */

type Pendengar = (y: number) => void;

const pendengar = new Set<Pendengar>();
let lenisAktif = 0;
let nativeTerpasang = false;

function siarkan(y: number) {
  for (const fn of pendengar) fn(y);
}

function onNativeScroll() {
  if (lenisAktif > 0) return;
  siarkan(window.scrollY);
}

/** Berlangganan posisi scroll. Mengembalikan fungsi untuk berhenti. */
export function pantauGulir(fn: Pendengar): () => void {
  pendengar.add(fn);
  if (!nativeTerpasang) {
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    nativeTerpasang = true;
  }
  return () => {
    pendengar.delete(fn);
    if (pendengar.size === 0 && nativeTerpasang) {
      window.removeEventListener("scroll", onNativeScroll);
      nativeTerpasang = false;
    }
  };
}

/**
 * Dipanggil <SmoothScroll>: selama Lenis hidup, posisi scroll diambil dari Lenis.
 * Mengembalikan fungsi { kirim, lepas }: `kirim` dipasang ke lenis.on("scroll").
 */
export function daftarkanLenis() {
  lenisAktif++;
  let lepas = false;
  return {
    kirim(y: number) {
      if (!lepas) siarkan(y);
    },
    lepas() {
      if (lepas) return;
      lepas = true;
      lenisAktif--;
    },
  };
}
