import React from 'react';
import styles from '../styles.js';

const Cell = ({isSwept, children, isFlagged, clickHandler}) => {

    let cellStyle = (isSwept) ?
    styles.sweptCell :
    styles.cell;

    let content = '';
    if (isSwept) {
      content = children;
    } else if (isFlagged) {
      content = '🇺🇸';
    }

    return (
      <div
        style={cellStyle}
        onClick={(e)=>{clickHandler(e)}}
      >
        {content}
      </div>
    );

};

Cell.propTypes = {
  isSwept: React.PropTypes.bool,
  isFlagged: React.PropTypes.bool,
  children: React.PropTypes.node
};

Cell.defaultProps = {
  isSwept: false,
  isFlagged: false
};

export default Cell;