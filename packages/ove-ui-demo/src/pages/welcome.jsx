/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Constants from '../constants/demo';
import 'bootstrap/dist/css/bootstrap.min.css';
import './welcome.css';

export default class Welcome extends Component {
    constructor (props) {
        super(props);
        this.log = props.log;
        this.log.debug('Successfully loaded React Component:', Constants.Page.WELCOME);
    }

    componentDidMount () { }

    componentWillUnmount () { }

    render () {
        return (
            <div style={{ height: '100%' }} className='bg-black'>
                <p style={{ fontSize: '7.5vh' }} className='text-white text-center welcome-text-middle'>
                    <strong>Welcome to Open Visualisation Environment (OVE) ...</strong>
                </p>
            </div>
        );
    }
}

Welcome.propTypes = {
    log: PropTypes.object.isRequired
};
