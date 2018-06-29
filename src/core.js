const fse = require('fs-extra');
const fs = require('fs');
const inquirer = require('inquirer');
const choice = require('./choices');
const common = require('./common');
const readFile = require('fs-readfile-promise');
const fullname = require('fullname');
const simpleGit = require('simple-git')();
const shell = require('shelljs');
const chalk = require('chalk');
const {spawn} = require('child_process');

const DESTINATION_PATH = process.cwd();
const headerParam = process.argv.slice(2)[0] || null;
const modalName = process.argv.slice(3)[0] || null;

const KEYWORD_REGEXP = /\$\{[^}]+\}/g;

class Core {
    constructor() {
        this.keyword = {};
    }

    _matchKeyword = (keyword) => {
        const param = keyword.slice(2, -1);
        // console.log(param, this.keyword[param]) ???
        if (this.keyword[param]) {
            return this.keyword[param]
        }
        return keyword;
    }

    async init() {
        await this.initKeyword();
        const tplPath = DESTINATION_PATH + '/.tpl';

        const rootConfig = tplPath + '/config.json';
        const existRootConfig = await fs.existsSync(rootConfig);
        if (existRootConfig) {
            // find .tpl/config.json!
            const configFile = require(rootConfig);
            const clis = Object.keys(configFile.templates);
            const selfKeywords = Object.keys(configFile.keywords);
            selfKeywords.forEach(item => {
                this.keyword[item] = configFile.keywords[item];
            });

            if (headerParam) {
                if (clis.includes(headerParam)) {
                    const innerConfigPath = tplPath + '/' + headerParam + '/config.json';
                    const existInnerConfig = await common.validatePath(innerConfigPath, 'config.json', true);
                    if (existInnerConfig) {
                        let innerConfig = await fs.readFileSync(innerConfigPath, 'utf-8');
                        innerConfig = innerConfig.replace(KEYWORD_REGEXP, this._matchKeyword);
                        const data = JSON.parse(innerConfig);
                        // console.log(innerConfig);
                        const innerPath = tplPath + '/' + headerParam;
                        Object.keys(data.rules).forEach(async item => {
                            // console.log(innerPath + '/' + data.rules[item].path,DESTINATION_PATH + '/' + data.target + '/' + item);
                            await this.copyFile(innerPath + '/' + data.rules[item].path, DESTINATION_PATH + '/' + data.target + '/' + item, {
                                match: KEYWORD_REGEXP,
                                callback: this._matchKeyword
                            });
                            console.log(chalk.blue('new template') + ' : ' + chalk.green(item) + '');
                        });
                    }
                } else {
                    console.log(headerParam + ' is not a valid cli!');
                    return Promise.reject();
                }
            } else {
                // not find headerParam
                choice([{
                    type: 'list',
                    name: 'param',
                    message: 'choice a entity.',
                    choices: clis
                }], async answers => {
                    clis.some(item => {
                        if (answers.param === item) {
                            choice([{
                                type: 'input',
                                name: 'name',
                                message: 'input a ' + item + ' name'
                            }], async answers => {
                                spawn(process.argv.slice(1)[0], [item, answers.name], {stdio: 'inherit'});
                            });
                        }
                    });
                });
            }
        } else {
            // Not find .tpl/config.js
            choice([{
                type: 'confirm',
                name: 'tpl',
                message: 'Not find config.js in .tpl of root path! init the .tpl?'
            }], async answers => {
                if (answers.tpl) {
                    await fse.mkdirsSync(rootConfig);
                }
            });
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
            datetime: this.getNow()
        };
    }

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

    getNow() {
        const date = new Date();
        const dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        return dateString;
    }
}

module.exports = new Core();