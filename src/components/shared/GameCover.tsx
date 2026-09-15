import { cn } from "@/lib/utils";

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function buildBlobs(seed: string) {
  const hash = hashSeed(seed);
  return Array.from({ length: 3 }, (_, i) => {
    const angleBits = (hash >> (i * 7)) & 0xff;
    const distBits = (hash >> (i * 5 + 2)) & 0xff;
    const sizeBits = (hash >> (i * 3 + 1)) & 0xff;
    const angle = (angleBits / 255) * Math.PI * 2;
    const dist = 12 + (distBits / 255) * 22;
    const radius = 20 + (sizeBits / 255) * 24;
    return {
      cx: 50 + Math.cos(angle) * dist,
      cy: 50 + Math.sin(angle) * dist,
      r: radius,
      opacity: 0.55 - i * 0.15,
    };
  });
}

/**
 * Deterministic, generative cover art for a game card/hero — no image assets
 * required, so every new game in the registry gets a unique cover for free.
 */
export function GameCover({
  seed,
  accentColor,
  emoji,
  className,
  emojiClassName = "text-4xl",
}: {
  seed: string;
  accentColor: string;
  emoji: string;
  className?: string;
  emojiClassName?: string;
}) {
  const blobs = buildBlobs(seed);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        className,
      )}
      style={{ backgroundColor: `${accentColor}1f` }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
        className="absolute inset-0 h-full w-full"
      >
        {blobs.map((blob, i) => (
          <circle
            key={i}
            cx={blob.cx}
            cy={blob.cy}
            r={blob.r}
            fill={accentColor}
            opacity={blob.opacity}
          />
        ))}
      </svg>
      <span className={cn("relative drop-shadow-sm", emojiClassName)}>
        {emoji}
      </span>
    </div>
  );
}
