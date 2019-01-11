'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fse = require('fs-extra');
var fs = require('fs');
var inquirer = require('inquirer');
var prompt = inquirer.createPromptModule();
var common = require('./common');
var readFile = require('fs-readfile-promise');
var fullname = require('fullname');
var simpleGit = require('simple-git')();
var shell = require('shelljs');
var chalk = require('chalk');

var _require = require('child_process'),
    spawn = _require.spawn;

var util = require('./util');
var namespace = require('./namespace');

var _require2 = require('./parser'),
    parse = _require2.parse,
    convertKeyword = _require2.convertKeyword;

var Pragma = require('./pragma');

var _require3 = require('./compiler'),
    Compiler = _require3.Compiler;

var path = require('path');

var DESTINATION_PATH = process.cwd();
var entityName = process.argv.slice(2)[0] || null;
var modalName = process.argv.slice(3)[0] || null;

// ${} match keyword
var KEYWORD_REGEXP = /\$\{[^}]+\}/g;

// const tplPath = NODE_ENV === 'development' ? '/example/.tpl/' : '/.tpl/';
var tplPath = '/.tpl/';
var globalTemplatePath = DESTINATION_PATH + tplPath;
var globalConfigPath = DESTINATION_PATH + tplPath + 'bb.config.js';

var requireFile = function requireFile(path) {
  try {
    var assets = require(path);
    return assets.default || assets;
  } catch (e) {
    if (e instanceof Error && e.code === "MODULE_NOT_FOUND") {
      console.log(path + ' module not find!');
      return null;
    } else {
      return null;
    }
  }
};

