/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './logs.css';
import 'semantic-ui-css/semantic.min.css';
import Constants from '../constants/logs';

export default class Logs extends Component {
    constructor (props) {
        super(props);

        this.log = props.log;

        this.state = {};
        this.state = { ...this.state, ...(JSON.parse(window.localStorage.getItem(Constants.LOCAL_STORAGE_KEY))), appAvailable: undefined };
    }

    render () {
        window.localStorage.setItem(Constants.LOCAL_STORAGE_KEY, JSON.stringify(this.state));

        return (
            <>
                <h1>OVE Application Logs</h1>
                <p>Collates logs for all services for monitoring.</p>
            </>
        );
    }
}

Logs.propTypes = {
    log: PropTypes.object.isRequired
};
