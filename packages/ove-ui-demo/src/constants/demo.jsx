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

    /**************************************************************
                            Enums
    **************************************************************/
    Page: {
        INDEX: 'index',
        WELCOME: 'welcome',
        CLIENT: 'client'
    }
};