var Core = function () {
  function Core() {
    _classCallCheck(this, Core);

    this.templates = [];
    // 支持的cli
    this.clis = [];

    // this.tplPath = DESTINATION_PATH + '/.tpl';
    // this.rootConfig = this.tplPath + '/config.js';
    // this.rootConfigPath = this.tplPath + '/config.js';
  }

  _createClass(Core, [{
    key: 'init',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.initCoreKeyword();

              case 2:
                _context.next = 4;
                return this.parseRootConfig();

              case 4:
                _context.next = 6;
                return this.parseEntityConfig();

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _ref.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: 'initCoreKeyword',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var userFullname, _ref3, username, email;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return fullname().then(function (name) {
                  return Promise.resolve(name);
                });

              case 2:
                userFullname = _context2.sent;
                _context2.next = 5;
                return new Promise(function (resolve) {
                  simpleGit.raw(['config', '--list'], function (err, result) {
                    var gitConfig = {};
                    if (!result) {
                      return;
                    }

                    result.split('\n').forEach(function (item) {
                      var freg = item.split('=');
                      gitConfig[freg[0]] = freg[1];
                    });
                    return resolve({
                      username: gitConfig['user.name'],
                      email: gitConfig['user.email']
                    });
                  });
                });

              case 5:
                _ref3 = _context2.sent;
                username = _ref3.username;
                email = _ref3.email;


                namespace.core = {
                  name: modalName,
                  fullname: userFullname,
                  username: username,
                  email: email,
                  datetime: util.getNow()
                };

              case 9:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function initCoreKeyword() {
        return _ref2.apply(this, arguments);
      }

      return initCoreKeyword;
    }()

    /* Read config file in root path */

  }, {
    key: 'parseRootConfig',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var _this = this;

        var fileData;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                fileData = requireFile(globalConfigPath);

                if (!fileData) {
                  _context4.next = 4;
                  break;
                }

                this.clis = fileData.add;
                return _context4.abrupt('return');

              case 4:
                _context4.next = 6;
                return prompt([{
                  type: 'confirm',
                  name: 'tpl',
                  message: 'Sorry, not find config files root path. init that and continue?'
                }]).then(function () {
                  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(answers) {
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            if (!answers.tpl) {
                              _context3.next = 6;
                              break;
                            }

                            _context3.next = 3;
                            return fse.mkdirsSync(globalConfigPath);

                          case 3:
                            console.log('Success! A empty config files build in rootPath.');
                            _context3.next = 7;
                            break;

                          case 6:
                            console.log('Bye.');

                          case 7:
                            process.exit(0);

                          case 8:
                          case 'end':
                            return _context3.stop();
                        }
                      }
                    }, _callee3, _this);
                  }));

                  return function (_x) {
                    return _ref5.apply(this, arguments);
                  };
                }());

              case 6:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function parseRootConfig() {
        return _ref4.apply(this, arguments);
      }

      return parseRootConfig;
    }()
  }, {
    key: 'parseEntityConfig',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        var _this2 = this;

        var entityConfig, configData, output, source, queue;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (entityName) {
                  _context6.next = 4;
                  break;
                }

                _context6.next = 3;
                return this.notEnterEntityName();

              case 3:
                return _context6.abrupt('return');

              case 4:
                entityConfig = this.clis[entityName];

                if (entityConfig) {
                  _context6.next = 8;
                  break;
                }

                console.log(entityName + ' is not a valid cli!');
                return _context6.abrupt('return');

              case 8:

                // config配置
                configData = requireFile(globalConfigPath);

                if (configData) {
                  _context6.next = 11;
                  break;
                }

                return _context6.abrupt('return');

              case 11:
                output = entityConfig.output, source = entityConfig.source, queue = entityConfig.queue;

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

                _context6.next = 14;
                return queue.forEach(function () {
                  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(item) {
                    var templatePath, outputPath, outputPathExist, compiler;
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            templatePath = convertKeyword(path.join(globalTemplatePath, source, item.template));
                            outputPath = convertKeyword(path.join(output, item.filename));
                            _context5.next = 4;
                            return fs.existsSync(outputPath);

                          case 4:
                            outputPathExist = _context5.sent;

                            if (!outputPathExist) {
                              _context5.next = 18;
                              break;
                            }

                            if (!item.progress) {
                              _context5.next = 13;
                              break;
                            }

                            compiler = new Compiler({
                              template: templatePath,
                              output: outputPath
                            });

                            item.progress(compiler);
                            // 获得更新过的compiler配置
                            _context5.next = 11;
                            return compiler.start();

                          case 11:
                            _context5.next = 16;
                            break;

                          case 13:
                            _context5.next = 15;
                            return _this2.copyFile(templatePath, outputPath);

                          case 15:
                            console.log(chalk.green('[new template] - ' + outputPath));

                          case 16:
                            _context5.next = 21;
                            break;

                          case 18:
                            _context5.next = 20;
                            return _this2.copyFile(templatePath, outputPath);

                          case 20:
                            console.log(chalk.green('[new template] - ' + outputPath));

                          case 21:
                          case 'end':
                            return _context5.stop();
                        }
                      }
                    }, _callee5, _this2);
                  }));

                  return function (_x2) {
                    return _ref7.apply(this, arguments);
                  };
                }());

              case 14:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function parseEntityConfig() {
        return _ref6.apply(this, arguments);
      }

      return parseEntityConfig;
    }()
  }, {
    key: 'notEnterEntityName',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        var _this3 = this;

        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return prompt([{
                  type: 'list',
                  name: 'param',
                  message: 'Choice an Entity to build.',
                  choices: Object.keys(this.clis)
                }]).then(function () {
                  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(answers) {
                    return regeneratorRuntime.wrap(function _callee8$(_context8) {
                      while (1) {
                        switch (_context8.prev = _context8.next) {
                          case 0:
                            Object.keys(_this3.clis).some(function (item) {
                              if (answers.param === item) {
                                prompt([{
                                  type: 'input',
                                  name: 'name',
                                  message: 'Enter a ' + item + ' name.'
                                }]).then(function () {
                                  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(answers) {
                                    return regeneratorRuntime.wrap(function _callee7$(_context7) {
                                      while (1) {
                                        switch (_context7.prev = _context7.next) {
                                          case 0:
                                            spawn(process.argv.slice(1)[0], [item, answers.name], { stdio: 'inherit' });

                                          case 1:
                                          case 'end':
                                            return _context7.stop();
                                        }
                                      }
                                    }, _callee7, _this3);
                                  }));

                                  return function (_x4) {
                                    return _ref10.apply(this, arguments);
                                  };
                                }());
                              }
                            });

                          case 1:
                          case 'end':
                            return _context8.stop();
                        }
                      }
                    }, _callee8, _this3);
                  }));

                  return function (_x3) {
                    return _ref9.apply(this, arguments);
                  };
                }());

              case 2:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function notEnterEntityName() {
        return _ref8.apply(this, arguments);
      }

      return notEnterEntityName;
    }()
  }, {
    key: 'copyFile',
    value: function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(from, to) {
        var data;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                _context10.next = 3;
                return readFile(from, 'utf-8');

              case 3:
                data = _context10.sent;

                data = data.replace(KEYWORD_REGEXP, function (value) {
                  return parse(value).output;
                });
                _context10.next = 7;
                return fse.outputFile(to, data);

              case 7:
                _context10.next = 12;
                break;

              case 9:
                _context10.prev = 9;
                _context10.t0 = _context10['catch'](0);

                console.log(_context10.t0);

              case 12:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this, [[0, 9]]);
      }));

      function copyFile(_x5, _x6) {
        return _ref11.apply(this, arguments);
      }

      return copyFile;
    }()
  }]);

  return Core;
}();

exports.default = Core;