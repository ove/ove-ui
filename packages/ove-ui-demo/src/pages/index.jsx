/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Constants from '../constants/demo';

export default class Index extends Component {
    constructor (props) {
        super(props);
        this.log = props.log;
        this.log.debug('Successfully loaded React Component:', Constants.Page.INDEX);
    }

    componentDidMount () { }

    componentWillUnmount () { }

    render () {
        return (
            <div>
                Hello World!
            </div>
        );
    }
}

Index.propTypes = {
    log: PropTypes.object.isRequired
};
