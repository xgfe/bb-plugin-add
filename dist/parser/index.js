'use strict';

/**
 * Interface:
 *
 *
 *
 *
 * Example:
 *
 *   PREFIX_CONTAINS A > B
 *   PREFIX_INCREASE +variable
 *   PREFIX_DECREASE -variable
 *
 *   INSTRUCT_CONDITION / INSTRUCT_RANGE variable|1-10
 *
 *   RELATION_AND +variableA && -variableB [return a Boolean]
 *   RELATION_OR +variableA || -variableB [return a Boolean]
 *
 *   FUNCTION_RANDOM RANDOM(variable) [random-js]
 *   FUNCTION_UPPERCASE UPPERCASE(variable) [String.prototype.toUpperCase]
 *   FUNCTION_LOWERCASE LOWERCASE(variable) [String.prototype.toLowerCase]
 *   FUNCTION_HASH HASH(variable) [object-hash]
 *
 *
 *
 * */
var PREFIX_CONTAINS = '>';
var PREFIX_INCREASE = '+';
var PREFIX_DECREASE = '-';

var INSTRUCT_CONDITION = '|';
var INSTRUCT_RANGE = '-';
var INSTRUCT_ADDITION = '*';

var RELATION_AND = '&&';
var RELATION_OR = '||';

var FUNCTION_RANDOM = 'RANDOM';
var FUNCTION_UPPERCASE = 'UPPERCASE';
var FUNCTION_LOWERCASE = 'LOWERCASE';
var FUNCTION_HASH = 'HASH';
var FUNCTION_HEAD_UPPERCASE = 'HEAD_UPPER';
var FUNCTION_HEAD_LOWERCASE = 'HEAD_LOWER';
var FUNCIION_GAP_HYPHEN = 'GAP_HYPHEN';
var FUNCTION_GAP_UNDERSCORE = 'GAP_UNDERSCORE';
var FUNCTION_CSS_CLASS_HYPHEN_STYLE = 'CSS_CLASS_HYPHEN_STYLE';
var FUNCTION_EVAL = 'EVAL';

var KEYWORD_REGEXP = /\$\{[^}]+\}/g;

var FNS = [FUNCTION_RANDOM, FUNCTION_UPPERCASE, FUNCTION_LOWERCASE, FUNCTION_HASH, FUNCTION_HEAD_UPPERCASE, FUNCTION_HEAD_LOWERCASE, FUNCIION_GAP_HYPHEN, FUNCTION_GAP_UNDERSCORE, FUNCTION_CSS_CLASS_HYPHEN_STYLE];

var PREFIX = [PREFIX_CONTAINS, PREFIX_INCREASE, PREFIX_DECREASE];

var INSTRUT = [INSTRUCT_CONDITION, INSTRUCT_RANGE];

var RELATION = [RELATION_AND, RELATION_OR];

var namespace = require('../namespace');

var fnMode = function fnMode(data, fn) {
    switch (fn) {
        case FUNCTION_UPPERCASE:
            return data.toUpperCase();
        case FUNCTION_LOWERCASE:
            return data.toLowerCase();
        case FUNCTION_HEAD_UPPERCASE:
            return data[0].toUpperCase() + data.slice(1);
        case FUNCTION_HEAD_LOWERCASE:
            return data[0].toLowerCase() + data.slice(1);
        case FUNCIION_GAP_HYPHEN:
            return data.replace(/[A-Z]/g, function (value) {
                return '-' + value.toLowerCase();
            });
        case FUNCTION_GAP_UNDERSCORE:
            return data.replace(/[A-Z]/g, function (value) {
                return '_' + value.toLowerCase();
            });
        case FUNCTION_EVAL:
        default:
            return data;
    }
};

module.exports = {
    parse: function parse(string) {
        var _ = {
            mode: '',
            range: '',
            fn: '',
            data: '',
            output: '',
            core: ''
        };

        _.core = string.slice(2, -1);

        if (/\([^\)]+\)/g.test(_.core)) {
            // find () in value
            _.output = _.core.match(/\([^\)]+\)/g)[0].slice(1, -1);
        } else {
            _.output = _.core;
        }

        var all = {};
        Object.keys(namespace.core).forEach(function (item) {
            all[item] = namespace.core[item];
        });
        Object.keys(namespace.self).forEach(function (item) {
            all[item] = namespace.self[item];
        });
        Object.keys(all).some(function (item) {
            if (item === _.output) {
                _.output = all[item];
                return true;
            }
        });

        var hasFunction = FNS.some(function (item) {
            return _.core.indexOf(item) !== -1;
        });
        if (hasFunction) {
            var hasAddition = _.core.indexOf('*') !== -1;

            if (!hasAddition) {
                FNS.some(function (fnItem) {
                    if (_.core.indexOf(fnItem) !== -1) {
                        _.output = fnMode(_.output, fnItem);
                    }
                });
            } else {
                var fnList = [];
                _.core.split('*').forEach(function (item) {
                    FNS.some(function (fn) {
                        if (item.indexOf(fn) !== -1) {
                            fnList.push(fn);
                            return true;
                        }
                    });
                });

                fnList.forEach(function (item) {
                    _.output = fnMode(_.output, item);
                });
            }
        }

        return _;
    }
};