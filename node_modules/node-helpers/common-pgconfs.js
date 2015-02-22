'use strict';

var PGConf = require('./psql-wrapper').PGConf;
var e = process.env;

if (e.PGUSER && e.PGDATABASE && e.PGPASSWORD && e.PGPORT) {
    module.exports.ptq = new PGConf(e.PGUSER, e.PGDATABASE, e.PGPASSWORD, e.PGPORT, '/run/postgresql', true);
}

if (e.PGTESTUSER && e.PGTESTPASS && e.PGPORT) {
    module.exports.test = new PGConf(e.PGTESTUSER, e.PGTESTUSER, e.PGTESTPASS, e.PGPORT, 'localhost', true);
}

module.exports.ptq_test = new PGConf('ptq_test', 'ptq_test', 'ptq_test', 5432, 'localhost', true);
