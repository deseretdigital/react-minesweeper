import { START_GAME, UPDATE_STATUS } from '../types';

const initialState = {
    height: 10,
    width: 10,
    numMines: 5,
    numRemainingFlags: 5,
  };

export default function board(state = initialState, action) {
  switch (action.type) {
    case START_GAME:
     return Object.assign({}, state, {
       height: action.height,
       width: action.width,
       numMines: action.numMines,
       numRemainingFlags: action.numMines,
     });
    case UPDATE_STATUS:
      return Object.assign({}, state, {
        numRemainingFlags: action.grid.reduce( (count, cell) => {
          if(cell.hasMine){ count++ }
          if(cell.isFlagged){ count-- }
          return count;
        }, 0)
      });
  }
  return state;
}
