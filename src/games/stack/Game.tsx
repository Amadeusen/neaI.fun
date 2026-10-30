"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useBestScore } from "@/lib/storage";
import { StackBackground } from "./StackBackground";
import { Ground } from "./Ground";
import { BlockMesh } from "./BlockMesh";
import { blockPoints, blockScreenCenter, sliceBlock } from "./geometry";
import { manifest } from "./manifest";
import {
  BASE_SIZE,
  BASE_SPEED,
  BLOCK_HEIGHT,
  DEFAULT_ASPECT,
  GAME_SIZE,
  MAX_SPEED,
  SPEED_STEP,
  VIEW_PAD,
  VIEW_W,
} from "./constants";
import type { Axis, Block, Debris, Phase } from "./types";

const DEBRIS_LIFETIME_MS = 550;

function baseBlock(): Block {
  const offset = (GAME_SIZE - BASE_SIZE) / 2;
  return { x: offset, y: offset, width: BASE_SIZE, depth: BASE_SIZE };
}

function axisForIndex(index: number): Axis {
  return index % 2 === 1 ? "x" : "y";
}

/** Picks a fall trajectory that drifts the piece away from the tower's center. */
function fallTrajectory(piece: Block, layerIndex: number) {
  const [screenX] = blockScreenCenter(piece, layerIndex);
  const side = screenX >= 0 ? 1 : -1;
  return {
    fallX: side * (18 + Math.random() * 16),
    fallY: 55 + Math.random() * 30,
    fallRotate: side * (16 + Math.random() * 22),
  };
}

/** Tracks an element's width / height ratio so the camera can fill any screen shape. */
function useAspectRatio<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [aspect, setAspect] = useState(DEFAULT_ASPECT);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setAspect(width / height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, aspect] as const;
}

