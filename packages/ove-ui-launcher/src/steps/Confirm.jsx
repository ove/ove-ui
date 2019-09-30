/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Constants from '../constants/launcher';
import axios from 'axios';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/shell/shell';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';

import { Form, Button, Divider, Header } from 'semantic-ui-react';

export default class Confirm extends Component {
    constructor (props) {
        super(props);

        this.state = {
            payload: { }
        };

        this.constructPayload = this.constructPayload.bind(this);
        this._launch = this._launch.bind(this);
    }

    componentDidMount () {
        this.constructPayload(this.props); // can't call from constructor, as setState can't be called on a component until it is mounted
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            this.constructPayload(this.props);
        }
    }

    constructPayload (props) {
        let payload = {
            space: props.space,
            ...props.geometry,
            app: {
                url: 'http://' + Constants.REACT_APP_OVE_APP(props.app),
                states: {}
            }
        };

        // Handle fact that user may have used CodeMirror to enter an invalid state config
        let parsedConfig;
        try {
            parsedConfig = JSON.parse(props.config);
        } catch (e) {
            parsedConfig = {};
        }

        if ([Constants.APPS.REPLICATOR.name, Constants.APPS.CONTROLLER.name].includes(props.app)) {
            payload.app.states.load = parsedConfig;
        } else if ([Constants.APPS.ALIGNMENT.name, Constants.APPS.WHITEBOARD.name].includes(props.app)) {
            delete payload.app.states;
        } else if ([Constants.APPS.WEBRTC.name].includes(props.app) || props.mode !== Constants.Mode.NEW) {
            payload.app.states.load = props.state;
        } else {
            payload.app.states.load = props.config ? parsedConfig : {};
        }

        this.setState({ payload });
    }

    _launch () {
        return new Promise((resolve, reject) => {
            const launchApp = _ => {
                axios.post('//' + Constants.REACT_APP_OVE_HOST + '/section', this.state.payload).then(res => {
                    if (this.props.app !== Constants.APPS.REPLICATOR.name && (res.data.id || res.data.id === 0)) {
                        const controllerURL = '//' + Constants.REACT_APP_OVE_APP(this.props.app) +
                            '/control.html?oveSectionId=' + res.data.id;
                        this.props.updateControllerURL(controllerURL);

                        if (this.props.showController) {
                            window.open(controllerURL);
                        }
                    } else {
                        this.props.updateControllerURL(undefined);
                    }
                    resolve(true);
                }).catch(error => console.log(error));
            };
            if (this.props.deleteSections) {
                axios.delete('//' + Constants.REACT_APP_OVE_HOST + '/sections?space=' + this.props.space).then(_ => {
                    setTimeout(launchApp, Constants.SECTION_DELETE_WAIT_TIME);
                }).catch(error => console.log(error));
            } else {
                launchApp();
            }
        });
    }

    _getCurlPayload () {
        const DELETE_SECTIONS_COMMAND = 'curl --header "Content-Type: application/json" --request DELETE http://' +
            Constants.REACT_APP_OVE_HOST + '/sections?space=' + this.props.space + '\n';
        if (this.props.os === Constants.OS.UNIX) {
            return (this.props.deleteSections ? DELETE_SECTIONS_COMMAND + '\n' : '') +
                'curl --header "Content-Type: application/json" --request POST --data \'' +
                JSON.stringify(this.state.payload) + '\' http://' + Constants.REACT_APP_OVE_HOST + '/section';
        } else {
            return (this.props.deleteSections ? DELETE_SECTIONS_COMMAND + '\n' : '') +
                'curl --header "Content-Type: application/json" --request POST --data ' +
                JSON.stringify(JSON.stringify(this.state.payload)) + ' http://' + Constants.REACT_APP_OVE_HOST +
                '/section';
        }
    }

    render () {
        let cmOptions = {
            lineNumberFormatter: _ => '',
            lineNumbers: true,
            lineWrapping: true,
            mode: Constants.CodeMirror.Mode.SHELL,
            readOnly: true,
            value: this._getCurlPayload(),
            theme: Constants.CodeMirror.THEME
        };

        const osChoices = [{ key: 'unix', value: Constants.OS.UNIX, text: 'Linux/Mac' }, { key: 'windows', value: Constants.OS.WINDOWS, text: 'Windows' }];

        return (
            <>
                <Divider horizontal>
                    <Header as='h2'>
                        Launch Application
                    </Header>
                </Divider>

                <p>You can launch the section configured above by pressing the <code>Launch</code> button.</p>

                {!this.props.showController ||
                <p>Please note that the application&#39;s controller may not automatically launch if you
                    have any pop-up blockers on your web browser.</p>}

                <p>Alternatively, you can use a terminal to run the command listed below, which
                    uses <a href="https://curl.haxx.se/docs/manpage.html" target="_blank"
                    rel="noopener noreferrer">curl</a>.
                </p>

                <Form>
                    <Form.Group>
                        <Form.Select label="Operating System" value={this.props.os} options={osChoices}
                            onChange={(_, d) => this.props.updateOS(d.value)}/>
                    </Form.Group>

                    <Form.Group>
                        <CodeMirror value={this._getCurlPayload()} options={cmOptions}/>
                    </Form.Group>

                    <Button fluid positive onClick={this._launch} disabled={!this.props.ready}>Launch!</Button>
                </Form>
            </>
        );
    }
}

Confirm.propTypes = {
    updateControllerURL: PropTypes.func.isRequired,
    updateOS: PropTypes.func.isRequired,

    app: PropTypes.string.isRequired,
    mode: PropTypes.oneOf([Constants.Mode.EXISTING, Constants.Mode.NEW]),
    state: PropTypes.string,
    url: PropTypes.string,
    deleteSections: PropTypes.bool,
    showController: PropTypes.bool,

    space: PropTypes.string,
    geometry: PropTypes.shape({ x: PropTypes.string, y: PropTypes.string, w: PropTypes.string, h: PropTypes.string }),
    os: PropTypes.oneOf([Constants.OS.UNIX, Constants.OS.WINDOWS]),
    ready: PropTypes.bool
};
