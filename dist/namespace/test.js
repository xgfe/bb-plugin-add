'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parser = require('../parser');
var namespace = require('./namespace');
var util = require('../util');
var path = require('path');

module.exports = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'subscribe',
        value: function subscribe(name, selfKeys) {
            var filePath = path.parse(name).dir;
            var arr = filePath.split('/');
            var prevPath = namespace.$root;
            arr.forEach(function (item) {
                if (item) {
                    var pr = prevPath['$' + item];
                    if (!pr) {
                        pr = {};
                    }
                    prevPath = pr;
                }
            });
            // initialize instruct
            Object.keys(selfKeys).forEach(function (item) {
                var parseKey = new Parser(item, prevPath, selfKeys);
            });

            console.log(namespace);

            // const router = this.namespace.root;
            // const sk = Object.keys(selfKey);
            // sk.forEach(item=>{
            //     const parser = new Parser(item, selfKey[item]);
            //     router[item] = parser._.output;
            // });
        }
    }, {
        key: 'pathToArray',
        value: function pathToArray(route) {}
    }]);

    return _class;
}();