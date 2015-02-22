# hoverintent-jqplugin

This is just [Brian Cherne's hoverintent JQuery plugin](http://cherne.net/brian/resources/jquery.hoverIntent.html) made available in NPM.  

I made two modifications to the library:  
1. It can now be imported via amd/csj/globally.  
2. Hoverintent requires activation by passing it either the jquery or window object.  See example below.

#Install
```
npm install --save hoverintent-jqplugin
```

#Use
```
// cjs
var $ = require('jquery');
require('hoverintent-jqplugin')($); // <---------- Attaches itself to the jquery object

// amd
require(['jquery', 'hoverintent'], function($, hoverintent) {
    hoverintent($);
});

// global
<script src="jquery.js"></script>
<script src="hoverintent.js"></script>
<script>
  hoverintent(window); // will attach itself to window.jQuery
</script>
```

#Clone and test
```
git clone git@github.com:olsonpm/hoverintent-jqplugin.git
npm install
npm test
```

A minified version is also available in the /dist directory.
