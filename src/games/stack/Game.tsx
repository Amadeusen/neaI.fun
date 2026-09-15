"use client";

import { useEffect, useRef, useState } from "react";
import { manifest } from "./manifest";
import { project, hexToHsl, hsl, pointsAttr, type Point } from "./projection";
import { StackBackground } from "./StackBackground";

const ACCENT = manifest.accentColor;
const [ACCENT_HUE, ACCENT_SAT, ACCENT_LIGHT] = hexToHsl(ACCENT);
const HUE_STEP = 5;

const GAME_SIZE = 150;
const BASE_SIZE = 92;
const BLOCK_HEIGHT = 22;
const BASE_SPEED = 90;
const SPEED_STEP = 3.5;
const MAX_SPEED = 220;
const MIN_OVERLAP = 4;

const CANVAS_W = 300;
const CANVAS_H = 420;
const VIEW_W = 190;
const VIEW_H = (VIEW_W * CANVAS_H) / CANVAS_W;
const VIEW_PAD = 24;
const CENTER = GAME_SIZE / 2;

interface Block {
  x: number;
  y: number;
  width: number;
  depth: number;
}

type Axis = "x" | "y";
type Phase = "idle" | "playing" | "over";

interface Debris extends Block {
  id: number;
  bottom: number;
}

function baseBlock(): Block {
  const offset = (GAME_SIZE - BASE_SIZE) / 2;
  return { x: offset, y: offset, width: BASE_SIZE, depth: BASE_SIZE };
}

function axisForIndex(index: number): Axis {
  return index % 2 === 1 ? "x" : "y";
}

function faces(block: Block, z0: number, z1: number) {
  const x0 = block.x - CENTER;
  const x1 = block.x + block.width - CENTER;
  const y0 = block.y - CENTER;
  const y1 = block.y + block.depth - CENTER;

  const b = project(x1, y0, z0);
  const c = project(x1, y1, z0);
  const d = project(x0, y1, z0);
  const e = project(x0, y0, z1);
  const f = project(x1, y0, z1);
  const g = project(x1, y1, z1);
  const h = project(x0, y1, z1);

  return {
    top: [e, f, g, h] as Point[],
    right: [b, f, g, c] as Point[],
    left: [c, d, h, g] as Point[],
  };
}

function blockPoints(block: Block, index: number): Point[] {
  const z0 = index * BLOCK_HEIGHT;
  const z1 = z0 + BLOCK_HEIGHT;
  const f = faces(block, z0, z1);
  return [...f.top, ...f.right, ...f.left];
}

function BlockMesh({
  block,
  index,
  opacity = 1,
}: {
  block: Block;
  index: number;
  opacity?: number;
}) {
  const z0 = index * BLOCK_HEIGHT;
  const z1 = z0 + BLOCK_HEIGHT;
  const f = faces(block, z0, z1);
  const hue = ACCENT_HUE + index * HUE_STEP;

  return (
    <g opacity={opacity}>
      <polygon points={pointsAttr(f.left)} fill={hsl(hue, ACCENT_SAT, ACCENT_LIGHT - 24)} />
      <polygon points={pointsAttr(f.right)} fill={hsl(hue, ACCENT_SAT, ACCENT_LIGHT - 6)} />
      <polygon points={pointsAttr(f.top)} fill={hsl(hue, ACCENT_SAT, ACCENT_LIGHT + 20)} />
    </g>
  );
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

  const drop = () => {
    if (phase !== "playing" || !current) return;
    const axis = axisRef.current;

    setBlocks((prev) => {
      const top = prev[prev.length - 1];
      const bottom = prev.length * BLOCK_HEIGHT;

      const buildPieces = (
        overlap: Block,
        leftoverA: Block | null,
        leftoverB: Block | null,
      ) => {
        const pieces: Debris[] = [];
        if (leftoverA) pieces.push({ ...leftoverA, id: debrisId.current++, bottom });
        if (leftoverB) pieces.push({ ...leftoverB, id: debrisId.current++, bottom });
        if (pieces.length) {
          setDebris((d) => [...d, ...pieces]);
          pieces.forEach((piece) => {
            window.setTimeout(() => {
              setDebris((d) => d.filter((p) => p.id !== piece.id));
            }, 450);
          });
        }
        return overlap;
      };

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
        const leftoverA =
          current.x < start
            ? { x: current.x, y: current.y, width: start - current.x, depth: current.depth }
            : null;
        const rightStart = start + overlap;
        const rightEnd = current.x + current.width;
        const leftoverB =
          rightEnd > rightStart
            ? { x: rightStart, y: current.y, width: rightEnd - rightStart, depth: current.depth }
            : null;

        const newBlock: Block = buildPieces(
          { x: start, y: top.y, width: overlap, depth: top.depth },
          leftoverA,
          leftoverB,
        );
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
      const leftoverA =
        current.y < start
          ? { x: current.x, y: current.y, width: current.width, depth: start - current.y }
          : null;
      const farStart = start + overlap;
      const farEnd = current.y + current.depth;
      const leftoverB =
        farEnd > farStart
          ? { x: current.x, y: farStart, width: current.width, depth: farEnd - farStart }
          : null;

      const newBlock: Block = buildPieces(
        { x: top.x, y: start, width: top.width, depth: overlap },
        leftoverA,
        leftoverB,
      );
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
    naturalHeight <= VIEW_H
      ? naturalMinY - (VIEW_H - naturalHeight) / 2
      : naturalMinY;

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
          {blocks.map((block, i) => (
            <BlockMesh key={i} block={block} index={i} />
          ))}

          {debris.map((d) => (
            <g key={d.id} className="debris-fall-3d">
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
