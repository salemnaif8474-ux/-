// Subtle repeating gear motif used behind brand surfaces (splash, login hero)
// for visual depth — an inline SVG pattern so it stays CSP-safe and needs no
// external asset.
export function BrandPattern({ opacity = 0.08 }: { opacity?: number }) {
  return (
    <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <pattern id="brand-gear-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="white" strokeWidth="1.5" opacity={opacity}>
            <circle cx="20" cy="20" r="14" />
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * Math.PI) / 4;
              const x1 = 20 + Math.cos(angle) * 14;
              const y1 = 20 + Math.sin(angle) * 14;
              const x2 = 20 + Math.cos(angle) * 19;
              const y2 = 20 + Math.sin(angle) * 19;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
            <circle cx="90" cy="80" r="10" />
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i * Math.PI) / 3;
              const x1 = 90 + Math.cos(angle) * 10;
              const y1 = 80 + Math.sin(angle) * 10;
              const x2 = 90 + Math.cos(angle) * 14;
              const y2 = 80 + Math.sin(angle) * 14;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
          </g>
        </pattern>
        <radialGradient id="brand-hero-glow" cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor="var(--color-brand-600)" />
          <stop offset="100%" stopColor="var(--color-brand-800)" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#brand-hero-glow)" />
      <rect width="100%" height="100%" fill="url(#brand-gear-pattern)" />
    </svg>
  );
}
