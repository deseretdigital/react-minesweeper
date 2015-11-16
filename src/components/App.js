import React, { Component, PropTypes } from 'react';
import Board from './Board';
import Scoreboard from './Scoreboard';
import NewGameControls from './NewGameControls';

import { connect } from 'react-redux';

import { startGame, cellClicked, clockTick, startClock, restartGame, stopClock } from '../actions';
import { GameState } from '../constants';
const NOT_STARTED = GameState.NOT_STARTED;


let renderBoard = (dispatch, board, statusMessage, gameStatus, mineCharacter, clock, grid) => {
  if(board.grid === []){
    return (<div></div>);
  }
  let restartButton = '';
  let cellClickedHandler = (cell, event) => {dispatch(handleClickAndHandleClock(cell, event))};
  if (gameStatus === GameState.FINISHED) {
    restartButton = (
        <button onClick={ () => dispatch(restartGame())}>New Game</button>
    );
    cellClickedHandler = () => {};
  }

  return (
    <div>
      <Scoreboard numRemainingFlags={board.numRemainingFlags} elapsedTime={clock.elapsedTime}>
        {statusMessage}
      </Scoreboard>

      <Board
        height={board.height}
        width={board.width}
        grid={grid}
        mineCharacter={mineCharacter}
        cellClickedHandler={cellClickedHandler}
      />

      {restartButton}
    </div>
  );
}


let App = ({ dispatch, board, status: {message: statusMessage, gameStatus, mineCharacter}, clock, grid }) => {

  if (gameStatus === NOT_STARTED) {
    return (
      <NewGameControls
        height = {board.height}
        width = {board.width}
        numMines = {board.numMines}
        dispatch = {dispatch}
        startGame = {startGame}
      />
    )
  } else {
    return renderBoard(dispatch, board, statusMessage, gameStatus, mineCharacter, clock, grid);
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

function handleClickAndHandleClock(cell, event){
  return function (dispatch, getState) {
    dispatch(cellClicked(cell, event));
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
