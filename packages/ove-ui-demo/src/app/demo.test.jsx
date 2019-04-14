/* jshint ignore:start */
// JSHint cannot deal with React.
import React from 'react';
import ReactDOM from 'react-dom';
import Demo from './demo';

it('renders without crashing', () => {
    const div = document.createElement('div');
    const log = { debug: jest.fn(x => x), warn: jest.fn(x => x), error: jest.fn(x => x) };
    ReactDOM.render(<Demo log={log} />, div);
    ReactDOM.unmountComponentAtNode(div);
});
