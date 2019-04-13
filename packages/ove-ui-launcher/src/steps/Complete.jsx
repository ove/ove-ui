/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Constants from '../constants/launcher';

export default class Complete extends Component {
    constructor (props) {
        super(props);

        this.log = props.getLogger();

        this.state = {
            app: props.getStore().app,
            space: props.getStore().space,
            controllerURL: props.getStore().controllerURL
        };

        this.log.debug('Displaying step:', Complete.name);
    }

    componentDidMount () { }

    componentWillUnmount () { }

    _showSummary () {
        if (this.state.controllerURL) {
            return (
                <h3>Congratulations! You have created a new instance of an application of
                    type <code>{this.state.app}</code> in space <code>{this.state.space}</code> using <a href="https://ove.readthedocs.io/en/stable/README.html" target="_blank" rel="noopener noreferrer">OVE</a>.<br />
                    More information on using the application is available in its <a href={'https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-' + this.state.app + '/README.html'} target="_blank" rel="noopener noreferrer">documentation</a>.<br />
                    The controller of the application can be launched by <a href={this.state.controllerURL} target="_blank" rel="noopener noreferrer">clicking here</a>.<br />
                    You can launch another application by <a href='#' onClick={() => this.props.jumpToStep(0)}>clicking here</a>.<br /> {/* eslint-disable-line jsx-a11y/anchor-is-valid */}
                    To see the outcome of your operation, click <a href={'//' + Constants.REACT_APP_OVE_UI_PREVIEW + '?oveSpace=' + this.state.space} target="_blank" rel="noopener noreferrer">preview space</a>.</h3>
            );
        } else {
            return (
                <h3>Congratulations you have created a new instance of an application of
                    type <code>{this.state.app}</code> in space <code>{this.state.space}</code> using <a href="https://ove.readthedocs.io/en/stable/README.html" target="_blank" rel="noopener noreferrer">OVE</a>.<br />
                    More information on using the application is available in its <a href={'https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-' + this.state.app + '/README.html'} target="_blank" rel="noopener noreferrer">documentation</a>.<br />
                    You can launch another application by <a href='#' onClick={() => this.props.jumpToStep(0)}>clicking here</a>.<br /> {/* eslint-disable-line jsx-a11y/anchor-is-valid */}
                    To see the outcome of your operation, click <a href={'//' + Constants.REACT_APP_OVE_UI_PREVIEW + '?oveSpace=' + this.state.space} target="_blank" rel="noopener noreferrer">preview space</a>.</h3>
            );
        }
    }

    render () {
        return (
            <div className="step complete">
                <div className="row">
                    <form id="Form" className="form-horizontal">
                        <div className="form-group">
                            <label className="col-md-12 control-label">
                                <h1>Step 6: Application instance created</h1>
                                {this._showSummary()}
                            </label>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

Complete.propTypes = {
    getLogger: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired,
    jumpToStep: PropTypes.func // Added by stepzilla
};
