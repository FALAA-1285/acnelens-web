import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy tanpa nonce (lihat panduan CSP Next.js).
 * - 'unsafe-inline' dibutuhkan skrip/gaya inline bawaan Next.js
 * - 'unsafe-eval' dan ws: hanya saat development (React dev tools & HMR)
 * - blob: untuk pratinjau foto yang diunggah, media-src untuk video hero
 * - connect-src 'self': browser hanya bicara ke /api/predict, bukan langsung ke backend
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "media-src 'self'",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // WebP saja: AVIF ~50% lebih lama di-encode (permintaan pertama tiap ukuran di
    // Vercel jadi lambat → gambar telat muncul) dan lebih berat di-decode browser
    // (decode saat scroll → tersendat). Lihat docs next/image `formats`.
    formats: ["image/webp"],
    minimumCacheTTL: 2592000, // 30 hari cache CDN Vercel untuk gambar yang dioptimasi
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" },
          // hanya berpengaruh saat situs diakses lewat HTTPS
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
