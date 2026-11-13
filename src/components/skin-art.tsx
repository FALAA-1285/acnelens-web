import type { KelasId } from "@/lib/kelas";

// titik-titik pori pada ilustrasi kulit
const PORI = [
  [60, 80], [110, 60], [170, 95], [240, 70], [300, 110], [340, 60],
  [80, 150], [210, 140], [330, 170], [50, 230], [120, 260], [260, 240],
  [350, 250], [90, 330], [180, 320], [250, 350], [320, 330], [150, 210],
];

function Papula({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r * 1.7} fill="#e2a39c" opacity={0.35} />
      <circle cx={x} cy={y} r={r} fill="#de9a92" />
    </g>
  );
}

function Pustula({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r * 1.7} fill="#e7afa4" opacity={0.4} />
      <circle cx={x} cy={y} r={r} fill="#e3a598" />
      <circle cx={x} cy={y - r * 0.25} r={r * 0.42} fill="#faf1e2" />
    </g>
  );
}

/* Ilustrasi potongan kulit, dipakai sebagai pengganti foto */
export function KulitIlustrasi({
  className = "",
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      className={`block size-full ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <rect width="400" height="400" fill="#ead7c6" />
      {PORI.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={2.2} fill="#d6bea9" />
      ))}
      <Papula x={150} y={170} r={15} />
      <Pustula x={255} y={205} r={14} />
      <Papula x={200} y={285} r={10} />
    </svg>
  );
}

/* Ikon bulat untuk tiap kelas */
export function IkonKelas({ jenis, size = 150 }: { jenis: KelasId; size?: number }) {
  const latar = { papula: "#ead7c6", pustula: "#f0e2d4", non_acne: "#f2e6da" }[jenis];
  return (
    <svg width={size} height={size} viewBox="0 0 150 150" aria-hidden="true">
      <circle cx="75" cy="75" r="72" fill={latar} />
      {[[40, 45], [105, 40], [35, 100], [110, 108]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={2.2} fill="#d6bea9" />
      ))}
      {jenis === "papula" && <Papula x={75} y={75} r={18} />}
      {jenis === "pustula" && <Pustula x={75} y={75} r={18} />}
      {jenis === "non_acne" && (
        <>
          <circle cx="72" cy="70" r="2.2" fill="#dcc7b4" />
          <circle cx="90" cy="85" r="2" fill="#dcc7b4" />
          <circle cx="58" cy="88" r="2" fill="#dcc7b4" />
        </>
      )}
    </svg>
  );
}
