import { cn } from "@/lib/utils";
import { PixelHeart } from "./PixelHeart";
import { BONUS_MS, LIVES, URGENT_MS } from "./useColorMatch";

/** Seconds with one decimal under ten, whole seconds above. */
function formatTime(ms: number): string {
  const s = ms / 1000;
  return s < 10 ? s.toFixed(1) : String(Math.ceil(s));
}

/**
 * The run's status bar: three pixel hearts, the clock (with a "+5s" popup
 * on every right answer, pulsing red when time runs low) and the level.
 */
export function Hud({
  lives,
  msLeft,
  bonusId,
  level,
}: {
  lives: number;
  msLeft: number;
  /** Changes on every bonus, to replay the "+5s" popup. */
  bonusId: number;
  level: number;
}) {
  const urgent = msLeft <= URGENT_MS;

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1" aria-label={`${lives} of ${LIVES} lives left`}>
        {Array.from({ length: LIVES }, (_, i) => (
          <PixelHeart
            key={`${i}-${i < lives}`}
            full={i < lives}
            className={cn("size-7", i >= lives && "shake")}
          />
        ))}
      </div>

      <span className="relative">
        <span
          className={cn(
            "pill min-w-20 justify-center",
            urgent && "urgent bg-[#ff4d6d] text-white",
          )}
        >
          ⏱ <strong className="tabular-nums">{formatTime(msLeft)}</strong>s
        </span>
        {bonusId > 0 && (
          <span
            key={bonusId}
            className="float-up pointer-events-none absolute top-0 left-1/2 font-display text-lg font-bold text-[#22a06b]"
          >
            +{BONUS_MS / 1000}s
          </span>
        )}
      </span>

      <span key={level} className="pill bump">
        Lv <strong>{level}</strong>
      </span>
    </div>
  );
}
