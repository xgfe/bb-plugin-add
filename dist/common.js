'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fs = require('fs');

module.exports = {
    /**
     * Function: validatePath
     * confirm template file in configPath exist
     *
     * @param {String} configPath
     * @param {String} name
     * @param {Boolean} exitProcess
     *
     * */
    validatePath: function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(configPath, name) {
            var exitProcess = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var existPath, pathName;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return fs.existsSync(configPath);

                        case 2:
                            existPath = _context.sent;

                            if (!existPath && exitProcess) {
                                pathName = name || 'file';

                                console.log(pathName + ' not exist!');
                                process.exit(0);
                            }
                            return _context.abrupt('return', existPath);

                        case 5:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function validatePath(_x2, _x3) {
            return _ref.apply(this, arguments);
        }

        return validatePath;
    }()
};