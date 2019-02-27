export default {
    UPDATE: 'UPDATE',
    STEP: 'step',
    PENDING: 'pending',
    UNDEFINED: typeof undefined,
    LAUNCH: 'LAUNCH',
    BLACKLIST: ['log', 'spaces', 'states'],
    COMPONENT_NAME: 'launcher',
    LOG_LEVEL: +(process.env.LOG_LEVEL || 5), // Level (from 0 - 6): 5 == TRACE
    SECTION_CONTROLLER: '.section-controller',

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

    REACT_APP_OVE_UI_PREVIEW: (function () {
        let host = process.env.REACT_APP_OVE_UI_PREVIEW;
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

    REACT_APP_OVE_APP: function (appName) {
        let host = process.env['REACT_APP_OVE_APP_' + appName.toUpperCase()];
        if (host) {
            if (host.indexOf('//') >= 0) {
                host = host.substring(host.indexOf('//') + 2);
            }
            if (host.indexOf('/') >= 0) {
                host = host.substring(0, host.indexOf('/'));
            }
        }
        return host;
    },

    NEXT_BUTTON_CLASS: 'btn btn-prev btn-primary btn-md pull-right',
    BACK_BUTTON_CLASS: 'btn btn-next btn-primary btn-md pull-left',

    DEFAULT_HEIGHT: 2424,
    DEFAULT_WIDTH: 4320,

    YOUTUBE_URL_REGEX: new RegExp('^(?:(?:(?:https?|ftp):)?\\/\\/)' +
        '(?:www.youtube.com\\/embed\\/)(?:[a-z0-9_-]{0,11})$', 'i'),

    // Based on https://gist.github.com/dperini/729294
    VALID_URL_REGEX: new RegExp(
        '^' +
            // protocol identifier (optional)
            // short syntax // still required
            '(?:(?:(?:https?|ftp):)?\\/\\/)' +
            // user:pass BasicAuth (optional)
            '(?:\\S+(?::\\S*)?@)?' +
            '(?:' +
                // IP address dotted notation octets
                // excludes loopback network 0.0.0.0
                // excludes reserved space >= 224.0.0.0
                // excludes network & broacast addresses
                // (first & last IP address of each class)
                '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
                '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
                '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
            '|' +
                // host & domain names, may end with dot
                // can be replaced by a shortest alternative
                // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
                '(?:' +
                '(?:' +
                    '[a-z0-9\\u00a1-\\uffff]' +
                    '[a-z0-9\\u00a1-\\uffff_-]{0,62}' +
                ')?' +
                '[a-z0-9\\u00a1-\\uffff]\\.' +
                ')+' +
                // TLD identifier name must not end with a dot
                '(?:[a-z\\u00a1-\\uffff]{2,})' +
            '|' +
                // Accept localhost as a valid URL
                '(?:localhost)' +
            ')' +
            // port number (optional)
            '(?::\\d{2,5})?' +
            // resource path (optional)
            '(?:[/?#]\\S*)?' +
        '$', 'i'
    ),

    /**************************************************************
                            Enums
    **************************************************************/
    App: {
        ALIGNMENT: 'alignment',
        AUDIO: 'audio',
        CHARTS: 'charts',
        CONTROLLER: 'controller',
        HTML: 'html',
        IMAGES: 'images',
        MAPS: 'maps',
        NETWORKS: 'networks',
        PDF: 'pdf',
        REPLICATOR: 'replicator',
        SVG: 'svg',
        VIDEOS: 'videos',
        WEBRTC: 'webrtc',
        WHITEBOARD: 'whiteboard'
    },

    Mode: {
        NEW: 'new',
        EXISTING: 'existing'
    },

    OS: {
        UNIX: 'unix',
        WINDOWS: 'windows'
    },

    CodeMirror: {
        THEME: 'dracula',
        Mode: {
            JS: 'javascript',
            SHELL: 'shell'
        }
    }
};
