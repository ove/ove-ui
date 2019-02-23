import Constants from '../constants/preview';

// Setup jQuery to work inside React
import $ from 'jquery';
window.$ = $;

export default class Replicator {
    constructor() {
        if (window.OVE && window.OVE.Utils) {
            this.space = window.OVE.Utils.getQueryParam(Constants.SPACE);
            this.hostname = window.OVE.Utils.getQueryParam(Constants.HOSTNAME);
        }
    }

    init() {
        const __private = {
            displayError: _ => {
                $('<div>').addClass('alert alert-danger')
                    .html('<strong>Error:</strong> Please provide <strong>' + Constants.HOSTNAME + '</strong> and <strong>' +
                        Constants.SPACE + '</strong> query parameters.')
                    .appendTo(Constants.CONTENT_DIV).css({ display: 'block', margin: '0.5vw auto', width: '85vw', maxWidth: '980px' });
            },
            replicate: (sections, space, hostname, bounds, scale, __private) => {
                $('<div>', {
                    class: Constants.SPACE_DIV.substring(1)
                }).css({
                    zoom: 1,
                    transformOrigin: '0% 0%',
                    width: bounds.w * scale + 'px',
                    height: bounds.h * scale + 'px',
                    // Each client is loaded in its original size and then scaled-down.
                    position: 'absolute',
                    background: Constants.BACKGROUND,
                    overflow: 'hidden'
                }).appendTo(Constants.CONTENT_DIV);
        
                // Introduce an overlay to prevent any background element from being clickable. This is what
                // makes pan and zoom possible.
                $('<div>').css({
                    zoom: 1,
                    transformOrigin: '0% 0%',
                    width: bounds.w * scale + 'px',
                    height: bounds.h * scale + 'px',
                    position: 'absolute',
                    opacity: '0%',
                    overflow: 'hidden'
                }).appendTo(Constants.CONTENT_DIV);
            
                fetch(hostname + '/spaces').then(function (r) { return r.text(); }).then(function (text) {
                    __private.log.debug('Loading space:', space);
                    let clients = JSON.parse(text)[space];
                    clients.forEach(function (c, i) {
                        if (c.x !== undefined && c.y !== undefined && c.w !== undefined && c.h !== undefined) {
                            $('<iframe>', {
                                src: hostname + '/view.html?oveViewId=' + space + '-' + i,
                                class: Constants.OVE_FRAME.substring(1),
                                allowtransparency: true,
                                frameborder: 0,
                                scrolling: 'no'
                            }).css({
                                zoom: 1,
                                transformOrigin: '0% 0%',
                                transform: 'scale(' + scale + ')',
                                // Each client is loaded in its original size and then scaled-down.
                                width: (c.w + (c.offset ? c.offset.x : 0)) + 'px',
                                height: (c.h + (c.offset ? c.offset.y : 0)) + 'px',
                                position: 'absolute',
                                marginLeft: (c.x - (c.offset ? c.offset.x : 0)) * scale,
                                marginTop: (c.y - (c.offset ? c.offset.y : 0)) * scale
                            }).appendTo(Constants.SPACE_DIV);
                        }
                    });
                    // Only displaying the subset of sections in the background.
                    setTimeout(function () {
                        const filter = [];
                        sections.forEach(function (section) {
                            filter.push(section.id);
                        });
                        __private.ove.frame.send('child', { load: true, filters: { includeOnly: filter } }, 'core');
                    }, Constants.FRAME_LOAD_DELAY);
                });
            },
            log: (window.OVE && window.OVE.Utils) ? window.OVE.Utils.Logger(Constants.COMPONENT_NAME, Constants.LOG_LEVEL) : undefined,
            ove: window.OVE ? new window.OVE(Constants.COMPONENT_NAME) : undefined
        };
        if (!this.hostname || !this.space) {
            __private.displayError();
            return;
        }
        const __self = this;

        __private.log.debug('Replicating contents from host:', __self.hostname);
        let url = __self.hostname + '/sections?space=' + __self.space;
        let sections = {};
        fetch(url).then(function (r) { return r.text(); }).then(function (text) {
            let response = JSON.parse(text);
            __private.log.trace('Got response:', response, 'from from URL:', url);
            response.forEach(function (section) {
                if (__self.space === section.space) {
                    if (!sections[section.space]) {
                        sections[section.space] = [];
                    }
                    sections[section.space].push(section);
                }
            });
            
            const sectionsToReplicate = sections[__self.space] || [];
            __private.log.info('Replicating', sectionsToReplicate.length, 'sections from space:', __self.space, 'on host:', __self.hostname);
            
            let boundsURL = __self.hostname + '/spaces/' + __self.space + '/geometry';
            fetch(boundsURL).then(function (r) { return r.text(); }).then(function (text) {
                let bounds = JSON.parse(text);
                __private.log.trace('Got response:', bounds, 'from from URL:', boundsURL);
                const scale = 1 / Math.min(bounds.w / Math.min(document.documentElement.clientWidth, window.innerWidth),
                    bounds.h / Math.min(document.documentElement.clientHeight, window.innerHeight));
                __private.replicate(sectionsToReplicate, __self.space, __self.hostname, bounds, scale, __private);
            });
        });
        $(Constants.CONTENT_DIV).css({
            width: '100%',
            height: '100%'
        });
    }    
}
