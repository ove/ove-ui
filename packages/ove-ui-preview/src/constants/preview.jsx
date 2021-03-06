// Setup jQuery to work inside React
import $ from 'jquery';
window.$ = $;

export default {
    UPDATE: 'UPDATE',
    COMPONENT_NAME: 'preview',
    CONTENT_DIV: '.preview',
    SPACE_DIV: '.space',
    BACKGROUND: '#222',
    CONTROL_CANVAS: '.unselectable',
    CONTROLLER: '.operation',
    OVE_FRAME: '.ove-frame',
    SPACE: 'oveSpace',
    DEFAULT_FILE_NAME: 'project.json',
    MAX_ZOOM_LEVEL: 1,
    MIN_ZOOM_LEVEL: 1.000001,
    LOG_LEVEL: +(process.env.LOG_LEVEL || 5), // Level (from 0 - 6): 5 == TRACE
    FRAME_LOAD_DELAY: 500, // Unit: milliseconds
    WAIT_FOR_SECTIONS_DOWNLOADED_INTERVAL: 1000, // Unit: milliseconds

    REACT_APP_OVE_HOST: (function () {
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
    })(),

    /**************************************************************
                            Enums
    **************************************************************/
    Button: {
        UPLOAD: '#btnUpload',
        DOWNLOAD: '#btnDownload',
        DELETE: '#btnDelete',
        ADD: '#btnAdd',
        EDIT: '#btnEdit'
    }
};
