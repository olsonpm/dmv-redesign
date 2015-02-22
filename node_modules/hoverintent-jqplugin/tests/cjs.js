'use strict';

var $ = require('jquery');
var assert = require('chai').assert;

try {
    require('../dist/hoverintent.js')($);
    assert.ok($.fn.hoverintent);
    console.log('cjs test successful');
} catch (e) {
    console.log(e);
    console.log(e.stack);
}

phantom.exit();