export default function Stack() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [blocks, setBlocks] = useState<Block[]>([baseBlock()]);
  const [current, setCurrent] = useState<Block | null>(null);
  const [debris, setDebris] = useState<Debris[]>([]);
  const [stageRef, aspect] = useAspectRatio<HTMLDivElement>();
  const { best, submit } = useBestScore(manifest.slug);
  const [bestBeforeRun, setBestBeforeRun] = useState<number | null>(null);

  // The animation loop and input handlers read and write these refs directly,
  // so a drop always uses the block's exact position, even between renders.
  const blocksRef = useRef<Block[]>([baseBlock()]);
  const blockRef = useRef<Block>(baseBlock());
  const axisRef = useRef<Axis>("x");
  const dirRef = useRef<1 | -1>(1);
  const speedRef = useRef(BASE_SPEED);
  const posRef = useRef(0);
  const sizeRef = useRef(BASE_SIZE);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const debrisId = useRef(0);

  const stopLoop = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    lastTsRef.current = null;
  };

  useEffect(() => stopLoop, []);

  const placeBlocks = (next: Block[]) => {
    blocksRef.current = next;
    setBlocks(next);
  };

  const spawnNext = (prev: Block, index: number) => {
    const axis = axisForIndex(index);
    axisRef.current = axis;
    const dir: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
    dirRef.current = dir;
    const size = axis === "x" ? prev.width : prev.depth;
    sizeRef.current = size;
    posRef.current = dir === 1 ? 0 : GAME_SIZE - size;

    const block: Block =
      axis === "x"
        ? { x: posRef.current, y: prev.y, width: size, depth: prev.depth }
        : { x: prev.x, y: posRef.current, width: prev.width, depth: size };
    blockRef.current = block;
    setCurrent(block);
  };

  const tick = (ts: number) => {
    if (lastTsRef.current == null) lastTsRef.current = ts;
    const dt = (ts - lastTsRef.current) / 1000;
    lastTsRef.current = ts;

    let pos = posRef.current + dirRef.current * speedRef.current * dt;
    const maxPos = GAME_SIZE - sizeRef.current;
    if (pos <= 0) {
      pos = 0;
      dirRef.current = 1;
    } else if (pos >= maxPos) {
      pos = maxPos;
      dirRef.current = -1;
    }
    posRef.current = pos;

    const prev = blockRef.current;
    const block: Block = axisRef.current === "x" ? { ...prev, x: pos } : { ...prev, y: pos };
    blockRef.current = block;
    setCurrent(block);
    rafRef.current = requestAnimationFrame(tick);
  };

  const start = () => {
    stopLoop();
    setDebris([]);
    const base = baseBlock();
    placeBlocks([base]);
    speedRef.current = BASE_SPEED;
    setBestBeforeRun(best);
    spawnNext(base, 1);
    setPhase("playing");
    rafRef.current = requestAnimationFrame(tick);
  };

  /** Turns leftover (trimmed-off) pieces into falling debris that clears itself up. */
  const spawnDebris = (pieces: Block[], layerIndex: number) => {
    if (!pieces.length) return;
    const bottom = layerIndex * BLOCK_HEIGHT;
    const newPieces: Debris[] = pieces.map((piece) => ({
      ...piece,
      id: debrisId.current++,
      bottom,
      ...fallTrajectory(piece, layerIndex),
    }));
    setDebris((d) => [...d, ...newPieces]);
    newPieces.forEach((piece) => {
      window.setTimeout(() => {
        setDebris((d) => d.filter((p) => p.id !== piece.id));
      }, DEBRIS_LIFETIME_MS);
    });
  };

  const drop = () => {
    const placed = blocksRef.current;
    const top = placed[placed.length - 1];
    const result = sliceBlock(blockRef.current, top, axisRef.current);

    if (!result) {
      stopLoop();
      setCurrent(null);
      setPhase("over");
      submit(placed.length - 1);
      return;
    }

    spawnDebris(result.pieces, placed.length);
    placeBlocks([...placed, result.placed]);
    speedRef.current = Math.min(MAX_SPEED, speedRef.current + SPEED_STEP);
    spawnNext(result.placed, placed.length + 1);
  };

  const handleActivate = () => {
    if (phase === "idle") start();
    else if (phase === "playing") drop();
  };

  // Space bar works from anywhere on the page, no need to focus the stage.
  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (e.key !== " " || e.repeat) return;
    e.preventDefault();
    if (phase === "over") start();
    else handleActivate();
  });

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const score = Math.max(0, blocks.length - 1);
  const isNewBest = phase === "over" && score > (bestBeforeRun ?? 0);

  // Framing is derived only from placed blocks (never the live, oscillating
  // `current` block) so the camera holds still while a piece is in flight
  // and only resettles when a block actually lands.
  const viewH = VIEW_W / aspect;
  const lastPlaced = blocks[blocks.length - 1];
  const topIndex = phase === "playing" ? blocks.length : blocks.length - 1;
  const topY = Math.min(...blockPoints(lastPlaced, topIndex).map((p) => p[1]));
  const baseBottomY = Math.max(...blockPoints(blocks[0], 0).map((p) => p[1]));

  const naturalMinY = topY - VIEW_PAD;
  const naturalHeight = baseBottomY + VIEW_PAD - naturalMinY;
  const viewMinY =
    naturalHeight <= viewH ? naturalMinY - (viewH - naturalHeight) / 2 : naturalMinY;

  const viewBox = `${-VIEW_W / 2} ${viewMinY} ${VIEW_W} ${viewH}`;

  return (
    <div
      ref={stageRef}
      onPointerDown={(e) => {
        if (e.button === 0) handleActivate();
      }}
      className="relative h-full max-h-[780px] w-full max-w-[520px] touch-manipulation overflow-hidden rounded-[var(--radius-card)] select-none"
      aria-label="Stack game. Press space or tap to drop the block."
    >
      <StackBackground score={score} />

      <svg className="absolute inset-0 h-full w-full" viewBox={viewBox} aria-hidden>
        <Ground score={score} />

        {blocks.map((block, i) => (
          <BlockMesh key={i} block={block} index={i} />
        ))}

        {debris.map((d) => (
          <g
            key={d.id}
            className="debris-fall-3d"
            style={
              {
                "--fall-x": `${d.fallX}px`,
                "--fall-y": `${d.fallY}px`,
                "--fall-rotate": `${d.fallRotate}deg`,
              } as React.CSSProperties
            }
          >
            <BlockMesh block={d} index={Math.round(d.bottom / BLOCK_HEIGHT)} />
          </g>
        ))}

        {current && phase === "playing" && (
          <BlockMesh block={current} index={blocks.length} opacity={0.95} />
        )}
      </svg>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center pt-6">
        {phase !== "idle" && (
          <span className="font-display text-7xl leading-none font-bold text-white drop-shadow-[0_2px_6px_rgb(0_0_0/0.25)]">
            {score}
          </span>
        )}
      </div>

      {best !== null && (
        <span className="pill absolute top-3 right-3">
          Best <strong>{best}</strong>
        </span>
      )}

      {phase === "idle" && (
        <div className="overlay">
          <span className="btn">Tap to start</span>
          <p className="pill">Drop each block right on top of the last one</p>
        </div>
      )}

      {phase === "over" && (
        <div className="overlay overlay-dim">
          <p className="font-display text-3xl font-bold">
            {isNewBest ? "New best!" : "Tower down"}
          </p>
          <p className="text-white/80">
            {score} {score === 1 ? "block" : "blocks"} high
          </p>
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={start}
            className="btn btn-light mt-2"
          >
            Try again
          </button>
        </div>
      )}

      <p className="pointer-events-none absolute inset-x-0 bottom-3 hidden text-center text-xs text-ink/50 sm:block">
        Click, tap or press space
      </p>
    </div>
  );
}
