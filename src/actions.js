import * as types from './types.js';

/*
 * action creators
 */

export function startGame(height, width, numMines) {
  return { type: types.START_GAME, height, width, numMines };
}

export function stopClock() {
  return { type: types.STOP_CLOCK, }
}

export function startClock(id) {
  return { type: types.START_CLOCK, id };
}

export function resetClock() {
  return { type: types.RESET_CLOCK }
}

export function clockTick() {
  return { type: types.CLOCK_TICK }
}

export function sweepLocation(position) {
  return { type: types.SWEEP_LOCATION, position, meta: {updateStatus: true} }
}

export function toggleFlag(position) {
  return { type: types.TOGGLE_FLAG, position, meta: {updateStatus: true} }
}

export function restartGame() {
  return { type: types.RESTART_GAME }
}

export function updateStatus(grid) {
  return { type: types.UPDATE_STATUS, grid }
}
