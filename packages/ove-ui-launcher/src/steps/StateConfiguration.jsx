/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import Constants from '../constants/launcher';

export default class StateConfiguration extends Component {
    constructor(props) {
        super(props);

        this.log = props.getLogger();
        this.state = {
            app: props.getStore().app,
            state: props.getStore().state,
            space: props.getStore().space,
            url: props.getStore().url,
            mode: props.getStore().mode,
            states: props.getStore().states
        };

        if ([Constants.App.CONTROLLER, Constants.App.REPLICATOR].includes(this.state.app)) {
            this.props.jumpToStep(1);
            return;
        }

        this.validationCheck = this.validationCheck.bind(this);
        this.isValidated = this.isValidated.bind(this);
        this.log.debug('Displaying step:', StateConfiguration.name);
    }

    componentDidMount() { }

    componentWillUnmount() { }

    isValidated() {
        const userInput = this._grabUserInput(); // grab user entered vals
        const validateNewInput = this._validateData(userInput); // run the new input against the validator

        // if full validation passes then save to store and pass as valid
        if (Object.keys(validateNewInput).every((k) => { return validateNewInput[k] !== false; })) {
            if (JSON.stringify(this.props.getStore().state) !== JSON.stringify(userInput.state) ||
                this.props.getStore().mode !== userInput.mode ||
                this.props.getStore().url !== userInput.url) { // only update store of something changed
                this.props.updateStore({
                    ...userInput
                });
            }
            const valid = true;
            this.log.debug('Input is valid:', valid, 'step:', StateConfiguration.name);
            return valid;
        } else {
            // if anything fails then update the UI validation state but NOT the UI Data State
            this.setState(Object.assign(userInput, validateNewInput, this._validationMessages(userInput, validateNewInput)));
            const valid = false;
            this.log.debug('Input is valid:', valid, 'step:', StateConfiguration.name);
            return valid;
        }
    }

    validationCheck() {
        const userInput = this._grabUserInput(); // grab user entered vals
        const validateNewInput = this._validateData(userInput); // run the new input against the validator

        this.setState(Object.assign(userInput, validateNewInput, this._validationMessages(userInput, validateNewInput)));
        this.log.debug('Ran validation check at step:', StateConfiguration.name);
    }

    _validateData(data) {
        return {
            stateVal: (data.mode === Constants.Mode.NEW || data.state !== ''),
            urlVal: (data.mode !== Constants.Mode.NEW ||
                (Constants.VALID_URL_REGEX.test(data.url) && this._validateYoutubeURL(data)))
        };
    }

    _validateYoutubeURL(data) {
        return this.state.app !== Constants.App.VIDEOS || data.mode !== Constants.Mode.NEW || Constants.YOUTUBE_URL_REGEX.test(data.url);
    }

    _validationMessages(data, val) {
        return {
            stateValMsg: val.stateVal ? '' : 'A state must be selected',
            urlValMsg: this._validateYoutubeURL(data) ? (
                val.urlVal ? ''  : 'The asset URL is not valid') : 'Youtube URLs ' +
                'must have the format http://www.youtube.com/embed/<VIDEO_ID>'
        };
    }

    _grabUserInput() {
        return {
            mode: this.refs.mode ? this.refs.mode.value : undefined,
            state: this.refs.state ? this.refs.state.value : undefined,
            url: this.refs.url ? this.refs.url.value : undefined
        };
    }

    _getSelectionItems() {
        let items = [];
        if (this.state.states) {
            this.state.states.forEach(e => {
                items.push(<option key={e} value={e}>{e}</option>);
            });
        }
        return items;
    }

