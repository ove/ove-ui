/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Constants from '../constants/launcher';
import axios from 'axios';

import { Form, Button, Divider, Header, Grid } from 'semantic-ui-react';

export default class SpaceAndGeometry extends Component {
    constructor (props) {
        super(props);
        const cState = [...Array(this.props.sectionRows * this.props.sectionColumns)]
            .map((_) => ({ color: '#d6d6d6', isClicked: false }));
        if (this.props.selectedSection !== -1) {
            cState[this.props.selectedSection] = { color: '#aaaba6', isClicked: true };
        }

        this.state = {
            spaces: [],
            bounds: { w: null, h: null },
            errors: { x: null, y: null, w: null, h: null },
            cellState: cState
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
                    }).catch(this.props.log.error);
                });
            }).catch(this.props.log.error);
    }

    componentDidUpdate () {
        this.determineErrors();
    }

    determineErrors () {
        if (this.state.spaces.length === 0) { return; }

        const spaceSelected = (this.props.space !== undefined);

        let currentSpace = this.props.space;
        if (!this.state.spaces[currentSpace]) {
            currentSpace = Object.keys(this.state.spaces)[0];
            this.props.updateSpace(currentSpace);
        }

        const spaceHeight = currentSpace ? `${this.state.spaces[currentSpace].h}` : '';
        const spaceWidth = currentSpace ? `${this.state.spaces[currentSpace].w}` : '';

        let errors = { space: null, x: null, y: null, w: null, h: null, sectionColumns: null, sectionRows: null };

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

        if (!Number.isInteger(parseFloat(this.props.sectionRows))) {
            errors.sectionRows = 'sectionRows is not provided';
        } else if (this.props.sectionRows <= 0) {
            errors.sectionRows = 'sectionRows must be greater than 0';
        }

        if (!Number.isInteger(parseFloat(this.props.sectionColumns))) {
            console.log('No. Sections: ', this.props.sectionColumns);
            console.log('Type of: ', typeof this.props.sectionColumns);
            errors.sectionColumns = 'sectionColumns is not provided';
        } else if (this.props.sectionColumns <= 0) {
            errors.sectionColumns = 'sectionColumns must be greater than 0';
        } else if (spaceSelected && this.props.sectionColumns > (!currentSpace ? 0 : this.state.spaces[currentSpace].h)) {
            errors.sectionColumns = 'sectionColumns cannot be greater than the height';
        } else if (spaceSelected && this.props.sectionColumns > (!currentSpace ? 0 : this.state.spaces[currentSpace].w)) {
            errors.sectionColumns = 'sectionColumns cannot be greater than the width';
        }

        if (errors.x !== this.props.errors.x || errors.y !== this.props.errors.y || errors.w !== this.props.errors.w ||
            errors.h !== this.props.errors.h || errors.space !== this.props.errors.space || errors.sectionRows !== this.props.errors.sectionRows ||
            errors.sectionColumns !== this.props.errors.sectionColumns) {
            this.props.updateErrors(errors);
        }
    }

    _fillSpace (ev) {
        ev.preventDefault();

        if (!this.props.space) { return; }
        this._updateShowSize(false);

        this.props.updateGeometry({
            x: '0',
            y: '0',
            w: this.state.spaces[this.props.space].w.toString(),
            h: this.state.spaces[this.props.space].h.toString()
        });
    }

    async _updateCellState () {
        await this.props.updateSelectedSection(-1);
        await this.setState({
            cellState: [...Array(this.props.sectionRows * this.props.sectionColumns)]
                .map((_) => ({ color: '#d6d6d6', isClicked: false }))
        });
    }

    async _updateSectionRows (sectionRows) {
        await this.props.updateSectionRows(sectionRows);
        await this._updateCellState();
        this._updateSize();
    }

    _updateShowSize (showSize) {
        this.props.updateShowSize(showSize ? 'Yes' : 'No');
        if (showSize) {
            this.props.updateGeoCache(this.props.geometry);
            this._updateSize();
        } else {
            this.props.updateGeometry(this.props.geoCache);
        }
    }

    async _updateSectionColumns (sectionColumns) {
        await this.props.updateSectionColumns(sectionColumns);
        await this._updateCellState();
        this._updateSize();
    }

    _updateSize () {
        if (!this.props.space) return;
        if (this.props.selectedSection === -1) return;

        const width = Math.floor(this.state.spaces[this.props.space].w / Number(this.props.sectionColumns));
        const height = Math.floor(this.state.spaces[this.props.space].h / Number(this.props.sectionRows));
        const i = this.props.selectedSection % Number(this.props.sectionColumns);
        const j = Math.floor(this.props.selectedSection / Number(this.props.sectionColumns));

        this.props.updateGeometry({
            x: (width * i).toString(),
            y: (height * j).toString(),
            w: width.toString(),
            h: height.toString()
        });
    }

    async _updateSpace (d) {
        await this.props.updateSpace(d);
        if (this.props.showSize === 'Yes') {
            if (this.props.selectedSection !== -1) {
                this._updateSize();
            }
        }
    }

    _getCell (i, j) {
        return (i * this.props.sectionColumns) + j;
    }

    async cellClick (_, i, j) {
        let temp = this.state.cellState;
        const index = this._getCell(i, j);
        const current = temp[index];
        const value = this.props.selectedSection !== index ? index : -1;

        await this.props.updateSelectedSection(value);

        temp = temp.map((_) => ({ color: '#d6d6d6', isClicked: false }));
        current.color = current.isClicked ? '#d6d6d6' : '#aaaba6';
        temp[index] = current;

        await this.setState({ cellState: temp });
        this._updateSize();
    }

    _getColor (i, j) {
        return this.state.cellState[this._getCell(i, j)] ? this.state.cellState[this._getCell(i, j)].color : '#d6d6d6';
    }

    render () {
        let spaceOptions = this.state.spaces ? Object.keys(this.state.spaces).map(e => ({ key: e, value: e, text: e })) : [];
        const sizeOptions = ['Yes', 'No'].map(e => ({ key: e, value: e, text: e }));

        const bounds = this.props.space ? this.state.spaces[this.props.space] : false;

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
                        <Form.Select options={spaceOptions}
                            label="Space"
                            error={this.props.errors.space && { content: this.props.errors.space, pointing: Constants.Pointing.ABOVE }}
                            onChange={(_, d) => this._updateSpace(d.value) }
                            defaultValue={this.props.space}
                            width={6}
                        />
                        <Form.Select
                            label="Use Preset Size"
                            onChange={(_, d) => this._updateShowSize(d.value === 'Yes')}
                            options={sizeOptions}
                            value={this.props.showSize}
                            width={6}
                        />
                        <Form.Field>
                            <label>Maximise</label>
                            <Button icon="expand" onClick={this._fillSpace}/>
                        </Form.Field>
                    </Form.Group>

                    { this.props.showSize === 'Yes' ? <Form.Group>
                        <Form.Input
                            error={this.props.errors.sectionRows && { content: this.props.errors.sectionRows, pointing: Constants.Pointing.ABOVE }}
                            autoComplete={'off'}
                            type={'number'}
                            label={'Rows'}
                            onChange={(_, d) => this._updateSectionRows(d.value)}
                            placeholder={'0'}
                            value={this.props.sectionRows}
                            min={1}
                            width={6}
                        />
                        <Form.Input
                            error={this.props.errors.sectionColumns && { content: this.props.errors.sectionColumns, pointing: Constants.Pointing.ABOVE }}
                            autoComplete={'off'}
                            type={'number'}
                            label={'Columns'}
                            onChange={(_, d) => this._updateSectionColumns(d.value)}
                            placeholder={'0'}
                            min={1}
                            value={this.props.sectionColumns}
                            width={6}
                        />
                    </Form.Group> : null }
                    { this.props.showSize === 'Yes' ? <Grid style={{ margin: '0px' }}>
                        {[...Array(Number(this.props.sectionRows))].map((_, i) =>
                            <Grid.Row key={i} style={ { padding: '0px' } }>
                                {[...Array(Number(this.props.sectionColumns))].map((_, j) => (
                                    <Grid.Column
                                        key={j}
                                        style={{ backgroundColor: this._getColor(i, j) }}
                                        id={'column'}
                                        onClick={(e) => this.cellClick(e, i, j)}
                                    />
                                ))}
                            </Grid.Row>
                        )}
                    </Grid> : null }

                    <Form.Group>
                        <Form.Input label='x'
                            error={this.props.errors.x && { content: this.props.errors.x, pointing: Constants.Pointing.ABOVE }}
                            autoComplete="off"
                            type="number"
                            placeholder="0"
                            min="0"
                            max={bounds ? bounds.w : Constants.DEFAULT_WIDTH}
                            value={this.props.geometry.x}
                            onChange={ev => this.props.updateGeometry({ ...this.props.geometry, x: ev.target.value })}
                            width={6}/>

                        <Form.Input label='y'
                            error={this.props.errors.y && { content: this.props.errors.y, pointing: Constants.Pointing.ABOVE }}
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
                            error={this.props.errors.w && { content: this.props.errors.w, pointing: Constants.Pointing.ABOVE }}
                            autoComplete="off"
                            type="number"
                            placeholder={bounds ? bounds.w : Constants.DEFAULT_WIDTH}
                            min="1"
                            max={bounds ? bounds.w : Constants.DEFAULT_WIDTH}
                            value={this.props.geometry.w}
                            onChange={ev => this.props.updateGeometry({ ...this.props.geometry, w: ev.target.value })}
                            width={6}/>
                        <Form.Input label="height"
                            error={this.props.errors.h && { content: this.props.errors.h, pointing: Constants.Pointing.ABOVE }}
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
    log: PropTypes.object.isRequired,
    updateSpace: PropTypes.func.isRequired,
    updateGeometry: PropTypes.func.isRequired,
    updateErrors: PropTypes.func.isRequired,
    updateShowSize: PropTypes.func.isRequired,
    updateGeoCache: PropTypes.func.isRequired,
    updateSectionRows: PropTypes.func.isRequired,
    updateSectionColumns: PropTypes.func.isRequired,
    updateSelectedSection: PropTypes.func.isRequired,

    space: PropTypes.string,
    geometry: PropTypes.shape({ x: PropTypes.string, y: PropTypes.string, w: PropTypes.string, h: PropTypes.string }),
    errors: PropTypes.shape({ x: PropTypes.string, y: PropTypes.string, w: PropTypes.string, h: PropTypes.string, space: PropTypes.string, sectionColumns: PropTypes.string, sectionRows: PropTypes.string }),
    showSize: PropTypes.string,
    geoCache: PropTypes.shape({ x: PropTypes.string, y: PropTypes.string, w: PropTypes.string, h: PropTypes.string }),
    sectionRows: PropTypes.string,
    sectionColumns: PropTypes.string,
    selectedSection: PropTypes.number
};
