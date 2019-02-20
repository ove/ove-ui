/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';

export default class SpaceAndGeometry extends Component {
    constructor(props) {
        super(props);

        this.log = props.getLogger();
        this.state = {
            app: props.getStore().app
        };

        this.validationCheck = this.validationCheck.bind(this);
        this.isValidated = this.isValidated.bind(this);
        this.log.debug('Displaying step:', SpaceAndGeometry.name);
    }

    componentDidMount() { }

    componentWillUnmount() { }

    isValidated() {
        const userInput = this._grabUserInput(); // grab user entered vals
        const validateNewInput = this._validateData(userInput); // run the new input against the validator

        // if full validation passes then save to store and pass as valid
        if (Object.keys(validateNewInput).every((k) => { return validateNewInput[k] === true })) {
            if (this.props.getStore().app !== userInput.app) { // only update store of something changed
                this.props.updateStore({
                    ...userInput,
                    savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
                });  // Update store here (this is just an example, in reality you will do it via redux or flux)
            }
            const valid = true;
            this.log.debug('Input is valid:', valid, 'step:', SpaceAndGeometry.name);
            return valid;
        }
        else {
            // if anything fails then update the UI validation state but NOT the UI Data State
            this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
            const valid = false;
            this.log.debug('Input is valid:', valid, 'step:', SpaceAndGeometry.name);
            return valid;
        }
    }

    validationCheck() {
        const userInput = this._grabUserInput(); // grab user entered vals
        const validateNewInput = this._validateData(userInput); // run the new input against the validator

        this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
        this.log.debug('Ran validation check at step:', SpaceAndGeometry.name)
    }

    _validateData(data) {
        return {
            appVal: (data.app !== '')
        }
    }

    _validationErrors(val) {
        return {
            appValMsg: val.appVal ? '' : 'An application must be selected'
        };
    }

    _grabUserInput() {
        return {
            app: this.refs.app.value
        };
    }

    render() {
        // explicit class assigning based on validation
        let notValidClasses = {};

        if (typeof this.state.appVal == 'undefined' || this.state.appVal) {
            notValidClasses.appCls = 'no-error col-md-5';
        }
        else {
            notValidClasses.appCls = 'has-error col-md-5';
            notValidClasses.appValGrpCls = 'val-err-tooltip';
        }

        return (
            <div className="step selectApp">
                <div className="row">
                    <form id="Form" className="form-horizontal">
                        <div className="form-group">
                            <label className="col-md-12 control-label">
                                <h1>Step 2: Select space and provide geometry details</h1>
                                <h3>More information on <code>Space</code>, <code>Geometry</code> and other basic concepts are available in the <a href="https://ove.readthedocs.io/en/stable/ove-apps/BASIC_CONCEPTS.html" target="_blank" rel="noopener noreferrer">Documentation</a>.</h3>
                            </label>
                            <div className="col-md-12">
                                <div className="form-group col-md-8 content form-block-holder">
                                    <label className="control-label col-md-3">
                                        Application
                                    </label>
                                    <div className={notValidClasses.appCls}>
                                    <select ref="app" autoComplete="off" className="form-control" required defaultValue={this.state.app} onBlur={this.validationCheck}>
                                            <option value="">Please select</option>
                                            <option value="alignment">Alignment</option>
                                            <option value="audio">Audio</option>
                                            <option value="charts">Charts</option>
                                            <option value="controller">Controller</option>
                                            <option value="html">HTML</option>
                                            <option value="images">Images</option>
                                            <option value="maps">Maps</option>
                                            <option value="networks">Networks</option>
                                            <option value="pdf">PDF</option>
                                            <option value="replicator">Replicator</option>
                                            <option value="svg">SVG</option>
                                            <option value="videos">Videos</option>
                                            <option value="webrtc">WebRTC</option>
                                            <option value="whiteboard">Whiteboard</option>
                                        </select>
                                        <div className={notValidClasses.appValGrpCls}>{this.state.appValMsg}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
