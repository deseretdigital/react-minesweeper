import React from 'react';
import Cell from './Cell';
import Scoreboard from './Scoreboard';
import styles from '../styles.js';
import {GameState, Victory} from '../constants';

var Board = React.createClass({

  handleClickLocation(x, e) {
    let { board, status, toggleFlag, sweepLocation } = this.props;
    let gameOver = status.gameStatus === GameState.FINISHED;

    let { grid } = board;
    if (gameOver) {
      return;
    }
    let cell = grid[x];

    if (e.shiftKey) {
      toggleFlag(x);
    } else if (!cell.isFlagged) {
      sweepLocation(x);
    }
  },

  renderRow(rowIndex) {
    var cols = [];
    let { board, status } = this.props;
    let { grid } = board;

    var startIndex = rowIndex * board.width;
    var endIndex = startIndex + board.width;
    var gameOver = status.gameStatus === GameState.FINISHED;
    var cells = grid.slice(startIndex, endIndex);

    for (var cellIndex in cells) {
      let cell = cells[cellIndex];
      let mineCounts = cell.mineCounts || '';

      let cellContents = mineCounts;
      if (cell.hasMine) {
        cellContents = (board.gameStatus === Victory.LOST) ? '💥' : '🔻';
      }
      let blah = startIndex * 1 + cellIndex *1;
      cols.push((
        <Cell
          isSwept={gameOver || cell.isSwept}
          isFlagged={cell.isFlagged}
          clickHandler={(e) => this.handleClickLocation(blah,e)}
          key={'cell_' + cellIndex}
        >
          {cellContents}
        </Cell>
      ));
    }

    return (
      <section style={styles.row} key={'row_' + rowIndex}>
        {cols}
      </section>
    );
  },

  render() {
    let {board, status} = this.props;

    if (board.grid === []) {
      return <div></div>;
    }

    let gameLost = status.victory === Victory.LOST;
    let statusMessage = (<span>Have fun</span>);

    if (gameLost) {
      statusMessage = (
        <span>You lost!</span>
      );
    } else if (status.victory === Victory.WON) {
      statusMessage = (
        <span>You won!</span>
      );
    }

    let rows = [];
    for (let x = 0; x < board.height; ++x) {
      rows.push(this.renderRow(x));
    }

    let restartButton = '';
    if (status.gameStatus === GameState.FINISHED) {
      restartButton = (
        <button onClick={this.props.restartGame}>New Game</button>
      );
    }

    return (
      <div>
        <Scoreboard {...this.props}>
          {statusMessage}
        </Scoreboard>
        <main style={styles.board}>
          {rows}
        </main>
        {restartButton}
      </div>
    );
  }
});

export default Board;
