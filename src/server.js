const PACKAGEJSON = require('./../package.json');

const restify = require('restify');
var server;

var reports = [];  // the "database" (for now)


// -------------------------------------------------------------------------------------
// Start server
// -------------------------------------------------------------------------------------

console.log('Starting the server...');
server = restify.createServer();
server.listen(9000, function() {
    console.log('Server started at %s.', server.url);
});


// -------------------------------------------------------------------------------------
// Handlers for all endpoints
// -------------------------------------------------------------------------------------

// Easy access to URL parameters and payload content
server.use(restify.plugins.queryParser({ mapParams: false }));
server.use(restify.plugins.bodyParser({ mapParams: false }));


// -------------------------------------------------------------------------------------
// Actual handlers for the individual endpoints
// -------------------------------------------------------------------------------------

// General API information
server.get('/api', function(req, res, next) {
    res.send({
        name: PACKAGEJSON.name,
        version: PACKAGEJSON.version,
    });
    next();
});

// List reports
server.get('/api/reports', function(req, res, next) {
    res.send(reports);
    next();
});

// Add new report
server.post('/api/reports', function(req, res, next) {
    var r = req.body;
    if(req.getContentType() != 'application/json') {
        res.statusCode = 415;
        res.send({message: "Only JSON allowed"});
        next();
    } else if(!(r.type && r.location && r.firstname && r.lastname && (r.email || r.phone))) {
        res.statusCode = 400;
        res.send({message: "JSON does not meet expected format"});
        next();
    } else {
        reports.push(req.body);
        res.statusCode = 200;
        res.send({id: reports.length-1})
        next();
    }
});

// Retrieve individual report
server.get('/api/reports/:id', function(req, res, next) {
    if(!Number.isInteger(id)) {
        res.statusCode = 415;
        res.send({message: "Parameter ID must be an integer"});
        next();
    } else if(id < 0 || id >= reports.length) {
        res.statusCode = 404;
        res.send({message: "ID not found"});
        next();
    } else {
        res.statusCode = 200;
        res.send(reports[id]);
        next();
    }
});
