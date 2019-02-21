/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import axios from 'axios';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/shell/shell';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';

// Setup jQuery to work inside React
import $ from 'jquery';
window.$ = $;

export default class Confirm extends Component {
    constructor(props) {
        super(props);

        this.log = props.getLogger();

        this.state = {
            app: props.getStore().app,
            space: props.getStore().space,
            deleteSections: props.getStore().deleteSections,
            showController: props.getStore().showController,
            payload: {
                space: props.getStore().space,
                ...props.getStore().geometry,
                app: {
                    url: 'http://' + process.env['REACT_APP_OVE_APP_' + props.getStore().app.toUpperCase()],
                    states: {}
                }
            },
            os: 'unix'
        }

        if (['replicator', 'controller'].includes(this.state.app)) {
            this.state.payload.app.states.load = JSON.parse(props.getStore().config);
        } else if (['alignment', 'whiteboard'].includes(this.state.app)) {
            delete this.state.payload.app.states;
        } else if (['maps', 'webrtc'].includes(this.state.app) || props.getStore().mode !== 'new') {
            this.state.payload.app.states.load = props.getStore().state;
        } else {
            this.state.payload.app.states.load = props.getStore().config ? JSON.parse(props.getStore().config) : {};
        }
        this.log.debug('Computed payload for create section operation:', this.state.payload);

        this.changeSelect = this.changeSelect.bind(this);
        this.isValidated = this.isValidated.bind(this);
        this.log.debug('Displaying step:', Confirm.name);
    }

    componentDidMount() { }

    componentWillUnmount() { }

    changeSelect() {
        if (this.refs.os && this.state.os !== this.refs.os.value) {
            this.setState({ os: this.refs.os.value });
        }
    }

    isValidated() {
        return new Promise((resolve, _reject) => {
            const loadApp = _ => {
                axios.post('http://' + process.env.REACT_APP_OVE_HOST + '/section', this.state.payload).then(res => {
                    if ((res.data.id || res.data.id === 0)) {
                        const controllerURL = 'http://' + process.env['REACT_APP_OVE_APP_' + this.state.app.toUpperCase()] +
                            '/control.html?oveSectionId=' + res.data.id;
                        if (this.state.showController) {
                            $('<a>', {
                                class: 'section-controller',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                href: controllerURL
                            }).css('display', 'none').appendTo($('body'));
                            this.log.debug('Loading controller for section:', res.data.id);
                            $('a.section-controller')[0].click();
                            $('a.section-controller').remove();
                        }
                        this.props.updateStore({
                            controllerURL: controllerURL
                        });
                    } else {
                        this.props.updateStore({
                            controllerURL: undefined
                        });
                    }
                    resolve(true);
                }).catch(this.log.error);
            };
            if (this.state.deleteSections) {
                axios.delete('http://' + process.env.REACT_APP_OVE_HOST + '/sections').then(_ => {
                    setTimeout(loadApp, 1000);
                }).catch(this.log.error);
            } else {
                loadApp();
            }
        });
    }

    _getCurlPayload() {
        const DELETE_SECTIONS_COMMAND = 'curl --header "Content-Type: application/json" --request DELETE http://' +
            process.env.REACT_APP_OVE_HOST + '/sections'
        if (this.state.os === 'unix') {
            return (this.state.deleteSections ? DELETE_SECTIONS_COMMAND + '\n' : '') +
                'curl --header "Content-Type: application/json" --request POST --data \'' +
                JSON.stringify(this.state.payload) + '\' http://' + process.env.REACT_APP_OVE_HOST + '/section';
        } else {
            return (this.state.deleteSections ? DELETE_SECTIONS_COMMAND + '\n' : '') +
                'curl --header "Content-Type: application/json" --request POST --data ' +
                JSON.stringify(JSON.stringify(this.state.payload)) + ' http://' + process.env.REACT_APP_OVE_HOST +
                '/section';
        }
    }

    render() {
        let cmOptions = {
            lineNumberFormatter: _ => '',
            lineNumbers: true,
            lineWrapping: true,
            mode: 'shell',
            readOnly: true,
            value: this._getCurlPayload(),
            theme: 'dracula'
        };
        return (
            <div className="step confirm">
                <div className="row">
                    <form id="Form" className="form-horizontal">
                        <div className="form-group">
                            <label className="col-md-12 control-label">
                                <h1>Step 5: Load a new application instance</h1>
                                <h3>Pressing <code>Load</code> below will create a new instance of an application of
                                    type <code>{this.state.app}</code> in space <code>{this.state.space}</code>.
                                    The same operation can also be executed on a CLI using <a href="https://curl.haxx.se/docs/manpage.html" target="_blank" rel="noopener noreferrer">curl</a>.
                                    Please note that the application's controller may not automatically launch if you have any pop-up blockers on your web browser.</h3>
                            </label>
                            <div className="col-md-12">
                                <div className="form-group col-md-9 content form-block-holder">
                                    <label className="control-label col-md-3">
                                        Operating System
                                    </label>
                                    <div className="no-error col-md-5">
                                        <select ref="os" autoComplete="off" className="form-control" required defaultValue={this.state.os} onChange={this.changeSelect}>
                                            <option value="unix">Linux/Mac</option>
                                            <option value="windows">Windows</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group col-md-12 content form-block-holder">
                                    <div className="no-error col-md-12">
                                        <CodeMirror value={this._getCurlPayload()} options={cmOptions} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
