/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Constants from '../constants/launcher';
import { Controlled as CodeMirror } from 'react-codemirror2';

import { js_beautify as JSBeautify } from 'js-beautify';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';

import { Divider, Form, Header } from 'semantic-ui-react';

export default class Review extends Component {
    constructor (props) {
        super(props);

        this.state = {
            errors: { configError: null },
            config: ''
        };

        this.handleProps = this.handleProps.bind(this);
        this._isValidJSON = this._isValidJSON.bind(this);
        this._formatJSON = this._formatJSON.bind(this);
        this.determineErrors = this.determineErrors.bind(this);

        this.handleProps(props);
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        // Handle change in mode or app props
        if (prevProps !== this.props) {
            this.handleProps(this.props, prevProps);
        }
    }

    handleProps (props, prevProps) {
        if ([Constants.APPS.ALIGNMENT.name].includes(props.app) && !this.props.deleteSections) {
            this.props.updateDeleteSections(true);
        }
        if ([Constants.APPS.REPLICATOR.name].includes(props.app && this.props.updateShowController)) {
            this.props.updateShowController(false);
        }

        // If necessary, update config
        let newConfig;

        if (props.app === Constants.APPS.CONTROLLER.name) {
            newConfig = JSON.stringify({ mode: 'space' });
        } else if (props.app === Constants.APPS.REPLICATOR.name) {
            newConfig = JSON.stringify({ mode: 'space', spaceName: this.props.space, border: 'solid gold' });
        } else if (props.mode === Constants.Mode.NEW) {
            if (!prevProps || prevProps.url !== props.url) {
                // if URL has not changed, keep the provided config (to retain edits made in CodeMirror)
                // this.props.updateConfig(props.config);
                // otherwise, regenerate the config
                newConfig = JSON.stringify({ url: props.url });
            }
        }

        if (newConfig && (!prevProps || newConfig !== prevProps.config)) {
            this.props.updateConfig(newConfig);
        }

        this.determineErrors();
    }

    _formatJSON () {
        const formattedConfig = JSBeautify(this.props.config, { indent_size: 2 });
        if (formattedConfig !== this.props.config) {
            this.props.updateConfig(formattedConfig);
        }
    }

    _isValidJSON (str) {
        try {
            JSON.parse(str);
        } catch (_) {
            return false;
        }
        return true;
    }

    _showConfiguration () {
        if (![Constants.APPS.ALIGNMENT.name, Constants.APPS.WHITEBOARD.name].includes(this.props.app) && (this.props.mode === Constants.Mode.NEW)) {
            let cmOptions = {
                lineNumbers: true,
                lineWrapping: true,
                mode: { name: Constants.CodeMirror.Mode.JS, json: true },
                smartIndent: true,
                theme: Constants.CodeMirror.THEME
            };

            return (
                <div>
                    <CodeMirror value={this.props.config} onBeforeChange={(editor, data, value) => { this.props.updateConfig(value); }} onChange={(e, d, v) => ('') } onBlur={this._formatJSON} options={cmOptions} />

                    {this.props.errors.configError && <div className="error field">
                        <div className="ui pointing above prompt label">{this.props.errors.configError}</div>
                    </div>}

                </div>
            );
        }
    }

    determineErrors () {
        const appNeedsConfig = ![Constants.APPS.ALIGNMENT.name, Constants.APPS.WHITEBOARD.name].includes(this.props.app) && this.props.mode === Constants.Mode.NEW;
        const configError = (appNeedsConfig && (this.props.config === '' || !this._isValidJSON(this.props.config))) ? 'State configuration is invalid' : null;

        if (!this.props.errors || this.props.errors.configError !== configError) {
            this.props.updateErrors({ configError: configError });
        }
    }

    render () {
        const yesOrNo = [{ key: 'yes', value: true, text: 'Yes' }, { key: 'no', value: false, text: 'No' }];
        return (
            <>
                <Divider horizontal>
                    <Header as='h2'>
                    Options
                    </Header>
                </Divider>

                <Form>
                    <Form.Group>
                        {![Constants.APPS.ALIGNMENT.name].includes(this.props.app) &&
                        <Form.Select options={yesOrNo}
                            label="Delete existing sections"
                            autoComplete="off"
                            className="form-control"
                            required value={this.props.deleteSections}
                            onChange={ (_, d) => this.props.updateDeleteSections(d.value)} />
                        }

                        {![Constants.APPS.REPLICATOR.name].includes(this.props.app) &&

                        <Form.Select label="Open controller" options={yesOrNo} autoComplete="off"
                            className="form-control" required value={this.props.showController}
                            onChange={ (_, d) => this.props.updateShowController(d.value)} />
                        }

                    </Form.Group>

                    {![Constants.APPS.ALIGNMENT.name, Constants.APPS.WHITEBOARD.name].includes(this.props.app) && (this.props.mode === Constants.Mode.NEW) &&
                    <p><a
                        href={'https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-' + this.props.app + '/README.html#application-state'}
                        target="_blank" rel="noopener noreferrer">Advanced configuration options</a> can
                        be passed by modifying the state configuration displayed below.</p>}

                    {this._showConfiguration()}

                </Form>
            </>
        );
    }
}

Review.propTypes = {
    updateDeleteSections: PropTypes.func.isRequired,
    updateShowController: PropTypes.func.isRequired,
    updateConfig: PropTypes.func.isRequired,
    updateErrors: PropTypes.func.isRequired,

    app: PropTypes.string.isRequired,
    mode: PropTypes.oneOf([Constants.Mode.EXISTING, Constants.Mode.NEW]),
    space: PropTypes.string,
    state: PropTypes.string,
    url: PropTypes.string,
    deleteSections: PropTypes.bool,
    showController: PropTypes.bool,
    config: PropTypes.string,

    errors: PropTypes.shape({ configError: PropTypes.string })
};
