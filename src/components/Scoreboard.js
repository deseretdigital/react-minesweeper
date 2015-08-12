import React from 'react';

var Scoreboard = React.createClass({
  render() {
    return (
      <div>
        {this.props.children}
        <p>flags left: {this.props.board.numRemainingFlags}</p>
        <p>Seconds ticked: {this.props.clock.elapsedTime}</p>
      </div>
    );
  }
});

export default Scoreboard;
