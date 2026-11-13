import Image from "next/image";
import { ViewTransition } from "react";

/**
 * Foto jurnal dengan nama view transition yang sama di kartu daftar dan di
 * halaman artikel, sehingga foto "membesar" mulus saat berpindah halaman.
 */
export function FotoJurnal({
  slug,
  src,
  sizes,
  className = "",
  priority = false,
  zoomHover = false,
}: {
  slug: string;
  src: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  zoomHover?: boolean;
}) {
  return (
    <ViewTransition name={`jurnal-${slug}`} share="morph" default="none">
      <div className={`relative overflow-hidden bg-mist ${className}`}>
        <Image
          src={src}
          alt=""
          fill
          priority={priority}
          sizes={sizes}
          className={`object-cover ${
            zoomHover ? "scale-110 transition-transform duration-[1.2s] ease-halus group-hover:scale-100" : ""
          }`}
        />
      </div>
    </ViewTransition>
  );
}
