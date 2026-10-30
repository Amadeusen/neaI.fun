/** "Click Sprint" leaning forward, with speed lines and a cursor. */
export function ClickSprintTitle() {
  return (
    <span className="relative flex items-center gap-1.5" aria-hidden>
      <span className="flex flex-col gap-1">
        <span className="h-1 w-4 rounded-full bg-accent/40" />
        <span className="h-1 w-6 rounded-full bg-accent/70" />
        <span className="h-1 w-3 rounded-full bg-accent/40" />
      </span>
      <span className="-skew-x-12 font-display text-3xl leading-none font-bold sm:text-4xl">
        <span className="text-accent">Click</span>
        <span className="text-ink"> Sprint</span>
      </span>
      <svg viewBox="0 0 22 32" className="bob h-6 w-5 sm:h-7" aria-hidden>
        <path
          d="M1 1 L1 26 L8 20 L13 31 L18 29 L13 18 L21 18 Z"
          fill="#fff"
          stroke="#111"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
