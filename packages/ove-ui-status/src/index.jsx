/* jshint ignore:start */
// JSHint cannot deal with React.
import React from 'react';
import ReactDOM from 'react-dom';
import Constants from './constants/status';

import load from 'little-loader';

import Status from './app/status';
import './index.css';

// Setup jQuery to work inside React
import $ from 'jquery';
window.$ = $;

load('//' + Constants.REACT_APP_OVE_HOST + '/ove.js', _ => {
    if (window.OVE) {
        const log = window.OVE.Utils.Logger(Constants.COMPONENT_NAME, Constants.LOG_LEVEL);

        log.debug('Rendering React DOM');
        Status.compute(log).then(function (status) {
            ReactDOM.render(
                <Status log={log} status={status} />, document.getElementById('root')
            );
        });
    } else {
        console.error('[FATAL] Unable to connect to OVE Core');
        ReactDOM.render(
            <div className='alert alert-danger' style={{ display: 'block', margin: '0.5vw', width: '100%' }}>
                <strong>Error:</strong> Unable to Connect to OVE Core. The status UI requires an active connection to OVE Core for it to work.
            </div>, document.body
        );
    }
});
