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
const { parse, convertKeyword } = require('./parser');
const Pragma = require('./pragma');
const { Compiler } = require('./compiler');
const path = require('path');

const DESTINATION_PATH = process.cwd();
const entityName = process.argv.slice(2)[0] || null;
const modalName = process.argv.slice(3)[0] || null;

// ${} match keyword
const KEYWORD_REGEXP = /\$\{[^}]+\}/g;

// const tplPath = NODE_ENV === 'development' ? '/example/.tpl/' : '/.tpl/';
const tplPath = '/.tpl/';
const globalTemplatePath = DESTINATION_PATH + tplPath;
const globalConfigPath = DESTINATION_PATH + tplPath + 'bb.config.js';

const requireFile = function (path) {
  try {
    return require(path).default;
  } catch (e) {
    if (e instanceof Error && e.code === "MODULE_NOT_FOUND") {
      console.log(path + ' module not find!');
      return null;
    } else {
      return null;
    }
  }
}



class Core {
  constructor() {
    this.templates = [];
    // 支持的cli
    this.clis = [];

    // this.tplPath = DESTINATION_PATH + '/.tpl';
    // this.rootConfig = this.tplPath + '/config.js';
    // this.rootConfigPath = this.tplPath + '/config.js';
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
    const fileData = requireFile(globalConfigPath);

    if (fileData) {
      this.clis = fileData.add;
      return;
    }

    // Not find config.js in root path.
    await prompt([{
      type: 'confirm',
      name: 'tpl',
      message: 'Sorry, not find config files root path. init that and continue?'
    }]).then(async answers => {
      if (answers.tpl) {
        await fse.mkdirsSync(globalConfigPath);
        console.log('Success! A empty config files build in rootPath.');
      } else {
        console.log('Bye.')
      }
      process.exit(0);
    });
  }

  async parseEntityConfig() {
    if (!entityName) {
      // 未输入要创建的实体类型，打印cli选项
      await this.notEnterEntityName();
      return;
    }
    const entityConfig = this.clis[entityName];

    if (!entityConfig) {
      console.log(entityName + ' is not a valid cli!');
      return;
    }

    // config配置
    const configData = requireFile(globalConfigPath);
    if (!configData) {
      return;
    }

    const {
      output, // 目标路径
      source, // 模板源路径
      queue, // 执行队列
    } = entityConfig;

    /*
      if 存在 {
        if progress {
          
        } else {
          new
        }
      } else {
        new
      }

    */

    await queue.forEach(async item => {
      const templatePath = convertKeyword(path.join(globalTemplatePath, source, item.template));
      const outputPath = convertKeyword(path.join(output, item.filename));

      const outputPathExist = await fs.existsSync(outputPath);

      if (outputPathExist) {
        // 如果目标文件已存在触发progress逻辑
        if (item.progress) {
          const compiler = new Compiler({
            template: templatePath,
            output: outputPath
          });
          item.progress(compiler);
          // 获得更新过的compiler配置
          await compiler.start();
        } else {
          await this.copyFile(templatePath, outputPath);
          console.log(chalk.green('[new template] - ' + outputPath));
        }
      } else {
        await this.copyFile(templatePath, outputPath);
        console.log(chalk.green('[new template] - ' + outputPath));
      }
    });
  }

  async notEnterEntityName() {
    // Not enter entity name
    await prompt([{
      type: 'list',
      name: 'param',
      message: 'Choice an Entity to build.',
      choices: Object.keys(this.clis)
    }]).then(async answers => {
      Object.keys(this.clis).some(item => {
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
        return parse(value).output;
      });
      await fse.outputFile(to, data);
    } catch (e) {
      console.log(e)
    }
  }
}

export default Core;