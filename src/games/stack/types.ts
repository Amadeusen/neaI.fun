export interface Block {
  x: number;
  y: number;
  width: number;
  depth: number;
}

export type Axis = "x" | "y";
export type Phase = "idle" | "playing" | "over";

export interface Debris extends Block {
  id: number;
  /** World z of the layer this piece broke off from. */
  bottom: number;
  /** Screen-space fall trajectory, chosen once when the piece is created. */
  fallX: number;
  fallY: number;
  fallRotate: number;
}
