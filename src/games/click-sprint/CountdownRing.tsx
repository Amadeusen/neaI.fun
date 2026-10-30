/** A circular progress ring that empties as `progress` goes from 1 to 0. */
export function CountdownRing({ progress }: { progress: number }) {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
      <circle cx="50" cy="50" r="48" fill="none" stroke="rgb(0 0 0 / 0.08)" strokeWidth="3" />
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="var(--game-accent)"
        strokeWidth="3"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={1 - progress}
        className="transition-[stroke-dashoffset] duration-100 ease-linear"
      />
    </svg>
  );
}
