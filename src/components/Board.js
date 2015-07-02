import React from 'react';
import Cell from './Cell';
import styles from '../styles.js';

var Board = React.createClass({
  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    numMines: React.PropTypes.number,
    onGameRestart: React.PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      height: 4,
      width: 4,
      numMines: 6,
    }
  },

  getInitialState() {
    return {
      gameGrid: this.makeGameGrid(),
      gameOver: false,
      gameWon: false
    }
  },

  makeGameGrid() {
    var grid = [];
    for (let x = 0; x < this.props.height; ++x) {
      grid.push([]);
      for (let y = 0; y < this.props.width; ++y) {
        grid[x].push({
          hasMine: false,
          isSwept: false,
          mineCounts: 0,
          isFlagged: false
        });
      }
    }

    this.addMines(grid);
    this.setMineCounts(grid);

    return grid;
  },

  setMineCounts(grid) {
    for (let x = 0; x < grid.length; ++x) {
      for (let y = 0; y < grid[x].length; ++y) {
        if (grid[x][y].hasMine) {
          let updatePositions = this.getNeighbors(x,y);
          updatePositions.forEach((position) => {
            grid[position[0]][position[1]].mineCounts++;
          });
        }
      }
    }
  },

  getNeighbors(x,y) {
    let positions = [];

    [1,0,-1].forEach((xMod) => {
      [1,0,-1].forEach((yMod) => {
        positions.push([x+xMod, y+yMod]);
      })
    });

    return positions.filter((position) => {
      return position[0] >= 0 && position[0] < this.props.height
        && position[1] >= 0 && position[1] < this.props.width;
    });
  },

  addMines(grid) {
    let minesToAdd = this.props.numMines;
    let numFreeSpaces = this.props.width * this.props.height;

    if (minesToAdd > numFreeSpaces) {
      minesToAdd = numFreeSpaces;
    }

    while (minesToAdd) {
      let x = this.getRandomNumber(0, this.props.width)
      let y = this.getRandomNumber(0, this.props.height);

      if (!grid[x][y].hasMine) {
        grid[x][y].hasMine = true;
        minesToAdd--;
      }
    }
  },

  getRandomNumber(min,max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },

  handleClickLocation(x, y, e) {
    let cell = this.state.gameGrid[x][y];
    if (e.shiftKey) {
      this.toggleFlag(x, y);
    } else if (!cell.isFlagged) {
      this.sweepLocation(x, y);
    }
  },

  toggleFlag(x, y) {
    let { gameGrid } = this.state;
    gameGrid[x][y].isFlagged = !gameGrid[x][y].isFlagged;
    this.setState({gameGrid});
  },

  isGameOver(x,y) {
    let { gameGrid } = this.state;

    let gameOver = this.state.gameOver;
    if (gameGrid[x][y].hasMine) {
      gameOver = true;
    }

    let gameWon = this.didWeWin();

    this.setState({gameOver, gameWon});
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

  sweepLocation(x, y) {
    let { gameGrid } = this.state;
    gameGrid[x][y].isSwept = true;

    if (gameGrid[x][y].mineCounts === 0) {
      this.sweepNeighbors(x,y);
    }

    this.setState({gameGrid}, () => {
      this.isGameOver(x,y);
    });
  },

  sweepNeighbors(x,y) {
    let { gameGrid } = this.state;
    let neighbors = this.getNeighbors(x, y);

    neighbors.forEach((neighbor) => {
      let [neighborX, neighborY] = neighbor;
      let neighborCell = gameGrid[neighborX][neighborY]
      if (!neighborCell.hasMine && neighborCell.isSwept !== true) {
        this.sweepLocation(neighborX, neighborY);
      }
    });
  },

  renderRow(width, rowIndex) {
    var cols = [];
    let { gameGrid } = this.state;
    for (let x = 0; x < width; ++x) {
      let mineCounts = gameGrid[rowIndex][x].mineCounts || '';

      cols.push((
        <Cell
          isSwept={this.state.gameOver || gameGrid[rowIndex][x].isSwept}
          isFlagged={gameGrid[rowIndex][x].isFlagged}
          clickHandler={(e) => this.handleClickLocation(rowIndex, x, e)}
          key={'cell_' + x}
        >
          {(gameGrid[rowIndex][x].hasMine)
            ? '💥' : mineCounts
          }
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
    let statusMessage = (this.state.gameWon) ? 'true': 'false';
    if (this.state.gameOver) {
      statusMessage = (
        <h1>You lost!</h1>
      );
    }

    let rows = [];
    for (let x = 0; x < this.props.height; ++x) {
      rows.push(this.renderRow(
        this.props.width,
        x
      ));
    }

    let restartButton = '';
    if (this.state.gameOver) {
      restartButton = (
        <button onClick={this.props.onGameRestart}>New Game</button>
      );
    }

    return (
      <div>
        {statusMessage}
        <table style={styles.board}>
          {rows}
        </table>
        {restartButton}
      </div>
    );
  }
});

export default Board;
