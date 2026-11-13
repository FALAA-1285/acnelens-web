/**
 * Pembatas laju sederhana (fixed window) di memori proses.
 *
 * Cukup untuk satu server/instance — mencegah satu klien membanjiri backend lewat
 * /api/predict. Kalau nanti di-deploy ke banyak instance, ganti dengan penyimpanan
 * bersama (mis. Redis) karena hitungan di sini tidak dibagi antar-instance.
 */
export function buatBatasLaju({ maks, jendelaMs }: { maks: number; jendelaMs: number }) {
  const catatan = new Map<string, { mulai: number; jumlah: number }>();

  return function periksa(kunci: string, sekarang = Date.now()) {
    // bersihkan entri kedaluwarsa supaya Map tidak terus membesar
    if (catatan.size > 5000) {
      for (const [k, v] of catatan) if (sekarang - v.mulai >= jendelaMs) catatan.delete(k);
    }

    const c = catatan.get(kunci);
    if (!c || sekarang - c.mulai >= jendelaMs) {
      catatan.set(kunci, { mulai: sekarang, jumlah: 1 });
      return { boleh: true, tungguDetik: 0 };
    }
    c.jumlah += 1;
    if (c.jumlah > maks) {
      return { boleh: false, tungguDetik: Math.ceil((c.mulai + jendelaMs - sekarang) / 1000) };
    }
    return { boleh: true, tungguDetik: 0 };
  };
}
