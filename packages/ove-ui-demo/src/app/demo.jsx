/* jshint ignore:start */
// JSHint cannot deal with React.
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import Constants from '../constants/demo';
import Client from '../pages/client';
import Index from '../pages/index';
import Welcome from '../pages/welcome';
import './demo.css';

export default function Demo (props) {
    const __self = {};
    const webContext = Constants.PUBLIC_URL.includes('/') ? Constants.PUBLIC_URL.substring(
        Constants.PUBLIC_URL.indexOf('/')) : '';
    __self.log = props.log;
    __self.log.debug('Successfully loaded React App');
    return (
        <Router>
            <Route exact path={webContext + '/'} render={_ => (<Index log={__self.log} />)} />
            <Route path={webContext + '/client'} render={props => (<Client query={ props.location.search } log={__self.log} />)} />
            <Route path={webContext + '/welcome'} render={_ => (<Welcome log={__self.log} />)} />
        </Router>
    );
}

Demo.propTypes = {
    log: PropTypes.object.isRequired,
    location: PropTypes.object
};
