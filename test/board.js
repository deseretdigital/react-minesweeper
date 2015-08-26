import expect from 'expect';
import * as types from '../src/types';
import reducer from '../src/reducers/board';
import * as actions from '../src/actions';

describe('actions', () => {
  it('should start a game', () => {
    const height = '10';
    const width = '10';
    const numMines = '5';
    const expectedAction = {
      type: types.START_GAME,
      width,
      height,
      numMines
    };
    expect(actions.startGame(height, width, numMines)).toEqual(expectedAction);
  });
});


describe('board reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
      height: 10,
      width: 10,
      numMines: 5,
      numRemainingFlags: 5,
    });
  });

  it('should handle START_GAME', () => {
    expect(
      reducer({
        height: 10,
        width: 10,
        numMines: 5,
        numRemainingFlags: 5,
      }, {
        type: types.START_GAME,
        height: 5,
        width: 5,
        numMines: 1,
      })
    ).toEqual({
      height: 5,
      width: 5,
      numMines: 1,
      numRemainingFlags: 1,
    });

    expect(
      reducer({
        height: 5,
        width: 5,
        numMines: 1,
        numRemainingFlags: 1,
      }, {
        type: types.START_GAME,
        height: 5,
        width: 5,
        numMines: 1,
      })
    ).toEqual({
      height: 5,
      width: 5,
      numMines: 1,
      numRemainingFlags: 1,
    });
  });
});
