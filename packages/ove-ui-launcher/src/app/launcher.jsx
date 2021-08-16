/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SelectApp from '../steps/SelectApp';
import SpaceAndGeometry from '../steps/SpaceAndGeometry';
import StateConfiguration from '../steps/StateConfiguration';
import Review from '../steps/Review';
import Confirm from '../steps/Confirm';
import Complete from '../steps/Complete';

import './launcher.css';
import 'semantic-ui-css/semantic.min.css';
import Constants from '../constants/launcher';

export default class Launcher extends Component {
    constructor (props) {
        super(props);

        this.log = props.log;
        this.updateOptions = this.updateOptions.bind(this);
        this.ready = this.ready.bind(this);

        this.state = {
            app: '',
            ready: false,

            os: Constants.OS.UNIX,
            showController: true,
            deleteSections: false,

            geometry: { x: '', y: '', w: '', h: '' },
            geometryErrors: { x: null, y: null, w: null, h: null, space: null, sectionRows: null, sectionColumns: null },
            geoCache: { x: '', y: '', w: '', h: '' },

            showSize: 'No',
            sectionRows: '1',
            sectionColumns: '1',
            selectedSection: -1,

            stateErrors: { existingState: null, newState: null },
            mode: Constants.Mode.NEW,

            optionsErrors: { configError: null },

            reviewErrors: { configError: null },
            config: ''
        };

        this.state = { ...this.state, ...(JSON.parse(window.localStorage.getItem(Constants.LOCAL_STORAGE_KEY))), appAvailable: undefined };

        const url = (new URL(document.location)).searchParams.get('url');
        if (url) {
            this.log.debug('Setting URL:', url);
            this.state.mode = Constants.Mode.NEW;
            this.state.url = url;
        }

        let app = (new URL(document.location)).searchParams.get('app');
        if (app) {
            let foundApp = false;
            app = app.toLowerCase();
            Object.values(Constants.APPS).forEach(a => {
                foundApp = foundApp || a.name === app;
            });
            if (foundApp) {
                this.log.debug('Setting App:', app);
                this.state.app = app;
            } else {
                // The user can still select the correct app, so this is a mere warning.
                this.log.warn('Got invalid App name:', app);
                this.state.app = '';
                this.state.state = undefined;
            }
        }
    }

    // Callbacks called by each step
    updateOptions (state) {
        const errors = state.errors || {}; // ?
        const ready = Object.values(errors).every(d => !d);
        this.setState({ config: state.config,
            deleteSections: state.deleteSections,
            showController: state.showController,
            optionsReady: ready,
            controllerURL: undefined });
    }

    ready () {
        const stateReady = ((this.state.mode === Constants.Mode.EXISTING) && !this.state.stateErrors.existingState) || ((this.state.mode === Constants.Mode.NEW) && !this.state.stateErrors.newState);
        const geometryReady = Object.values(this.state.geometryErrors).every(d => !d);
        const optionsReady = Object.values(this.state.optionsErrors).every(d => !d);

        const appsWithoutStates = [Constants.APPS.ALIGNMENT.name, Constants.APPS.WHITEBOARD.name, Constants.APPS.REPLICATOR.name, Constants.APPS.CONTROLLER.name];
        const noStateRequired = appsWithoutStates.includes(this.state.app);

        return !!this.state.app && geometryReady && optionsReady && (stateReady || noStateRequired);
    }

    render () {
        window.localStorage.setItem(Constants.LOCAL_STORAGE_KEY, JSON.stringify(this.state));

        return (
            <>
                <h1>OVE Application Launcher</h1>
                <p>Configured to launch applications into the OVE instance at <a href={Constants.REACT_APP_OVE_HOST} target="_blank"
                    rel="noopener noreferrer"><code>{Constants.REACT_APP_OVE_HOST}</code></a>.</p>

                <div className='form'>
                    <SelectApp updateApp={ev => this.setState({ app: ev.value, state: null, controllerURL: undefined })}
                        selectedApp={this.state.app} appAvailable={this.state.appAvailable} />

                    <SpaceAndGeometry log={this.log} updateSpace={space => this.setState({ space, controllerURL: undefined })}
                        updateGeometry={geometry => this.setState({ geometry, controllerURL: undefined })}
                        updateErrors={geometryErrors => this.setState({ geometryErrors })}
                        updateShowSize={showSize => this.setState({ showSize })}
                        updateGeoCache={geoCache => this.setState({ geoCache })}
                        updateSectionRows={sectionRows => this.setState({ sectionRows })}
                        updateSectionColumns={sectionColumns => this.setState({ sectionColumns })}
                        updateSelectedSection={(selectedSection) => this.setState({ selectedSection }) }

                        space={this.state.space} geometry={this.state.geometry} errors={this.state.geometryErrors} showSize={this.state.showSize} geoCache={this.state.geoCache}
                        sectionRows={this.state.sectionRows} sectionColumns={this.state.sectionColumns} selectedSection={this.state.selectedSection}
                    />

                    <StateConfiguration log={this.log} updateState={(d) => this.setState({ state: d, controllerURL: undefined })}
                        updateMode={d => this.setState({ mode: d, controllerURL: undefined })}
                        updateURL={d => this.setState({ url: d, controllerURL: undefined })}
                        updateErrors={d => this.setState({ stateErrors: d })}
                        app={this.state.app} mode={this.state.mode} state={this.state.state} url={this.state.url} geometry={this.state.geometry} errors={this.state.stateErrors} />

                    <Review updateOptions={this.updateOptions}
                        updateDeleteSections={deleteSections => this.setState({ deleteSections })}
                        updateShowController={showController => this.setState({ showController })}
                        updateErrors={optionsErrors => this.setState({ optionsErrors })}
                        updateConfig={config => this.setState({ config })}
                        app={this.state.app} space={this.state.space} deleteSections={this.state.deleteSections} showController={this.state.showController} mode={this.state.mode} state={this.state.state} url={this.state.url} config={this.state.config}
                        errors={this.state.optionsErrors} />

                    <Confirm log={this.log} updateControllerURL={controllerURL => this.setState({ controllerURL })}
                        updateOS={os => this.setState({ os })}
                        app={this.state.app} space={this.state.space} geometry={this.state.geometry} mode={this.state.mode}
                        config={this.state.config} state={this.state.state} deleteSections={this.state.deleteSections}
                        showController={this.state.showController} os={this.state.os} ready={this.ready()}
                        appAvailable={this.state.appAvailable} updateAppAvailability={appAvailable => this.setState({ appAvailable })} />

                    <Complete app={this.state.app} space={this.state.space} controllerURL={this.state.controllerURL} />
                </div>
            </>
        );
    }
}

Launcher.propTypes = {
    log: PropTypes.object.isRequired
};
