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
const Parser = require('./parser');

const DESTINATION_PATH = process.cwd();
const headerParam = process.argv.slice(2)[0] || null;
const modalName = process.argv.slice(3)[0] || null;

// ${} match keyword
const KEYWORD_REGEXP = /\$\{[^}]+\}/g;

class Core {
    constructor() {
        this.templates = [];

        this.tplPath = DESTINATION_PATH + '/.tpl';
        this.rootConfig = this.tplPath + '/config.json';
        this.rootConfigPath = this.tplPath + '/config.json';
    }

    async init() {
        await this.initCoreKeyword();
        await this.parseRootConfig();
        await this.parseEntityConfig();
    }

    async initCoreKeyword() {
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

        namespace.core = {
            name: modalName,
            fullname: userFullname,
            username,
            email,
            datetime: util.getNow()
        };
    }

    /* Read Config file in rootPath */
    async parseRootConfig() {
        const rootConfigExist = await fs.existsSync(this.rootConfig);

        if (rootConfigExist) {
            const rootConfigFile = await fs.readFileSync(this.rootConfigPath, 'utf-8');
            const rootConfigData = JSON.parse(rootConfigFile);
            this.templates = Object.keys(rootConfigData.templates);
            return;
        }

        // Not find config.js in root path.
        await prompt([{
            type: 'confirm',
            name: 'tpl',
            message: 'Sorry, not find config files root path. init that and continue?'
        }]).then(async answers => {
            if (answers.tpl) {
                await fse.mkdirsSync(this.rootConfig);
                console.log('Success! A empty config files build in rootPath.');
            } else {
                console.log('Bye.')
            }
            process.exit(0);
        });
    }

    async parseEntityConfig() {
        if (headerParam) {
            const innerConfigPath = this.tplPath + '/' + headerParam + '/config.json';
            const innerConfigExist = await fs.existsSync(innerConfigPath);

            if (!this.templates.includes(headerParam)) {
                console.log(headerParam + ' is not a valid cli!');
                return;
            }
            // if config.js exist
            if (innerConfigExist) {
                let innerConfig = await fs.readFileSync(innerConfigPath, 'utf-8');
                // match self-defining and build-in keywords
                innerConfig = innerConfig.replace(KEYWORD_REGEXP, function (value) {
                    return Parser.parse(value).output;
                });
                const data = JSON.parse(innerConfig);
                const innerPath = this.tplPath + '/' + headerParam;
                Object.keys(data.files).forEach(async item => {
                    const obj = data.files[item];
                    const direction = DESTINATION_PATH + '/' + data.address + obj.path;
                    const pathDir = DESTINATION_PATH + '/' + data.address + obj.path;
                    // if exist execute
                    if (obj.execute) {
                        let pathExist = await fs.existsSync(pathDir, 'utf-8');
                        if(pathExist) {
                            const execute = obj.execute.replace(KEYWORD_REGEXP, function (){
                               return Parser.parse(value).output;
                            });
                            await this.echo2File(
                                execute,
                                pathDir
                            );
                            return;
                        }
                    }
                    await this.copyFile(innerPath + '/' + item, direction);
                    console.log(chalk.green('[new template]') + ':' + data.files[item].path);
                });
            }
            return;
        }

        // Not find headerParam
        await prompt([{
            type: 'list',
            name: 'param',
            message: 'Choice an Entity to build.',
            choices: this.templates
        }]).then(async answers => {
            this.templates.some(item => {
                if (answers.param === item) {
                    prompt([{
                        type: 'input',
                        name: 'name',
                        message: 'Enter a ' + item + ' name.'
                    }]).then(async answers => {
                        spawn(process.argv.slice(1)[0], [item, answers.name], {stdio: 'inherit'});
                    });
                }
            });
        });
    }

    async copyFile(from, to) {
        try {
            let data = await readFile(from, 'utf-8');
            data = data.replace(KEYWORD_REGEXP, function (value) {
                return Parser.parse(value).output;
            });
            await fse.outputFile(to, data);
        } catch (e) {
            console.log(e)
        }
    }

    async echo2File(string, dir) {
        try {
            const data = await readFile(dir, 'utf-8');
            let array = data.split('\n');
            let flag = array.length;
            array.splice(flag, 0, string);

            await fse.outputFile(dir, array.join('\n'));

        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = function () {
    return new Core();
};