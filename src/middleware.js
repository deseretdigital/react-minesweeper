import { updateStatus } from './actions';

export function checkStatus({ getState }) {
  return (next) => (action) => {
    let returnValue = next(action);
    if (action.meta && action.meta.updateStatus) {
      next(updateStatus(getState().grid));
    }
    return returnValue;
  };
}
