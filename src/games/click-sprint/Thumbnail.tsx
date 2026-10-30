const ACCENT = "var(--tile-accent)";

/** Home page tile art for Click Sprint (static SVG, no client JS). */
export function ClickSprintThumbnail() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
      {/* Ripples spreading from the button. */}
      <circle cx="100" cy="122" r="66" fill="none" stroke={ACCENT} strokeWidth="3" opacity="0.12" />
      <circle cx="100" cy="122" r="55" fill="none" stroke={ACCENT} strokeWidth="3" opacity="0.25" />

      {/* The big button, pressed a little further on hover. */}
      <circle cx="100" cy="128" r="44" fill="rgb(0 0 0 / 0.18)" />
      <g className="transition-transform duration-150 group-hover:translate-y-1">
        <circle cx="100" cy="122" r="44" fill={ACCENT} />
        <ellipse cx="86" cy="104" rx="20" ry="11" fill="#fff" opacity="0.22" />
        <text
          x="100"
          y="128"
          textAnchor="middle"
          fill="#fff"
          fontSize="17"
          fontWeight="700"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          CLICK!
        </text>
      </g>

      {/* Floating +1s. */}
      <g fill={ACCENT} fontWeight="700" style={{ fontFamily: "var(--font-fredoka)" }}>
        <text x="148" y="80" fontSize="18" opacity="0.9">+1</text>
        <text x="36" y="96" fontSize="14" opacity="0.6">+1</text>
        <text x="160" y="118" fontSize="11" opacity="0.4">+1</text>
      </g>

      {/* Mouse cursor about to click. */}
      <path
        d="M0 0 L0 26 L7 20 L12 31 L17 29 L12 18 L21 18 Z"
        transform="translate(124 140) rotate(-12)"
        fill="#fff"
        stroke="#111"
        strokeWidth="2"
        strokeLinejoin="round"
        className="transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1"
      />

      {/* Timer chip. */}
      <rect x="22" y="160" width="46" height="20" rx="10" fill="#fff" opacity="0.85" />
      <text x="45" y="174" textAnchor="middle" fontSize="11" fontWeight="600" fill="#111">
        9.4s
      </text>
    </svg>
  );
}
