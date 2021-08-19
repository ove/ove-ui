/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import { AppBar, Toolbar } from '@material-ui/core';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import './logs.css';
import 'semantic-ui-css/semantic.min.css';
import Constants from '../constants/logs';

export default class Logs extends Component {
    constructor (props) {
        super(props);

        this.log = props.log;

        this.state = { list: [], logs: [], components: [], componentsList: [] };
        this.state = {
            ...this.state,
            ...(JSON.parse(window.localStorage.getItem(Constants.LOCAL_STORAGE_KEY))),
            appAvailable: undefined
        };
        const socket = new WebSocket(`ws://${Constants.REACT_APP_OVE_HOST}/ui/logs`);
        socket.onmessage = (msg) => {
            const data = JSON.parse(msg.data);
            if (data.name === 'init') {
                this.setState({ componentsList: data.config });
            } else if (data.name === 'message') {
                let body = data.body.trim();
                let nl;
                if (body.charAt(0) !== '[') {
                    nl = this.state.list
                        .slice(0, this.state.list.length - 1)
                        .concat([this.state.list[this.state.list.length - 1] + body]);
                } else {
                    nl = this.state.list.concat([body.trim()]);
                }
                this.setState({ list: nl });
            }
        };
    }

    _getColor (msg) {
        if (msg.includes('[ERROR]')) {
            return 'red';
        } else if (msg.includes('[WARN]')) {
            return '#ff4500';
        } else if (msg.includes('[TRACE]')) {
            return 'green';
        } else if (msg.includes('[DEBUG]')) {
            return 'blue';
        } else if (msg.includes('[INFO]')) {
            return '#800080';
        } else {
            return 'black';
        }
    }

    _contains (y, xs) {
        return xs.some(x => {
            if (y.includes(x)) {
                return true;
            }
        });
    }

    handleLogChange (event, data) {
        this.setState({ logs: data.value });
    }

    handleComponentChange (event, data) {
        this.setState({ components: data.value });
    }

    filter () {
        return this.state.list.filter(y => (this.state.logs.length === 0 || this._contains(y, this.state.logs)) &&
            (this.state.components.length === 0 || this._contains(y, this.state.components)));
    }

    render () {
        window.localStorage.setItem(Constants.LOCAL_STORAGE_KEY, JSON.stringify(this.state));
        const logLevels = ['Debug', 'Info', 'Trace', 'Warn', 'Error'].map(s => ({
            key: s,
            text: s,
            value: s.toUpperCase()
        }));
        const components = this.state.componentsList.map(s => ({ key: s, text: s, value: s.toLowerCase() }));

        return (
            <>
                <AppBar position={'sticky'}>
                    <Toolbar>
                        <h1 style={{ flexGrow: 1 }}>OVE Application Logs</h1>
                        <button onClick={() => window.scrollTo(0, document.body.scrollHeight)}>
                            To Bottom
                        </button>
                        <button
                            style={{ float: 'right' }}
                            onClick={() => this.setState({ list: [] })}>
                            Clear
                        </button>
                    </Toolbar>
                    <Dropdown
                        placeholder={'Log Levels'}
                        fluid multiple selection options={logLevels}
                        onChange={this.handleLogChange.bind(this)}
                    />
                    <Dropdown
                        placeholder={'Component'}
                        fluid multiple selection options={components}
                        onChange={this.handleComponentChange.bind(this)}
                    />
                </AppBar>
                <div style={{ margin: '35px', height: '100%' }}>
                    <ul style={{ margin: '35px', height: '100%' }}>
                        {this.filter().map(s => <li key={s}>
                            <span style={{ color: this._getColor(s.split(' ')[0]) }}>{s.split(' ')[0]}</span>
                            <span> {s.split(' ').slice(1).join(' ')}</span>
                        </li>)}
                    </ul>
                    <p style={{ margin: '8px' }}/>
                </div>
            </>
        );
    }
}

Logs.propTypes = {
    log: PropTypes.object.isRequired
};
