export function Logo({ size = 56 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="32" r="30" fill="#9e1b24" />
        <path
          d="M32 12l4.8 9.7 10.7 1.6-7.7 7.5 1.8 10.6L32 36.3l-9.6 5.1 1.8-10.6-7.7-7.5 10.7-1.6L32 12z"
          fill="#ffffff"
        />
        <circle cx="32" cy="32" r="6.5" fill="#9e1b24" />
      </svg>
    </div>
  );
}
