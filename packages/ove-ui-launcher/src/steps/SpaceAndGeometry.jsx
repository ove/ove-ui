/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import Constants from '../constants/launcher';
import axios from 'axios';

export default class SpaceAndGeometry extends Component {
    constructor(props) {
        super(props);

        this.log = props.getLogger();
        this.state = {
            app: props.getStore().app,
            geometry: props.getStore().geometry || {},
            space: props.getStore().space,
            spaces: props.getStore().spaces
        };

        this.validationCheck = this.validationCheck.bind(this);
        this.isValidated = this.isValidated.bind(this);
        this.log.debug('Displaying step:', SpaceAndGeometry.name);
    }

    componentDidMount() { }

    componentWillUnmount() { }

    isValidated() {
        const userInput = this._grabUserInput(); // grab user entered vals
        const validateNewInput = this._validateData(userInput, true); // run the new input against the validator

        // if full validation passes then save to store and pass as valid
        if (Object.keys(validateNewInput).every((k) => { return validateNewInput[k] !== false && validateNewInput[k] !== Constants.PENDING; })) {
            if (JSON.stringify(this.props.getStore().geometry) !== JSON.stringify(userInput.geometry) ||
                this.props.getStore().space !== userInput.space) { // only update store of something changed
                this.props.updateStore({
                    ...userInput,
                    geometry: {
                        x: parseInt(userInput.geometry.x, 10),
                        y: parseInt(userInput.geometry.y, 10),
                        w: parseInt(userInput.geometry.w, 10),
                        h: parseInt(userInput.geometry.h, 10)
                    }
                });
            }
            const valid = true;
            this.log.debug('Input is valid:', valid, 'step:', SpaceAndGeometry.name);
            const __self = this;
            if ([Constants.App.CONTROLLER, Constants.App.REPLICATOR].includes(this.state.app)) {
                let config;
                if (this.state.app === Constants.App.CONTROLLER) {
                    config = JSON.stringify({ mode: 'space' });
                } else {
                    config = JSON.stringify({ mode: 'space', spaceName: userInput.space, border: 'solid gold' });
                }
                this.props.updateStore({
                    ...userInput,
                    mode: Constants.Mode.NEW,
                    url: undefined,
                    config: config
                });
                this.props.jumpToStep(3);
                return false;
            }
            return axios.get('//' + Constants.REACT_APP_OVE_APP(this.props.getStore().app) + '/states').then(res => res.data).then(states => {
                __self.props.updateStore({
                    ...userInput,
                    states: states
                });
            }).catch(this.log.error);
        } else {
            // if anything fails then update the UI validation state but NOT the UI Data State
            this.setState(Object.assign(userInput, validateNewInput, this._validationMessages(validateNewInput)));
            const valid = false;
            this.log.debug('Input is valid:', valid, 'step:', SpaceAndGeometry.name);
            return valid;
        }
    }

    validationCheck() {
        const userInput = this._grabUserInput(); // grab user entered vals
        const validateNewInput = this._validateData(userInput); // run the new input against the validator

        this.setState(Object.assign(userInput, validateNewInput, this._validationMessages(validateNewInput)));
        this.log.debug('Ran validation check at step:', SpaceAndGeometry.name);
    }

    _validateData(data, force) {
        const result = {
            spaceVal: (data.space !== ''),
            currentSpace: data.space,
        };
        if (!force && data.geometry.x === '' && data.geometry.y === '' &&
            data.geometry.w === '' && data.geometry.h === '') {
            return {
                ...result,
                geometryVal_x: Constants.PENDING,
                geometryVal_y: Constants.PENDING,
                geometryVal_w: Constants.PENDING,
                geometryVal_h: Constants.PENDING
            };
        }
        return {
            ...result,
            geometryVal_x: Number.isInteger(parseFloat(data.geometry.x)) && (parseInt(data.geometry.x, 10) >= 0) && 
                (parseInt(data.geometry.x, 10) <= (!result.currentSpace ? 0 : this.state.spaces[result.currentSpace].w)),
            geometryVal_y: Number.isInteger(parseFloat(data.geometry.y)) && (parseInt(data.geometry.y, 10) >= 0) && 
                (parseInt(data.geometry.y, 10) <= (!result.currentSpace ? 0 : this.state.spaces[result.currentSpace].h)),
            geometryVal_w: Number.isInteger(parseFloat(data.geometry.w)) && (parseInt(data.geometry.w, 10) > 0) && 
                (parseInt(data.geometry.w, 10) <= (!result.currentSpace ? 0 : this.state.spaces[result.currentSpace].w)),
            geometryVal_h: Number.isInteger(parseFloat(data.geometry.h)) && (parseInt(data.geometry.h, 10) > 0) && 
                (parseInt(data.geometry.h, 10) <= (!result.currentSpace ? 0 : this.state.spaces[result.currentSpace].h)),
        };
    }

    _validationMessages(val) {
        return {
            spaceValMsg: val.spaceVal ? '' : 'A space must be selected',
            geometryValMsg: {
                x: val.geometryVal_x ? '' : 'x coordinate is not provided or out of bounds',
                y: val.geometryVal_y ? '' : 'y coordinate is not provided or out of bounds',
                w: val.geometryVal_w ? '' : 'The width is not provided or out of bounds',
                h: val.geometryVal_h ? '' : 'The height is not provided or out of bounds',
            },
            bounds: {
                w: !val.currentSpace ? 0 : this.state.spaces[val.currentSpace].w,
                h: !val.currentSpace ? 0 : this.state.spaces[val.currentSpace].h,
            }
        };
    }

