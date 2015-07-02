import assign from 'object-assign';

var styles = {
	board: {
	},
	row: {
	},
	cell: {
		backgroundColor: 'gainsboro',
		height: 20,
		width: 20
	}
};

styles.sweptCell = assign({}, styles.cell, {
  backgroundColor: 'sandybrown'
});

export default styles;
