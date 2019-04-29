// Setup jQuery to work inside React
import $ from 'jquery';
window.$ = $;

const getOVEHost = function () {
    const publicURL = (function () {
        try {
            let manifestURL = $('link[rel=\'manifest\'')[0].href;
            let host = manifestURL.substring(0, manifestURL.indexOf('/manifest.json'));
            if (host) {
                if (host.indexOf('//') >= 0) {
                    host = host.substring(host.indexOf('//') + 2);
                }
            }
            return host;
        } catch (_) {
            return process.env.PUBLIC_URL;
        }
    })();
    if (publicURL.includes('/ui/')) {
        return publicURL.substring(0, publicURL.indexOf('/ui/'));
    }
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
};

export default {
    COMPONENT_NAME: 'status',
    LOG_LEVEL: +(process.env.LOG_LEVEL || 5), // Level (from 0 - 6): 5 == TRACE
    COMPONENT_STATUS_TEST_TIME: 2000, // Unit: milliseconds
    COMPONENT_STATUS_TEST_INITIAL_WAIT_TIME: 1000, // Unit: milliseconds

    REACT_APP_OVE_HOST: getOVEHost(),

    REACT_APP_OVE_APP: function (appName) {
        return getOVEHost() + '/app/' + appName.toLowerCase();
    },

    REACT_APP_OVE_SERVICE: function (serviceName) {
        if (serviceName.toLowerCase() === 'persistence') {
            return getOVEHost() + '/service/persistence/inmemory';
        }
        // return getOVEHost() + '/service/' + serviceName.toLowerCase();
        return null;
    },

    REACT_APP_OVE_UI: function (uiName) {
        return getOVEHost() + '/ui/' + uiName.toLowerCase();
    },

    OVE_COMPONENT_TYPES: ['App', 'Service', 'UI'],

    /**************************************************************
                            Enums
    **************************************************************/
    Status: {
        OPERATIONAL: 0,
        DEGRADED: 1,
        OUTAGE: 2,

        Text: {
            OPERATIONAL: 'Operational',
            DEGRADED: 'Degraded Performance',
            OUTAGE: 'Outage'
        },

        Notice: {
            OPERATIONAL: 'All Components Operational',
            DEGRADED: 'Degraded Performance in some Components',
            OUTAGE: 'Outage in some Components'
        }
    },

    App: {
        ALIGNMENT: 'Alignment',
        AUDIO: 'Audio',
        CHARTS: 'Charts',
        CONTROLLER: 'Controller',
        HTML: 'HTML',
        IMAGES: 'Images',
        MAPS: 'Maps',
        NETWORKS: 'Networks',
        PDF: 'PDF',
        REPLICATOR: 'Replicator',
        SVG: 'SVG',
        VIDEOS: 'Videos',
        WEBRTC: 'WebRTC',
        WHITEBOARD: 'Whiteboard'
    },

    Service: {
        PERSISTENCE: 'Persistence'
    },

    UI: {
        DEMO: 'Demo',
        LAUNCHER: 'Launcher',
        PREVIEW: 'Preview',
        STATUS: 'Status'
    }
};
