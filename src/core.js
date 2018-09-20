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
const Pragma = require('./pragma');

const DESTINATION_PATH = process.cwd();
const entityName = process.argv.slice(2)[0] || null;
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
                if (!result) {
                    return;
                }

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

    /* Read config file in root path */
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
        if (!entityName) {
            await this.notEnterEntityName();
            return;
        }

        if (!this.templates.includes(entityName)) {
            console.log(entityName + ' is not a valid cli!');
            return;
        }

        const innerConfigPath = this.tplPath + '/' + entityName + '/config.json';
        const innerConfigExist = await fs.existsSync(innerConfigPath);

        // if config.json exist
        if (!innerConfigExist) {
            console.log('config.json of ' + entityName + ' is not exist!');
            return;
        }

        let innerConfig = await fs.readFileSync(innerConfigPath, 'utf-8');
        // match self-defining and build-in keywords
        innerConfig = innerConfig.replace(KEYWORD_REGEXP, function (value) {
            return Parser.parse(value).output;
        });
        const data = JSON.parse(innerConfig);
        const innerPath = this.tplPath + '/' + entityName;

        let flag = 0;

        Object.keys(data.files).forEach(async item => {
            const obj = data.files[item];
            const direction = DESTINATION_PATH + '/' + data.address + obj.path;
            const pathDir = DESTINATION_PATH + '/' + data.address + obj.path;
            // if exist execute
            if (obj.execute) {
                let pathExist = await fs.existsSync(pathDir, 'utf-8');
                if (pathExist) {
                    const execute = obj.execute.replace(KEYWORD_REGEXP, function () {
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
            if(flag === 0) {
                console.log(chalk.green('[new template]:'));
                flag++;
            }
            console.log(' - ' + data.files[item].path);
        });
    }

    async notEnterEntityName() {
        // Not enter entity name
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
    /*
    * Add a string into file
    * */
    async echo2File(string, dir) {
        try {
            let data = await readFile(dir, 'utf-8');
            // todo: update regex matching
            data = data.replace(/\/\*([\S\s]*?)\*\//gm, function (value){
                if(value.indexOf('@bb-pragma add') !== -1) {
                    return string + '\n' + value;
                }
                return value;
            });

            await fse.outputFile(dir, data);

        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = function () {
    return new Core();
};