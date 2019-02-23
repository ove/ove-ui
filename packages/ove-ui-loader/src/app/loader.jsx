/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import StepZilla from 'react-stepzilla';
import 'react-stepzilla/src/css/main.css';
import Constants from '../constants/loader';
import SelectApp from '../steps/SelectApp';
import SpaceAndGeometry from '../steps/SpaceAndGeometry';
import StateConfiguration from '../steps/StateConfiguration';
import Review from '../steps/Review';
import Confirm from '../steps/Confirm';
import Complete from '../steps/Complete';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-theme.min.css';
import './loader.css';

export default class Loader extends Component {
    constructor(props) {
        super(props);
        this.store = JSON.parse(JSON.stringify(props));
        delete this.store.log;
        this.log = props.log;
        this.log.debug('Successfully loaded React App');
    }

    componentDidMount() { }

    componentWillUnmount() { }

    getStore() {
        this.log.debug('Retrieving store', this.store);
        return this.store;
    }

    updateStore(update) {
        this.log.debug('Updating store with:', update);
        this.store = {
            ...this.store,
            ...update,
        };
        this.props.dispatch({
            type: Constants.UPDATE,
            ...this.store,
            ...update,
        });
    }

    render() {
        const steps =
            [
                { name: 'Select Application', component: <SelectApp getLogger={() => (this.log)} getStore={() => (this.getStore())} updateStore={(u) => { this.updateStore(u);}} /> },
                { name: 'Define Geometry', component: <SpaceAndGeometry getLogger={() => (this.log)} getStore={() => (this.getStore())} updateStore={(u) => { this.updateStore(u); }} /> },
                { name: 'Configure State', component: <StateConfiguration getLogger={() => (this.log)} getStore={() => (this.getStore())} updateStore={(u) => { this.updateStore(u); }} /> },
                { name: 'Review Configuration', component: <Review getLogger={() => (this.log)} getStore={() => (this.getStore())} updateStore={(u) => { this.updateStore(u); }} /> },
                { name: 'Confirm Operation', component: <Confirm getLogger={() => (this.log)} getStore={() => (this.getStore())} updateStore={(u) => { this.updateStore(u); }} /> },
                { name: 'Complete', component: <Complete getLogger={() => (this.log)} getStore={() => (this.getStore())} updateStore={(u) => { this.updateStore(u); }} /> },
            ];
        steps.forEach(e => {
            this.log.debug('Loading step:', e.name);
        });
        return (
            <div className='form'>
                <div className='step-progress'>
                    <StepZilla
                        steps={steps}
                        preventEnterSubmission={true}
                        nextTextOnFinalActionStep={Constants.LOAD}
                        startAtStep={window.sessionStorage.getItem(Constants.STEP) ? parseFloat(window.sessionStorage.getItem(Constants.STEP)) : 0}
                        onStepChange={(step) => window.sessionStorage.setItem(Constants.STEP, step)}
                        nextButtonCls={Constants.NEXT_BUTTON_CLASS}
                        backButtonCls={Constants.BACK_BUTTON_CLASS}
                    />
                </div>
            </div>
        );
    }
}
