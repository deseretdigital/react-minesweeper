import { createGameGrid, sweepLocation, sweepAll, toggleFlag } from '../utils/gameGrid';
import { START_GAME, CELL_CLICKED, RESTART_GAME, STOP_CLOCK} from '../types';

const initialState = [];

export default function grid(state = initialState, action) {
  switch (action.type) {
    case START_GAME:
      return createGameGrid(action.height, action.width, action.numMines);
    case CELL_CLICKED:
      if(action.event.shiftKey){
        return toggleFlag(state, action.cell.index);
      } else {
        return sweepLocation(state, action.cell.index);
      }
    case RESTART_GAME:
      return [];
    case STOP_CLOCK:
      return sweepAll(state);
   }
 return state;
}
