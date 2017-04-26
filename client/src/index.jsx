import ReactDom from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
// import reduxImmutableStateVariant from 'redux-immutable-state-invariant';
// import allReducers from './';
import App from './components/app.component';
import combineReducers from './reducers/index.js';
import setAuthorizationToken from './utils/setAuth';

require('../src/scss/main.scss');

const token = window.localStorage.getItem('token');

// const middleware = process.env.NODE_ENV !== 'production' ?
//   [reduxImmutableStateVariant(), thunk] :
//   [thunk];
const store = createStore(
  combineReducers,
  applyMiddleware(thunk)
);
if (token) {
  setAuthorizationToken(token);
}

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('react-app'));
