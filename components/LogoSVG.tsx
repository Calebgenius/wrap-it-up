interface LogoSVGProps {
  width?: number;
  dark?: boolean;
}

export default function LogoSVG({ width = 160, dark = false }: LogoSVGProps) {
  const textColor = dark ? "#FFFFFF" : "#1E1A16";
  const mutedColor = dark ? "rgba(255,255,255,0.5)" : "#6B5F50";
  const gold = "#C9A96E";
  const h = Math.round(width * 1.05);

  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 320 336"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Wrap It Up logo"
      role="img"
    >
      {/* ── W (gold) using polygon path so font never breaks ── */}
      <polygon
        points="30,40 52,40 80,130 108,40 130,40 158,130 186,40 208,40 170,180 148,180 120,88 92,180 70,180"
        fill={gold}
      />

      {/* ── U (dark) using path ── */}
      <path
        d="M178 40 L200 40 L200 140 Q200 182 240 182 Q280 182 280 140 L280 40 L302 40 L302 142 Q302 200 240 200 Q178 200 178 142 Z"
        fill={textColor}
      />

      {/* ── Bow left loop ── */}
      <path
        d="M196 52 C178 22, 140 10, 118 26 C96 42, 100 68, 124 72 C150 76, 180 58, 196 48"
        stroke={gold} strokeWidth="6" fill={gold} fillOpacity="0.2"
        strokeLinecap="round" strokeLinejoin="round"
      />

      {/* ── Bow right loop ── */}
      <path
        d="M210 52 C228 22, 266 10, 288 26 C310 42, 306 68, 282 72 C256 76, 226 58, 210 48"
        stroke={gold} strokeWidth="6" fill={gold} fillOpacity="0.2"
        strokeLinecap="round" strokeLinejoin="round"
      />

      {/* ── Left ribbon tail draping over W ── */}
      <path
        d="M194 56 C178 84, 156 120, 130 162"
        stroke={gold} strokeWidth="5.5" fill="none" strokeLinecap="round"
      />

      {/* ── Right ribbon tail draping over U ── */}
      <path
        d="M212 56 C228 84, 250 120, 276 162"
        stroke={gold} strokeWidth="5.5" fill="none" strokeLinecap="round"
      />

      {/* ── Bow knot ── */}
      <circle cx="203" cy="50" r="9" fill={gold} />
      <circle cx="203" cy="50" r="4" fill="#E2C080" />

      {/* ── "wrap it up" wordmark ── */}
      {/* "wrap" */}
      <text x="30" y="252"
        fontFamily="Georgia, serif" fontSize="54" fontWeight="400"
        fill={textColor}>wrap</text>
      {/* "it" gold */}
      <text x="163" y="252"
        fontFamily="Georgia, serif" fontSize="54" fontWeight="400"
        fill={gold}> it</text>
      {/* "up" */}
      <text x="218" y="252"
        fontFamily="Georgia, serif" fontSize="54" fontWeight="400"
        fill={textColor}> up</text>

      {/* ── Divider lines + heart ── */}
      <line x1="30" y1="270" x2="140" y2="270" stroke={gold} strokeWidth="0.8" />
      <text x="160" y="276" textAnchor="middle" fontSize="12" fill={gold}>♥</text>
      <line x1="180" y1="270" x2="290" y2="270" stroke={gold} strokeWidth="0.8" />

      {/* ── Slogan line 1 ── */}
      <text x="160" y="298"
        fontFamily="Georgia, serif" fontSize="9.5" fontWeight="400"
        fill={mutedColor} textAnchor="middle" letterSpacing="2.8">
        BEAUTIFULLY WRAPPED,
      </text>
      {/* ── Slogan line 2 ── */}
      <text x="160" y="316"
        fontFamily="Georgia, serif" fontSize="9.5" fontWeight="400"
        fill={mutedColor} textAnchor="middle" letterSpacing="2.8">
        THOUGHTFULLY GIVEN
      </text>
    </svg>
  );
}