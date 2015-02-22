'use strict';

var page = require('webpage').create();
var fs = require('fs');

/*
page.onResourceRequested = function(req) {
    console.log('\n');
    console.log('REQUEST');
    console.log(JSON.stringify(req, null, 4));
    console.log('\n');
};
page.onResourceReceived = function(response) {
    console.log('\n');
    console.log('RESPONSE');
    console.log('Response (#' + response.id + ', stage "' + response.stage + '"): ' + JSON.stringify(response, null, 4));
    console.log('\n');
};
*/

page.onConsoleMessage = function(msg) {
    msg = msg.split('=');
    if (msg[1] === 'success') {
        console.log('amd test successful');
    } else {
        console.log('amd test failed');
    }
    phantom.exit();
};

page.open('file://' + fs.absolute('tests/amd.html'));

setTimeout(function() {
    console.log('amd test failed - timeout');
    phantom.exit();
}, 500);
