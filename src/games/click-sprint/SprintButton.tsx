"use client";

import { useRef, useState, type PointerEvent } from "react";
import { useTimeouts } from "@/lib/useTimeouts";
import { cn } from "@/lib/utils";
import { CountdownRing } from "./CountdownRing";
import { ROUND_MS, type Phase } from "./useClickSprint";

const FLOATER_MS = 800;
const MAX_FLOATERS = 14;

interface Floater {
  id: number;
  x: number;
  y: number;
}

/**
 * The big round button, which is also the scoreboard: a large countdown
 * with the click count and best score underneath. Every press squishes the
 * button, sends out a ripple and floats a "+1" from where it was pressed.
 */
export function SprintButton({
  phase,
  clicks,
  msLeft,
  best,
  urgent,
  onTap,
}: {
  phase: Phase;
  clicks: number;
  msLeft: number;
  best: number | null;
  urgent: boolean;
  /** Returns true if the press counted. */
  onTap: () => boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const nextId = useRef(0);
  const later = useTimeouts();

  const press = (x: number, y: number) => {
    if (!onTap()) return;
    buttonRef.current?.animate(
      [{ transform: "scale(1)" }, { transform: "scale(0.92)" }, { transform: "scale(1)" }],
      { duration: 140, easing: "ease-out" },
    );
    const id = nextId.current++;
    setFloaters((f) => [...f.slice(-MAX_FLOATERS + 1), { id, x, y }]);
    later(() => setFloaters((f) => f.filter((p) => p.id !== id)), FLOATER_MS);
  };

  const onPointerDown = (e: PointerEvent) => {
    const rect = wrapRef.current!.getBoundingClientRect();
    press(e.clientX - rect.left, e.clientY - rect.top);
  };

  const pressCenter = () => {
    const rect = wrapRef.current!.getBoundingClientRect();
    press(rect.width / 2, rect.height / 3);
  };

  return (
    <div ref={wrapRef} className="relative grid size-[min(80vw,50dvh)] place-items-center">
      <CountdownRing progress={msLeft / ROUND_MS} />
      {phase === "running" && (
        <span key={clicks} className="ring-out pointer-events-none absolute inset-[6%] rounded-full border-4 border-accent" />
      )}

      <button
        ref={buttonRef}
        type="button"
        onPointerDown={onPointerDown}
        onKeyDown={(e) => {
          if ((e.key === " " || e.key === "Enter") && !e.repeat) {
            e.preventDefault();
            pressCenter();
          }
        }}
        disabled={phase === "done"}
        className="flex size-[88%] touch-manipulation flex-col items-center justify-center rounded-full bg-accent font-display text-white shadow-[0_10px_0_rgb(0_0_0/0.18)] select-none active:shadow-[0_5px_0_rgb(0_0_0/0.18)] disabled:opacity-60"
      >
        {phase === "idle" && (
          <>
            <span className="bob text-6xl leading-none font-bold sm:text-7xl">TAP</span>
            <span className="mt-1 text-lg opacity-80">to start</span>
          </>
        )}
        {phase !== "idle" && (
          <>
            <span
              className={cn(
                "text-[min(18vw,11dvh)] leading-none font-bold tabular-nums",
                urgent && "urgent text-[#ffe08a]",
              )}
            >
              {phase === "done" ? "Time!" : (msLeft / 1000).toFixed(1)}
            </span>
            <span key={clicks} className="bump mt-2 text-2xl font-semibold tabular-nums">
              {clicks} {clicks === 1 ? "click" : "clicks"}
            </span>
          </>
        )}
        {best !== null && <span className="mt-1 text-sm opacity-75">best {best}</span>}
      </button>

      {floaters.map((f) => (
        <span
          key={f.id}
          className="float-up pointer-events-none absolute font-display text-2xl font-bold text-accent"
          style={{ left: f.x, top: f.y - 20 }}
        >
          +1
        </span>
      ))}
    </div>
  );
}
