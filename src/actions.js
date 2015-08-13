/*
 * action types
 */

export const START_GAME = 'START_GAME';
export const SWEEP_LOCATION = 'SWEEP_LOCATION';
export const TOGGLE_FLAG = 'TOGGLE_FLAG';
export const RESTART_GAME = 'RESTART_GAME';
export const START_CLOCK = 'START_CLOCK';
export const STOP_CLOCK = 'STOP_CLOCK';
export const CLOCK_TICK = 'CLOCK_TICK';
export const RESET_CLOCK = 'RESET_CLOCK';
export const UPDATE_STATUS = 'UPDATE_STATUS';

/*
 * action creators
 */

export function startGame(height, width, numMines) {
  return { type: START_GAME, height, width, numMines };
}

export function stopClock(id) {
  return { type: STOP_CLOCK, id }
}

export function startClock(id) {
  return { type: START_CLOCK, id};
}

export function resetClock() {
  return { type: RESET_CLOCK }
}

export function clockTick() {
  return { type: CLOCK_TICK }
}

export function sweepLocation(position) {
  return { type: SWEEP_LOCATION, position }
}

export function toggleFlag(position) {
  return { type: TOGGLE_FLAG, position }
}

export function restartGame(position) {
  return { type: RESTART_GAME, position }
}

export function updateStatus(grid) {
  return { type: UPDATE_STATUS, grid }
}
