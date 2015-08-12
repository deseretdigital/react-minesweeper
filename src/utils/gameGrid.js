export function createGameGrid(height, width) {
  const numCells = height * width;
  const grid = [];
  for (let x = 0; x < numCells; ++x) {
    grid.push({
      index: x,
      hasMine: false,
      isSwept: false,
      mineCounts: 0,
      isFlagged: false,
      neighbors: getNeighbors(x, height, width),
    });
  }
  return grid;
}

export function getNeighbors(x, height, width) {
  const positions = [];
  const numCells = height * width;

  [width,0,width * -1].forEach((xMod) => {
    [1,0,-1].forEach((yMod) => {

      let baseInt = Math.floor((x + xMod)/width);
      let newIndex = x + xMod + yMod;
      let blah = Math.floor(newIndex/width);

      if (newIndex >= 0 && newIndex < numCells && blah == baseInt && x !== newIndex) {
        positions.push(newIndex);
      }
    })
  });
  return positions;
}

export function addMines(grid, numMines) {
  let minesToAdd = numMines;
  let numFreeSpaces = grid.length;
  let newGrid = grid;
  if (minesToAdd > numFreeSpaces) {
    minesToAdd = numFreeSpaces;
  }

  while (minesToAdd) {
    let index = getRandomNumber(0, numFreeSpaces - 1)

    if (!newGrid[index].hasMine) {
      newGrid[index].hasMine = true;
      minesToAdd--;
    }
  }
  return newGrid;
}

function getRandomNumber(min,max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function setMineCounts(grid) {
  let newGrid = grid;
  for (let x = 0; x < grid.length; ++x) {
    if (grid[x].hasMine) {
      grid[x].neighbors.forEach((position) => {
        newGrid[position].mineCounts++;
      });
    }
  }
  return newGrid;
}
