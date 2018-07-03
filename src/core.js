const fse = require('fs-extra');
const fs = require('fs');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const common = require('./common');
const readFile = require('fs-readfile-promise');
const fullname = require('fullname');
const simpleGit = require('simple-git')();
const shell = require('shelljs');
const chalk = require('chalk');
const {spawn} = require('child_process');
const util = require('./util');
const namespace = require('./namespace');

const DESTINATION_PATH = process.cwd();
const headerParam = process.argv.slice(2)[0] || null;
const modalName = process.argv.slice(3)[0] || null;

// ${} match keyword
const KEYWORD_REGEXP = /\$\{[^}]+\}/g;
//
// const MATCH_PLUS = //g;

class Core {
    constructor() {
        this.namespace = new namespace();
        this.keyword = {};

        this.tplPath = DESTINATION_PATH + '/.tpl';
        this.rootConfig = this.tplPath + '/config.json';
    }

    _matchKeyword = (keyword) => {
        const param = keyword.slice(2, -1);
        // console.log(param, this.keyword[param]) ???
        if (this.keyword[param]) {
            return this.keyword[param];
        }
        return keyword;
    }

    async init() {
        await this.initKeyword();


        const existRootConfig = await fs.existsSync(this.rootConfig);
        if (existRootConfig) {
            // find .tpl/config.json!
            const configFile = require(this.rootConfig);
            const clis = Object.keys(configFile.templates);
            // const selfKey = Object.keys(configFile.keywords);
            // selfKey.forEach(item => {
            //     this.keyword[item] = configFile.keywords[item];
            // });

            this.namespace.subscribe('/', configFile.keywords);

            // if (headerParam) {
            //     if (clis.includes(headerParam)) {
            //
            //         const innerConfigPath = this.tplPath + '/' + headerParam + '/config.json';
            //         const existInnerConfig = await common.validatePath(innerConfigPath, 'config.json', true);
            //
            //         if (existInnerConfig) {
            //             let innerConfig = await fs.readFileSync(innerConfigPath, 'utf-8');
            //             innerConfig = innerConfig.replace(KEYWORD_REGEXP, this._matchKeyword);
            //             const data = JSON.parse(innerConfig);
            //             // console.log(innerConfig);
            //             const innerPath = this.tplPath + '/' + headerParam;
            //             Object.keys(data.files).forEach(async item => {
            //                 // console.log(innerPath + '/' + data.files[item].path,DESTINATION_PATH + '/' + data.address + '/' + item);
            //                 await this.copyFile(innerPath + '/' + data.files[item].path, DESTINATION_PATH + '/' + data.address + '/' + item, {
            //                     match: KEYWORD_REGEXP,
            //                     callback: this._matchKeyword
            //                 });
            //                 console.log(chalk.blue('new template') + ' : ' + chalk.green(item) + '');
            //             });
            //         }
            //     } else {
            //         console.log(headerParam + ' is not a valid cli!');
            //         return Promise.reject();
            //     }
            // } else {
            //     // not find headerParam
            //     prompt([{
            //         type: 'list',
            //         name: 'param',
            //         message: 'choice a entity.',
            //         choices: clis
            //     }]).then(async answers => {
            //         clis.some(item => {
            //             if (answers.param === item) {
            //                 choice([{
            //                     type: 'input',
            //                     name: 'name',
            //                     message: 'input a ' + item + ' name'
            //                 }], async answers => {
            //                     spawn(process.argv.slice(1)[0], [item, answers.name], {stdio: 'inherit'});
            //                 });
            //             }
            //         });
            //     });
            // }
        } else {
            // not find .tpl/config.js
            // prompt([{
            //     type: 'confirm',
            //     name: 'tpl',
            //     message: 'Sorry, not find config files root path. init that and continue?'
            // }]).then(async answers => {
            //     if (answers.tpl) {
            //         await fse.mkdirsSync(this.rootConfig);
            //         console.log('Config files build success!');
            //     } else {
            //         console.log('Bye.')
            //     }
            // });
        }
    }

    initKeyword = async () => {
        const userFullname = await fullname().then(name => Promise.resolve(name));

        const {username, email} = await new Promise(resolve => {
            simpleGit.raw(['config', '--list'], (err, result) => {
                let gitConfig = {};
                result.split('\n').forEach(item => {
                    const freg = item.split('=');
                    gitConfig[freg[0]] = freg[1];
                });
                return resolve({
                    username: gitConfig['user.name'],
                    email: gitConfig['user.email']
                });
            });
        });

        this.keyword = {
            name: modalName,
            fullname: userFullname,
            username,
            email,
            datetime: util.getNow()
        };
    };

    async copyFile(from, to, filter = null) {
        try {
            let data = await readFile(from, 'utf-8');
            if (filter) {
                if (Array.isArray(filter)) {
                    filter.forEach(item => {
                        data = data.replace(item.match, item.callback);
                    })
                } else {
                    data = data.replace(filter.match, filter.callback);
                }
            }
            await fse.outputFile(to, data);
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new Core();