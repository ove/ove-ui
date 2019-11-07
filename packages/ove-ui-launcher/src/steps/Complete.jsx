/* jshint ignore:start */
// JSHint cannot deal with React.
import React from 'react';
import PropTypes from 'prop-types';
import Constants from '../constants/launcher';
import { Divider, Header, Icon } from 'semantic-ui-react';

const Complete = ({ controllerURL, app, space }) => {
    if (!controllerURL) { return ''; }

    return <div>
        <Divider horizontal>
            <Header as='h2'>
                Application instance created
            </Header>
        </Divider>
        <p>Congratulations! You have created a new section of the <code>{app}</code> app in
                space <code>{space}</code>.</p>

        <ul>
            <li><a
                href={'https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-' + app + '/README.html'}
                target="_blank" rel="noopener noreferrer"><Icon name="book"/> Documentation</a> for
                    the <code>{app}</code> app.
            </li>

            {controllerURL &&
                <li><a href={controllerURL} target="_blank" rel="noopener noreferrer"><Icon
                    name="gamepad"/> Controller</a> for this section.</li>}

            <li><a href={'//' + Constants.REACT_APP_OVE_UI_PREVIEW + '?oveSpace=' + space}
                target="_blank" rel="noopener noreferrer"> <Icon name="binoculars"/> Preview</a> of the
                    space <code>{space}</code>.
            </li>

            <li><a href={'//' + Constants.REACT_APP_OVE_HOST} target="_blank" rel="noopener noreferrer"><Icon
                name="list" /> list of sections</a> in this instance of OVE</li>

        </ul>
    </div>;
};

Complete.propTypes = {
    app: PropTypes.string.isRequired,
    space: PropTypes.string,
    controllerURL: PropTypes.string
};

export default Complete;
