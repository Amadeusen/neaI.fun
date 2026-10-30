// 7 × 6 pixel heart; "X" is filled, "o" is the shine.
const PIXELS = [".XX.XX.", "XoXXXXX", "XXXXXXX", ".XXXXX.", "..XXX..", "...X..."];

/** A crisp pixel-art heart: red when `full`, grey once the life is lost. */
export function PixelHeart({ full, className }: { full: boolean; className?: string }) {
  const fill = full ? "#ff4d6d" : "#c9c5d6";
  const shade = full ? "#c9184a" : "#a8a3b8";

  return (
    <svg viewBox="0 0 7 6" className={className} shapeRendering="crispEdges" aria-hidden>
      {PIXELS.flatMap((row, y) =>
        [...row].map((cell, x) => {
          if (cell === ".") return null;
          const bottomEdge = y === PIXELS.length - 1 || PIXELS[y + 1][x] === ".";
          const color = cell === "o" && full ? "#fff" : bottomEdge ? shade : fill;
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />;
        }),
      )}
    </svg>
  );
}
