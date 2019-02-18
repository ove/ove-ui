/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';

export default class SelectApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      app: props.getStore().app
    };

    this._validateOnDemand = true; // this flag enables onBlur validation as user fills forms

    this.validationCheck = this.validationCheck.bind(this);
    this.isValidated = this.isValidated.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  isValidated() {
    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator
    let isDataValid = false;

    // if full validation passes then save to store and pass as valid
    if (Object.keys(validateNewInput).every((k) => { return validateNewInput[k] === true })) {
        if (this.props.getStore().email !== userInput.email || this.props.getStore().gender !== userInput.gender) { // only update store of something changed
          this.props.updateStore({
            ...userInput,
            savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
          });  // Update store here (this is just an example, in reality you will do it via redux or flux)
        }

        isDataValid = true;
    }
    else {
        // if anything fails then update the UI validation state but NOT the UI Data State
        this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
    }

    return isDataValid;
  }

  validationCheck() {
    if (!this._validateOnDemand)
      return;

    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator

    this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
  }

   _validateData(data) {
    return  {
      appVal: (data.app !== ''), // required: anything besides N/A
    }
  }

  _validationErrors(val) {
    const errMsgs = {
      appValMsg: val.appVal ? '' : 'An application must be selected',
    }
    return errMsgs;
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
      notValidClasses.appCls = 'no-error col-md-4';
    }
    else {
       notValidClasses.appCls = 'has-error col-md-4';
       notValidClasses.appValGrpCls = 'val-err-tooltip';
    }

    return (
      <div className="step selectApp">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12 control-label">
                <h1>Step 1: Choose the type application to load onto OVE</h1>
                <h3>A complete list of applications along with more information, is available in the <a href="https://ove.readthedocs.io/en/stable/ove-apps/README.html" target="_blank" rel="noopener noreferrer">Documentation</a>.</h3>
              </label>
              <div className="col-md-12">
                <div className="form-group col-md-6 content form-block-holder">
                  <label className="control-label col-md-2">
                    Application
                  </label>
                  <div className={notValidClasses.appCls}>
                    <select
                      ref="app"
                      autoComplete="off"
                      className="form-control"
                      required
                      defaultValue={this.state.app}
                      onBlur={this.validationCheck}>
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
