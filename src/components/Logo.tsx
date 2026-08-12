export function Logo({ size = 56, spin = true }: { size?: number; spin?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        aria-hidden="true"
        className={spin ? "animate-logo-spin" : undefined}
      >
        <circle cx="32" cy="32" r="30" fill="#8f1d24" />
        <path
          fill="#ffffff"
          d="M12,29 C12,16 20,9 32,9 C44,9 52,16 52,29 L44,29 C44,20 38,16 32,16 C26,16 20,20 20,29 Z"
        />
        <path
          fill="#ffffff"
          d="M12,35 C12,48 20,55 32,55 C44,55 52,48 52,35 L44,35 C44,44 38,48 32,48 C26,48 20,44 20,35 Z"
        />
        <g stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round">
          <path d="M13,32 L18,29.3 L18,34.7 Z" fill="#ffffff" stroke="none" />
          <line x1="22" y1="29.5" x2="24.5" y2="34.5" />
          <line x1="28" y1="29.5" x2="30.5" y2="34.5" />
          <line x1="34" y1="29.5" x2="36.5" y2="34.5" />
          <line x1="40" y1="29.5" x2="42.5" y2="34.5" />
          <line x1="46" y1="29.5" x2="48.5" y2="34.5" />
        </g>
      </svg>
    </div>
  );
}
