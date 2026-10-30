const COLOR_HUES = [350, 30, 50, 150, 215];
const TILTS = [-6, 4, -3, 5, -4];

/** "Color Match" with every letter of "Color" in its own slowly shifting hue. */
export function ColorMatchTitle() {
  return (
    <span className="flex items-baseline gap-2 font-display text-3xl leading-none font-bold sm:text-4xl" aria-hidden>
      <span className="hue-cycle flex">
        {"Color".split("").map((letter, i) => (
          <span
            key={i}
            className="inline-block"
            style={{ color: `hsl(${COLOR_HUES[i]} 85% 55%)`, transform: `rotate(${TILTS[i]}deg)` }}
          >
            {letter}
          </span>
        ))}
      </span>
      <span className="text-ink">Match</span>
    </span>
  );
}
