"use client";

import { useEffect, useRef, useState } from "react";
import { StackBackground } from "./StackBackground";
import { Ground } from "./Ground";
import { BlockMesh } from "./BlockMesh";
import { blockPoints, blockScreenCenter } from "./geometry";
import {
  BASE_SIZE,
  BASE_SPEED,
  BLOCK_HEIGHT,
  CANVAS_H,
  CANVAS_W,
  GAME_SIZE,
  MAX_SPEED,
  MIN_OVERLAP,
  SPEED_STEP,
  VIEW_H,
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

export default function Stack() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [blocks, setBlocks] = useState<Block[]>([baseBlock()]);
  const [current, setCurrent] = useState<Block | null>(null);
  const [debris, setDebris] = useState<Debris[]>([]);

  const axisRef = useRef<Axis>("x");
  const dirRef = useRef<1 | -1>(1);
  const speedRef = useRef(BASE_SPEED);
  const posRef = useRef(0);
  const sizeRef = useRef(BASE_SIZE);
  const blockRef = useRef<Block>(baseBlock());
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const debrisId = useRef(0);

  const stopLoop = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    lastTsRef.current = null;
  };

  useEffect(() => stopLoop, []);

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
    setBlocks([base]);
    speedRef.current = BASE_SPEED;
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
    if (phase !== "playing" || !current) return;
    const axis = axisRef.current;

    setBlocks((prev) => {
      const top = prev[prev.length - 1];
      const layerIndex = prev.length;

      if (axis === "x") {
        const start = Math.max(current.x, top.x);
        const end = Math.min(current.x + current.width, top.x + top.width);
        const overlap = end - start;
        if (overlap <= MIN_OVERLAP) {
          stopLoop();
          setCurrent(null);
          setPhase("over");
          return prev;
        }
        const pieces: Block[] = [];
        if (current.x < start) {
          pieces.push({ x: current.x, y: current.y, width: start - current.x, depth: current.depth });
        }
        const rightStart = start + overlap;
        const rightEnd = current.x + current.width;
        if (rightEnd > rightStart) {
          pieces.push({ x: rightStart, y: current.y, width: rightEnd - rightStart, depth: current.depth });
        }
        spawnDebris(pieces, layerIndex);

        const newBlock: Block = { x: start, y: top.y, width: overlap, depth: top.depth };
        speedRef.current = Math.min(MAX_SPEED, speedRef.current + SPEED_STEP);
        spawnNext(newBlock, prev.length + 1);
        return [...prev, newBlock];
      }

      const start = Math.max(current.y, top.y);
      const end = Math.min(current.y + current.depth, top.y + top.depth);
      const overlap = end - start;
      if (overlap <= MIN_OVERLAP) {
        stopLoop();
        setCurrent(null);
        setPhase("over");
        return prev;
      }
      const pieces: Block[] = [];
      if (current.y < start) {
        pieces.push({ x: current.x, y: current.y, width: current.width, depth: start - current.y });
      }
      const farStart = start + overlap;
      const farEnd = current.y + current.depth;
      if (farEnd > farStart) {
        pieces.push({ x: current.x, y: farStart, width: current.width, depth: farEnd - farStart });
      }
      spawnDebris(pieces, layerIndex);

      const newBlock: Block = { x: top.x, y: start, width: top.width, depth: overlap };
      speedRef.current = Math.min(MAX_SPEED, speedRef.current + SPEED_STEP);
      spawnNext(newBlock, prev.length + 1);
      return [...prev, newBlock];
    });
  };

  const handleActivate = () => {
    if (phase === "idle") start();
    else if (phase === "playing") drop();
  };

  const score = Math.max(0, blocks.length - 1);

  // Framing is derived only from placed blocks (never the live, oscillating
  // `current` block) so the camera holds still while a piece is in flight
  // and only resettles when a block actually lands.
  const lastPlaced = blocks[blocks.length - 1];
  const topIndex = phase === "playing" ? blocks.length : blocks.length - 1;
  const topPts = blockPoints(lastPlaced, topIndex);
  const topY = Math.min(...topPts.map((p) => p[1]));

  const basePts = blockPoints(blocks[0], 0);
  const baseBottomY = Math.max(...basePts.map((p) => p[1]));

  const naturalMinY = topY - VIEW_PAD;
  const naturalMaxY = baseBottomY + VIEW_PAD;
  const naturalHeight = naturalMaxY - naturalMinY;

  const viewMinY =
    naturalHeight <= VIEW_H ? naturalMinY - (VIEW_H - naturalHeight) / 2 : naturalMinY;

  const viewBox = `${-VIEW_W / 2} ${viewMinY} ${VIEW_W} ${VIEW_H}`;

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="font-mono text-sm text-neutral-500">Score {score}</p>

      <div
        role="button"
        tabIndex={0}
        onClick={handleActivate}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            handleActivate();
          }
        }}
        className="relative select-none overflow-hidden rounded-xl border border-black/10 outline-none dark:border-white/10"
        style={{ width: CANVAS_W, height: CANVAS_H }}
      >
        <StackBackground score={score} />

        <svg
          className="relative transition-[view-box] duration-150 ease-out"
          width={CANVAS_W}
          height={CANVAS_H}
          viewBox={viewBox}
        >
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

        {phase === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-[var(--game-accent)] px-6 py-2 font-semibold text-white shadow-lg">
              Tap to start
            </span>
          </div>
        )}

        {phase === "over" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 backdrop-blur-sm">
            <p className="text-lg font-semibold text-white">Tower of {score}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                start();
              }}
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-neutral-500">
        Click, tap, or press space to drop the block.
      </p>
    </div>
  );
}
