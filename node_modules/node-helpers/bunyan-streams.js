//---------//
// Imports //
//---------//

var bunyan = require('bunyan')
    , moment = require('moment')
    , Environment = require('./environment');


//---------//
// Exports //
//---------//

module.exports = bstreams;
module.exports.EnvironmentMapping = getEnvironmentMapping;


//-----------------//
// Exports Helpers //
//-----------------//

function getEnvironmentMapping() {
    var res = {};
    res[Environment.DEV] = {
        'level': bunyan.TRACE
        , 'formatter': localFormatter
        , 'type': 'raw'
        , 'src': true
    };
    res[Environment.TEST] = {
        'level': bunyan.DEBUG
        , 'formatter': testFormatter
        , 'type': 'raw'
        , 'src': false
    };
    res[Environment.PROD] = {
        'level': bunyan.WARN
        , 'formatter': prodFormatter
        , 'type': 'stream'
        , 'src': false
    };

    return res;
}


//-------------//
// Helper Fxns //
//-------------//

function bstreams(appName, env, optLevel) {
    if (!Environment.ENVS.contains(env)) {
        throw new Error("Invalid Argument: bunyan-streams expects to be given an environment string that matches one of the following " + Environment.ENVS.toArray());
    }

    envMapping = getEnvironmentMapping();

    var logLevel = optLevel;
    // if optLevel wasn't passed, then we get the default level based on the passed environment
    if (!optLevel) {
        logLevel = envMapping[env].level;
    }

    var logType = envMapping[env].type;
    var logSrc = envMapping[env].src;

    var MyStream = function() {};
    MyStream.prototype.write = envMapping[env].formatter;

    return {
        stream: new MyStream()
        , level: logLevel
        , type: logType
        , source: logSrc
    };
}

function localFormatter(rec) {
    if (rec.level >= bunyan.WARN) {
        console.log('Time: %s\n App: %s\n Level: %s\n Message: %s\n Source\n   File: %s\n   Line: %s\n   Fxn: %s'
            , moment(rec.time).format('HH:mm:ss.SS')
            , rec.name
            , mapLevelToName(rec.level)
            , rec.msg
            , rec.src.file
            , rec.src.line
            , rec.src.func
        );
    } else { // level == trace || debug || info
        console.log('[%s] %s: %s'
            , moment(rec.time).format('HH:mm:ss.SS')
            , mapLevelToName(rec.level)
            , rec.msg);
    }
}

function testFormatter(rec) {
    console.log('Time: %s\n App: %s\n Level: %s\n Message: %s'
        , moment(rec.time).format('HH:mm:ss.SS')
        , rec.name
        , mapLevelToName(rec.level)
        , rec.msg
    );
}

function prodFormatter(rec) {
    console.log(rec);
}

function mapLevelToName(level) {
    var res = '';
    switch (level) {
        case bunyan.TRACE:
            res = 'DEBUG';
            break;
        case bunyan.DEBUG:
            res = 'DEBUG';
            break;
        case bunyan.INFO:
            res = 'INFO';
            break;
        case bunyan.WARN:
            res = 'WARN';
            break;
        case bunyan.ERROR:
            res = 'ERROR';
            break;
        case bunyan.FATAL:
            res = 'FATAL';
            break;
    }
    return res;
}
