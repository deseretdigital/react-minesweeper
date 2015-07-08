import Reflux from 'reflux';
import Actions from './actions';

let store = Reflux.createStore({
  listenables: Actions,
  gameGrid: null,
  gameStarted: false,
  height: 10,
  width: 10,
  numMines: 1,

  getInitialState() {
    return {
      gameGrid: this.gameGrid,
      gameStarted: this.gameStarted,
      height: this.height,
      width: this.width,
      numMines: this.numMines
    };
  },

  updateState() {
    this.trigger({
      gameGrid: this.gameGrid,
      gameStarted: this.gameStarted,
      height: this.height,
      width: this.width,
      numMines: this.numMines
    });
  },

  onStartGame(width, height, numMines) {
    this.height = height;
    this.width = width;
    this.numMines = numMines;
    this.gameStarted = true;

    this.makeGameGrid();
    this.updateState();
  },

  makeGameGrid() {
    var grid = [];
    for (let x = 0; x < this.height; ++x) {
      grid.push([]);
      for (let y = 0; y < this.width; ++y) {
        grid[x].push({
          hasMine: false,
          isSwept: false,
          mineCounts: 0,
          isFlagged: false
        });
      }
    }

    this.gameGrid = grid;
    this.addMines(grid);
    this.setMineCounts(grid);
  },

  addMines(grid) {
    let minesToAdd = this.numMines;
    let numFreeSpaces = this.width * this.height;

    if (minesToAdd > numFreeSpaces) {
      minesToAdd = numFreeSpaces;
    }

    while (minesToAdd) {
      let x = this.getRandomNumber(0, this.width)
      let y = this.getRandomNumber(0, this.height);

      if (!grid[x][y].hasMine) {
        grid[x][y].hasMine = true;
        minesToAdd--;
      }
    }
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
      return position[0] >= 0 && position[0] < this.height
        && position[1] >= 0 && position[1] < this.width;
    });
  },

  getRandomNumber(min,max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },

  onSweepLocation(x, y) {
    this.sweepLocation(x,y);
    this.updateState();
  },

  sweepLocation(x, y) {
    let gameGrid = this.gameGrid;
    gameGrid[x][y].isSwept = true;

    if (gameGrid[x][y].mineCounts === 0) {
      this.sweepNeighbors(x,y);
    }
  },

  sweepNeighbors(x,y) {
    let gameGrid = this.gameGrid;
    let neighbors = this.getNeighbors(x, y);

    neighbors.forEach((neighbor) => {
      let [neighborX, neighborY] = neighbor;
      let neighborCell = gameGrid[neighborX][neighborY]
      if (!neighborCell.hasMine
          && neighborCell.isSwept !== true
          && neighborCell.isFlagged !== true
      ) {
        this.sweepLocation(neighborX, neighborY, false);
      }
    });
  },
});

export default store;
