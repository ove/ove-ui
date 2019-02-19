/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import StepZilla from "react-stepzilla";
import SelectApp from '../steps/SelectApp';
import Step2 from '../steps/Step2';
import Step3 from '../steps/Step3';
import Step4 from '../steps/Step4';
import Step5 from '../steps/Step5';
import Step6 from '../steps/Step6';
import './App.css';
import '../deps/main.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.store = props;
  }

  componentDidMount() {}

  componentWillUnmount() {}

  getStore() {
    return this.store;
  }

  updateStore(update) {
    this.store = {
      ...this.store,
      ...update,
    }
    this.store.dispatch({
      type: "UPDATE",
      ...update,
    })
  }

  render() {
    const steps =
    [
      {name: 'Select App', component: <SelectApp getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      {name: 'Select Space', component: <Step2 getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      {name: 'Specify Geometry', component: <Step3 getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      {name: 'Specify Geometry', component: <Step4 getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      {name: 'Configure State', component: <Step5 getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      {name: 'Completed', component: <Step6 getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
    ]

    return (
      <div className='example'>
        <div className='step-progress'>
          <StepZilla
            steps={steps}
            preventEnterSubmission={true}
            nextTextOnFinalActionStep={"Load"}
            hocValidationAppliedTo={[3]}
            startAtStep={window.sessionStorage.getItem('step') ? parseFloat(window.sessionStorage.getItem('step')) : 0}
            onStepChange={(step) => window.sessionStorage.setItem('step', step)}
            />
        </div>
      </div>
    );
  }
}

export default App;
