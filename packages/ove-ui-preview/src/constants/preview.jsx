export default {
    UPDATE: 'UPDATE',
    COMPONENT_NAME: 'preview',
    CONTENT_DIV: '.preview',
    SPACE_DIV: '.space',
    BACKGROUND: '#222',
    CONTROL_CANVAS: '.unselectable',
    OVE_FRAME: '.ove-frame',
    SPACE: 'oveSpace',
    MAX_ZOOM_LEVEL: 1,
    MIN_ZOOM_LEVEL: 1.000001,
    LOG_LEVEL: +(process.env.LOG_LEVEL || 5), // Level (from 0 - 6): 5 == TRACE
    FRAME_LOAD_DELAY: 500, // Unit: milliseconds

    REACT_APP_OVE_HOST: (function () {
        let host = process.env.REACT_APP_OVE_HOST;
        if (host) {
            if (host.indexOf('//') >= 0) {
                host = host.substring(host.indexOf('//') + 2);
            }
            if (host.indexOf('/') >= 0) {
                host = host.substring(0, host.indexOf('/'));
            }
        }
        return host;
    })(),
};
