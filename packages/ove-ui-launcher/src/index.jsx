/* jshint ignore:start */
// JSHint cannot deal with React.
import React from 'react';
import ReactDOM from 'react-dom';
import Constants from './constants/launcher';

import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './reducers/store';
import { Provider, connect } from 'react-redux';
import load from 'little-loader';

import Launcher from './app/launcher';
import './index.css';

// Setup jQuery to work inside React
import $ from 'jquery';
window.$ = $;

const { store, persistor, mapStateToProps } = configureStore();
const Form = connect(mapStateToProps)(Launcher);

load('//' + Constants.REACT_APP_OVE_HOST + '/ove.js', _ => {
    if (window.OVE) {
        const log = window.OVE.Utils.Logger(Constants.COMPONENT_NAME, Constants.LOG_LEVEL);

        log.debug('Rendering React DOM');
        ReactDOM.render(
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Form log={log} />
                </PersistGate>
            </Provider>, document.getElementById('root')
        );
    } else {
        console.error('[FATAL] Unable to connect to OVE Core');
        ReactDOM.render(
            <div className='alert alert-danger' style={{ display: 'block', margin: '0.5vw', width: '100%' }}>
                <strong>Error:</strong> Unable to Connect to OVE Core. The launcher UI requires an active connection to OVE Core for it to work.
            </div>, document.body
        );
    }
});
