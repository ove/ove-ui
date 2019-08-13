/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Constants from '../constants/launcher';
import axios from 'axios';

export default class SelectApp extends Component {
    constructor (props) {
        super(props);

        this.log = props.getLogger();
        this.state = {
            app: props.getStore().app
        };

        this.validationCheck = this.validationCheck.bind(this);
        this.isValidated = this.isValidated.bind(this);
        this.log.debug('Displaying step:', SelectApp.name);
    }

    componentDidMount () { }

    componentWillUnmount () { }

    isValidated () {
        const userInput = this._grabUserInput(); // grab user entered vals
        const validateNewInput = this._validateData(userInput); // run the new input against the validator

        // if full validation passes then save to store and pass as valid
        if (Object.keys(validateNewInput).every((k) => { return validateNewInput[k] === true; })) {
            if (this.props.getStore().app !== userInput.app) { // only update store of something changed
                this.props.updateStore({
                    ...userInput
                });
            }
            const valid = true;
            this.log.debug('Input is valid:', valid, 'step:', SelectApp.name);
            const __self = this;
            return new Promise((resolve, reject) => {
                const hostname = Constants.REACT_APP_OVE_HOST;
                let result = {};
                let count = 0;
                axios.get('//' + hostname + '/spaces').then(res => res.data).then(spaces => {
                    count = Object.keys(spaces).length;
                    Object.keys(spaces).forEach(space => {
                        axios.get('//' + hostname + '/spaces/' + space + '/geometry').then(res => {
                            result[space] = res.data;
                        }).catch(this.log.error);
                    });
                }).catch(this.log.error);
                setTimeout(_ => {
                    const x = setInterval(_ => {
                        if (count > 0 && Object.keys(result).length === count) {
                            clearInterval(x);
                            __self.props.updateStore({
                                ...userInput,
                                spaces: result
                            });
                            axios.get('//' + Constants.REACT_APP_OVE_APP(userInput.app) + '/name').then(_ => {
                                resolve(true);
                            }).catch(error => {
                                if (error.request) {
                                    this.setState({
                                        ...this.state,
                                        appVal: false,
                                        appValMsg: 'Selected application is not available'
                                    });
                                    this.log.debug('Ran validation check at step:', SelectApp.name);
                                    resolve(false);
                                } else {
                                    this.log.error(error);
                                }
                            });
                        }
                    }, Constants.SPACE_NAMES_LOADED_TEST_TIME);
                }, Constants.SPACE_NAMES_LOADED_INITIAL_WAIT_TIME);
            });
        } else {
            // if anything fails then update the UI validation state but NOT the UI Data State
            this.setState(Object.assign(userInput, validateNewInput, this._validationMessages(validateNewInput)));
            const valid = false;
            this.log.debug('Input is valid:', valid, 'step:', SelectApp.name);
            return valid;
        }
    }

    validationCheck () {
        const userInput = this._grabUserInput(); // grab user entered vals
        const validateNewInput = this._validateData(userInput); // run the new input against the validator

        this.setState(Object.assign(userInput, validateNewInput, this._validationMessages(validateNewInput)));
        this.log.debug('Ran validation check at step:', SelectApp.name);
    }

    _validateData (data) {
        return {
            appVal: (data.app !== '')
        };
    }

    _validationMessages (val) {
        return {
            appValMsg: val.appVal ? '' : 'An application must be selected'
        };
    }

    _grabUserInput () {
        return {
            app: this.refs.app.value
        };
    }

    render () {
        // explicit class assigning based on validation
        let notValidClasses = {};

        if (typeof this.state.appVal === 'undefined' || this.state.appVal) {
            notValidClasses.appCls = 'no-error col-md-5';
        } else {
            notValidClasses.appCls = 'has-error col-md-5';
            notValidClasses.appValGrpCls = 'val-err-tooltip';
        }

        return (
            <div className="step selectApp">
                <div className="row">
                    <form id="Form" className="form-horizontal">
                        <div className="form-group">
                            <label className="col-md-12 control-label">
                                <h1>Step 1: Choose which application to launch</h1>
                                <h3> For details of each application, see the <a href="https://ove.readthedocs.io/en/stable/ove-apps/README.html" target="_blank" rel="noopener noreferrer">documentation</a>.</h3>
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
                                            <option value="qrcode">QR code</option>
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
        );
    }
}

SelectApp.propTypes = {
    getLogger: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired,
    updateStore: PropTypes.func.isRequired
};
