/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Constants from '../constants/demo';
import 'bootstrap/dist/css/bootstrap.min.css';
import './client.css';
import { detect } from 'detect-browser';

export default class Client extends Component {
    constructor (props) {
        super(props);
        this.log = props.log;
        let viewId = new URLSearchParams(props.query).get('oveViewId');
        this.log.debug('Got viewId:', viewId);
        if (viewId && viewId.includes('-')) {
            this.clientId = viewId.split('-')[1];
            this.space = viewId.split('-')[0];
        }
        this.log.debug('Successfully loaded React Component:', Constants.Page.CLIENT);
    }

    componentDidMount () { }

    componentWillUnmount () { }

    render () {
        const time = _ => {
            return '<strong>Time:</strong> <code style=\'color: White\'>' +
                new Date().toLocaleString() + '</code>';
        };

        const resolution = _ => {
            return '<strong>Resolution:</strong> <code style=\'color: White\'>' +
                window.innerWidth + 'x' + window.innerHeight + '</code>';
        };

        const browser = _ => {
            let browser = detect();
            return Constants.BROWSER(browser.name) + ' ' + browser.version;
        };

        const os = _ => {
            return detect().os;
        };

        return (
            <div style={{ height: '100%' }} className='bg-black'>
                <p style={{ fontSize: '70vh' }} className='text-white text-center client-text-middle'>
                    <strong>{this.clientId}</strong>
                </p>
                <p style={{ fontSize: '3vh', position: 'absolute' }} className='text-white text-center client-text-lower'>
                    <span id='space' dangerouslySetInnerHTML={{ __html:
                        (_ => { return this.space ? '<strong>Space:</strong> ' + this.space : ''; })() }} />
                    <br/>
                    <span id='resolution' dangerouslySetInnerHTML={{ __html: resolution() }} />
                    <br/>
                    <strong>Browser:</strong> {browser()}
                    <br/>
                    <strong>OS:</strong> {os()}
                    <br/>
                    <span id='time' dangerouslySetInnerHTML={{ __html: time() }} />
                </p>
                {
                    setInterval(() => {
                        document.getElementById('time').innerHTML = time();
                        document.getElementById('resolution').innerHTML = resolution();
                    }, 1000)
                }
            </div>
        );
    }
}

Client.propTypes = {
    log: PropTypes.object.isRequired,
    query: PropTypes.string.isRequired
};
