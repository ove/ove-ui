/* jshint ignore:start */
// JSHint cannot deal with React.

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import * as serviceWorker from './app/serviceWorker';

import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './reducers/store.js';
import { Provider, connect } from 'react-redux';

const { store, persistor, mapStateToProps } = configureStore();
 
const Form = connect(mapStateToProps)(App);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Form />
    </PersistGate>
  </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
