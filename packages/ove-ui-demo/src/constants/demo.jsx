export default {
    COMPONENT_NAME: 'demo',
    LOG_LEVEL: +(process.env.LOG_LEVEL || 5), // Level (from 0 - 6): 5 == TRACE

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

    PUBLIC_URL: (function () {
        let host = window.location.href;
        if (host) {
            if (host.indexOf('//') >= 0) {
                host = host.substring(host.indexOf('//') + 2);
            }
            if (host.endsWith('/')) {
                host = host.substring(0, host.length - 1);
            }
        }
        return '//' + host;
    })(),

    BROWSER: function (name) {
        switch (name) {
            case 'chrome':
                return 'Google Chrome';
            case 'firefox':
                return 'Mozilla Firefox';
            case 'safari':
                return 'Safari';
            case 'edge':
                return 'Microsoft Edge';
            default:
                return name;
        }
    },

    MAX_DOT_COUNT: 5,
    DOT_LOAD_SPEED: 800, // Unit: milliseconds
    CLOCK_UPDATE_FREQUENCY: 1000, // Unit: milliseconds
    SECTION_DELETE_WAIT_TIME: 1000, // Unit: milliseconds
    POST_WELCOME_DELAY: 15000, // Unit: milliseconds
    POST_CLIENT_STATUS_DELAY: 45000, // Unit: milliseconds

    /**************************************************************
                            Enums
    **************************************************************/
    Page: {
        INDEX: 'index',
        WELCOME: 'welcome',
        CLIENT: 'client'
    }
};
