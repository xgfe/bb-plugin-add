const Parser = require('../parser');
const namespace = require('./namespace');
const util = require('../util');
const path = require('path');

module.exports = class {
    constructor() {
    }

    subscribe(name, selfKeys) {
        const filePath = path.parse(name).dir;
        const arr = filePath.split('/');
        let prevPath = namespace.$root;
        arr.forEach(item => {
            if (item) {
                let pr = prevPath['$' + item];
                if (!pr) {
                    pr = {};
                }
                prevPath = pr;
            }
        });
        // initialize instruct
        Object.keys(selfKeys).forEach(item => {
            const parseKey = new Parser(item, prevPath, selfKeys);
        });

        console.log(namespace);

        // const router = this.namespace.root;
        // const sk = Object.keys(selfKey);
        // sk.forEach(item=>{
        //     const parser = new Parser(item, selfKey[item]);
        //     router[item] = parser._.output;
        // });

    }

    pathToArray(route) {

    }
}