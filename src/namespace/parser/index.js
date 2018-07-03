const hash = require('object-hash');
const SuperParser = require('./superParser');

const PREFIX_CONTAINS = '>';
const PREFIX_INCREASE = '+';
const PREFIX_DECREASE = '-';

const INSTRUCT_CONDITION = '|';
const INSTRUCT_RANGE = '-';

const RELATION_AND = '&&';
const RELATION_OR = '||';

const FUNCTION_RANDOM = 'RANDOM';
const FUNCTION_UPPERCASE = 'UPPERCASE';
const FUNCTION_LOWERCASE = 'LOWERCASE';
const FUNCTION_HASH = 'HASH';

const FNS = [
    FUNCTION_RANDOM,
    FUNCTION_UPPERCASE,
    FUNCTION_LOWERCASE,
    FUNCTION_HASH
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

class Parser {

    constructor(initialKey, path, selfKeys) {
        this.initialKey = initialKey;
        this.path = path;
        this.selfKeys = selfKeys;
        this._ = {
            mode: '',
            range: '',
            fn: '',
            data: '',
            output: ''
        };
        this.parse();
    }

    parse() {
        /**
         *
         * @param {String} str
         *
         */
        // filter INSTRUCT_CONDITION
        const str = this.initialKey;
        const condition = str.indexOf('|') !== -1;
        const tsl = this._;
        if (condition) {
            const arr = str.split('|');
            tsl.data = arr[0];
            tsl.range = arr[1];
        } else {
            tsl.data = str;
        }

        //
        tsl.mode = tsl.data.slice(0,1);

        FNS.some(item => {
            if (tsl.data.indexOf(item) !== -1) {
                tsl.output = this.fnMode(tsl.data, item);
                return true;
            }
        });

        PREFIX.some(item => {
            if (tsl.mode === item) {
                tsl.output = this.prefixMode(tsl.data, item);
                return true;
            }
        });

        INSTRUT.some(item => {
            if (tsl.data.indexOf(item) !== -1) {
                tsl.output = this.instructMode(tsl.data, item);
                return true;
            }
        });

        // RELATION.some(item => {
        //
        // });

    }

    compile() {

    }

    fnMode(data, fn) {
        switch (fn) {
            case FUNCTION_RANDOM:
                return isNaN(+data) ? data : Math.random()*(+data);
            case FUNCTION_UPPERCASE:
                return data.toUpperCase();
            case FUNCTION_LOWERCASE:
                return data.toLowerCase();
            case FUNCTION_HASH:
                return hash(data);
            default:
                return data;
        }
    }

    instructMode(data, instruct) {
        switch (instruct) {
            case INSTRUCT_CONDITION:
                return data;
            case INSTRUCT_RANGE:
                return data;
            default:
                return data;
        }
    }

    prefixMode(data, prefix) {
        switch (prefix) {
            case PREFIX_CONTAINS:
                return data;
            case PREFIX_INCREASE:
                let innerKey = this.path._[this.initialKey];
                let trueKey = this.path[this.initialKey];
                if(!innerKey){
                    innerKey = trueKey = this.selfKeys[this.initialKey];
                    return innerKey;
                }
                trueKey = innerKey ++;
                return trueKey;
            case PREFIX_DECREASE:
                return data;
            default:
                return data;
        }
    }
}

module.exports = Parser;