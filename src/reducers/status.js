import { START_GAME, UPDATE_STATUS, RESTART_GAME } from '../types';

import { GameState, Victory } from '../constants';
const { STARTED, NOT_STARTED, FINISHED } = GameState;
const { UNKNOWN, LOST, WON } = Victory;

const initialState = {
    gameStatus: NOT_STARTED,
    victory: UNKNOWN,
    message: "Have Fun!",
    mineCharacter: '',
  };

export default function status(state = initialState, action) {
  switch(action.type){
    case UPDATE_STATUS:
      {
        let { grid } = action;

        if(grid.some((cell) => cell.hasMine && cell.isSwept)) {
          return {gameStatus:FINISHED, victory:LOST, message:"You Lost!", mineCharacter: '💥' };
        } else if (grid.every((cell) => cell.isSwept || cell.hasMine)) {
          return {gameStatus:FINISHED, victory:WON, message:"You Won!", mineCharacter: '🔻' };
        }
      }
    case START_GAME:
      return Object.assign({}, state, {
        gameStatus: STARTED
      })
    case RESTART_GAME:
      return Object.assign({}, state, {
        gameStatus: NOT_STARTED,
        victory: UNKNOWN
      })
  }
  return state;
}
