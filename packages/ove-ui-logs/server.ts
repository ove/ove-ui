const WebSocketServer = require('ws').WebSocketServer;
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const config = require(process.env.CONFIG_PATH);
const app = express();
const Tail = require('tail').Tail;

app.use(cors());
app.use(express.json());
app.use('/static/media', express.static(path.join(__dirname, 'build', 'static', 'media')));
app.get('/:path(*)', function (req, res) {
    let file = path.join(__dirname, 'build', req.params.path || 'index.html');
    if (!fs.existsSync(file)) {
        file = path.join(__dirname, 'build', 'index.html');
    }
    res.type(path.extname(file)).send(fs.readFileSync(file, 'utf-8')
        .replace(/__OVEHOST__/ig, process.env.OVE_HOST));
});

let clients = [];

const connectFile = (t) => {
    t.on('line', data => {
        clients.forEach(c => c.send(JSON.stringify({ name: 'message', body: data })));
    });
    t.on('error', err => {
        clients.forEach(c => c.send(JSON.stringify({ name: 'message', body: err })));
    });
};

const setupTails = () => {
    const options = {
        separator: /[\r]?\n/,
        fromBeginning: false,
        fsWatchOptions: {},
        follow: false,
        logger: console,
        nLines: 0,
        useWatchFile: true,
        encoding: 'utf-8',
        flushAtEOF: false
    };
    const outputs = config.output_logs.map(x => {
        console.log(x);
        return new Tail(x, options);
    });
    const errors: [typeof Tail] = config.error_logs.map(x => new Tail(x, options));
    outputs.forEach(connectFile);
    errors.forEach(connectFile);
};

app.post('/log', (req, res) => {
    const message: [string] = req.body.message;

    message.splice(1, 1);
    message[0] = message[0].substring(message[0].indexOf('['));

    clients.forEach(c => c.send(JSON.stringify({ name: 'message', body: message.join(' ') })));
    res.sendStatus(200);
});

setupTails();

const server = app.listen(process.env.PORT || 8080);
const wss = new WebSocketServer({ server });
wss.on('connection', ws => {
    clients.push(ws);
    ws.send(JSON.stringify({ name: 'init', config: config.components }));
});
