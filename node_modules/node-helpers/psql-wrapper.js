'use strict';

var BPromise = require('bluebird')
    , Utils = require('./utils')
    , pg = require('pg').native;

var using = BPromise.using;
BPromise.promisifyAll(pg);

//--------//
// PGConf //
//--------//

function PGConf(user_, database_, password_, port_, host_, ssl_) {
    this.user = user_;
    this.database = database_;
    this.password = password_;
    this.port = port_;
    this.host = host_;
    this.ssl = ssl_;
    validatePgConf(this);
}
PGConf.prototype.GeneratePGWrapper = function GeneratePGWrapper() {
    return new PGWrapper(this);
};


//-----------//
// PGWrapper //
//-----------//

function PGWrapper(curPgConf_) {
    validatePgConf(curPgConf_);
    this.curPgConf = curPgConf_;

}
PGWrapper.prototype.RunParameterizedQuery = function RunParameterizedQuery(queryText_, queryValues_) {
    return using(getPostgresConnection(this.curPgConf), function(conn_) {
        var queryConf = {
            text: queryText_
        };
        if (typeof queryValues_ !== 'undefined') {
            queryConf.values = queryValues_;
        }
        return conn_.queryAsync(queryConf);
    });
};


//-------------//
// Helper Fxns //
//-------------//

// doesn't return anything - just throws an error if invalid
function validatePgConf(pgConf_) {
    if (!(Utils.instance_of(pgConf_, PGConf))) {
        throw new Error("validatePgConf requires a PGConf argument");
    }
    var err = "";
    var errFields = [];
    if (!pgConf_.user) {
        errFields.push({
            field: 'user', reason: 'falsy'
        });
    }
    if (!pgConf_.database) {
        errFields.push({
            field: 'database', reason: 'falsy'
        });
    }
    if (!pgConf_.password) {
        errFields.push({
            field: 'password', reason: 'falsy'
        });
    }
    if (!pgConf_.port) {
        errFields.push({
            field: 'port', reason: 'falsy'
        });
    }
    if (!pgConf_.host) {
        errFields.push({
            field: 'host', reason: 'falsy'
        });
    }
    if (isNullOrUndefined(pgConf_.ssl)) {
        errFields.push({
            field: 'ssl', reason: 'null or undefined'
        });
    }
    if (errFields.length) {
        var fieldReasons = "";
        errFields.forEach(function(e) {
            fieldReasons += "\n  field: " + e.field + "\n  reason: " + e.reason;
        });
        throw new Error("Invalid Arguments: The following fields were invalid" + fieldReasons);
    }
}

function isNullOrUndefined(prop_) {
    return (typeof prop_ === 'undefined' || prop_ === null);
}

function getPostgresConnection(pgConf_) {
    var close;
    return pg.connectAsync(pgConf_).spread(function(client, done) {
        close = done;
        return client;
    }).disposer(function(client) {
        if (close) close(client);
    });
}


//---------//
// Exports //
//---------//

module.exports.PGConf = PGConf;
module.exports.PGWrapper = PGWrapper;