    _getInstructions() {
        switch (this.state.app) {
            case Constants.App.ALIGNMENT:
                return (<h3>The <code>Alignment App</code> does not require a state configuration.
                    Please press <code>Next</code> to proceed.</h3>);
            case Constants.App.WHITEBOARD:
                return (<h3>The <code>Whiteboard App</code> does not require a state configuration.
                    Please press <code>Next</code> to proceed.</h3>);
            case Constants.App.MAPS:
            case Constants.App.WEBRTC:
                return (<h3>You are creating an application of type <code>{this.state.app}</code> in space <code>{this.state.space}</code>.<br />
                    Please select one of the following pre-loaded states.</h3>);
            default:
                return (<h3>You are creating an application of type <code>{this.state.app}</code> in space <code>{this.state.space}</code>.<br />
                    Please select an existing state or create a new state by providing an asset URL.</h3>);
        }
    }

    _getMode() {
        if ([Constants.App.MAPS, Constants.App.WEBRTC].includes(this.state.app)) {
            return (
                <input type="hidden" ref="mode" value={Constants.Mode.EXISTING} />
            );
        } else if (![Constants.App.ALIGNMENT, Constants.App.WHITEBOARD].includes(this.state.app)) {
            return (
                <div className="col-md-12">
                    <div className="form-group col-md-8 content form-block-holder">
                        <label className="control-label col-md-3">
                            Mode
                        </label>
                        <div className="no-error col-md-5">
                            <select ref="mode" autoComplete="off" className="form-control" required defaultValue={this.state.mode} onBlur={this.validationCheck}>
                                <option value={Constants.Mode.EXISTING}>Use existing state</option>
                                <option value={Constants.Mode.NEW}>New state configuration</option>
                            </select>
                        </div>
                    </div>
                </div>
            );
        }
    }

    _getStateSelection() {
        // explicit class assigning based on validation
        let notValidClasses = {};

        if (typeof this.state.stateVal == Constants.UNDEFINED || this.state.stateVal) {
            notValidClasses.stateCls = 'no-error col-md-5';
        } else {
            notValidClasses.stateCls = 'has-error col-md-5';
            notValidClasses.stateValGrpCls = 'val-err-tooltip';
        }
        if (![Constants.App.ALIGNMENT, Constants.App.WHITEBOARD].includes(this.state.app)) {
            return (
                <div className="col-md-12">
                    <div className="form-group col-md-8 content form-block-holder">
                        <label className="control-label col-md-3">
                            Existing state
                        </label>
                        <div className={notValidClasses.stateCls}>
                            <select ref="state" autoComplete="off" className="form-control" required defaultValue={this.state.state} onBlur={this.validationCheck}>
                                <option value="">Please select</option>
                                {this._getSelectionItems()}
                            </select>
                            <div className={notValidClasses.stateValGrpCls}>{this.state.stateValMsg}</div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    _getConfigurationEntry() {
        // explicit class assigning based on validation
        let notValidClasses = {};

        if (typeof this.state.urlVal == Constants.UNDEFINED || this.state.urlVal) {
            notValidClasses.urlCls = 'no-error col-md-8';
        } else {
            notValidClasses.urlCls = 'has-error col-md-8';
            notValidClasses.urlValGrpCls = 'val-err-tooltip';
        }
        if (![Constants.App.ALIGNMENT, Constants.App.WHITEBOARD, Constants.App.MAPS, Constants.App.WEBRTC].includes(this.state.app)) {
            return (
                <div className="col-md-12">
                    <div className="form-group col-md-8 content form-block-holder">
                        <label className="control-label col-md-3">
                            Asset URL
                        </label>
                        <div className={notValidClasses.urlCls}>
                            <input
                                ref="url"
                                autoComplete="off"
                                type="url"
                                placeholder="Asset URL"
                                className="form-control"
                                required
                                defaultValue={this.state.url}
                                onBlur={this.validationCheck} />
                            <div className={notValidClasses.urlValGrpCls}>{this.state.urlValMsg}</div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="step selectStateConfiguration">
                <div className="row">
                    <form id="Form" className="form-horizontal">
                        <div className="form-group">
                            <label className="col-md-12 control-label">
                                <h1>Step 3: Configure application state</h1>
                                {this._getInstructions()}
                            </label>
                            {this._getMode()}
                            {this._getStateSelection()}
                            {this._getConfigurationEntry()}
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
