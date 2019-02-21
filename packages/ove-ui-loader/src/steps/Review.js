/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import Constants from '../constants/loader';
import CodeMirror from 'react-codemirror';
import { js_beautify } from 'js-beautify'
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';

export default class Review extends Component {
    constructor(props) {
        super(props);

        this.log = props.getLogger();
        this.state = {
            app: props.getStore().app,
            space: props.getStore().space,
            geometry: props.getStore().geometry,
            deleteSections: props.getStore().deleteSections,
            showController: props.getStore().showController
        }
        if (props.getStore().mode === Constants.Mode.NEW) {
            this.state.config = props.getStore().url ?
                JSON.stringify({ url: props.getStore().url }) : props.getStore().config;
        } else {
            this.state.state = props.getStore().state
        }

        if ([Constants.App.ALIGNMENT, Constants.App.WHITEBOARD].includes(this.state.app)) {
            this.props.jumpToStep(2);
            return;
        }

        this.updateCode = this.updateCode.bind(this);
        this.validationCheck = this.validationCheck.bind(this);
        this.isValidated = this.isValidated.bind(this);
        this.log.debug('Displaying step:', Review.name);
    }

    componentDidMount() { }

    componentWillUnmount() { }

    isValidated() {
        const userInput = this._grabUserInput(); // grab user entered vals
        const validateNewInput = this._validateData(userInput); // run the new input against the validator

        // if full validation passes then save to store and pass as valid
        if (Object.keys(validateNewInput).every((k) => { return validateNewInput[k] !== false; })) {
            this.props.updateStore({
                ...userInput
            });
            const valid = true;
            this.log.debug('Input is valid:', valid, 'step:', Review.name);
            return valid;
        } else {
            // if anything fails then update the UI validation state but NOT the UI Data State
            this.setState(Object.assign(userInput, validateNewInput, this._validationMessages(validateNewInput)));
            const valid = false;
            this.log.debug('Input is valid:', valid, 'step:', Review.name);
            return valid;
        }
    }

    validationCheck() {
        const userInput = this._grabUserInput(); // grab user entered vals
        const validateNewInput = this._validateData(userInput); // run the new input against the validator

        this.setState(Object.assign(userInput, validateNewInput, this._validationMessages(validateNewInput)));
        this.log.debug('Ran validation check at step:', Review.name);
    }

    updateCode(config) {
        this.setState({
            config: config
        });
        this.validationCheck();
    }

    _isValidJSON(str) {
        try {
            JSON.parse(str);
        } catch (_) {
            return false;
        }
        return true;
    }

    _validateData(data) {
        return {
            configVal: this.state.state || (data.config !== '' && this._isValidJSON(data.config))
        };
    }

    _validationMessages(val) {
        return {
            configValMsg: val.configVal ? '' : 'State configuration is invalid'
        };
    }

    _grabUserInput() {
        return {
            config: this.state.config,
            deleteSections: JSON.parse(this.refs.deleteSections.value),
            showController: JSON.parse(this.refs.showController.value)
        };
    }

    _getInstructions() {
        if (this.state.state) {
            return (
                <h3>Pressing <code>Next</code> will finalise the configuration for creating an instance of an application of
                type <code>{this.state.app}</code> in space <code>{this.state.space}</code> with
                geometry <code>{JSON.stringify(this.state.geometry)}</code>. The <code>{this.state.state}</code> state
                configuration will be pre-loaded with this application instance.</h3>
            );
        } else {
            return (
                <h3>Pressing <code>Next</code> finalise the configuration for creating an instance of an application of
                type <code>{this.state.app}</code> in space <code>{this.state.space}</code> with
                geometry <code>{JSON.stringify(this.state.geometry)}</code>. The following state configuration
                will be pre-loaded with this application instance. <a href={'https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-' + this.state.app + '/README.html#application-state'} target="_blank" rel="noopener noreferrer">Advanced configuration options</a> can
                be passed by modifying the state configuration displayed below.</h3>
            );
        }
    }

    _showConfiguration() {
        if (!this.state.state) {
            let cmOptions = {
                lineNumbers: true,
                lineWrapping: true,
                mode: {name: Constants.CodeMirror.Mode.JS, json: true},
                smartIndent: true,
                theme: Constants.CodeMirror.THEME
            };
            // explicit class assigning based on validation
            let notValidClasses = {};
    
            if (typeof this.state.configVal == Constants.UNDEFINED || this.state.configVal) {
                notValidClasses.configCls = 'no-error col-md-8';
            } else {
                notValidClasses.configCls = 'has-error col-md-8';
                notValidClasses.configValGrpCls = 'val-err-tooltip';
            }
            return (    
                <div className="col-md-12">
                    <div className="form-group col-md-8 content form-block-holder">
                        <label className="control-label col-md-3">
                            Configuration
                        </label>
                        <div className="col-md-9">
                            <CodeMirror value={js_beautify(this.state.config, { indent_size: 2   })} onChange={this.updateCode} options={cmOptions} />
                            <div className={notValidClasses.configValGrpCls}>{this.state.configValMsg}</div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="step review">
                <div className="row">
                    <form id="Form" className="form-horizontal">
                        <div className="form-group">
                            <label className="col-md-12 control-label">
                                <h1>Step 4: Review state configuration and operation details</h1>
                                <h3>Please select additional actions that should be performed when loading the application instance.</h3>
                            </label>
                            <div className="col-md-12">
                                <div className="form-group col-md-8 content form-block-holder">
                                    <label className="control-label col-md-3">
                                        Delete sections
                                    </label>
                                    <div className="no-error col-sm-2">
                                        <select ref="deleteSections" autoComplete="off" className="form-control" required defaultValue={this.state.deleteSections} onBlur={this.validationCheck}>
                                            <option value="false">No</option>
                                            <option value="true">Yes</option>
                                        </select>
                                    </div>
                                    <label className="control-label col-md-3">
                                        Show controller
                                    </label>
                                    <div className="no-error col-sm-2">
                                        <select ref="showController" autoComplete="off" className="form-control" required defaultValue={this.state.showController} onBlur={this.validationCheck}>
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <label className="col-md-12 control-label">
                                {this._getInstructions()}
                            </label>
                            {this._showConfiguration()}
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
