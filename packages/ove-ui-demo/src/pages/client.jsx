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
        let queryParams = new URLSearchParams(props.query);

        let geometry = (_ => {
            const x = queryParams.get('x');
            const y = queryParams.get('y');
            const w = queryParams.get('w');
            const h = queryParams.get('h');
            return ((x || x === 0) && (y || y === 0) && w && h) ? { x: x, y: y, w: w, h: h } : null;
        })();
        this.log.debug('Got client geometry:', geometry);
        if (geometry) {
            this.geometry = geometry;
        }

        let viewId = queryParams.get('oveViewId');
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
        const code = code => {
            return '<code style=\'color: White\'>' + code + '</code>';
        };

        const time = _ => {
            return '<strong>Time:</strong> ' + code(new Date().toLocaleString());
        };

        const resolution = _ => {
            return '<strong>Resolution:</strong> ' + code(window.innerWidth + 'x' + window.innerHeight);
        };

        const geometry = _ => {
            if (this.geometry) {
                const g = this.geometry;
                return `<strong>Geometry:</strong> x: ${code(g.x)}, y: ${code(g.y)}, w: ${code(g.w)}, h: ${code(g.h)}`;
            }
            return '';
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
                    <span id='geometry' dangerouslySetInnerHTML={{ __html: geometry() }} />
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
                    setInterval(_ => {
                        document.getElementById('time').innerHTML = time();
                        document.getElementById('resolution').innerHTML = resolution();
                    }, Constants.CLOCK_UPDATE_FREQUENCY)
                }
            </div>
        );
    }
}

Client.propTypes = {
    log: PropTypes.object.isRequired,
    query: PropTypes.string.isRequired
};
