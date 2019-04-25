import Constants from '../constants/preview';
import axios from 'axios';
import * as d3 from 'd3';
import UploadImg from '@fortawesome/fontawesome-free/svgs/solid/upload.svg';
import DownloadImg from '@fortawesome/fontawesome-free/svgs/solid/download.svg';
import DeleteImg from '@fortawesome/fontawesome-free/svgs/solid/trash-alt.svg';
import AddImg from '@fortawesome/fontawesome-free/svgs/solid/plus.svg';
import EditImg from '@fortawesome/fontawesome-free/svgs/solid/edit.svg';

// Setup jQuery to work inside React
import $ from 'jquery';
window.$ = $;

export default class Replicator {
    constructor () {
        if (window.OVE && window.OVE.Utils) {
            this.space = window.OVE.Utils.getQueryParam(Constants.SPACE);
            this.hostname = '//' + Constants.REACT_APP_OVE_HOST;
        }
    }

    init () {
        const toProjectFormat = json => {
            let payload = [];
            json.forEach((e, i) => {
                payload.push({
                    name: 'section' + i,
                    type: 'section',
                    positionConstraints: { h: e.h, w: e.w, x: e.x, y: e.y },
                    app: e.app
                });
            });
            return payload;
        };
        const fromProjectFormat = (json, space) => {
            let payload = [];
            json.forEach((e, i) => {
                let p = e.positionConstraints;
                payload.push({ id: i, space: space, h: p.h, w: p.w, x: p.x, y: p.y, app: e.app });
            });
            return payload;
        };
        const __private = {
            displayError: () => {
                $('<div id=\'no-space-selected\'>').addClass('alert alert-danger')
                    .html('No <strong>' + Constants.SPACE + '</strong> query parameter provided. Available spaces:')
                    .appendTo(Constants.CONTENT_DIV).css({
                        display: 'block',
                        margin: '0.5vw auto',
                        width: '85vw',
                        maxWidth: '980px'
                    });

                axios.get('//' + Constants.REACT_APP_OVE_HOST + '/spaces').then(res => res.data).then(spaces => {
                    d3.select('#no-space-selected')
                        .append('ul')
                        .selectAll('li')
                        .data(Object.keys(spaces))
                        .enter()
                        .append('li')
                        .append('a')
                        .attr('href', d => `?oveSpace=${d}`)
                        .text(d => d);
                });
            },
            replicate: (space, hostname, bounds, scale, __private) => {
                const log = __private.log;

                log.debug('Displaying content on a canvas with width:', bounds.w * scale, 'height:', bounds.h * scale);
                $('<div>', {
                    class: Constants.SPACE_DIV.substring(1)
                }).css({
                    zoom: 1,
                    transformOrigin: '50% 50%',
                    width: bounds.w * scale + 'px',
                    height: bounds.h * scale + 'px',
                    // Each client is loaded in its original size and then scaled-down.
                    position: 'absolute',
                    background: Constants.BACKGROUND,
                    overflow: 'hidden'
                }).appendTo(Constants.CONTENT_DIV);

                const width = Math.min(bounds.w * scale, Math.min(document.documentElement.clientWidth, window.innerWidth));
                const height = Math.min(bounds.h * scale, Math.min(document.documentElement.clientHeight, window.innerHeight));
                log.debug('Displaying control canvas with width:', width, 'height:', height);
                // Introduce an overlay to prevent any background element from being clickable. This is what
                // makes pan and zoom possible.
                $('<div>', {
                    class: Constants.CONTROL_CANVAS.substring(1)
                }).css({
                    zoom: 1,
                    display: 'inline-block',
                    transformOrigin: '0% 0%',
                    width: width + 'px',
                    height: height + 'px',
                    position: 'absolute',
                    opacity: '0%',
                    overflow: 'hidden'
                }).appendTo(Constants.CONTENT_DIV);

                log.debug('Displaying controller');
                $('<div>', {
                    class: Constants.CONTROLLER.substring(1)
                }).css({
                    zIndex: 1,
                    position: 'absolute',
                    bottom: '40px',
                    textAlign: 'center',
                    width: '100%'
                }).appendTo(Constants.CONTENT_DIV);
                const css = {
                    display: 'inline-block',
                    width: '48px',
                    height: '48px',
                    position: 'relative',
                    paddingRight: '5px', /* required for the oval shape */
                    marginRight: '5px',
                    borderRadius: '50%',
                    textShadow: '1px 1px 2px #000',
                    color: '#fff',
                    fontSize: '32px',
                    lineHeight: '46px'
                };

                [
                    { name: Constants.Button.ADD, icon: `${AddImg}` },
                    { name: Constants.Button.DOWNLOAD, icon: `${DownloadImg}` },
                    { name: Constants.Button.UPLOAD, icon: `${UploadImg}` },
                    { name: Constants.Button.EDIT, icon: `${EditImg}` },
                    { name: Constants.Button.DELETE, icon: `${DeleteImg}` }
                ].forEach(e => {
                    let span = $('<span>').css(Object.assign({ background: 'snow' }, css));
                    span.appendTo(Constants.CONTROLLER);
                    $('<div>', {
                        id: e.name.substring(1)
                    }).css(Object.assign({
                        background: `url(${e.icon}) center/45% no-repeat`,
                        opacity: 0.8
                    }, css)).appendTo(span);
                });

                const controllerScale = Math.min(Math.min(document.documentElement.clientWidth, window.innerWidth) / 1440,
                    Math.min(document.documentElement.clientHeight, window.innerHeight) / 720);
                $(Constants.CONTROLLER).css({ display: 'block', transformOrigin: '50% 50%', transform: 'scale(' + controllerScale + ')' });

                $(Constants.Button.ADD).click(_ => {
                    const launcher = window.open('', 'Launcher', '', true);
                    try {
                        if (launcher.location.href === 'about:blank') {
                            launcher.location.href = '//' + Constants.REACT_APP_OVE_HOST + '/ui/launcher';
                        }
                    } catch (__) {}
                });

                $(Constants.Button.DOWNLOAD).click(_ => {
                    axios.get('//' + Constants.REACT_APP_OVE_HOST + '/sections?space=' + space).then(res => {
                        const payload = {
                            Space: space,
                            Layout: {
                                oveSpaceGeometry: '//' + Constants.REACT_APP_OVE_HOST + '/spaces/' + space + '/geometry',
                                canvas: { layout: { type: 'static' }, sections: toProjectFormat(res.data) }
                            }
                        };
                        let fileName = prompt('Please provide a name for your file', Constants.DEFAULT_FILE_NAME);
                        // return if cancel button is pressed or filename is blank.
                        if (fileName) {
                            let fn = fileName.split('.')[0] + '.json';
                            $('<a>', {
                                download: fn,
                                target: '_blank',
                                href: 'data:application/octet-stream;charset=utf-8,' +
                                    encodeURIComponent(JSON.stringify(payload))
                            }).css('display', 'none').appendTo($('body'));
                            log.debug('Downloading sections to file:', fn);
                            $('a')[0].click();
                            $('a').remove();
                        }
                    });
                });

                $(Constants.Button.UPLOAD).click(_ => {
                    $('<input>', {
                        type: 'file'
                    }).css('visibility', 'hidden').appendTo($('body')).change(function () {
                        const __self = $(this)[0];
                        if (__self.files.length > 0) {
                            let fileReader = new FileReader();
                            fileReader.onload = function (e) {
                                axios.delete('//' + Constants.REACT_APP_OVE_HOST + '/sections').then(_ => {
                                    const sections = fromProjectFormat(JSON.parse(e.target.result).Layout.canvas.sections, space);
                                    sections.forEach(section => {
                                        axios.post('//' + Constants.REACT_APP_OVE_HOST + '/section', section).catch(log.error);
                                    });
                                    log.debug('Restoring sections from file');
                                }).catch(log.error);
                            };
                            fileReader.readAsText(__self.files.item(0));
                            __self.remove();
                        }
                    }).click();
                });

                $(Constants.Button.DELETE).click(_ => {
                    axios.delete('//' + Constants.REACT_APP_OVE_HOST + '/sections?space=' + space).catch(log.error);
                });

                // D3 is used for pan operations. Zoom is ignored.
                log.debug('Registering pan listeners');
                const maxTranslate = {
                    x: Math.max(bounds.w * scale - width, 0),
                    y: Math.max(bounds.h * scale - height, 0)
                };
                log.debug('Translation is limited to a maximum of:', maxTranslate);
                // We are only interested in translations and not in scaling.
                d3.select(Constants.CONTROL_CANVAS).call(d3.zoom().scaleExtent([1, 1.000001]).on('zoom', function () {
                    const event = d3.event.transform;
                    log.trace('Got D3 event with, k:', event.k, 'x:', event.x, 'y:', event.y);
                    const x = Math.max(-maxTranslate.x, Math.min(event.x, 0));
                    const y = Math.max(-maxTranslate.y, Math.min(event.y, 0));
                    $(Constants.SPACE_DIV).css({
                        transform: 'translate(' + x + 'px,' + y + 'px)'
                    });
                }));

                fetch(hostname + '/spaces').then(function (r) { return r.text(); }).then(function (text) {
                    log.debug('Loading space:', space);
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
                        __private.ove.frame.send('child', { load: true }, 'core');
                    }, Constants.FRAME_LOAD_DELAY);
                });
            },
            // OVE and OVE Logging are only available at runtime.
            log: (window.OVE && window.OVE.Utils) ? window.OVE.Utils.Logger(
                Constants.COMPONENT_NAME, Constants.LOG_LEVEL) : undefined,
            ove: window.OVE ? new window.OVE(Constants.COMPONENT_NAME) : undefined
        };
        const __self = this;
        const log = __private.log;
        if (!this.hostname || !this.space) {
            __private.displayError();
            return;
        }

        log.debug('Replicating contents from host:', __self.hostname);
        let boundsURL = __self.hostname + '/spaces/' + __self.space + '/geometry';
        fetch(boundsURL).then(function (r) { return r.text(); }).then(function (text) {
            let bounds = JSON.parse(text);
            log.trace('Got response:', bounds, 'from from URL:', boundsURL);
            const scale = 1 / Math.min(bounds.w / Math.min(document.documentElement.clientWidth, window.innerWidth),
                bounds.h / Math.min(document.documentElement.clientHeight, window.innerHeight));
            __private.replicate(__self.space, __self.hostname, bounds, scale, __private);
        });
        $(Constants.CONTENT_DIV).css({
            width: '100%',
            height: '100%'
        });
    }
}
