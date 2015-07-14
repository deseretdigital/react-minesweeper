import React from 'react';
import Store from '../store.js';
import Reflux from 'reflux';

var Scoreboard = React.createClass({
  mixins: [Reflux.connect(Store)],

  render() {
    return (
      <div>
        <p>flags left: {this.state.numRemainingFlags}</p>
        <p>Seconds ticked: {this.state.gameTimer}</p>
      </div>
    );
  }
});

export default Scoreboard;
