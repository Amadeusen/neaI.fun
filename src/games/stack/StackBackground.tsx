function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpRgb(a: [number, number, number], b: [number, number, number], t: number): string {
  return `rgb(${Math.round(lerp(a[0], b[0], t))}, ${Math.round(lerp(a[1], b[1], t))}, ${Math.round(lerp(a[2], b[2], t))})`;
}

interface SkyStop {
  score: number;
  top: [number, number, number];
  bottom: [number, number, number];
}

// A generic day -> sunset -> night progression, original to this project.
const SKY_STOPS: SkyStop[] = [
  { score: 0, top: [138, 210, 255], bottom: [217, 241, 255] },
  { score: 14, top: [255, 176, 129], bottom: [255, 221, 168] },
  { score: 28, top: [82, 61, 122], bottom: [158, 104, 140] },
  { score: 45, top: [10, 12, 36], bottom: [30, 24, 62] },
];

function skyColors(score: number) {
  const s = Math.max(0, score);
  let lo = SKY_STOPS[0];
  let hi = SKY_STOPS[SKY_STOPS.length - 1];
  for (let i = 0; i < SKY_STOPS.length - 1; i += 1) {
    if (s >= SKY_STOPS[i].score && s <= SKY_STOPS[i + 1].score) {
      lo = SKY_STOPS[i];
      hi = SKY_STOPS[i + 1];
      break;
    }
  }
  if (s >= SKY_STOPS[SKY_STOPS.length - 1].score) {
    lo = hi = SKY_STOPS[SKY_STOPS.length - 1];
  }
  const span = hi.score - lo.score || 1;
  const t = Math.min(1, Math.max(0, (s - lo.score) / span));
  return { top: lerpRgb(lo.top, hi.top, t), bottom: lerpRgb(lo.bottom, hi.bottom, t) };
}

const STARS = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 53) % 100,
  y: (i * 37) % 65,
  size: 1 + (i % 3),
  o: 0.35 + ((i * 13) % 60) / 100,
}));

/**
 * Score-driven sky: clouds fading to a starry night as the tower climbs.
 * The ground itself is drawn separately, inside the tower's own <svg>
 * (see Ground.tsx), so it always aligns with the base regardless of camera
 * panning — this layer only ever needs to fill the canvas edge-to-edge.
 */
export function StackBackground({ score }: { score: number }) {
  const { top, bottom } = skyColors(score);
  const starOpacity = Math.min(1, Math.max(0, (score - 22) / 18));
  const cloudOpacity = Math.min(1, Math.max(0, 1 - score / 18));

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{ background: `linear-gradient(to bottom, ${top}, ${bottom})` }}
      />

      <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: starOpacity }}>
        {STARS.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, opacity: s.o }}
          />
        ))}
      </div>

      <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: cloudOpacity }}>
        <div
          className="landscape-drift absolute rounded-full bg-white/70 blur-md"
          style={{ width: 90, height: 30, left: "8%", top: "16%" }}
        />
        <div
          className="landscape-drift absolute rounded-full bg-white/55 blur-md"
          style={{ width: 70, height: 24, left: "55%", top: "28%", animationDelay: "-6s" }}
        />
        <div
          className="landscape-drift absolute rounded-full bg-white/45 blur-md"
          style={{ width: 56, height: 20, left: "76%", top: "10%", animationDelay: "-12s" }}
        />
      </div>
    </div>
  );
}
