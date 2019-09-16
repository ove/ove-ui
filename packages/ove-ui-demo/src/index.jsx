/* jshint ignore:start */
// JSHint cannot deal with React.
import React from 'react';
import ReactDOM from 'react-dom';
import Constants from './constants/demo';

import load from 'little-loader';

import Demo from './app/demo';
import './index.css';

load('//' + Constants.REACT_APP_OVE_HOST + '/ove.js', _ => {
    if (window.OVE) {
        const log = window.OVE.Utils.Logger(Constants.COMPONENT_NAME, Constants.LOG_LEVEL);

        log.debug('Rendering React DOM');
        ReactDOM.render(
            <Demo log={log} />, document.getElementById('root')
        );
    } else {
        console.error('[FATAL] Unable to connect to OVE Core');
        ReactDOM.render(
            <div className='alert alert-danger' style={{ display: 'block', margin: '0.5vw', width: '100%' }}>
                <strong>Error:</strong> Unable to Connect to OVE Core. The demo UI requires an active connection to OVE Core for it to work.
            </div>, document.body
        );
    }
});
