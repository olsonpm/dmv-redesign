require(['jquery', 'hoverintent'], function($, hoverintent) {
    hoverintent($);
    console.log(
        ($.fn.hoverintent) ? "test=success" : "test=failed"
    );
});
