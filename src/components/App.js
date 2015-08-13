import React, { Component, PropTypes, findDOMNode } from 'react';
import Board from './Board';
import { connect } from 'react-redux';

import { startGame, sweepLocation, toggleFlag, clockTick, startClock, resetClock, restartGame, stopClock, updateStatus } from '../actions';
import { GameState } from '../constants';
const NOT_STARTED = GameState.NOT_STARTED;

class App extends Component {

  startNewGame(e) {
    e.preventDefault();

    let width = parseInt(findDOMNode(this.refs.width).value);
    let height = parseInt(findDOMNode(this.refs.height).value);
    let numMines = parseInt(findDOMNode(this.refs.numMines).value);

    this.props.dispatch(startGameAndUpdateStatus(height, width, numMines));
  }

  render() {
    if (this.props.status.gameStatus === NOT_STARTED) {
      return this.renderNewGameControls();
    } else {
      return this.renderBoard();
    }
  }

  renderNewGameControls() {
    let { board } = this.props;
    return (
      <div>
        <form onSubmit={this.startNewGame.bind(this)}>
          <p>
            <label>
              Width:{' '}
              <input type="number" min="1" max="20" defaultValue={board.width} ref="width" />
            </label>{' '}
            <label>
              Height:{' '}
              <input type="number" min="1" max="20" defaultValue={board.height} ref="height" />
            </label>
            <label>{' '}
              Num Mines:{' '}
              <input type="number" min="1" max="50" defaultValue={board.numMines} ref="numMines" />
            </label>{' '}
            <input type="submit" value="Start" />
          </p>
        </form>
      </div>
    );
  }

  renderBoard() {
    let { dispatch } = this.props;
    return (
      <div>
        <Board {...this.props}
          sweepLocation={ (position) => {dispatch(sweepLocationAndHandleClock(position))} }
          toggleFlag={ (position) => dispatch(toggleFlagAndUpdateStatus(position)) }
          restartGame= { () => dispatch(restartGame()) }
        />
      </div>
    );
  }
};

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function select(state) {
  return {
    board: state.board,
    clock: state.clock,
    status: state.status,
    grid: state.grid,
  };
}

function startGameAndUpdateStatus(height, width, numMines){
  return function(dispatch, getState){
    dispatch(startGame(height, width, numMines));
    dispatch(updateStatus(getState().grid));
  }
}

function sweepLocationAndUpdateStatus(position) {
  return function(dispatch, getState){
    dispatch(sweepLocation(position));
    dispatch(updateStatus(getState().grid));
  }
}

function toggleFlagAndUpdateStatus(position) {
  return function(dispatch, getState){
    dispatch(toggleFlag(position));
    if(!getState().clock.id){
      let intervalId = setInterval(() => dispatch(clockTick()), 1000);
      dispatch(startClock(intervalId));
    }
    dispatch(updateStatus(getState().grid));
  }
}

function sweepLocationAndHandleClock(position) {
  return function (dispatch, getState) {
      dispatch(sweepLocationAndUpdateStatus(position));
      if(!getState().clock.id){
        let intervalId = setInterval(() => dispatch(clockTick()), 1000);
        dispatch(startClock(intervalId));
      }
      if(getState().status.gameStatus === GameState.FINISHED){
        clearInterval(getState().clock.id);
        dispatch(stopClock());
      }
  };
}
export default connect(select)(App);
