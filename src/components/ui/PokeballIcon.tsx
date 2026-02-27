export default function PokeballIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="flex-shrink-0">
      <path d="M 5 50 A 45 45 0 0 1 95 50 Z" fill="white" opacity="0.9" />
      <path d="M 5 50 A 45 45 0 0 0 95 50 Z" fill="white" opacity="0.5" />
      <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="5" fill="none" />
      <line x1="5" y1="50" x2="95" y2="50" stroke="white" strokeWidth="5" />
      <circle cx="50" cy="50" r="12" fill="white" />
      <circle cx="50" cy="50" r="7" fill="rgba(255,107,107,0.8)" />
    </svg>
  );
}
