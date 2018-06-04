let express = require("express");
let path = require('path');
let app = express();
let url = require('url');
let xmlparser = require('express-xml-bodyparser');
let childProcess = require('child_process');

let { handleMsg } = require('./services/msgService');

server = require('http').Server(app);
server.listen(3000, function() {
    console.log('App start,port 80.');
});

app.get('/*', function(req, res) {

    console.log('req', JSON.stringify(req.params));
    console.log('req', JSON.stringify(req.url));
    console.log(req.query)

    let query = url.parse(req.url, true).query;
    console.log('query  ', query)

    res.send(query.echostr)
});

app.post('/*', xmlparser({ trim: false, explicitArray: false }), function(req, res) {
    try {
        console.log(req.body)
        let xml = req.body.xml;
        console.log('req', JSON.stringify(req.params));
        console.log('req', JSON.stringify(req.url));
        console.log(req.query)
        console.log(xml)
        handleMsg(xml).then(msg => res.send(msg));

    } catch (e) {
        console.log(e);
    }
});
