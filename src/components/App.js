import React from 'react';
import Board from './Board';

var App = React.createClass({
  getInitialState() {
    return {
      width: 10,
      height: 10,
      numMines: 2,
      gameStarted: true
    }
  },

  startNewGame(e) {
    e.preventDefault();

    this.setState({
      width: parseInt(React.findDOMNode(this.refs.width).value),
      height: parseInt(React.findDOMNode(this.refs.height).value),
      numMines: parseInt(React.findDOMNode(this.refs.numMines).value),
      gameStarted: true
    });
  },

  handleGameRestart() {
    this.setState({
      gameStarted: false
    });
  },

  render() {
    if (!this.state.gameStarted) {
      return this.renderNewGameControls();
    } else {
      return this.renderBoard();
    }
  },

  renderNewGameControls() {
    return (
      <div>
        <form onSubmit={this.startNewGame}>
          <p>
            <label>
              Width:{' '}
              <input type="number" defaultValue={this.state.width} min="1" max="20" ref="width" />
            </label>{' '}
            <label>
              Height:{' '}
              <input type="number" defaultValue={this.state.height} min="1" max="20" ref="height" />
            </label>
            <label>{' '}
              Num Mines:{' '}
              <input type="number" defaultValue={this.state.numMines} min="1" max="50" ref="numMines" />
            </label>{' '}
            <input type="submit" value="Start" />
          </p>
        </form>
      </div>
    );
  },

  renderBoard() {
    return (
      <div>
        <Board
          width={this.state.width}
          height={this.state.height}
          numMines={this.state.numMines}
          onGameRestart={this.handleGameRestart}
        />
      </div>
    );
  }
});

export default App;
