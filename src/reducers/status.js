import { START_GAME, UPDATE_STATUS, RESTART_GAME } from '../actions';

import { GameState, Victory } from '../constants';
const { STARTED, NOT_STARTED, FINISHED } = GameState;
const { UNKNOWN, LOST, WON } = Victory;

const initialState = {
    gameStatus: NOT_STARTED,
    victory: UNKNOWN
  };

export default function status(state = initialState, action) {
  switch(action.type){
    case UPDATE_STATUS:
      {
        let { grid } = action;

        if(grid.some((cell) => cell.hasMine && cell.isSwept)) {
          return {gameStatus:FINISHED, victory:LOST};
        } else if (grid.every((cell) => cell.isSwept || cell.hasMine)) {
          return {gameStatus:FINISHED, victory:WON};
        }
      }
    case START_GAME:
      return Object.assign({}, state, {
        gameStatus: STARTED
      })
    case RESTART_GAME:
      return Object.assign({}, state, {
        gameStatus: NOT_STARTED
      })
  }
  return state;
}
