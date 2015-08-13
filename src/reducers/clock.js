import { START_CLOCK, STOP_CLOCK, CLOCK_TICK, RESET_CLOCK } from '../actions';
const initialState = {
  id: null,
  elapsedTime: 0
};
function clock(state = initialState, action) {
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

export default clock
