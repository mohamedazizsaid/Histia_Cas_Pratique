export function StolosLogo({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stylized "S" spiral inspired by Stolos branding */}
      <path
        d="M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24"
        stroke="url(#grad1)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M32 16C22.059 16 14 24.059 14 34s8.059 18 18 18"
        stroke="url(#grad2)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
      <path
        d="M32 24c-5.523 0-10 4.477-10 10s4.477 10 10 10"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M32 56c13.255 0 24-10.745 24-24S45.255 8 32 8"
        stroke="url(#grad3)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M32 48c8.837 0 16-7.163 16-16S40.837 16 32 16"
        stroke="url(#grad4)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <circle cx="32" cy="34" r="3" fill="white" />
      <defs>
        <linearGradient id="grad1" x1="8" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="grad2" x1="14" y1="16" x2="32" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ddd6fe" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="grad3" x1="32" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a78bfa" />
          <stop offset="1" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="grad4" x1="32" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
