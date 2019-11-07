/* jshint ignore:start */
// JSHint cannot deal with React.
import React from 'react';
import PropTypes from 'prop-types';
import Constants from '../constants/launcher';

import { Divider, Form, Header } from 'semantic-ui-react';

const SelectApp = ({ selectedApp, updateApp, appAvailable }) => {
    const appOptions = Object.keys(Constants.APPS).map(appName => {
        const app = Constants.APPS[appName];
        return { key: app.name, value: app.name, text: app.label };
    });

    let error;
    if (!selectedApp) {
        error = { content: 'You must select an application', pointing: 'below' };
    } else if (!appAvailable) {
        error = { content: 'This application is not available', pointing: 'below' };
    }

    return (
        <>
            <Divider horizontal>
                <Header as='h2'>
                    Application
                </Header>
            </Divider>

            <Form>
                <Form.Select
                    label="Application"
                    value={selectedApp}
                    error={error}
                    options={appOptions} onChange={(_, d) => updateApp(d)}
                    width={6}
                />
            </Form>
            <p> For details of each application, see the <a
                href="https://ove.readthedocs.io/en/stable/ove-apps/README.html" target="_blank"
                rel="noopener noreferrer">documentation</a>.</p>
        </>
    );
};

SelectApp.propTypes = {
    selectedApp: PropTypes.string,
    appAvailable: PropTypes.bool,
    updateApp: PropTypes.func.isRequired
};

export default SelectApp;
