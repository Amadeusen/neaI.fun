const TARGET = "#f2a541";
const SWATCHES = ["#4cc9a6", "#e5596b", TARGET, "#6c8cff", "#b07cff", "#9ad14b"];
const SIZE = 34;
const GAP = 9;
const GRID_X = (200 - (3 * SIZE + 2 * GAP)) / 2;
const GRID_Y = 112;

/** Home page tile art for Color Match (static SVG, no client JS). */
export function ColorMatchThumbnail() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
      {/* Target color card. */}
      <rect x="44" y="60" width="112" height="38" rx="10" fill="rgb(0 0 0 / 0.12)" transform="translate(0 3)" />
      <rect x="44" y="60" width="112" height="38" rx="10" fill={TARGET} />

      {SWATCHES.map((color, i) => {
        const x = GRID_X + (i % 3) * (SIZE + GAP);
        const y = GRID_Y + Math.floor(i / 3) * (SIZE + GAP);
        const isMatch = color === TARGET;
        return (
          <g
            key={color}
            className={isMatch ? "origin-center transition-transform duration-300 [transform-box:fill-box] group-hover:scale-110" : undefined}
          >
            <rect x={x} y={y + 3} width={SIZE} height={SIZE} rx="8" fill="rgb(0 0 0 / 0.12)" />
            <rect x={x} y={y} width={SIZE} height={SIZE} rx="8" fill={color} />
            {isMatch && (
              <>
                <rect x={x - 4} y={y - 4} width={SIZE + 8} height={SIZE + 8} rx="11" fill="none" stroke="#111" strokeWidth="3" />
                <path
                  d={`M${x + 10} ${y + 18} l6 6 l11 -12`}
                  fill="none"
                  stroke="#fff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}
          </g>
        );
      })}

      {/* Sparkles around the match. */}
      <g fill="#fff" className="opacity-70 transition-opacity duration-300 group-hover:opacity-100">
        <path d="M156 100 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 Z" />
        <path d="M100 104 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5 Z" />
      </g>

      {/* Cursor pointing at the match. */}
      <path
        d="M0 0 L0 26 L7 20 L12 31 L17 29 L12 18 L21 18 Z"
        transform="translate(134 140) rotate(-12)"
        fill="#fff"
        stroke="#111"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
