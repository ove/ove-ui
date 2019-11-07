/* jshint ignore:start */
// JSHint cannot deal with React.
import React from 'react';
import PropTypes from 'prop-types';
import Constants from '../constants/launcher';
import axios from 'axios';
import { UnControlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/mode/shell/shell';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';

import { Form, Button, Divider, Header } from 'semantic-ui-react';

const Confirm = (props) => {
    if (props.app) {
        axios.get('//' + Constants.REACT_APP_OVE_APP(props.app) + '/name').then(_ => {
            if (props.appAvailable !== true) {
                props.updateAppAvailability(true);
            }
        }).catch(_ => {
            if (props.appAvailable !== false) {
                props.updateAppAvailability(false);
            }
        });
    }

    const constructPayload = (props) => {
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

        return payload;
    };

    const _launch = (payload) => {
        return new Promise((resolve, reject) => {
            const launchApp = _ => {
                axios.post('//' + Constants.REACT_APP_OVE_HOST + '/section', payload).then(res => {
                    if (props.app !== Constants.APPS.REPLICATOR.name && (res.data.id || res.data.id === 0)) {
                        const controllerURL = '//' + Constants.REACT_APP_OVE_APP(props.app) +
                            '/control.html?oveSectionId=' + res.data.id;
                        props.updateControllerURL(controllerURL);

                        if (props.showController) {
                            window.open(controllerURL);
                        }
                    } else {
                        props.updateControllerURL(undefined);
                    }
                    resolve(true);
                }).catch(props.log.error);
            };
            if (props.deleteSections) {
                axios.delete('//' + Constants.REACT_APP_OVE_HOST + '/sections?space=' + props.space).then(_ => {
                    setTimeout(launchApp, Constants.SECTION_DELETE_WAIT_TIME);
                }).catch(props.log.error);
            } else {
                launchApp();
            }
        });
    };

    const _getCurlPayload = (payload) => {
        const DELETE_SECTIONS_COMMAND = 'curl --header "Content-Type: application/json" --request DELETE http://' +
            Constants.REACT_APP_OVE_HOST + '/sections?space=' + props.space + '\n';
        if (props.os === Constants.OS.UNIX) {
            return (props.deleteSections ? DELETE_SECTIONS_COMMAND + '\n' : '') +
                'curl --header "Content-Type: application/json" --request POST --data \'' +
                JSON.stringify(payload) + '\' http://' + Constants.REACT_APP_OVE_HOST + '/section';
        } else {
            return (props.deleteSections ? DELETE_SECTIONS_COMMAND + '\n' : '') +
                'curl --header "Content-Type: application/json" --request POST --data ' +
                JSON.stringify(JSON.stringify(payload)) + ' http://' + Constants.REACT_APP_OVE_HOST +
                '/section';
        }
    };

    const payload = constructPayload(props);

    let cmOptions = {
        lineNumberFormatter: _ => '',
        lineNumbers: true,
        lineWrapping: true,
        mode: Constants.CodeMirror.Mode.SHELL,
        readOnly: true,
        value: _getCurlPayload(payload),
        theme: Constants.CodeMirror.THEME
    };

    const osChoices = [{ key: 'unix', value: Constants.OS.UNIX, text: 'Linux/Mac' }, {
        key: 'windows',
        value: Constants.OS.WINDOWS,
        text: 'Windows'
    }];

    return (
        <>
            <Divider horizontal>
                <Header as='h2'>
                    Launch Application
                </Header>
            </Divider>

            <p>You can launch the section configured above by pressing the <code>Launch</code> button.</p>

            {!props.showController ||
            <p>Please note that the application&#39;s controller may not automatically launch if you
                have any pop-up blockers on your web browser.</p>}

            <p>Alternatively, you can use a terminal to run the command listed below, which
                uses <a href="https://curl.haxx.se/docs/manpage.html" target="_blank"
                rel="noopener noreferrer">curl</a>.
            </p>

            <Form>
                <Form.Group>
                    <Form.Select label="Operating System" value={props.os} options={osChoices}
                        onChange={(_, d) => props.updateOS(d.value)}/>
                </Form.Group>

                <Form.Group>
                    <CodeMirror value={_getCurlPayload(payload)} options={cmOptions}/>
                </Form.Group>

                <Button fluid positive onClick={() => _launch(payload)} disabled={!props.ready || !props.appAvailable}>Launch!</Button>
            </Form>
        </>
    );
};

Confirm.propTypes = {
    log: PropTypes.object.isRequired,
    updateControllerURL: PropTypes.func.isRequired,
    updateOS: PropTypes.func.isRequired,

    app: PropTypes.string.isRequired,
    mode: PropTypes.oneOf([Constants.Mode.EXISTING, Constants.Mode.NEW]),
    state: PropTypes.string,
    url: PropTypes.string,
    config: PropTypes.string,
    deleteSections: PropTypes.bool,
    showController: PropTypes.bool,

    space: PropTypes.string,
    geometry: PropTypes.shape({ x: PropTypes.string, y: PropTypes.string, w: PropTypes.string, h: PropTypes.string }),
    os: PropTypes.oneOf([Constants.OS.UNIX, Constants.OS.WINDOWS]),
    ready: PropTypes.bool,

    appAvailable: PropTypes.bool,
    updateAppAvailability: PropTypes.func.isRequired
};

export default Confirm;
