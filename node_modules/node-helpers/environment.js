'use strict';

//---------//
// Imports //
//---------//

var lazy = require('lazy.js');

//------//
// Main //
//------//

function Environment(optArgs) {
    optArgs = optArgs || {};
    this.serverEnv = optArgs.serverEnv;
    this.hardCoded = optArgs.hardCoded;

    if (this.hardCoded
        && typeof this.hardCoded === 'string'
        && Environment.ENVS.indexOf(this.hardCoded.toLowerCase()) === -1) {

        throw new Error("hardCoded environment '" + this.hardCoded + "' is not valid");
    }
    if (this.serverEnv && this.hardCoded) {
        throw new Error("Environment doesn't expect both serverEnv and hardCoded to be passed");
    }
}

Environment.DEV = 'dev';
Environment.TEST = 'test';
Environment.PROD = 'prod';

Environment.ENVS = lazy([
    Environment.DEV
    , Environment.TEST
    , Environment.PROD
]);

Environment.CLIENT_ENV = 'ENV_NODE_ENV';

Environment.validateEnv = function validateEnv(env, shouldThrow) {
    var msg = "";

    if (typeof env !== 'string') {
        throw new Error("Invalid Argument: Environment.validateEnv only validates environment strings");
    }

    if (!Environment.ENVS.has(env.toLowerCase())) {
        msg = "Invalid Argument: environment string '" + env + "' is not valid.";
        if (shouldThrow) {
            throw new Error(msg);
        }
    }

    return msg;
};

Environment.prototype.getCurrentEnvironment = function getCurrentEnvironment() {
    var res;
    if (this.hardCoded) {
        res = this.hardCoded;
    } else if (process
        && process.env
        && process.env[this.serverEnv]
        && Environment.ENVS.contains(process.env[this.serverEnv].toLowerCase())) {
        res = process.env[this.serverEnv];
    } else if (Environment.ENVS.contains(Environment.CLIENT_ENV)) {
        res = Environment.CLIENT_ENV;
    } else {
        if (this.serverEnv) {
            throw new Error("Invalid State: None of the following cases were met\n1) A hard coded environment string is passed.\n2) Called server-side with '" + this.serverEnv
                + "' declared.\n3) Called client-side with the server replacing ENV_" + "NODE_ENV with the proper node environment string");
        } else {
            throw new Error("Invalid State: None of the following cases were met\n1) A hard coded environment string is passed.\n2) Called server-side with an environment variable"
                + " declared.\n3) Called client-side with the server replacing ENV_" + "NODE_ENV with the proper node environment string");
        }
    }

    return res;
};
Environment.prototype.curEnv = Environment.prototype.getCurrentEnvironment;

Environment.prototype.isDev = function isDev() {
    return this.getCurrentEnvironment() === Environment.DEV;
};
Environment.prototype.isTest = function isTest() {
    return this.getCurrentEnvironment() === Environment.TEST;
};
Environment.prototype.isProd = function isProd() {
    return this.getCurrentEnvironment() === Environment.PROD;
};


//---------//
// Exports //
//---------//

module.exports = Environment;
