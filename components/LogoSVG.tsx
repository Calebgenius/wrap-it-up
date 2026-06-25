interface LogoSVGProps {
  width?: number;
  dark?: boolean; // true = white text (for dark backgrounds)
}

export default function LogoSVG({ width = 160, dark = false }: LogoSVGProps) {
  const textColor = dark ? "#FFFFFF" : "#1E1A16";
  const gold = "#C9A96E";
  const h = Math.round(width * 0.55);

  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 320 176"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Wrap It Up logo"
      role="img"
    >
      {/* ── W letter ── */}
      <text
        x="30"
        y="82"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="96"
        fontWeight="400"
        fill={gold}
        letterSpacing="-2"
      >
        W
      </text>

      {/* ── U letter ── */}
      <text
        x="148"
        y="82"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="96"
        fontWeight="400"
        fill={textColor}
        letterSpacing="-2"
      >
        U
      </text>

      {/* ── Ribbon left loop ── */}
      <path
        d="M158 28 C140 8 110 2 100 18 C90 34 108 50 130 44 C148 40 158 28 163 18"
        stroke={gold}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── Ribbon right loop ── */}
      <path
        d="M168 28 C186 8 216 2 226 18 C236 34 218 50 196 44 C178 40 168 28 163 18"
        stroke={gold}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── Ribbon left tail (drapes over letters) ── */}
      <path
        d="M158 22 C150 38 138 56 118 80"
        stroke={gold}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── Ribbon right tail ── */}
      <path
        d="M168 22 C176 38 188 56 208 80"
        stroke={gold}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── Bow knot center ── */}
      <circle cx="163" cy="20" r="5" fill={gold} />

      {/* ── "wrap it up" wordmark ── */}
      <text
        x="160"
        y="130"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="28"
        fontWeight="400"
        fill={textColor}
        textAnchor="middle"
        letterSpacing="1"
      >
        wrap{" "}
        <tspan fill={gold}>it</tspan>
        {" "}up
      </text>

      {/* ── Gold divider line + heart ── */}
      <line x1="80" y1="142" x2="145" y2="142" stroke={gold} strokeWidth="0.8" />
      <text x="160" y="147" textAnchor="middle" fontSize="10" fill={gold}>♥</text>
      <line x1="175" y1="142" x2="240" y2="142" stroke={gold} strokeWidth="0.8" />

      {/* ── Slogan ── */}
      <text
        x="160"
        y="165"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="10"
        fontWeight="400"
        fill={dark ? "rgba(255,255,255,0.55)" : "#6B5F50"}
        textAnchor="middle"
        letterSpacing="2.5"
      >
        BEAUTIFULLY WRAPPED, THOUGHTFULLY GIVEN
      </text>
    </svg>
  );
}