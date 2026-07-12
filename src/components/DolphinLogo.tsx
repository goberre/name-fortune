type DolphinLogoProps = { size?: number; className?: string };

export default function DolphinLogo({ size = 32, className }: DolphinLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M5.5 19.2c-.9-4.6 3.2-8.8 8.6-9.4 2.4-.3 4.5-1.7 5.6-3.8 1.2 3 .1 6.4-2.6 8.1-2.4 1.5-5.6 1.6-8.1.3-1.4-.7-2.6.4-3.1 1.6-.7 1.7-2.1 3-3.7 3.2-1.1.1-1.6-.9-1.3-2.4l-.4.4z" />
      <path d="M13.1 9.8 15.9 6 17.4 10.2z" />
    </svg>
  );
}
