const BLOBS = [
  { color: "#ff9f6b", top: "-10%", left: "-8%", size: "38vmax", delay: "0s" },
  { color: "#7c5cff", top: "10%", left: "60%", size: "42vmax", delay: "-8s" },
  { color: "#2dd4bf", top: "55%", left: "5%", size: "32vmax", delay: "-16s" },
];

/** Purely decorative, blurred abstract shapes anchored behind the page content. */
export function BackgroundOrnament() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          className="bg-blob absolute rounded-full opacity-[0.14] blur-3xl dark:opacity-[0.16]"
          style={{
            top: blob.top,
            left: blob.left,
            width: blob.size,
            height: blob.size,
            background: blob.color,
            animationDelay: blob.delay,
          }}
        />
      ))}
    </div>
  );
}
