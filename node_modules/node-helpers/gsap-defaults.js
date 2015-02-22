'use strict';

module.exports = function gsapd(global) {
    if (!global.Power3) {
        throw new Error("The Power3 gsap easing object doesn't exist in the current scope.  Are you certain TweenLite or TweenMax has been loaded properly?");
    }
    return {
        DURATION: 0.4
        , SHORT_DURATION: 0.25
        , LONG_DURATION: 0.7
        , EASE: global.Power3.easeOut
    };
}
