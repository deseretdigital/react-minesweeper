import React from 'react';
import Cell from './Cell';
import Scoreboard from './Scoreboard';
import styles from '../styles.js';
import Actions from '../actions.js';
import Store from '../store.js';
import Reflux from 'reflux';

var Board = React.createClass({
  mixins: [Reflux.ListenerMixin],

  getInitialState() {
    return Store.getInitialState();
  },

  componentDidMount() {
    this.listenTo(Store, this.onStoreUpdate);
  },

  onStoreUpdate(newStoreState) {
    this.setState(newStoreState, () => {
      this.isGameOver()
    });
  },

  isGameOver() {
    let gameLost = this.isGameLost();
    let gameWon = !gameLost && this.didWeWin();

    let gameOver = false;
    if (gameLost || gameWon) {
      gameOver = true;
      Actions.stopTimer();
    }

    this.setState({
      gameOver,
      gameWon
    });
  },

  handleClickLocation(x, e) {
    if (this.state.gameOver) {
      return;
    }
    if (this.state.gameTimer === 0) {
      Actions.startTimer();
    }
    let cell = this.state.gameGrid[x];

console.log(x, cell);
    if (e.shiftKey) {
      Actions.toggleFlag(x);
    } else if (!cell.isFlagged) {
      Actions.sweepLocation(x);
    }
  },

  isGameLost() {
    let { gameGrid } = this.state;

    for (let x = 0; x < gameGrid.length; ++x) {
      if (gameGrid[x].isSwept && gameGrid[x].hasMine) {
        return true;
      }
    }
    return false;
  },

  didWeWin() {
    let sweptSpaces = this.state.gameGrid.reduce((count, cell) => {
      if (cell.isSwept) {
        count++;
      }
      return count;
    }, 0);

    let totalSpaces = this.state.width * this.state.height;
    return sweptSpaces === totalSpaces - this.state.numMines;
  },

  renderRow(rowIndex) {
    let gameLost = this.state.gameOver && !this.state.gameWon;
    var cols = [];
    let { gameGrid } = this.state;

    var startIndex = rowIndex * this.state.height;
    var endIndex = startIndex + this.state.width;
    var cells = gameGrid.slice(startIndex, endIndex);

    for (var cellIndex in cells) {
      let cell = cells[cellIndex];
      let mineCounts = cell.mineCounts || '';

      let cellContents = mineCounts;
      if (cell.hasMine) {
        cellContents = (gameLost) ? '💥' : '🔻';
      }
      let blah = startIndex * 1 + cellIndex *1;
      cols.push((
        <Cell
          isSwept={this.state.gameOver || cell.isSwept}
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
    if (this.state.gameGrid === null) {
      return <div></div>;
    }

    let gameLost = this.state.gameOver && !this.state.gameWon;
    let statusMessage = (<span>Have fun</span>);

    if (gameLost) {
      statusMessage = (
        <span>You lost!</span>
      );
    } else if (this.state.gameWon) {
      statusMessage = (
        <span>You won!</span>
      );
    }

    let rows = [];
    for (let x = 0; x < this.state.height; ++x) {
      rows.push(this.renderRow(x));
    }

    let restartButton = '';
    if (this.state.gameOver) {
      restartButton = (
        <button onClick={Actions.restartGame}>New Game</button>
      );
    }

    return (
      <div>
        <Scoreboard>
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
