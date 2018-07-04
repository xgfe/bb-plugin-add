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
//
// const MATCH_PLUS = //g;

var Core = function () {
    function Core() {
        var _this = this;

        _classCallCheck(this, Core);

        this._matchKeyword = function (keyword) {
            var param = keyword.slice(2, -1);
            // console.log(param, this.keyword[param]) ???
            if (_this.keyword[param]) {
                return _this.keyword[param];
            }
            return keyword;
        };

        this.initKeyword = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var userFullname, _ref2, username, email;

            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return fullname().then(function (name) {
                                return Promise.resolve(name);
                            });

                        case 2:
                            userFullname = _context.sent;
                            _context.next = 5;
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
                            _ref2 = _context.sent;
                            username = _ref2.username;
                            email = _ref2.email;


                            namespace.core = {
                                name: modalName,
                                fullname: userFullname,
                                username: username,
                                email: email,
                                datetime: util.getNow()
                            };

                        case 9:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this);
        }));

        this.keyword = {};

        this.tplPath = DESTINATION_PATH + '/.tpl';
        this.rootConfig = this.tplPath + '/config.json';
    }

    _createClass(Core, [{
        key: 'init',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                var _this2 = this;

                var existRootConfig, configFile, clis, innerConfigPath, existInnerConfig, innerConfig, data, innerPath;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.initKeyword();

                            case 2:
                                _context6.next = 4;
                                return fs.existsSync(this.rootConfig);

                            case 4:
                                existRootConfig = _context6.sent;

                                if (!existRootConfig) {
                                    _context6.next = 31;
                                    break;
                                }

                                // read config.json in rootPath
                                configFile = require(this.rootConfig);
                                clis = Object.keys(configFile.templates);

                                // read config.json keywords in rootPath
                                // const selfKey = Object.keys(configFile.keywords);
                                // selfKey.forEach(item => {
                                //     this.keyword[item] = configFile.keywords[item];
                                // });

                                if (!headerParam) {
                                    _context6.next = 28;
                                    break;
                                }

                                if (!clis.includes(headerParam)) {
                                    _context6.next = 24;
                                    break;
                                }

                                innerConfigPath = this.tplPath + '/' + headerParam + '/config.json';
                                _context6.next = 13;
                                return common.validatePath(innerConfigPath, 'config.json', true);

                            case 13:
                                existInnerConfig = _context6.sent;

                                if (!existInnerConfig) {
                                    _context6.next = 22;
                                    break;
                                }

                                _context6.next = 17;
                                return fs.readFileSync(innerConfigPath, 'utf-8');

                            case 17:
                                innerConfig = _context6.sent;

                                // match self-defining and build-in keywords
                                innerConfig = innerConfig.replace(KEYWORD_REGEXP, function (value) {
                                    return Parser.parse(value).output;
                                });

                                data = JSON.parse(innerConfig);
                                // console.log(innerConfig);

                                innerPath = this.tplPath + '/' + headerParam;

                                Object.keys(data.files).forEach(function () {
                                    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(item) {
                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                            while (1) {
                                                switch (_context2.prev = _context2.next) {
                                                    case 0:
                                                        _context2.next = 2;
                                                        return _this2.copyFile(innerPath + '/' + item, DESTINATION_PATH + '/' + data.address + '/' + data.files[item].path);

                                                    case 2:
                                                        console.log(chalk.blue('new template') + ' : ' + chalk.green(data.files[item].path) + '');

                                                    case 3:
                                                    case 'end':
                                                        return _context2.stop();
                                                }
                                            }
                                        }, _callee2, _this2);
                                    }));

                                    return function (_x) {
                                        return _ref4.apply(this, arguments);
                                    };
                                }());

                            case 22:
                                _context6.next = 26;
                                break;

                            case 24:
                                console.log(headerParam + ' is not a valid cli!');
                                return _context6.abrupt('return', Promise.reject());

                            case 26:
                                _context6.next = 29;
                                break;

                            case 28:
                                // not find headerParam
                                prompt([{
                                    type: 'list',
                                    name: 'param',
                                    message: 'Which entity to build.',
                                    choices: clis
                                }]).then(function () {
                                    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(answers) {
                                        return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                            while (1) {
                                                switch (_context4.prev = _context4.next) {
                                                    case 0:
                                                        clis.some(function (item) {
                                                            if (answers.param === item) {
                                                                prompt([{
                                                                    type: 'input',
                                                                    name: 'name',
                                                                    message: 'input a ' + item + ' name'
                                                                }]).then(function () {
                                                                    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(answers) {
                                                                        return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                                                            while (1) {
                                                                                switch (_context3.prev = _context3.next) {
                                                                                    case 0:
                                                                                        spawn(process.argv.slice(1)[0], [item, answers.name], { stdio: 'inherit' });

                                                                                    case 1:
                                                                                    case 'end':
                                                                                        return _context3.stop();
                                                                                }
                                                                            }
                                                                        }, _callee3, _this2);
                                                                    }));

                                                                    return function (_x3) {
                                                                        return _ref6.apply(this, arguments);
                                                                    };
                                                                }());
                                                            }
                                                        });

                                                    case 1:
                                                    case 'end':
                                                        return _context4.stop();
                                                }
                                            }
                                        }, _callee4, _this2);
                                    }));

                                    return function (_x2) {
                                        return _ref5.apply(this, arguments);
                                    };
                                }());

                            case 29:
                                _context6.next = 32;
                                break;

                            case 31:
                                // not find .tpl/config.js
                                prompt([{
                                    type: 'confirm',
                                    name: 'tpl',
                                    message: 'Sorry, not find config files root path. init that and continue?'
                                }]).then(function () {
                                    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(answers) {
                                        return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                            while (1) {
                                                switch (_context5.prev = _context5.next) {
                                                    case 0:
                                                        if (!answers.tpl) {
                                                            _context5.next = 6;
                                                            break;
                                                        }

                                                        _context5.next = 3;
                                                        return fse.mkdirsSync(_this2.rootConfig);

                                                    case 3:
                                                        console.log('Config files build success!');
                                                        _context5.next = 7;
                                                        break;

                                                    case 6:
                                                        console.log('Bye.');

                                                    case 7:
                                                    case 'end':
                                                        return _context5.stop();
                                                }
                                            }
                                        }, _callee5, _this2);
                                    }));

                                    return function (_x4) {
                                        return _ref7.apply(this, arguments);
                                    };
                                }());

                            case 32:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function init() {
                return _ref3.apply(this, arguments);
            }

            return init;
        }()
    }, {
        key: 'copyFile',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(from, to) {
                var filter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
                var data;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.prev = 0;
                                _context7.next = 3;
                                return readFile(from, 'utf-8');

                            case 3:
                                data = _context7.sent;

                                data = data.replace(KEYWORD_REGEXP, function (value) {
                                    return Parser.parse(value).output;
                                });
                                _context7.next = 7;
                                return fse.outputFile(to, data);

                            case 7:
                                _context7.next = 12;
                                break;

                            case 9:
                                _context7.prev = 9;
                                _context7.t0 = _context7['catch'](0);

                                console.log(_context7.t0);

                            case 12:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this, [[0, 9]]);
            }));

            function copyFile(_x6, _x7) {
                return _ref8.apply(this, arguments);
            }

            return copyFile;
        }()
    }]);

    return Core;
}();

module.exports = new Core();