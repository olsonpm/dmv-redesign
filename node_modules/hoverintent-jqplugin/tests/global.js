'use strict';

phantom.injectJs('../node_modules/jquery/dist/jquery.js');
var assert = require('chai').assert;

try {
    require('../dist/hoverintent.js')(window);
    assert.ok(window.jQuery.fn.hoverintent);
    console.log('global test successful');
} catch (e) {
    console.log(e);
    console.log(e.stack);
}

phantom.exit();
