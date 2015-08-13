import React from 'react';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import logger from 'redux-logger';
import thunk from 'redux-thunk';

import App from './components/App';
import * as reducers from './reducers';

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
