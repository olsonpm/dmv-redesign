'use strict';
/* --execute=mocha-- */

var Utils = require('./utils')
    , chai = require('chai');

var assert = chai.assert;
chai.config.includeStack = true;

suite("utils.js", function() {
    test("instance_of", function instance_of() {
        var aGrandparent
            , aParent
            , aChild;
        var wParent
            , wChild;

        function Grandparent() {}

        function Parent() {}

        function Child() {}

        function WildParent() {}

        function WildChild() {}

        Parent.prototype = new Grandparent();
        Parent.prototype.constructor = Parent;
        WildParent.prototype = new Grandparent();
        WildParent.prototype.constructor = WildParent;

        Child.prototype = new Parent();
        Child.prototype.constructor = Child;
        WildChild.prototype = new WildParent();
        WildChild.prototype.constructor = WildChild;

        aGrandparent = new Grandparent();
        aParent = new Parent();
        wParent = new WildParent();
        aChild = new Child();
        wChild = new WildChild();

        assert.isTrue(Utils.instance_of(aGrandparent, Grandparent));
        assert.isFalse(Utils.instance_of(aGrandparent, Parent));

        assert.isTrue(Utils.instance_of(aParent, Grandparent));
        assert.isTrue(Utils.instance_of(aParent, Parent));
        assert.isFalse(Utils.instance_of(aParent, Child));
        assert.isFalse(Utils.instance_of(aParent, WildParent));

        assert.isTrue(Utils.instance_of(aChild, Grandparent));
        assert.isTrue(Utils.instance_of(aChild, Parent));
        assert.isTrue(Utils.instance_of(aChild, Child));
        assert.isFalse(Utils.instance_of(aChild, WildParent));

        assert.isTrue(Utils.instance_of(wChild, Grandparent));
        assert.isTrue(Utils.instance_of(wChild, WildParent));
        assert.isTrue(Utils.instance_of(wChild, WildChild));
        assert.isFalse(Utils.instance_of(wChild, Parent));
    });
});
