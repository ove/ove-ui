/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Constants from '../constants/launcher';
import axios from 'axios';

import { Form, Button, Divider, Header } from 'semantic-ui-react';

export default class SpaceAndGeometry extends Component {
    constructor (props) {
        super(props);

        this.state = {
            spaces: [],
            bounds: { w: null, h: null },
            errors: { x: null, y: null, w: null, h: null }
        };

        this.determineErrors = this.determineErrors.bind(this);
        this._fillSpace = this._fillSpace.bind(this);
    }

    componentDidMount () {
        // Add details of each space to the state
        axios.get('//' + Constants.REACT_APP_OVE_HOST + '/spaces')
            .then(res => res.data)
            .then(spaces => {
                let spacesToProcess = Object.keys(spaces).length;
                let result = {};

                Object.keys(spaces).forEach(space => {
                    axios.get('//' + Constants.REACT_APP_OVE_HOST + '/spaces/' + space + '/geometry').then(res => {
                        result[space] = res.data;
                        spacesToProcess--;

                        if (spacesToProcess === 0) {
                            this.setState({ spaces: result });
                            this.determineErrors();
                        }
                    }).catch(error => console.log(error));
                });
            }).catch(error => console.log(error));

    }

    componentDidUpdate () {
        this.determineErrors();
    }

    determineErrors () {
        if (this.state.spaces.length === 0){  return; }

        const spaceSelected = (this.props.space !== '');

        const currentSpace = this.props.space;

        const spaceHeight = currentSpace ? `${this.state.spaces[currentSpace].h}` : '';
        const spaceWidth = currentSpace ? `${this.state.spaces[currentSpace].w}` : '';

        let errors = { space: null, x: null, y: null, w: null, h: null };

        if (!currentSpace) {
            errors.space = 'You must select a space';
        }

        if (!Number.isInteger(parseFloat(this.props.geometry.x))) {
            errors.x = 'x coordinate is not provided';
        } else if (parseInt(this.props.geometry.x, 10) < 0) {
            errors.x = 'x coordinate cannot be negative';
        } else if (spaceSelected && parseInt(this.props.geometry.x, 10) > (!currentSpace ? 0 : this.state.spaces[currentSpace].w)) {
            errors.x = `x coordinate must be less than space width (${spaceWidth})`;
        }

        if (!Number.isInteger(parseFloat(this.props.geometry.y))) {
            errors.y = 'y coordinate is not provided';
        } else if (parseInt(this.props.geometry.y, 10) < 0) {
            errors.y = 'y coordinate cannot be negative';
        } else if (spaceSelected && parseInt(this.props.geometry.y, 10) > (!currentSpace ? 0 : this.state.spaces[currentSpace].h)) {
            errors.y = `y coordinate must be less than space height (${spaceHeight})`;
        }

        if (!Number.isInteger(parseFloat(this.props.geometry.w))) {
            errors.w = 'width is not provided';
        } else if (parseInt(this.props.geometry.w, 10) <= 0) {
            errors.w = 'width must be greater than 0';
        } else if (spaceSelected && parseInt(this.props.geometry.w, 10) > (!currentSpace ? 0 : this.state.spaces[currentSpace].w)) {
            errors.w = `width must be less than space width (${spaceWidth})`;
        }

        if (!Number.isInteger(parseFloat(this.props.geometry.h))) {
            errors.h = 'height is not provided';
        } else if (parseInt(this.props.geometry.h, 10) <= 0) {
            errors.h = 'height must be greater than 0';
        } else if (spaceSelected && parseInt(this.props.geometry.h, 10) > (!currentSpace ? 0 : this.state.spaces[currentSpace].h)) {
            errors.h = `height must be less than space height (${spaceHeight})`;
        }

        if (errors.x !== this.props.errors.x || errors.y !== this.props.errors.y || errors.w !== this.props.errors.w || errors.h !== this.props.errors.h || errors.space !== this.props.errors.space) {
            this.props.updateErrors(errors);
        }
    }

