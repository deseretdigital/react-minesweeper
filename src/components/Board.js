import React from 'react';
import Cell from './Cell';
import styles from '../styles.js';
import Actions from '../actions.js';
import Store from '../store.js';
import Reflux from 'reflux';

var Board = React.createClass({
  mixins: [Reflux.ListenerMixin],

  getInitialState() {
    let state = Store.getInitialState();
    state.numRemainingFlags = state.numMines;
    return state;
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
    }

    this.setState({
      gameOver,
      gameWon
    });
  },

  handleClickLocation(x, y, e) {
    if (this.state.gameOver) {
      return;
    }

    let cell = this.state.gameGrid[x][y];
    if (e.shiftKey) {
      this.toggleFlag(x, y);
    } else if (!cell.isFlagged) {
      Actions.sweepLocation(x, y);
    }
  },

  toggleFlag(x, y) {
    let { gameGrid } = this.state;
    gameGrid[x][y].isFlagged = !gameGrid[x][y].isFlagged;
    this.setState({gameGrid}, () => {
      this.setNumberRemainingFlags();
    });
  },

  isGameLost() {
    let { gameGrid } = this.state;

    for (let x = 0; x < gameGrid.length; ++x) {
      for (let y = 0; y < gameGrid[x].length; ++y) {
        if (gameGrid[x][y].isSwept && gameGrid[x][y].hasMine) {
          return true;
        }
      }
    }
    return false;
  },

  setNumberRemainingFlags() {
    let flaggedSpaces = this.state.gameGrid.reduce((count, row) => {
      return count + row.reduce((initCount, cell) => {
        if (cell.isFlagged) {
          initCount++;
        }
        return initCount;
      }, 0);
    }, 0);

    this.setState({'numRemainingFlags': this.state.numMines - flaggedSpaces});
  },

  didWeWin() {
    let sweptSpaces = this.state.gameGrid.reduce((count, row) => {
      return count + row.reduce((initCount, cell) => {
        if (cell.isSwept) {
          initCount++;
        }
        return initCount;
      }, 0);
    }, 0);

    let totalSpaces = this.props.width * this.props.height;
    return sweptSpaces === totalSpaces - this.props.numMines;
  },

  renderRow(rowIndex) {
    let gameLost = this.state.gameOver && !this.state.gameWon;
    var cols = [];
    let { gameGrid } = this.state;
    for (let x = 0; x < gameGrid[rowIndex].length; ++x) {
      let mineCounts = gameGrid[rowIndex][x].mineCounts || '';

      let cellContents = mineCounts;
      if (gameGrid[rowIndex][x].hasMine) {
        cellContents = (gameLost) ? '💥' : '🔻';
      }
      cols.push((
        <Cell
          isSwept={this.state.gameOver || gameGrid[rowIndex][x].isSwept}
          isFlagged={gameGrid[rowIndex][x].isFlagged}
          clickHandler={(e) => this.handleClickLocation(rowIndex, x, e)}
          key={'cell_' + x}
        >
          {cellContents}
        </Cell>
      ));
    }

    return (
      <tr style={styles.row} key={'row_' + rowIndex}>
        {cols}
      </tr>
    );
  },

  render() {
    if (this.state.gameGrid === null) {
      return <div></div>;
    }

    let gameLost = this.state.gameOver && !this.state.gameWon;
    let statusMessage = '';

    if (gameLost) {
      statusMessage = (
        <h1>You lost!</h1>
      );
    } else if (this.state.gameWon) {
      statusMessage = (
        <h1>You won!</h1>
      );
    }

    let rows = [];
    for (let x = 0; x < this.state.gameGrid.length; ++x) {
      rows.push(this.renderRow(x));
    }

    let restartButton = '';
    if (this.state.gameOver) {
      restartButton = (
        <button>New Game</button>
      );
    }

    return (
      <div>
        {statusMessage}
        <p>Flags left: {this.state.numRemainingFlags}</p>
        <table style={styles.board}>
          {rows}
        </table>
        {restartButton}
      </div>
    );
  }
});

export default Board;
