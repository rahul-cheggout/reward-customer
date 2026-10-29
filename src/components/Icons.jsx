import React from 'react';

const commonStroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};

export function MobileIcon() {
  return (
    <svg viewBox="0 0 24 24" {...commonStroke}>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </svg>
  );
}

export function OtpKeypadIcon() {
  return (
    <svg viewBox="0 0 24 24" {...commonStroke}>
      <rect x="3.4" y="5.4" width="17.2" height="13.2" rx="2.5" />
      <path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
    </svg>
  );
}

export function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" {...commonStroke}>
      <circle cx="12" cy="12" r="8.8" />
      <path d="m8.2 12.3 2.7 2.7 5-5.3" />
    </svg>
  );
}

export function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" {...commonStroke}>
      <path d="M12 2.8 4.6 5.9v6.2c0 4.3 3 8 7.4 9.1 4.4-1.1 7.4-4.8 7.4-9.1V5.9L12 2.8Z" />
      <path d="m9.2 12 2 2 3.6-3.8" />
    </svg>
  );
}

export function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" {...commonStroke}>
      <path d="M4.5 12h14.6" />
      <path d="m13 5.6 6.1 6.4-6.1 6.4" />
    </svg>
  );
}

export function LoginArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" {...commonStroke}>
      <path d="M14.2 3.5H18a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-3.8" />
      <path d="m9.6 8.4 3.6 3.6-3.6 3.6" />
      <path d="M13.2 12H3.6" />
    </svg>
  );
}

export function AlertCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" {...commonStroke}>
      <circle cx="12" cy="12" r="8.8" />
      <path d="M12 7.6v5" />
      <path d="M12 16.2h.01" />
    </svg>
  );
}

export function FeatureCardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
      <path d="M2.5 10.2h19" />
      <path d="M6 14.5h4" />
    </svg>
  );
}

export function FeatureBankIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 4l9 6.5" />
      <path d="M4.5 10.5v9M8.5 10.5v9M15.5 10.5v9M19.5 10.5v9" />
      <path d="M2.5 19.5h19" />
    </svg>
  );
}

export function FeatureGiftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="9" width="19" height="11.5" rx="2" />
      <path d="M2.5 13.5h19M12 9v11.5" />
      <path d="M12 9c0-2.2-1-3.6-2.6-3.6a1.8 1.8 0 1 0 0 3.6H12Z" />
      <path d="M12 9c0-2.2 1-3.6 2.6-3.6a1.8 1.8 0 1 1 0 3.6H12Z" />
    </svg>
  );
}

export function FeatureFlashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 3 4.5 13.5h6L11 21l8.5-10.5h-6L13 3Z" />
    </svg>
  );
}

export function HeroDecorativeSvg() {
  return (
    <svg className="auth-bg" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="heroGlow">
          <stop offset="0%" stopColor="#d4af37" stopOpacity=".30" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </radialGradient>
        <pattern id="heroDots" width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="#d4af37" opacity=".55" />
        </pattern>
      </defs>
      <rect width="600" height="800" fill="url(#heroDots)" />
      <circle cx="70" cy="110" r="240" fill="url(#heroGlow)" />
      <circle cx="540" cy="690" r="270" fill="url(#heroGlow)" />
      <g fill="none" stroke="#d4af37" strokeOpacity=".28">
        <circle cx="520" cy="150" r="72" />
        <circle cx="520" cy="150" r="116" />
        <circle cx="70" cy="690" r="94" />
      </g>
      <g fill="#f5d576" fillOpacity=".55">
        <path d="M486 96c1.4 5.6 3.4 7.6 9 9-5.6 1.4-7.6 3.4-9 9-1.4-5.6-3.4-7.6-9-9 5.6-1.4 7.6-3.4 9-9Z" />
        <path d="M132 268c1 4.2 2.6 5.7 6.8 6.8-4.2 1-5.7 2.6-6.8 6.8-1-4.2-2.6-5.7-6.8-6.8 4.2-1 5.7-2.6 6.8-6.8Z" />
        <path d="M556 452c1.2 4.8 2.9 6.5 7.7 7.7-4.8 1.2-6.5 2.9-7.7 7.7-1.2-4.8-2.9-6.5-7.7-7.7 4.8-1.2 6.5-2.9 7.7-7.7Z" />
        <path d="M74 470c.9 3.6 2.2 4.9 5.8 5.8-3.6.9-4.9 2.2-5.8 5.8-.9-3.6-2.2-4.9-5.8-5.8 3.6-.9 4.9-2.2 5.8-5.8Z" />
      </g>
      <path d="M0 700c100-34 200-34 300 0s200 34 300 0v100H0Z" fill="#d4af37" fillOpacity=".10" />
      <path d="M0 742c100-30 200-30 300 0s200 30 300 0v58H0Z" fill="#d4af37" fillOpacity=".14" />
    </svg>
  );
}

export function FloatingChips() {
  return (
    <div className="auth-floats" aria-hidden="true">
      <span className="float-chip float-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
          <path d="M2.5 10h19" />
        </svg>
      </span>
      <span className="float-chip float-2">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3.6 2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L3.5 9.8l5.9-.9L12 3.6Z" />
        </svg>
      </span>
      <span className="float-chip float-3">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2.5" y="9" width="19" height="11.5" rx="2" />
          <path d="M2.5 13.5h19M12 9v11.5" />
        </svg>
      </span>
    </div>
  );
}

export function AuthRightGlowSvg() {
  return (
    <svg className="auth-right-bg" viewBox="0 0 480 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="formGlow">
          <stop offset="0%" stopColor="#111827" stopOpacity=".18" />
          <stop offset="100%" stopColor="#111827" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="440" cy="40" r="180" fill="url(#formGlow)" />
      <circle cx="30" cy="660" r="160" fill="url(#formGlow)" />
    </svg>
  );
}

export function CardChipSvg() {
  return (
    <svg viewBox="0 0 24 18" fill="none">
      <rect x="0.5" y="0.5" width="23" height="17" rx="3" fill="url(#chipGrad)" stroke="rgba(0,0,0,0.15)" />
      <path d="M8 0.5V17.5M16 0.5V17.5M0.5 6H23.5M0.5 12H23.5" stroke="rgba(0,0,0,0.18)" strokeWidth="0.6" />
      <defs>
        <linearGradient id="chipGrad" x1="0" y1="0" x2="24" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffe9b3" />
          <stop offset="1" stopColor="#d4af5a" />
        </linearGradient>
      </defs>
    </svg>
  );
}
