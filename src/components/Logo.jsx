import { Link } from 'react-router-dom';

export function LogoMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="62" height="62" rx="14" stroke="#B99A62" strokeOpacity=".55" />
      <path
        d="M32 14v34M21 48h22M15 24h34M15 24l-6 13h12zM49 24l-6 13h12z"
        stroke="#B99A62"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logo({ className = '' }) {
  return (
    <Link to="/" aria-label="Verdict Beach — home" className={`flex items-center gap-3 ${className}`}>
      <LogoMark />
      <span className="leading-none">
        <span className="block font-serif text-[17px] font-semibold uppercase tracking-[0.22em] text-ivory">Verdict Beach</span>
        <span className="mt-1.5 block text-[9px] font-medium uppercase tracking-[0.3em] text-gold">Belvo Ventures Group</span>
      </span>
    </Link>
  );
}
