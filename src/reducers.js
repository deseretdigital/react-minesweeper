import { START_GAME, SWEEP_LOCATION, START_CLOCK, STOP_CLOCK, CLOCK_TICK,
         RESET_CLOCK, UPDATE_STATUS, TOGGLE_FLAG, RESTART_GAME } from './actions';

import { createGameGrid, sweepLocation } from './utils/gameGrid';

import { GameState, Victory } from './constants';
const { STARTED, NOT_STARTED, FINISHED } = GameState;
const { UNKNOWN, LOST, WON } = Victory;

const initialState = {
  board: {
    grid: [],
    height: 10,
    width: 10,
    numMines: 5,
    numRemainingFlags: 1,
  },
  clock: {
    id: null,
    elapsedTime: 0
  },
  status: {
    gameStatus: NOT_STARTED,
    victory: UNKNOWN
  },
  grid: []
};

export function board(state = initialState.board, action) {
  switch (action.type) {
    case START_GAME:
     return Object.assign({}, state, action, {
       numRemainingFlags: action.numMines,
     });
    case UPDATE_STATUS:
      return Object.assign({}, state, {
        numRemainingFlags: getNumFlagsRemaining(0, {grid:action.grid})
      });
  }
  return state;
}

export function grid(state = initialState.grid, action) {
  switch (action.type) {
    case START_GAME:
      return createGameGrid(action.height, action.width, action.numMines);
    case SWEEP_LOCATION:
      return sweepLocation(state, action.position);
    case TOGGLE_FLAG:
      return [
        ...state.slice(0, action.position),
        Object.assign( {}, state[action.position], {
          isFlagged: !state[action.position].isFlagged
        }),
        ...state.slice(action.position+1)
      ];
   }
 return state;
}

export function clock(state = initialState.clock, action) {
  switch (action.type) {
    case START_CLOCK:
      return Object.assign({}, state, {
       id: action.id
      });
    case STOP_CLOCK:
      return Object.assign({}, state, {
       id: null
      });
    case CLOCK_TICK:
      return Object.assign({}, state, {
        elapsedTime: state.elapsedTime + 1
      });
    case RESET_CLOCK:
      return Object.assign({}, state, {
        elapsedTime: 0
      });
  }
  return state;
}

export function status(state = initialState.status, action) {
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

function getNumFlagsRemaining(state, action) {
  let { grid } = action;
  return grid.reduce( (count, cell) => {
    if(cell.hasMine){ count++ }
    if(cell.isFlagged){ count-- }
    return count;
  }, 0)

}
