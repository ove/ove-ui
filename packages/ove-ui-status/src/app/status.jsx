/* jshint ignore:start */
// JSHint cannot deal with React.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Constants from '../constants/status';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';
import 'github-markdown-css/github-markdown.css';
import './status.css';

export default class Status extends Component {
    constructor (props) {
        super(props);
        this.log = props.log;
        this.status = props.status || {};
        this.log.debug('Successfully loaded React App');
    }

    componentDidMount () { }

    componentWillUnmount () { }

    static getURL (type, id) {
        let url;
        if (type !== 'Core') {
            url = Constants['REACT_APP_OVE_' + type.toUpperCase()](id);
            if (url !== null) {
                if (id.toUpperCase() === Constants.Service.PERSISTENCE.toUpperCase()) {
                    url += '/empty';
                } else if (type.toUpperCase() !== 'UI') {
                    url += '/name';
                }
            }
        } else {
            url = Constants.REACT_APP_OVE_HOST + '/sections?geometry=0,0,0,0';
        }
        return url;
    }

    static compute (log) {
        let status = {};
        log.debug('Computing status information');
        const getStatus = (url) => {
            return new Promise((resolve, reject) => {
                if (url === null) {
                    resolve(Constants.Status.DEGRADED);
                } else {
                    axios.get('//' + url).then(_ => {
                        resolve(Constants.Status.OPERATIONAL);
                    }).catch(error => {
                        if (error.request) {
                            resolve(Constants.Status.OUTAGE);
                        } else {
                            log.error(error);
                        }
                    });
                }
            });
        };
        return new Promise((resolve, reject) => {
            let count = 0;
            let completedCount = 0;
            Constants.OVE_COMPONENT_TYPES.forEach(function (x) {
                const af = async function (x) {
                    for (let e in Constants[x]) {
                        let url = Status.getURL(x, Constants[x][e]);
                        status[url] = await getStatus(url);
                    }
                    completedCount++;
                };
                count++;
                af(x);
            });
            setTimeout(_ => {
                const x = setInterval(_ => {
                    if (count === completedCount) {
                        clearInterval(x);
                        resolve(status);
                    }
                }, 2000);
            }, 1000);
        });
    };

    _getTableRows () {
        const getDivider = x => {
            return !((x.length + 1) % 4) ? 'td-csr' : 'td-csl';
        };

        const getStatusSymbol = status => {
            switch (status) {
                case Constants.Status.OPERATIONAL:
                    return <i className='fas fa-check text-success' title={Constants.Status.Text.OPERATIONAL}></i>;
                case Constants.Status.DEGRADED:
                    return <i className='fas fa-exclamation-triangle text-warning' title={Constants.Status.Text.DEGRADED}></i>;
                case Constants.Status.OUTAGE:
                    return <i className='fas fa-times-circle text-danger' title={Constants.Status.Text.OUTAGE}></i>;
                default:
                    this.log.warn('Unknown status:', status);
                    return '';
            }
        };

        this.log.debug('Generating status table');
        let tds = [];
        tds.push(<td className='td-c'>OVE Core</td>);
        tds.push(<td className={'text-right ' + getDivider(tds)}>{getStatusSymbol(Constants.Status.OPERATIONAL)}</td>);

        Constants.OVE_COMPONENT_TYPES.forEach(x => {
            for (let e in Constants[x]) {
                tds.push(<td className='td-c'>{'OVE ' + Constants[x][e] + ' ' + x}</td>);
                tds.push(<td className={'text-right ' + getDivider(tds)}>{getStatusSymbol(this.status[Status.getURL(x, Constants[x][e])])}</td>);
            }
        });

        let trs = [];
        for (let i = 0; i < tds.length; i = i + 4) {
            trs.push(<tr key={i}>{tds[i]}{tds[i + 1]}{tds[i + 2]}{tds[i + 3]}</tr>);
        }
        return trs;
    }

    _displayStatusBanner () {
        let status = Constants.Status.OPERATIONAL;
        Object.values(this.status).forEach(e => {
            if (e > status) {
                status = e;
            }
        });
        switch (status) {
            case Constants.Status.OPERATIONAL:
                return (
                    <div className='jumbotron alert bg-success'>
                        <p className='text-white'><strong>{Constants.Status.Notice.OPERATIONAL}</strong></p>
                    </div>
                );
            case Constants.Status.DEGRADED:
                return (
                    <div className='jumbotron alert bg-warning'>
                        <p className='text-light'><strong>{Constants.Status.Notice.DEGRADED}</strong></p>
                    </div>
                );
            case Constants.Status.OUTAGE:
                return (
                    <div className='jumbotron alert bg-danger'>
                        <p className='text-white'><strong>{Constants.Status.Notice.OUTAGE}</strong></p>
                    </div>
                );
            default:
                this.log.warn('Unknown status:', status);
                return '';
        }
    }

    render () {
        return (
            <div className='outer'>
                <div className='markdown-body'>
                    <h1>Open Visualisation Environment Status Page</h1>
                    <p>
                        This page provides status information of Open Visualisation Environment (OVE) components that are
                        associated with an instance of OVE Core accessible
                        at <a href={'//' + Constants.REACT_APP_OVE_HOST}>{Constants.REACT_APP_OVE_HOST}</a> - more
                        information about OVE and how it has been configured is available there.
                    </p>
                    <p>
                        Please note that the <code>{Constants.Status.Text.DEGRADED}</code> status will be displayed if the
                        status of an OVE component cannot be determined due to a technical reason.
                    </p>
                </div>
                {this._displayStatusBanner()}

                <div className='card status my-4'>
                    <div className='table-responsive'>
                        <table className='table table-bordered'>
                            <tbody>
                                {this._getTableRows()}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='jumbotron alert bg-white'>
                    <p className='text-regular text-center'>
                        <i className='px-2 fas fa-check text-success'></i> {Constants.Status.Text.OPERATIONAL}
                        <i className='px-4' />
                        <i className='px-2 fas fa-exclamation-triangle text-warning'></i> {Constants.Status.Text.DEGRADED}
                        <i className='px-4' />
                        <i className='px-2 fas fa-times-circle text-danger'></i> {Constants.Status.Text.OUTAGE}
                    </p>
                </div>
            </div>
        );
    }
}

Status.propTypes = {
    log: PropTypes.object.isRequired,
    status: PropTypes.object.isRequired
};
