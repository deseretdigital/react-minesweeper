import React from 'react';

let Scoreboard = ({numRemainingFlags, elapsedTime, children}) => {
  return (
    <div>
      {children}
      <p>flags left: {numRemainingFlags}</p>
      <p>Seconds ticked: {elapsedTime}</p>
    </div>
  );
}

export default Scoreboard;
