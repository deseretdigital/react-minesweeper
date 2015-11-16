import React from 'react';
import Cell from './Cell';
import styles from '../styles.js';

let renderRow = (cells, clickHandler, mineCharacter) => {
  let cols = [];
  for (var cellIndex in cells) {
    let cell = cells[cellIndex];

    let cellContents = (cell.hasMine ? mineCharacter : cell.mineCounts) || '';

    cols.push((
      <Cell
        isSwept={cell.isSwept}
        isFlagged={cell.isFlagged}
        clickHandler={(e) => clickHandler(cell,e)}
        key={'cell_' + cellIndex}
      >
        {cellContents}
      </Cell>
    ));
  }

  return cols;
};

let Board = ({height, width, grid, mineCharacter, cellClickedHandler}) => {
  let rows = [];
  for (let x = 0; x < height; ++x) {
    let startIndex = width * x;
    let cells = grid.slice(startIndex, startIndex + width);
    let row = renderRow(cells, cellClickedHandler, mineCharacter);
    rows.push(
        <section style={styles.row} key={'row_' + x}>
          {row}
        </section>
    );
  }


  return (
    <div>
      <main style={styles.board}>
        {rows}
      </main>
    </div>
  );
}

export default Board;
