/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import Constants from '../constants/preview';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-theme.min.css';
import './preview.css';
import Replicator from '../replicator/replicator';

export default class Preview extends Component {
    constructor(props) {
        super(props);
        this.store = JSON.parse(JSON.stringify(props));
        delete this.store.log;
        this.log = props.log;
        this.log.debug('Successfully loaded React App');
    }

    componentDidMount() { 
        new Replicator().init();
    }

    componentWillUnmount() { }

    getStore() {
        this.log.debug('Retrieving store', this.store);
        return this.store;
    }

    updateStore(update) {
        this.log.debug('Updating store with:', update);
        this.store = {
            ...this.store,
            ...update,
        };
        this.props.dispatch({
            type: Constants.UPDATE,
            ...this.store,
            ...update,
        });
    }

    render() {
        return (
            <div className={Constants.CONTENT_DIV.substring(1)}/>
        );
    }
}
