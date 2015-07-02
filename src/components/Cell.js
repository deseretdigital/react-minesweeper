import React from 'react';
import styles from '../styles.js';

var Cell = React.createClass({
	propTypes: {
		isSwept: React.PropTypes.bool,
		children: React.PropTypes.node
	},

	getDefaultProps() {
		return {
			isSwept: false
		}
	},

	render() {
		let cellStyle = (this.props.isSwept) ?
		styles.sweptCell :
		styles.cell;

		return (
			<td
				style={cellStyle}
				onClick={this.props.clickHandler.bind(null)}
			>
				{(this.props.isSwept) ? this.props.children : ''}
			</td>
		);
	}
});

export default Cell;
