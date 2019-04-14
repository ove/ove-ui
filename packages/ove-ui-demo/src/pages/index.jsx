/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Constants from '../constants/demo';
import 'github-markdown-css/github-markdown.css';

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
            <div className='outer'>
                <div className='markdown-body'>
                    <h1>Open Visualisation Environment Demos</h1>
                    <p>
                        This page provides a list of demonstrations that can be launched on an installation of
                        Open Visualisation Environment (OVE). Simply loading this page and taking no action will
                        leading to the displaying of the OVE splash screen followed by the details of the OVE
                        clients.
                    </p>
                    <p>
                        This demo launcher is associated with an instance of OVE Core accessible
                        at <a href={'//' + Constants.REACT_APP_OVE_HOST}>{Constants.REACT_APP_OVE_HOST}</a> - more
                        information about OVE and how it has been configured is available there.
                    </p>
                </div>
            </div>
        );
    }
}

Index.propTypes = {
    log: PropTypes.object.isRequired
};
