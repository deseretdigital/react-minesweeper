import React from 'react';
import styles from '../styles.js';

var Cell = React.createClass({
  propTypes: {
    isSwept: React.PropTypes.bool,
    isFlagged: React.PropTypes.bool,
    children: React.PropTypes.node
  },

  getDefaultProps() {
    return {
      isSwept: false,
      isFlagged: false,
    }
  },

  render() {
    let cellStyle = (this.props.isSwept) ?
    styles.sweptCell :
    styles.cell;

    let content = '';
    if (this.props.isSwept) {
      content = this.props.children;
    } else if (this.props.isFlagged) {
      content = '🇺🇸';
    }

    return (
      <td
        style={cellStyle}
        onClick={this.props.clickHandler.bind(null)}
      >
        {content}
      </td>
    );
  }
});

export default Cell;
