const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const Tail = require('tail').Tail;

app.use(cors());
app.use('/static/media', express.static(path.join(__dirname, 'build', 'static', 'media')));
app.get('/:path(*)', function (req, res) {
    let file = path.join(__dirname, 'build', req.params.path || 'index.html');
    if (!fs.existsSync(file)) {
        file = path.join(__dirname, 'build', 'index.html');
    }
    res.type(path.extname(file)).send(fs.readFileSync(file, 'utf-8')
        .replace(/__OVEHOST__/ig, process.env.OVE_HOST));
});

const setupTails = () => {
    const options = { separator: /[\r]?\n/, fromBeginning: false, fsWatchOptions: {}, follow: false, logger: console, nLines: 0, useWatchFile: true, encoding: 'utf-8', flushAtEOF: false };
    const outputs = [
        '-ove-ove-app-videos-out.log',
        '-ove-ove-app-images-out.log',
        '-ove-ove-core-out.log'
    ].map(x => new Tail(`C:\\Users\\Brython\\.pm2\\logs\\${x}`, options));
    const errors = [
        '-ove-ove-app-videos-error.log',
        '-ove-ove-app-images-error.log',
        '-ove-ove-core-error.log'
    ].map(x => new Tail(`C:\\Users\\Brython\\.pm2\\logs\\${x}`, options));
    outputs.forEach(t => {
        t.on('line', data => {
            console.log(data);
        });
        t.on('error', err => {
            console.log(err);
        });
    });
    errors.forEach(t => {
        t.on('line', data => {
            console.log(data);
        });
        t.on('error', err => {
            console.log(err);
        });
    });
};

setupTails();

app.listen(process.env.PORT || 8080);