    _fillSpace (ev) {
        ev.preventDefault();

        if (!this.props.space) { return; }

        this.props.updateGeometry({
            x: '0',
            y: '0',
            w: this.state.spaces[this.props.space].w.toString(),
            h: this.state.spaces[this.props.space].h.toString()
        });
    }

    render () {
        let spaceOptions = this.state.spaces ? Object.keys(this.state.spaces).map(e => ({ key: e, value: e, text: e })) : [];

        const bounds = this.props.space ? this.state.spaces[this.props.space] : false;
        console.log('Space is', this.props.space);
        console.log('Bounds are', bounds);

        return (
            <>

                <Divider horizontal>
                    <Header as='h2'>
                    Space and Geometry
                    </Header>
                </Divider>

                <p>More information on <code>Space</code>, <code>Geometry</code> and other basic concepts are available
                    in the <a href="https://ove.readthedocs.io/en/stable/docs/BASIC_CONCEPTS.html" target="_blank"
                    rel="noopener noreferrer">documentation</a>.</p>

                <p>Note that launching an application in a space will <b>not</b> automatically switch any displays to
                    show that space.</p>

                <Form>

                    <Form.Group>
                        <Form.Field inline width={6}>
                            <label>Space</label>
                            <Form.Select options={spaceOptions}
                                error={this.props.errors.space && { content: this.props.errors.space, pointing: 'below' }}
                                onChange={(_, d) => this.props.updateSpace(d.value)}
                                defaultValue={this.props.space}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Maximise</label>
                            <Button icon="expand" onClick={this._fillSpace}/>
                        </Form.Field>
                    </Form.Group>

                    <Form.Group>
                        <Form.Input label='x'
                            error={this.props.errors.x && { content: this.props.errors.x, pointing: 'above' }}
                            autoComplete="off"
                            type="number"
                            placeholder="0"
                            min="0"
                            max={bounds ? bounds.w : Constants.DEFAULT_WIDTH}
                            value={this.props.geometry.x}
                            onChange={ev => this.props.updateGeometry({ ...this.props.geometry, x: ev.target.value })}
                            width={6}/>

                        <Form.Input label='y'
                            error={this.props.errors.y && { content: this.props.errors.y, pointing: 'above' }}
                            autoComplete="off"
                            type="number"
                            placeholder="0"
                            min="0"
                            max={bounds ? bounds.h : Constants.DEFAULT_HEIGHT}
                            value={this.props.geometry.y}
                            onChange={ev => this.props.updateGeometry({ ...this.props.geometry, y: ev.target.value })}
                            width={6}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Input label="width"
                            error={this.props.errors.w && { content: this.props.errors.w, pointing: 'above' }}
                            autoComplete="off"
                            type="number"
                            placeholder={bounds ? bounds.w : Constants.DEFAULT_WIDTH}
                            min="1"
                            max={bounds ? bounds.w : Constants.DEFAULT_WIDTH}
                            value={this.props.geometry.w}
                            onChange={ev => this.props.updateGeometry({ ...this.props.geometry, w: ev.target.value })}
                            width={6}/>
                        <Form.Input label="height"
                            error={this.props.errors.h && { content: this.props.errors.h, pointing: 'above' }}
                            autoComplete="off"
                            type="number"
                            placeholder={bounds ? bounds.h : Constants.DEFAULT_HEIGHT}
                            min="1"
                            max={bounds ? bounds.h : Constants.DEFAULT_HEIGHT}
                            value={this.props.geometry.h}
                            onChange={ev => this.props.updateGeometry({ ...this.props.geometry, h: ev.target.value })}
                            width={6}/>
                    </Form.Group>
                </Form>
            </>
        );
    }
}

SpaceAndGeometry.propTypes = {
    updateSpace: PropTypes.func.isRequired,
    updateGeometry: PropTypes.func.isRequired,
    updateErrors: PropTypes.func.isRequired,

    space: PropTypes.string,
    geometry: PropTypes.shape({ x: PropTypes.string, y: PropTypes.string, w: PropTypes.string, h: PropTypes.string }),
    errors: PropTypes.shape({ x: PropTypes.string, y: PropTypes.string, w: PropTypes.string, h: PropTypes.string, space: PropTypes.string })
};