    _grabUserInput() {
        return {
            space: this.refs.space.value,
            geometry: {
                x: this.refs.geometry_x.value,
                y: this.refs.geometry_y.value,
                w: this.refs.geometry_w.value,
                h: this.refs.geometry_h.value
            }
        };
    }

    _getSelectionItems() {
        let items = [];
        if (this.state.spaces) {
            Object.keys(this.state.spaces).forEach(e => {
                items.push(<option key={e} value={e}>{e}</option>);
            });
        }
        return items;
    }

    render() {
        // explicit class assigning based on validation
        let notValidClasses = {};

        if (typeof this.state.spaceVal == Constants.UNDEFINED || this.state.spaceVal) {
            notValidClasses.spaceCls = 'no-error col-md-5';
        } else {
            notValidClasses.spaceCls = 'has-error col-md-5';
            notValidClasses.spaceValGrpCls = 'val-err-tooltip';
        }

        ['x', 'y', 'w', 'h'].forEach(e => {
            if (typeof this.state['geometryVal_' + e] == Constants.UNDEFINED || this.state['geometryVal_' + e]) {
                notValidClasses['geometryCls_' + e] = 'no-error col-sm-3';
            } else {
                notValidClasses['geometryCls_' + e] = 'has-error col-sm-3';
                notValidClasses['geometryValGrpCls_' + e] = 'val-err-tooltip';
            }
        })

        return (
            <div className="step selectSpaceAndGeometry">
                <div className="row">
                    <form id="Form" className="form-horizontal">
                        <div className="form-group">
                            <label className="col-md-12 control-label">
                                <h1>Step 2: Select space and provide geometry details</h1>
                                <h3>You are creating an application of type <code>{this.state.app}</code>. More information on <code>Space</code>, <code>Geometry</code> and other basic concepts are available in the <a href="https://ove.readthedocs.io/en/stable/docs/BASIC_CONCEPTS.html" target="_blank" rel="noopener noreferrer">Documentation</a>.</h3>
                            </label>
                            <div className="col-md-12">
                                <div className="form-group col-md-8 content form-block-holder">
                                    <label className="control-label col-md-3">
                                        Space
                                    </label>
                                    <div className={notValidClasses.spaceCls}>
                                        <select ref="space" autoComplete="off" className="form-control" required defaultValue={this.state.space} onBlur={this.validationCheck}>
                                            <option value="">Please select</option>
                                            {this._getSelectionItems()}
                                        </select>
                                        <div className={notValidClasses.spaceValGrpCls}>{this.state.spaceValMsg}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group col-md-8 content form-block-holder">
                                    <label className="control-label col-md-2">
                                        Geometry
                                    </label>
                                    <label className="control-label col-sm-1">
                                        x:
                                    </label>
                                    <div className={notValidClasses.geometryCls_x}>
                                        <input
                                            ref="geometry_x"
                                            autoComplete="off"
                                            type="number"
                                            placeholder="0"
                                            min="0"
                                            max={this.state.bounds ? this.state.bounds.w : Constants.DEFAULT_WIDTH}
                                            className="form-control"
                                            required
                                            defaultValue={this.state.geometry.x}
                                            onBlur={this.validationCheck} />
                                        <div className={notValidClasses.geometryValGrpCls_x}>{this.state.geometryValMsg ? this.state.geometryValMsg.x : ''}</div>
                                    </div>
                                    <label className="control-label col-md-1">
                                        y:
                                    </label>
                                    <div className={notValidClasses.geometryCls_y}>
                                        <input
                                            ref="geometry_y"
                                            autoComplete="off"
                                            type="number"
                                            placeholder="0"
                                            min="0"
                                            max={this.state.bounds ? this.state.bounds.h : Constants.DEFAULT_HEIGHT}
                                            className="form-control"
                                            required
                                            defaultValue={this.state.geometry.y}
                                            onBlur={this.validationCheck} />
                                        <div className={notValidClasses.geometryValGrpCls_y}>{this.state.geometryValMsg ? this.state.geometryValMsg.y : ''}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group col-md-8 content form-block-holder">
                                    <label className="control-label col-md-2"/>
                                    <label className="control-label col-md-1">
                                        w:
                                    </label>
                                    <div className={notValidClasses.geometryCls_w}>
                                        <input
                                            ref="geometry_w"
                                            autoComplete="off"
                                            type="number"
                                            placeholder={this.state.bounds ? this.state.bounds.w : Constants.DEFAULT_WIDTH}
                                            min="1"
                                            max={this.state.bounds ? this.state.bounds.w : Constants.DEFAULT_WIDTH}
                                            className="form-control"
                                            required
                                            defaultValue={this.state.geometry.w}
                                            onBlur={this.validationCheck} />
                                        <div className={notValidClasses.geometryValGrpCls_w}>{this.state.geometryValMsg ? this.state.geometryValMsg.w : ''}</div>
                                    </div>
                                    <label className="control-label col-md-1">
                                        h:
                                    </label>
                                    <div className={notValidClasses.geometryCls_h}>
                                        <input
                                            ref="geometry_h"
                                            autoComplete="off"
                                            type="number"
                                            placeholder={this.state.bounds ? this.state.bounds.h : Constants.DEFAULT_HEIGHT}
                                            min="1"
                                            max={this.state.bounds ? this.state.bounds.h : Constants.DEFAULT_HEIGHT}
                                            className="form-control"
                                            required
                                            defaultValue={this.state.geometry.h}
                                            onBlur={this.validationCheck} />
                                        <div className={notValidClasses.geometryValGrpCls_h}>{this.state.geometryValMsg ? this.state.geometryValMsg.h : ''}</div>
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
