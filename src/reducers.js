import { START_GAME, SWEEP_LOCATION, START_CLOCK, STOP_CLOCK, CLOCK_TICK,
         RESET_CLOCK, UPDATE_STATUS, TOGGLE_FLAG, RESTART_GAME } from './actions';

import { setMineCounts, addMines, createGameGrid } from './utils/gameGrid';

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
  }
};

export function board(state = initialState.board, action) {
  switch (action.type) {
    case START_GAME:
     return Object.assign({}, state, {
       height: action.height,
       width: action.width,
       numMines: action.numMines,
       numRemainingFlags: action.numMines,
       grid: setMineCounts(addMines(createGameGrid(action.height, action.width), action.numMines))
     });
    case SWEEP_LOCATION:
      {
        let newGrid = sweepLocation(state.grid, action.position);
        return Object.assign({}, state, {
          grid: newGrid,
        })
      }
    case TOGGLE_FLAG:
      {
        let cell = state.grid[action.position]
        let newCell = Object.assign( {}, cell, {
          isFlagged: !cell.isFlagged
        });
        let { grid } = state;
        let newGrid = [
          ...grid.slice(0, action.position),
          newCell,
          ...grid.slice(action.position + 1)
        ]
        let newNumFlagsRemaining = getNumFlagsRemaining(0, {grid:newGrid});
        return Object.assign( {}, state, {
          grid: newGrid,
          numRemainingFlags: newNumFlagsRemaining
        });
      }
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


function sweepLocation(grid, x) {
  let cell = grid[x];
  cell.isSwept = true;

  let newGrid = [
    ...grid.slice(0, x),
    cell,
    ...grid.slice(x+1)
  ];

    if (cell.mineCounts === 0) {
    newGrid = sweepNeighbors(newGrid, x);
  }
  return newGrid;
}

function sweepNeighbors(grid, x) {
  let newGrid = grid;
  newGrid[x].neighbors.forEach((neighbor) => {
    let neighborCell = newGrid[neighbor]
    if (!neighborCell.hasMine
        && neighborCell.isSwept !== true
        && neighborCell.isFlagged !== true
    ) {
      newGrid = sweepLocation(grid, neighbor);
    }
  });
  return newGrid;
}


export function status(state = initialState.status, action) {
  let { grid } = action;
  switch(action.type){
    case UPDATE_STATUS:
      if(grid.some((cell) => cell.hasMine && cell.isSwept)) {
        return {gameStatus:FINISHED, victory:LOST};
      } else if (grid.every((cell) => cell.isSwept || cell.hasMine)) {
        return {gameStatus:FINISHED, victory:WON};
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
