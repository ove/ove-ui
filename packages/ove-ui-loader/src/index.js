/* jshint ignore:start */
// JSHint cannot deal with React.
import React from 'react';
import ReactDOM from 'react-dom';
import Constants from './constants/loader';

import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './reducers/store.js';
import { Provider, connect } from 'react-redux';
import load from 'little-loader';

import Loader from './app/loader';
import './index.css';

// Setup jQuery to work inside React
import $ from 'jquery';
window.$ = $;

const { store, persistor, mapStateToProps } = configureStore();
const Form = connect(mapStateToProps)(Loader);

load('//' + Constants.REACT_APP_OVE_HOST + '/ove.js', _ => {
    const log = window.OVE.Utils.Logger(Constants.COMPONENT_NAME);

    log.debug('Rendering React DOM');
    ReactDOM.render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Form log={log} />
            </PersistGate>
        </Provider>, document.getElementById('root')
    );
});
