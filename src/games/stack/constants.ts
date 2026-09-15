/** Tunable gameplay and rendering constants, kept in one place. */

export const GAME_SIZE = 150;
export const BASE_SIZE = 92;
export const BLOCK_HEIGHT = 22;

export const BASE_SPEED = 90;
export const SPEED_STEP = 3.5;
export const MAX_SPEED = 220;
export const MIN_OVERLAP = 4;

export const CANVAS_W = 300;
export const CANVAS_H = 420;
export const VIEW_W = 190;
export const VIEW_H = (VIEW_W * CANVAS_H) / CANVAS_W;
export const VIEW_PAD = 24;

/** World x/y are stored in [0, GAME_SIZE]; geometry is projected centered on this. */
export const CENTER = GAME_SIZE / 2;

export const HUE_STEP = 5;
