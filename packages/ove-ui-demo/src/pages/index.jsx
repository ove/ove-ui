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
        if (window.OVE && window.OVE.Utils) {
            this.space = window.OVE.Utils.getQueryParam(Constants.SPACE);
        }
        this.log.debug('Successfully loaded React Component:', Constants.Page.INDEX);
    }

    _loadWelcomePage (space) {
        return new Promise((resolve, reject) => {
            const log = this.log;
            let count = 0;
            let response = [];
            const logAndReject = (...x) => {
                log.error(x);
                reject(new Error());
            };
            const loadPage = space => {
                count++;
                axios.get('//' + Constants.REACT_APP_OVE_HOST + '/spaces/' + space + '/geometry').then(res => {
                    let payload = { space: space, x: 0, y: 0, w: res.data.w, h: res.data.h };
                    let appURL = 'http://' + Constants.REACT_APP_OVE_HOST + '/app/html';
                    let welcomeURL = '//' + Constants.PUBLIC_URL + '/welcome';
                    payload.app = { url: appURL, states: { load: { url: welcomeURL, launchDelay: 0 } } };
                    axios.post('//' + Constants.REACT_APP_OVE_HOST + '/section', payload)
                        .then(payload => {
                            response.push(payload.data.id);
                            if (response.length === count) {
                                resolve(response);
                            }
                        }).catch(logAndReject);
                    log.debug('Created section with payload:', payload);
                }).catch(logAndReject);
            };
            if (space === Constants.ALL_SPACES) {
                axios.get('//' + Constants.REACT_APP_OVE_HOST + '/spaces').then(res => res.data).then(spaces => {
                    Object.keys(spaces).forEach(loadPage);
                }).catch(logAndReject);
            } else {
                loadPage(space);
            }
        });
    }

    _loadClientPages (space) {
        return new Promise((resolve, reject) => {
            const log = this.log;
            let count = 0;
            let response = [];
            const logAndReject = (...x) => {
                log.error(x);
                reject(new Error());
            };
            const loadPages = (spaces, space) => {
                spaces[space].forEach((c, i) => {
                    count++;
                    let payload = { space: space, x: c.x, y: c.y, w: c.w, h: c.h };
                    let appURL = 'http://' + Constants.REACT_APP_OVE_HOST + '/app/html';
                    let clientURL = '//' + Constants.PUBLIC_URL + `/client?oveViewId=${space}-${i}&x=${c.x}&y=${c.y}&w=${c.w}&h=${c.h}`;
                    payload.app = { url: appURL, states: { load: { url: clientURL, launchDelay: 0 } } };
                    axios.post('//' + Constants.REACT_APP_OVE_HOST + '/section', payload)
                        .then(payload => {
                            response.push(payload.data.id);
                            if (response.length === count) {
                                resolve(response);
                            }
                        }).catch(logAndReject);
                    log.debug('Created section with payload:', payload);
                });
            };
            if (space === Constants.ALL_SPACES) {
                axios.get('//' + Constants.REACT_APP_OVE_HOST + '/spaces').then(res => res.data).then(spaces => {
                    Object.keys(spaces).forEach(space => {
                        loadPages(spaces, space);
                    });
                }).catch(logAndReject);
            } else {
                axios.get('//' + Constants.REACT_APP_OVE_HOST + '/spaces').then(res => res.data).then(spaces => {
                    loadPages(spaces, space);
                }).catch(logAndReject);
            }
        });
    }

    componentDidMount () {
        const __self = this;
        let sections = [];
        if (__self.space) {
            __self._loadWelcomePage(__self.space).then(res1 => {
                sections = sections.concat(res1);
                setTimeout(_ => {
                    __self._loadClientPages(__self.space).then(res2 => {
                        sections = sections.concat(res2);
                        setTimeout(_ => {
                            sections.forEach(s => {
                                __self.log.debug('Deleting section:', s);
                                axios.delete('//' + Constants.REACT_APP_OVE_HOST + '/sections/' + s).catch(__self.log.error);
                            });
                        }, Constants.POST_CLIENT_STATUS_DELAY);
                    });
                }, Constants.POST_WELCOME_DELAY);
            });
        }
    };

    render () {
        return (
            <div className='outer'>
                <div className='markdown-body'>
                    <h1>Open Visualisation Environment Demos</h1>
                    {this.space ? <IntroMessage/> : <NoSpaceSelectedMessage/>}
                </div>
            </div>
        );
    }
}

Index.propTypes = {
    log: PropTypes.object.isRequired
};

const IntroMessage = () => {
    return <>
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
    </>;
};

export class NoSpaceSelectedMessage extends Component {
    constructor (props) {
        super(props);
        this.state = { allSpaces: [] };
        if (window.OVE && window.OVE.Utils) {
            this.space = window.OVE.Utils.getQueryParam(Constants.SPACE);
        }
    }

    componentDidMount () {
        axios.get('//' + Constants.REACT_APP_OVE_HOST + '/spaces').then(res => res.data).then(spaces => {
            this.setState({ allSpaces: Object.keys(spaces).concat([Constants.ALL_SPACES]) });
        });
    }

    render () {
        return <>
            <div id='no-space-selected' className="alert alert-danger"
                style={{ display: 'block', margin: '0.5vw auto', width: '85vw', maxWidth: '980px' }}>
                No <strong> {Constants.SPACE} </strong> query parameter provided. Available spaces:

                <ul>
                    {this.state.allSpaces.map(d => <li key={d}><a href={`?oveSpace=${d}`}>{d === Constants.ALL_SPACES ? 'All Spaces' : d}</a> </li>)}
                </ul>
            </div>
        </>;
    }
}
