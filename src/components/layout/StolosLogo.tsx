import Image from "next/image";

export function StolosLogo({
  className = "h-20 w-20",
  priority = true,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/assets/stolos-logo.png"
      alt="Stolos"
      width={132}
      height={121}
      priority={priority}
      className={`${className} object-contain`}
    />
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
