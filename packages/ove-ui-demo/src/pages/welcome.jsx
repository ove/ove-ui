/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Constants from '../constants/demo';
import 'bootstrap/dist/css/bootstrap.min.css';
import './welcome.css';

export default class Welcome extends Component {
    constructor (props) {
        super(props);
        this.log = props.log;
        this.log.debug('Successfully loaded React Component:', Constants.Page.WELCOME);
    }

    componentDidMount () { }

    componentWillUnmount () { }

    render () {
        const dots = count => {
            const paint = (max, color) => {
                let dots = '';
                let i = 0;
                while (i < max) {
                    dots += `<span style='color: ${color}'>.</span>`;
                    i++;
                }
                return dots;
            };
            return paint(count % (Constants.MAX_DOT_COUNT + 1), 'White') +
                paint(Constants.MAX_DOT_COUNT - (count % (Constants.MAX_DOT_COUNT + 1)), 'Black');
        };
        let count = 0;

        return (
            <div style={{ height: '100%' }} className='bg-black'>
                <p style={{ fontSize: '7vh' }} className='text-white text-center welcome-text-middle'>
                    <strong>
                        Welcome to Open Visualisation Environment (OVE) <span id='dots'
                            dangerouslySetInnerHTML={{ __html: dots(count++) }}></span>
                    </strong>
                </p>
                {
                    setInterval(_ => {
                        document.getElementById('dots').innerHTML = dots(count++);
                    }, Constants.DOT_LOAD_SPEED)
                }
            </div>
        );
    }
}

Welcome.propTypes = {
    log: PropTypes.object.isRequired
};
