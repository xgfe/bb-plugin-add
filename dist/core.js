'use strict';

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
var Parser = require('./parser');

var DESTINATION_PATH = process.cwd();
var headerParam = process.argv.slice(2)[0] || null;
var modalName = process.argv.slice(3)[0] || null;

// ${} match keyword
var KEYWORD_REGEXP = /\$\{[^}]+\}/g;

var Core = function () {
    function Core() {
        _classCallCheck(this, Core);

        this.templates = [];

        this.tplPath = DESTINATION_PATH + '/.tpl';
        this.rootConfig = this.tplPath + '/config.json';
        this.rootConfigPath = this.tplPath + '/config.json';
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

        /* Read Config file in rootPath */

    }, {
        key: 'parseRootConfig',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                var _this = this;

                var rootConfigExist, rootConfigFile, rootConfigData;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return fs.existsSync(this.rootConfig);

                            case 2:
                                rootConfigExist = _context4.sent;

                                if (!rootConfigExist) {
                                    _context4.next = 10;
                                    break;
                                }

                                _context4.next = 6;
                                return fs.readFileSync(this.rootConfigPath, 'utf-8');

                            case 6:
                                rootConfigFile = _context4.sent;
                                rootConfigData = JSON.parse(rootConfigFile);

                                this.templates = Object.keys(rootConfigData.templates);
                                return _context4.abrupt('return');

                            case 10:
                                _context4.next = 12;
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
                                                        return fse.mkdirsSync(_this.rootConfig);

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

                            case 12:
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
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
                var _this2 = this;

                var innerConfigPath, innerConfigExist, innerConfig, data, innerPath;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                if (!headerParam) {
                                    _context8.next = 17;
                                    break;
                                }

                                innerConfigPath = this.tplPath + '/' + headerParam + '/config.json';
                                _context8.next = 4;
                                return fs.existsSync(innerConfigPath);

                            case 4:
                                innerConfigExist = _context8.sent;

                                if (this.templates.includes(headerParam)) {
                                    _context8.next = 8;
                                    break;
                                }

                                console.log(headerParam + ' is not a valid cli!');
                                return _context8.abrupt('return');

                            case 8:
                                if (!innerConfigExist) {
                                    _context8.next = 16;
                                    break;
                                }

                                _context8.next = 11;
                                return fs.readFileSync(innerConfigPath, 'utf-8');

                            case 11:
                                innerConfig = _context8.sent;

                                // match self-defining and build-in keywords
                                innerConfig = innerConfig.replace(KEYWORD_REGEXP, function (value) {
                                    return Parser.parse(value).output;
                                });
                                data = JSON.parse(innerConfig);
                                innerPath = this.tplPath + '/' + headerParam;

                                Object.keys(data.files).forEach(function () {
                                    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(item) {
                                        var obj, direction, pathDir, pathExist, execute;
                                        return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                            while (1) {
                                                switch (_context5.prev = _context5.next) {
                                                    case 0:
                                                        obj = data.files[item];
                                                        direction = DESTINATION_PATH + '/' + data.address + obj.path;
                                                        pathDir = DESTINATION_PATH + '/' + data.address + obj.path;
                                                        // if exist execute

                                                        if (!obj.execute) {
                                                            _context5.next = 12;
                                                            break;
                                                        }

                                                        _context5.next = 6;
                                                        return fs.existsSync(pathDir, 'utf-8');

                                                    case 6:
                                                        pathExist = _context5.sent;

                                                        if (!pathExist) {
                                                            _context5.next = 12;
                                                            break;
                                                        }

                                                        execute = obj.execute.replace(KEYWORD_REGEXP, function () {
                                                            return Parser.parse(value).output;
                                                        });
                                                        _context5.next = 11;
                                                        return _this2.echo2File(execute, pathDir);

                                                    case 11:
                                                        return _context5.abrupt('return');

                                                    case 12:
                                                        _context5.next = 14;
                                                        return _this2.copyFile(innerPath + '/' + item, direction);

                                                    case 14:
                                                        console.log(chalk.green('[new template]') + ':' + data.files[item].path);

                                                    case 15:
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

                            case 16:
                                return _context8.abrupt('return');

                            case 17:
                                _context8.next = 19;
                                return prompt([{
                                    type: 'list',
                                    name: 'param',
                                    message: 'Choice an Entity to build.',
                                    choices: this.templates
                                }]).then(function () {
                                    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(answers) {
                                        return regeneratorRuntime.wrap(function _callee7$(_context7) {
                                            while (1) {
                                                switch (_context7.prev = _context7.next) {
                                                    case 0:
                                                        _this2.templates.some(function (item) {
                                                            if (answers.param === item) {
                                                                prompt([{
                                                                    type: 'input',
                                                                    name: 'name',
                                                                    message: 'Enter a ' + item + ' name.'
                                                                }]).then(function () {
                                                                    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(answers) {
                                                                        return regeneratorRuntime.wrap(function _callee6$(_context6) {
                                                                            while (1) {
                                                                                switch (_context6.prev = _context6.next) {
                                                                                    case 0:
                                                                                        spawn(process.argv.slice(1)[0], [item, answers.name], { stdio: 'inherit' });

                                                                                    case 1:
                                                                                    case 'end':
                                                                                        return _context6.stop();
                                                                                }
                                                                            }
                                                                        }, _callee6, _this2);
                                                                    }));

                                                                    return function (_x4) {
                                                                        return _ref9.apply(this, arguments);
                                                                    };
                                                                }());
                                                            }
                                                        });

                                                    case 1:
                                                    case 'end':
                                                        return _context7.stop();
                                                }
                                            }
                                        }, _callee7, _this2);
                                    }));

                                    return function (_x3) {
                                        return _ref8.apply(this, arguments);
                                    };
                                }());

                            case 19:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function parseEntityConfig() {
                return _ref6.apply(this, arguments);
            }

            return parseEntityConfig;
        }()
    }, {
        key: 'copyFile',
        value: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(from, to) {
                var data;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.prev = 0;
                                _context9.next = 3;
                                return readFile(from, 'utf-8');

                            case 3:
                                data = _context9.sent;

                                data = data.replace(KEYWORD_REGEXP, function (value) {
                                    return Parser.parse(value).output;
                                });
                                _context9.next = 7;
                                return fse.outputFile(to, data);

                            case 7:
                                _context9.next = 12;
                                break;

                            case 9:
                                _context9.prev = 9;
                                _context9.t0 = _context9['catch'](0);

                                console.log(_context9.t0);

                            case 12:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this, [[0, 9]]);
            }));

            function copyFile(_x5, _x6) {
                return _ref10.apply(this, arguments);
            }

            return copyFile;
        }()
    }, {
        key: 'echo2File',
        value: function () {
            var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(string, dir) {
                var data, array, flag;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.prev = 0;
                                _context10.next = 3;
                                return readFile(dir, 'utf-8');

                            case 3:
                                data = _context10.sent;
                                array = data.split('\n');
                                flag = array.length;

                                array.splice(flag, 0, string);

                                _context10.next = 9;
                                return fse.outputFile(dir, array.join('\n'));

                            case 9:
                                _context10.next = 14;
                                break;

                            case 11:
                                _context10.prev = 11;
                                _context10.t0 = _context10['catch'](0);

                                console.log(_context10.t0);

                            case 14:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this, [[0, 11]]);
            }));

            function echo2File(_x7, _x8) {
                return _ref11.apply(this, arguments);
            }

            return echo2File;
        }()
    }]);

    return Core;
}();

module.exports = function () {
    return new Core();
};