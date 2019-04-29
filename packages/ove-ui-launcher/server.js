const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

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

app.listen(process.env.PORT || 8080);
