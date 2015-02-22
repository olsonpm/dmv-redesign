'use strict'
/* --execute=mocha-- */

var PGWrapper = require('./psql-wrapper').PGWrapper
    , commonPgConfs = require('./common-pgconfs')
    , assert = require('chai').assert;

suite("psql-wrapper.js", function() {
    var constUser1
        , constUserAddress1;

    var pg = new PGWrapper(commonPgConfs.test);

    function Test_user(id_, name_, what_) {
        this.id = Number(id_);
        this.name = name_;
        this.what = what_;
    }
    Test_user.prototype.equals = function(other_) {
        return this.id === other_.id
            && this.name === other_.name
            && this.what === other_.what;
    };
    Test_user.UserFromRow = function UserFromRow(pgRow_) {
        return new Test_user(
            pgRow_.test_user_id
            , pgRow_.test_user_name
            , pgRow_.what
        );
    };

    function Test_user_address(id_, info_, uid_, what_) {
        this.id = Number(id_);
        this.info = info_;
        this.uid = Number(uid_);
        this.what = what_;
    }
    Test_user_address.prototype.equals = function(other_) {
        return this.id === other_.id
            && this.info === other_.info
            && this.uid === other_.uid
            && this.what === other_.what;
    };
    Test_user_address.UserAddressFromRow = function UserAddressFromRow(pgRow_) {
        return new Test_user_address(
            pgRow_.test_user_address_id
            , pgRow_.address_info
            , pgRow_.test_user_id
            , pgRow_.address_what
        );
    };

    setup(function() {
        constUser1 = new Test_user(1, 'my user1', 'ok');
        constUserAddress1 = new Test_user_address(1, 'my address', 1, 'address ok');
    });
    test("RunParameterizedQuery", function RunParameterizedQuery() {
        var queryText = "\
				select * \
				from test_user \
			";
        var p1 = pg.RunParameterizedQuery(queryText)
            .then(function(result) {
                var userOut = Test_user.UserFromRow(result.rows[0]);
                assert.isTrue(userOut.equals(constUser1));
            });

        queryText = "\
                select * \
                from test_user tu \
					join test_user_address tua \
						on tu.test_user_id = tua.test_user_id \
                where tu.test_user_id = 1 \
                ";

        var p2 = pg.RunParameterizedQuery(queryText)
            .then(function(result) {
                var userOut = Test_user.UserFromRow(result.rows[0]);
                var userAddressOut = Test_user_address.UserAddressFromRow(result.rows[0]);
                assert.isTrue(userOut.equals(constUser1));
                assert.isTrue(userAddressOut.equals(constUserAddress1));
            });

        return p1 && p2;
    });
});
