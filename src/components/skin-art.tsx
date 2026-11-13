import type { KelasId } from "@/lib/kelas";

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
