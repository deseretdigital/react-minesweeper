import React from 'react';
import Cell from './Cell';
import styles from '../styles.js';

var Board = React.createClass({
	propTypes: {
		height: React.PropTypes.number,
		width: React.PropTypes.number,
		numMines: React.PropTypes.number
	},

	getDefaultProps() {
		return {
			height: 4,
			width: 4,
			numMines: 6
		}
	},

	getInitialState() {
		return {
			gameGrid: this.makeGameGrid(),
			gameOver: false
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
					mineCounts: 0
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
					let updatePositions = this.getUpdatePositions(x,y);
					updatePositions.forEach((position) => {
						grid[position[0]][position[1]].mineCounts++;
					});
				}
			}
		}
	},

	getUpdatePositions(x,y) {
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

	sweepLocation(x, y, e) {
		let { gameGrid } = this.state;
		gameGrid[x][y].isSwept = true;
		let gameOver = this.state.gameOver;
		if (gameGrid[x][y].hasMine) {
			gameOver = true;
		}
		this.setState({gameGrid, gameOver});
	},

	renderRow(width, rowIndex) {
		var cols = [];
		let { gameGrid } = this.state;
		for (let x = 0; x < width; ++x) {
			cols.push((
				<Cell
					isSwept={this.state.gameOver || gameGrid[rowIndex][x].isSwept}
					clickHandler={(e) => this.sweepLocation(rowIndex, x, e)}
					key={'cell_' + x}
				>
					{(gameGrid[rowIndex][x].hasMine)
						? 'x' : gameGrid[rowIndex][x].mineCounts
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
		let statusMessage = '';
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

		return (
			<div>
				{statusMessage}
				<table style={styles.board}>
					{rows}
				</table>
			</div>
		);
	}
});

export default Board;
