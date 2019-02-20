/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import StepZilla from 'react-stepzilla';
import SelectApp from '../steps/SelectApp';
import SpaceAndGeometry from '../steps/SpaceAndGeometry';
import Step3 from '../steps/Step3';
import Step4 from '../steps/Step4';
import Step5 from '../steps/Step5';
import Step6 from '../steps/Step6';
import './loader.css';

class Loader extends Component {
  constructor(props) {
    super(props);
    this.store = JSON.parse(JSON.stringify(props));
    delete this.store.log;
    this.log = props.log;
    this.log.debug('Successfully loaded React App');
  }

  componentDidMount() {}

  componentWillUnmount() {}

  getStore() {
    this.log.debug('Retrieving store', this.store);
    return this.store;
  }

  updateStore(update) {
    this.log.debug('Updating store with:', update);
    this.store = {
      ...this.store,
      ...update,
    }
    this.props.dispatch({
      type: 'UPDATE',
      ...update,
    })
  }

  render() {
    const steps =
    [
      {name: 'Application', component: <SelectApp getLogger={() => (this.log)} getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      {name: 'Space and Geometry', component: <SpaceAndGeometry getLogger={() => (this.log)} getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      {name: 'Specify Geometry', component: <Step3 getLogger={() => (this.log)} getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      {name: 'Specify Geometry', component: <Step4 getLogger={() => (this.log)} getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      {name: 'Configure State', component: <Step5 getLogger={() => (this.log)} getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      {name: 'Completed', component: <Step6 getLogger={() => (this.log)} getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
    ]
    steps.forEach(e => {
      this.log.debug('Loading step:', e.name);
    });
    return (
      <div className='form'>
        <div className='step-progress'>
          <StepZilla
            steps={steps}
            preventEnterSubmission={true}
            nextTextOnFinalActionStep={'Load'}
            hocValidationAppliedTo={[3]}
            startAtStep={window.sessionStorage.getItem('step') ? parseFloat(window.sessionStorage.getItem('step')) : 0}
            onStepChange={(step) => window.sessionStorage.setItem('step', step)}
            nextButtonCls='btn btn-prev btn-primary btn-md pull-right'
            backButtonCls='btn btn-next btn-primary btn-md pull-left'
            />
        </div>
      </div>
    );
  }
}

export default Loader;
