/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Constants from '../constants/launcher';

import { Form, Button, Divider, Header } from 'semantic-ui-react';
import axios from 'axios';

export default class StateConfiguration extends Component {
    constructor (props) {
        super(props);

        this.state = {
            states: []
        };

        this.determineErrors = this.determineErrors.bind(this);
    }

    determineErrors () {
        if (Constants.APPS.WEBRTC.name === this.props.app && this.props.mode !== Constants.Mode.EXISTING) {
            this.props.updateMode(Constants.Mode.EXISTING);
        }

        let errors = { existingState: null, newState: null };

        if (this.props.mode === Constants.Mode.EXISTING) {
            if (!this.props.state) {
                errors.existingState = 'You must select a state';
            } else if ((this.props.state === 'SigmaSample' || this.props.state === 'LesMiserables') && (this.props.geometry.h > 1616 || this.props.geometry.w > 2880)) {
                errors.existingState = 'Must display in resolution <= 2880x1616, currently displaying in - ' + this.props.geometry.w.toString() + 'x' + this.props.geometry.h.toString();
            }
        } else if (this.props.mode === Constants.Mode.NEW) {
            const url = this.props.url;

            let urlObj;
            try {
                urlObj = new URL(this.props.url);
            } catch (error) {
                urlObj = false;
            }

            if (!url) {
                errors.newState = 'You must enter a URL';
            } else if (!Constants.VALID_URL_REGEX.test(this.props.url) || !urlObj) {
                errors.newState = 'Invalid URL';
            } else if (urlObj.hostname.toString().includes('youtube') && !Constants.YOUTUBE_URL_REGEX.test(url)) {
                errors.newState = 'Youtube URLs must have the format http://www.youtube.com/embed/<VIDEO_ID>';
            }
        }

        if (errors.newState !== this.props.errors.newState || errors.existingState !== this.props.errors.existingState) {
            this.props.updateErrors(errors);
        }
    }

    componentDidMount () {
        this.listExistingStates(this.props.app);
        this.determineErrors();
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        if (this.props.app !== prevProps.app) {
            this.setState({ states: [] }, this.listExistingStates(this.props.app));
        } else if (this.props.mode === Constants.Mode.EXISTING && this.state.states && this.state.states.length === 1 && this.props.state !== this.state.states[0]) {
            this.props.updateState(this.state.states[0]);
        }

        this.determineErrors();
    }

    listExistingStates (app) {
        if (!app) { return; }
        axios.get('//' + Constants.REACT_APP_OVE_APP(app) + '/states')
            .then(res => res.data)
            .then(states => {
                this.setState({ states });
            }).catch(this.props.log.error);
    }

    render () {
        let existingStates = this.state.states.map(e => ({ key: e, value: e, text: e }));

        if ([Constants.APPS.ALIGNMENT.name, Constants.APPS.WHITEBOARD.name, Constants.APPS.REPLICATOR.name, Constants.APPS.CONTROLLER.name].includes(this.props.app)) {
            return '';
        }

        return (
            <>
                <Divider horizontal>
                    <Header as='h2'>
                    Application State
                    </Header>
                </Divider>

                <Form>
                    { Constants.APPS.WEBRTC.name === this.props.app

                        ? <input type="hidden" ref="mode" value={Constants.Mode.EXISTING} />

                        : <Form.Field>
                            <Button.Group>
                                <Button positive={this.props.mode === Constants.Mode.EXISTING} onClick={() => this.props.updateMode(Constants.Mode.EXISTING)}>Use existing state</Button>
                                <Button.Or />
                                <Button positive={this.props.mode === Constants.Mode.NEW} onClick={() => this.props.updateMode(Constants.Mode.NEW)}>New state configuration</Button>
                            </Button.Group>
                        </Form.Field>
                    }

                    { ![Constants.APPS.ALIGNMENT.name, Constants.APPS.WHITEBOARD.name].includes(this.props.app) && (this.props.mode === Constants.Mode.EXISTING) &&

                    <Form.Select options={existingStates}
                        label="Existing state"
                        value={this.props.state}
                        onChange={(_, d) => this.props.updateState(d.value)}
                        error={this.props.errors.existingState && { content: this.props.errors.existingState, pointing: Constants.Pointing.ABOVE }}
                        width={6}
                    />
                    }

                    {(![Constants.APPS.ALIGNMENT.name, Constants.APPS.WHITEBOARD.name, Constants.APPS.WEBRTC.name].includes(this.props.app)) && (this.props.mode === Constants.Mode.NEW) &&

                        <Form.Group>
                            <Form.Input
                                autoComplete="off"
                                type="url"
                                placeholder="Asset URL"
                                defaultValue={this.props.url}
                                onChange={ev => this.props.updateURL(ev.target.value)}
                                error={this.props.errors.newState && { content: this.props.errors.newState, pointing: Constants.Pointing.ABOVE }}/>
                        </Form.Group>
                    }

                </Form>
            </>
        );
    }
}

StateConfiguration.propTypes = {
    log: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
    updateMode: PropTypes.func.isRequired,
    updateURL: PropTypes.func.isRequired,
    updateErrors: PropTypes.func.isRequired,

    app: PropTypes.string.isRequired,
    mode: PropTypes.oneOf([Constants.Mode.EXISTING, Constants.Mode.NEW]),
    state: PropTypes.string,
    url: PropTypes.string,
    geometry: PropTypes.shape({ x: PropTypes.string, y: PropTypes.string, w: PropTypes.string, h: PropTypes.string }),

    errors: PropTypes.shape({ newState: PropTypes.string, existingState: PropTypes.string })

};
