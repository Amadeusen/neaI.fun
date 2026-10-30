/** Tunable gameplay and rendering constants, kept in one place. */

export const GAME_SIZE = 150;
export const BASE_SIZE = 92;
export const BLOCK_HEIGHT = 22;

export const BASE_SPEED = 90;
export const SPEED_STEP = 3.5;
export const MAX_SPEED = 220;
export const MIN_OVERLAP = 4;

/** Width of the world slice the camera shows; its height follows the stage's aspect ratio. */
export const VIEW_W = 270;
export const VIEW_PAD = 24;
/** Stage aspect ratio (width / height) used before the real size is measured. */
export const DEFAULT_ASPECT = 300 / 420;

/** World x/y are stored in [0, GAME_SIZE]; geometry is projected centered on this. */
export const CENTER = GAME_SIZE / 2;

export const HUE_STEP = 5;
