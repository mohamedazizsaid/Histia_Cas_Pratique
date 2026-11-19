export function StolosLogo({
  className = "h-20 w-20",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft shadow under elements */}
        <filter id="chrome-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#090615" floodOpacity="0.65" />
        </filter>

        {/* Outer/top chrome gradient */}
        <linearGradient id="chrome-grad-1" x1="25%" y1="10%" x2="75%" y2="85%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#EDE8FC" />
          <stop offset="55%" stopColor="#C4B7EE" />
          <stop offset="85%" stopColor="#8777C2" />
          <stop offset="100%" stopColor="#5B4A98" />
        </linearGradient>

        {/* Middle chrome gradient */}
        <linearGradient id="chrome-grad-2" x1="15%" y1="20%" x2="80%" y2="80%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#EDE8FC" />
          <stop offset="60%" stopColor="#BBAEE8" />
          <stop offset="85%" stopColor="#7E6EB9" />
          <stop offset="100%" stopColor="#554490" />
        </linearGradient>

        {/* Bottom-right chrome gradient */}
        <linearGradient id="chrome-grad-3" x1="75%" y1="35%" x2="30%" y2="90%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#ECE7FC" />
          <stop offset="60%" stopColor="#B3A5E5" />
          <stop offset="85%" stopColor="#7B6BB7" />
          <stop offset="100%" stopColor="#50408A" />
        </linearGradient>

        {/* Highlight sheen lines */}
        <linearGradient id="chrome-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* 3D Sphere radial gradients */}
        <radialGradient id="sphere-grad" cx="36%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#F5F2FF" />
          <stop offset="70%" stopColor="#BCB0EE" />
          <stop offset="90%" stopColor="#8A79C6" />
          <stop offset="100%" stopColor="#62519E" />
        </radialGradient>
      </defs>

      {/* Group with filter shadow */}
      <g filter="url(#chrome-shadow)">
        {/* ARM 3: Bottom crescent swooping from right sphere (84, 46) to bottom left (44, 78) */}
        <path
          d="M 83 48 C 88 66 79 84 65 91 C 53 96 40 92 34 84 C 40 88 52 90 62 85 C 74 79 81 64 76 48 Z"
          fill="url(#chrome-grad-3)"
        />
        <path
          d="M 82 50 C 85 64 78 78 66 84 C 56 89 44 87 36 82"
          stroke="url(#chrome-sheen)"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* ARM 2: Middle crescent from left sphere (32, 28) around to center-bottom (70, 68) */}
        <path
          d="M 33 28 C 26 42 27 60 38 72 C 48 82 62 82 72 74 C 61 78 48 76 40 68 C 32 58 31 43 36 29 Z"
          fill="url(#chrome-grad-2)"
        />
        <path
          d="M 34 30 C 29 44 30 60 39 70 C 47 78 59 78 69 73"
          stroke="url(#chrome-sheen)"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* ARM 1: Top-most crescent from top sphere (64, 15) curving down and around (44, 52) */}
        <path
          d="M 64 15 C 48 16 36 28 34 44 C 32 54 37 63 46 68 C 40 62 37 54 39 46 C 41 33 50 23 64 21 Z"
          fill="url(#chrome-grad-1)"
        />
        <path
          d="M 62 17 C 49 18 39 29 37 43 C 35 52 39 60 45 65"
          stroke="url(#chrome-sheen)"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* 3D Chrome Spheres at tip of each arm */}
        {/* Top Sphere */}
        <circle cx="64" cy="16" r="6" fill="url(#sphere-grad)" />
        <circle cx="62.5" cy="14.5" r="1.8" fill="#FFFFFF" opacity="0.85" />

        {/* Left Sphere */}
        <circle cx="32" cy="28" r="5" fill="url(#sphere-grad)" />
        <circle cx="30.8" cy="26.8" r="1.5" fill="#FFFFFF" opacity="0.85" />

        {/* Right Sphere */}
        <circle cx="83" cy="46" r="7" fill="url(#sphere-grad)" />
        <circle cx="81.2" cy="44.2" r="2.2" fill="#FFFFFF" opacity="0.85" />
      </g>
    </svg>
  );
}

// 2D Minimalist Stolos Icon for Email & Small Headers
export function StolosIconMinimal({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="7" r="2" fill="white" />
      <circle cx="23" cy="16" r="2" fill="white" />
      <path
        d="M 16 7 C 10 7 6 12 6 17 C 6 22 10 26 16 26 C 21 26 24 23 25 19"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 11 12 C 9 14 9 17 11 20 C 13 22 16 23 19 22"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeOpacity="0.6"
        fill="none"
      />
    </svg>
  );
}
