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

function ensureValidId(req, res, next) {
    var id = parseInt(req.params.id);
    if(isNaN(id)) {
        res.statusCode = 400;
        res.send({message: "Parameter ID must be an integer"});
        next();
        return false;
    } else if(id <= 0 || id > reports.length) {
        res.statusCode = 404;
        res.send({message: "ID not found"});
        next();
        return false;
    } else {
        return true;
    }
}

function ensureValidReport(req, res, next) {
    var r = req.body;
    if(req.getContentType() != 'application/json') {
        res.statusCode = 415;
        res.send({message: "Only JSON allowed"});
        next();
        return false;
    } else if(!(r.type && r.location && r.firstname && r.lastname && (r.email || r.phone))) {
        res.statusCode = 400;
        res.send({message: "JSON does not meet expected format"});
        next();
        return false;
    } else {
        return true;
    }
}

// Add new report
server.post('/api/reports', function(req, res, next) {
    if(ensureValidReport(req, res, next)) {
        reports.push(req.body);
        res.statusCode = 200;
        res.send({id: reports.length})
        next();
    }
});

// Retrieve individual report
server.get('/api/reports/:id', function(req, res, next) {
    var id = parseInt(req.params.id);
    if(ensureValidId(req, res, next)) {
        res.statusCode = 200;
        res.send(reports[id-1]);
        next();
    }
});

// Retrieve individual report
server.put('/api/reports/:id', function(req, res, next) {
    var id = parseInt(req.params.id);
    if(ensureValidId(req, res, next) && ensureValidReport(req, res, next)) {
        reports[id-1] = req.body;
        res.statusCode = 200;
        res.send(reports[id-1]);
        next();
    }
});
