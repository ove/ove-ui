/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';

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

        if (['controller', 'replicator'].includes(this.state.app)) {
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
        if (!this.refs.mode) {
            this.props.jumpToStep(4);
            return false;
        }
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
            this.setState(Object.assign(userInput, validateNewInput, this._validationMessages(validateNewInput)));
            const valid = false;
            this.log.debug('Input is valid:', valid, 'step:', StateConfiguration.name);
            return valid;
        }
    }

    validationCheck() {
        const userInput = this._grabUserInput(); // grab user entered vals
        const validateNewInput = this._validateData(userInput); // run the new input against the validator

        this.setState(Object.assign(userInput, validateNewInput, this._validationMessages(validateNewInput)));
        this.log.debug('Ran validation check at step:', StateConfiguration.name);
    }

    _validateData(data) {
        // Based on https://gist.github.com/dperini/729294
        const VALID_URL_REGEX = new RegExp(
            "^" +
                // protocol identifier (optional)
                // short syntax // still required
                "(?:(?:(?:https?|ftp):)?\\/\\/)" +
                // user:pass BasicAuth (optional)
                "(?:\\S+(?::\\S*)?@)?" +
                "(?:" +
                    // IP address dotted notation octets
                    // excludes loopback network 0.0.0.0
                    // excludes reserved space >= 224.0.0.0
                    // excludes network & broacast addresses
                    // (first & last IP address of each class)
                    "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
                    "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
                    "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
                "|" +
                    // host & domain names, may end with dot
                    // can be replaced by a shortest alternative
                    // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
                    "(?:" +
                    "(?:" +
                        "[a-z0-9\\u00a1-\\uffff]" +
                        "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
                    ")?" +
                    "[a-z0-9\\u00a1-\\uffff]\\." +
                    ")+" +
                    // TLD identifier name must not end with a dot
                    "(?:[a-z\\u00a1-\\uffff]{2,})" +
                "|" +
                    // Accept localhost as a valid URL
                    "(?:localhost)" +
                ")" +
                // port number (optional)
                "(?::\\d{2,5})?" +
                // resource path (optional)
                "(?:[/?#]\\S*)?" +
            "$", "i"
        );
        return {
            stateVal: (data.mode === 'new' || data.state !== ''),
            urlVal: (data.mode !== 'new' || VALID_URL_REGEX.test(data.url))
        };
    }

    _validationMessages(val) {
        return {
            stateValMsg: val.stateVal ? '' : 'A state must be selected',
            urlValMsg: val.urlVal ? '' : 'The asset URL is not valid'
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
            case 'alignment':
                return (<h3>The <code>Alignment App</code> does not require a state configuration.
                    Please press <code>Next</code> to proceed.</h3>);
            case 'whiteboard':
                return (<h3>The <code>Whiteboard App</code> does not require a state configuration.
                    Please press <code>Next</code> to proceed.</h3>);
            case 'maps':
            case 'webrtc':
                return (<h3>You are creating an application of type <code>{this.state.app}</code> in space <code>{this.state.space}</code>.
                    Please select one of the following pre-loaded states.</h3>);
            default:
                return (<h3>You are creating an application of type <code>{this.state.app}</code> in space <code>{this.state.space}</code>.
                    Please select an existing state or provide an asset URL to create a new state configuration.</h3>);
        }
    }

    _getMode() {
        if (['maps', 'webrtc'].includes(this.state.app)) {
            return (
                <input type="hidden" ref="mode" value="existing" />
            );
        } else if (!['alignment', 'whiteboard'].includes(this.state.app)) {
            return (
                <div className="col-md-12">
                    <div className="form-group col-md-8 content form-block-holder">
                        <label className="control-label col-md-3">
                            Mode
                        </label>
                        <div className="no-error col-md-5">
                            <select ref="mode" autoComplete="off" className="form-control" required defaultValue={this.state.mode} onBlur={this.validationCheck}>
                                <option value="existing">Use existing state</option>
                                <option value="new">New state configuration</option>
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

        if (typeof this.state.stateVal == 'undefined' || this.state.stateVal) {
            notValidClasses.stateCls = 'no-error col-md-5';
        } else {
            notValidClasses.stateCls = 'has-error col-md-5';
            notValidClasses.stateValGrpCls = 'val-err-tooltip';
        }
        if (!['alignment', 'whiteboard'].includes(this.state.app)) {
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

        if (typeof this.state.urlVal == 'undefined' || this.state.urlVal) {
            notValidClasses.urlCls = 'no-error col-md-8';
        } else {
            notValidClasses.urlCls = 'has-error col-md-8';
            notValidClasses.urlValGrpCls = 'val-err-tooltip';
        }
        if (!['alignment', 'whiteboard', 'maps', 'webrtc'].includes(this.state.app)) {
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
                                <h1>Step 3: Configure application state for section</h1>
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
