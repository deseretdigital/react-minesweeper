import assign from 'object-assign';

var styles = {
	board: {
	},
	row: {
	},
	cell: {
		backgroundColor: 'gainsboro',
		height: 32,
		width: 32
	}
};

styles.sweptCell = assign({}, styles.cell, {
  backgroundColor: 'sandybrown'
});

export default styles;
