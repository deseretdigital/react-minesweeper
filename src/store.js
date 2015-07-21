import Reflux from 'reflux';
import Actions from './actions';

let store = Reflux.createStore({
  listenables: Actions,
  gameGrid: null,
  gameStarted: false,
  height: 10,
  width: 10,
  numMines: 5,
  numRemainingFlags: 1,
  gameTimer: 0,
  gameTimerId: null,

  getInitialState() {
    return {
      gameGrid: this.gameGrid,
      gameStarted: this.gameStarted,
      height: this.height,
      width: this.width,
      numMines: this.numMines,
      numRemainingFlags: this.numMines,
      gameTimer: this.gameTimer
    };
  },

  updateState() {
    this.trigger({
      gameGrid: this.gameGrid,
      gameStarted: this.gameStarted,
      height: this.height,
      width: this.width,
      numMines: this.numMines,
      numRemainingFlags: this.numRemainingFlags,
      gameTimer: this.gameTimer
    });
  },

  onRestartGame() {
    this.gameStarted = false;
    this.updateState();
  },

  onStartGame(width, height, numMines) {
    this.height = height;
    this.width = width;
    this.numMines = numMines;
    this.gameStarted = true;
    this.gameTimer = 0;

    this.makeGameGrid();
    this.updateState();
  },

  makeGameGrid() {
    let numCells = this.height * this.width;

    var grid = [];
    for (let x = 0; x < numCells; ++x) {
      grid.push({
        hasMine: false,
        isSwept: false,
        mineCounts: 0,
        isFlagged: false
      });
    }

    this.gameGrid = grid;
    this.addMines(grid);
    this.setMineCounts(grid);
  },

  addMines(grid) {
    let minesToAdd = this.numMines;
    let numFreeSpaces = grid.length;

    if (minesToAdd > numFreeSpaces) {
      minesToAdd = numFreeSpaces;
    }

    while (minesToAdd) {
      let index = this.getRandomNumber(0, numFreeSpaces - 1)

      if (!grid[index].hasMine) {
        grid[index].hasMine = true;
        minesToAdd--;
      }
    }
  },

  setMineCounts(grid) {
    for (let x = 0; x < grid.length; ++x) {
      if (grid[x].hasMine) {
        let updatePositions = this.getNeighbors(x);
        updatePositions.forEach((position) => {
          grid[position].mineCounts++;
        });
      }
    }
  },

  getNeighbors(x) {
    let positions = [];

    [this.width,0,this.width * -1].forEach((xMod) => {
      [1,0,-1].forEach((yMod) => {
        let baseInt = Math.floor(xMod/this.width);
        let newIndex = x + xMod + yMod;

        let blah = Math.floor(newIndex/this.width);

        if (newIndex >= 0 && blah == baseInt) {
          positions.push(newIndex);
        }
      })
    });

    return positions;
  },

  getRandomNumber(min,max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },

  onStartTimer() {
    if (this.gameTimerId !== null) {
      return;
    }

    this.gameTimerId = setInterval(() => {
      this.gameTimer++;
      this.updateState();
    }, 1000);
  },

  onStopTimer() {
    clearInterval(this.gameTimerId);
    this.gameTimerId = null;
  },

  onSweepLocation(x) {
    this.sweepLocation(x);
    this.updateState();
  },

  sweepLocation(x) {
    let gameGrid = this.gameGrid;
    gameGrid[x].isSwept = true;

    if (gameGrid[x].mineCounts === 0) {
      this.sweepNeighbors(x);
    }
  },

  sweepNeighbors(x) {
    let gameGrid = this.gameGrid;
    let neighbors = this.getNeighbors(x);

    neighbors.forEach((neighbor) => {
      let neighborCell = gameGrid[neighbor]
      if (!neighborCell.hasMine
          && neighborCell.isSwept !== true
          && neighborCell.isFlagged !== true
      ) {
        this.sweepLocation(neighbor);
      }
    });
  },

  onToggleFlag(x) {
    let gameGrid = this.gameGrid;
    gameGrid[x].isFlagged = !gameGrid[x].isFlagged;
    this.setNumberRemainingFlags();
    this.updateState();
  },

  setNumberRemainingFlags() {
    let flaggedSpaces = this.gameGrid.reduce((count, row) => {
      return count + row.reduce((initCount, cell) => {
        if (cell.isFlagged) {
          initCount++;
        }
        return initCount;
      }, 0);
    }, 0);

    this.numRemainingFlags = this.numMines - flaggedSpaces;
  },
});

export default store;
