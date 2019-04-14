/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Constants from '../constants/demo';

export default class Index extends Component {
    constructor (props) {
        super(props);
        this.log = props.log;
        this.log.debug('Successfully loaded React Component:', Constants.Page.INDEX);
    }

    _loadWelcomePage () {
        return new Promise((resolve, reject) => {
            const log = this.log;
            const logAndReject = (...x) => {
                log.error(x);
                reject(new Error());
            };
            log.debug('Deleting sections');
            axios.delete('http://' + Constants.REACT_APP_OVE_HOST + '/sections').then(_ => {
                setTimeout(_ => {
                    axios.get('//' + Constants.REACT_APP_OVE_HOST + '/spaces').then(res => res.data).then(spaces => {
                        Object.keys(spaces).forEach(space => {
                            axios.get('//' + Constants.REACT_APP_OVE_HOST + '/spaces/' + space + '/geometry').then(res => {
                                let payload = { space: space, x: 0, y: 0, w: res.data.w, h: res.data.h };
                                let appURL = 'http://' + Constants.REACT_APP_OVE_HOST + '/app/html';
                                let welcomeURL = Constants.PUBLIC_URL + '/welcome';
                                payload.app = { url: appURL, states: { load: { url: welcomeURL, launchDelay: 0 } } };
                                axios.post('http://' + Constants.REACT_APP_OVE_HOST + '/section', payload)
                                    .then(resolve).catch(logAndReject);
                                log.debug('Created section with payload:', payload);
                            }).catch(logAndReject);
                        });
                    }).catch(logAndReject);
                }, Constants.SECTION_DELETE_WAIT_TIME);
            }).catch(logAndReject);
        });
    }

    _loadClientPages () {
        return new Promise((resolve, reject) => {
            const log = this.log;
            const logAndReject = (...x) => {
                log.error(x);
                reject(new Error());
            };
            log.debug('Deleting sections');
            axios.delete('http://' + Constants.REACT_APP_OVE_HOST + '/sections').then(_ => {
                setTimeout(_ => {
                    axios.get('//' + Constants.REACT_APP_OVE_HOST + '/spaces').then(res => res.data).then(spaces => {
                        Object.keys(spaces).forEach(space => {
                            spaces[space].forEach((c, i) => {
                                let payload = { space: space, x: c.x, y: c.y, w: c.w, h: c.h };
                                let appURL = 'http://' + Constants.REACT_APP_OVE_HOST + '/app/html';
                                let clientURL = Constants.PUBLIC_URL + `/client?oveViewId=${space}-${i}&x=${c.x}&y=${c.y}&w=${c.w}&h=${c.h}`;
                                payload.app = { url: appURL, states: { load: { url: clientURL, launchDelay: 0 } } };
                                axios.post('http://' + Constants.REACT_APP_OVE_HOST + '/section', payload)
                                    .then(resolve).catch(logAndReject);
                                log.debug('Created section with payload:', payload);
                            });
                        });
                    }).catch(logAndReject);
                }, Constants.SECTION_DELETE_WAIT_TIME);
            }).catch(logAndReject);
        });
    }

    componentDidMount () {
        const __self = this;
        __self._loadWelcomePage().then(_ => {
            setTimeout(_ => {
                __self._loadClientPages().then(_ => {
                    setTimeout(_ => {
                        axios.delete('http://' + Constants.REACT_APP_OVE_HOST +
                            '/sections').catch(__self.log.error);
                    }, Constants.POST_CLIENT_STATUS_DELAY);
                });
            }, Constants.POST_WELCOME_DELAY);
        });
    };

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
