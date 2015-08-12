import React from 'react';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import App from './components/App';
import * as reducers from './reducers';


const logger = store => next => action => {
 console.group(action.type);
 console.info('dispatching', action);
 let result = next(action);
 console.log('next state', store.getState());
 console.groupEnd(action.type);
 return result;
};

const thunk = store => next => action =>
  typeof action === 'function' ?
    action(store.dispatch, store.getState) :
    next(action);

let createStoreWithMiddleWare = applyMiddleware(thunk)(createStore);
let minesweeperApp = combineReducers(reducers);

let store = createStoreWithMiddleWare(minesweeperApp);
let rootElement = document.getElementById('app');

React.render(
  // The child must be wrapped in a function
  // to work around an issue in React 0.13.
  <Provider store={store}>
    {() => <App />}
  </Provider>,
  rootElement
);
