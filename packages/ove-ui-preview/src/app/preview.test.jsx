/* jshint ignore:start */
// JSHint cannot deal with React.
import React from 'react';
import ReactDOM from 'react-dom';
import Preview from './preview';

it('renders without crashing', () => {
    const div = document.createElement('div');
    const log = { debug: jest.fn(x => x), warn: jest.fn(x => x), error: jest.fn(x => x) };
    ReactDOM.render(<Preview log={log} dispatch={_ => {}} />, div);
    ReactDOM.unmountComponentAtNode(div);
});
