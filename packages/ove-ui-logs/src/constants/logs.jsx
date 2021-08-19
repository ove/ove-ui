// Setup jQuery to work inside React
import $ from 'jquery';
window.$ = $;

const getOVEHost = function () {
    const publicURL = (function () {
        try {
            let manifestURL = $('link[rel=\'manifest\']')[0].href;
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
    COMPONENT_NAME: 'logs',
    LOG_LEVEL: +(process.env.LOG_LEVEL || 5), // Level (from 0 - 6): 5 == TRACE

    SECTION_DELETE_WAIT_TIME: 1000, // Unit: milliseconds

    REACT_APP_OVE_HOST: getOVEHost(),

    LOCAL_STORAGE_KEY: 'logsState',

    DEFAULT_HEIGHT: 2424, // Unit: pixels
    DEFAULT_WIDTH: 4320 // Unit: pixels
};
