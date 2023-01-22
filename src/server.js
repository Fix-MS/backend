const { validate: uuidv4validate } = require('uuid');
const PACKAGEJSON = require('./../package.json');

const restify = require('restify');
var server;

var reports = {};  // the "database" (for now)


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
// Utility functions
// -------------------------------------------------------------------------------------

function ensureUserAccessIsValid(userId) {
    if (!uuidv4validate(userId)) {
        res.statusCode = 401;
        res.send({message: "User ID must be a valid UUIDv4"});
        next();
        return false;
    }

    ensureUserDBValid(userId);
    return true;
}

function ensureUserDBValid(userId) {
    if (!reports[userId]) {
        reports[userId] = [];
    }
}

function ensureValidReportId(req, res, next) {
    const userId = req.params.userId;
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.statusCode = 400;
        res.send({message: "Parameter ID must be an integer"});
        next();
        return false;
    } else if (id <= 0 || id > reports[userId].length) {
        res.statusCode = 404;
        res.send({message: "ID not found"});
        next();
        return false;
    } else {
        return true;
    }
}

function ensureValidReport(req, res, next) {
    const reqBody = req.body;
    if (req.getContentType() !== 'application/json') {
        res.statusCode = 415;
        res.send({message: "Only JSON allowed"});
        next();
        return false;
    } else if (!(reqBody.type && reqBody.location && reqBody.firstname && reqBody.lastname && (reqBody.email || reqBody.phone))) {
        res.statusCode = 400;
        res.send({message: "JSON does not meet expected format"});
        next();
        return false;
    } else {
        return true;
    }
}

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
server.get('/api/reports/:userId', function(req, res, next) {
    const userId = req.params.userId;

    if (!ensureUserAccessIsValid(userId)) {
        return false;
    }

    res.send(reports[userId]);
    next();
});

// Add new report
server.post('/api/reports/:userId', function(req, res, next) {
    const userId = req.params.userId;

    if (!ensureUserAccessIsValid(userId)) {
        return false;
    }

    if (ensureValidReport(req, res, next)) {
        reports[userId].push(req.body);
        res.statusCode = 200;
        res.send({id: reports[userId].length})
        next();
    }
});

// Retrieve individual report
server.get('/api/reports/:userId/:id', function(req, res, next) {
    const userId = req.params.userId;

    if (!ensureUserAccessIsValid(userId)) {
        return false;
    }

    const id = parseInt(req.params.id);
    if (ensureValidReportId(req, res, next)) {
        res.statusCode = 200;
        res.send(reports[userId][id - 1]);
        next();
    }
});

// Retrieve individual report
server.put('/api/reports/:userId/:id', function(req, res, next) {
    const userId = req.params.userId;

    if (!ensureUserAccessIsValid(userId)) {
        return false;
    }

    const id = parseInt(req.params.id);
    if (ensureValidReportId(req, res, next) && ensureValidReport(req, res, next)) {
        reports[userId][id - 1] = req.body;
        res.statusCode = 200;
        res.send(reports[userId][id - 1]);
        next();
    }
});
