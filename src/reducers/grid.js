import { createGameGrid, sweepLocation } from '../utils/gameGrid';
import { START_GAME, SWEEP_LOCATION, TOGGLE_FLAG, RESTART_GAME } from '../actions';

const initialState = [];

export default function grid(state = initialState, action) {
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
    case RESTART_GAME:
      return [];
   }
 return state;
}
