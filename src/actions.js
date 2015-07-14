import Reflux from 'reflux';

let actions = Reflux.createActions([
  'startGame',
  'sweepLocation',
  'toggleFlag',
  'restartGame',
  'startTimer',
  'stopTimer'
]);

export default actions;
