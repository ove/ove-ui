/* jshint ignore:start */
// JSHint cannot deal with React.
import React from 'react';
import ReactDOM from 'react-dom';
import Logs from './logs';

const range = document.createRange();

document.createRange = () => {
    range.getBoundingClientRect = jest.fn();

    range.getClientRects = jest.fn(() => ({
        item: () => null,
        length: 0
    }));

    return range;
};

// Mocking required for codemirror (see https://discuss.codemirror.net/t/working-in-jsdom-or-node-js-natively/138/6)
global.document.body.createTextRange = function () {
    return {
        setEnd: function () {},
        setStart: function () {},
        getBoundingClientRect: function () {
            return { right: 0 };
        },
        getClientRects: function () {
            return {
                length: 0,
                left: 0,
                right: 0
            };
        }
    };
};

it('renders without crashing', () => {
    const div = document.createElement('div');
    const log = { debug: jest.fn(x => x), warn: jest.fn(x => x), error: jest.fn(x => x) };
    ReactDOM.render(<Logs log={log} />, div);
    ReactDOM.unmountComponentAtNode(div);
});
