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
const PREFIX_CONTAINS = '>';
const PREFIX_INCREASE = '+';
const PREFIX_DECREASE = '-';

const INSTRUCT_CONDITION = '|';
const INSTRUCT_RANGE = '-';
const INSTRUCT_ADDITION = '*';

const RELATION_AND = '&&';
const RELATION_OR = '||';

const FUNCTION_RANDOM = 'RANDOM';
const FUNCTION_UPPERCASE = 'UPPERCASE';
const FUNCTION_LOWERCASE = 'LOWERCASE';
const FUNCTION_HASH = 'HASH';
const FUNCTION_HEAD_UPPERCASE = 'HEAD_UPPER';
const FUNCTION_HEAD_LOWERCASE = 'HEAD_LOWER';
const FUNCIION_GAP_HYPHEN = 'GAP_HYPHEN';
const FUNCTION_GAP_UNDERSCORE = 'GAP_UNDERSCORE';
const FUNCTION_CSS_CLASS_HYPHEN_STYLE = 'CSS_CLASS_HYPHEN_STYLE';
const FUNCTION_EVAL = 'EVAL';

const KEYWORD_REGEXP = /\$\{[^}]+\}/g;

const FNS = [
    FUNCTION_RANDOM,
    FUNCTION_UPPERCASE,
    FUNCTION_LOWERCASE,
    FUNCTION_HASH,
    FUNCTION_HEAD_UPPERCASE,
    FUNCTION_HEAD_LOWERCASE,
    FUNCIION_GAP_HYPHEN,
    FUNCTION_GAP_UNDERSCORE,
    FUNCTION_CSS_CLASS_HYPHEN_STYLE
];

const PREFIX = [
    PREFIX_CONTAINS,
    PREFIX_INCREASE,
    PREFIX_DECREASE
];

const INSTRUT = [
    INSTRUCT_CONDITION,
    INSTRUCT_RANGE
];

const RELATION = [
    RELATION_AND,
    RELATION_OR
];

const namespace = require('../namespace');

const fnMode = function (data, fn) {
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
            return data.replace(/[A-Z]/g,function (value){
                return '-' + value.toLowerCase();
            });
        case FUNCTION_GAP_UNDERSCORE:
            return data.replace(/[A-Z]/g, function (value){
                return '_' + value.toLowerCase();
            });
        case FUNCTION_EVAL:
        default:
            return data;
    }
}

module.exports = {
    parse(string) {
        let _ = {
            mode: '',
            range: '',
            fn: '',
            data: '',
            output: '',
            core: ''
        };

        _.core = string.slice(2,-1);

        if(/\([^\)]+\)/g.test(_.core)){
            // find () in value
            _.output = _.core.match(/\([^\)]+\)/g)[0].slice(1,-1);
        } else {
            _.output = _.core;
        }

        const all = {};
        Object.keys(namespace.core).forEach(item => {
            all[item] = namespace.core[item];
        });
        Object.keys(namespace.self).forEach(item => {
            all[item] = namespace.self[item];
        });
        Object.keys(all).some(item => {
            if(item === _.output){
                _.output = all[item];
                return true;
            }
        });


        const hasFunction = FNS.some(item => _.core.indexOf(item) !== -1);
        if(hasFunction){
            const hasAddition = _.core.indexOf('*') !== -1;

            if(!hasAddition){
                FNS.some(fnItem => {
                    if (_.core.indexOf(fnItem) !== -1) {
                        _.output = fnMode(_.output, fnItem);
                    }
                });
            }else{
                const fnList = [];
                _.core.split('*').forEach(item => {
                    FNS.some(fn => {
                        if(item.indexOf(fn) !== -1){
                            fnList.push(fn);
                            return true;
                        }
                    });
                });

                fnList.forEach(item => {
                   _.output = fnMode(_.output, item);
                });
            }
        }

        return _;

    }
};