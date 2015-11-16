import React from 'react';

let NewGameControls = React.createClass({

  startNewGame(e, starterFunction) {
    e.preventDefault();

    let width = parseInt(this.refs.width.value);
    let height = parseInt(this.refs.height.value);
    let numMines = parseInt(this.refs.numMines.value);

    starterFunction(height, width, numMines);
  },

  render() {
    let {height, width, numMines, dispatch, startGame} = this.props;
    let starterFunction = (height, width, numMines) => {
      dispatch(startGame(height, width, numMines));
    }
    return (
      <div>
        <form onSubmit={(e) => this.startNewGame(e, starterFunction)}>
          <p>
            <label>
              Width:{' '}
              <input type="number" min="1" max="20" defaultValue={width} ref="width" />
            </label>{' '}
            <label>
              Height:{' '}
              <input type="number" min="1" max="20" defaultValue={height} ref="height" />
            </label>
            <label>{' '}
              Num Mines:{' '}
              <input type="number" min="1" max="50" defaultValue={numMines} ref="numMines" />
            </label>{' '}
            <input type="submit" value="Start" />
          </p>
        </form>
      </div>
    );
  }
})

export default NewGameControls;
