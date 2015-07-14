import assign from 'object-assign';

var styles = {
	board: {
   width: 340,
   height: 340,
	},
	row: {
   display: 'flex',
   justifyContent: 'space-between'
	},
	cell: {
		backgroundColor: 'gainsboro',
    flex: '0 0 32px',
    height: 32,
    margin: 1,
	}
};

styles.sweptCell = assign({}, styles.cell, {
  backgroundColor: 'sandybrown'
});

export default styles;
