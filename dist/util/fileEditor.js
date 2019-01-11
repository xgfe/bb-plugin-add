'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fse = require('fs-extra');
var readFile = require('fs-readfile-promise');

var insert = exports.insert = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
        var point = _ref.point,
            content = _ref.content,
            output = _ref.output,
            match = _ref.match;
        var data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return readFile(output, 'utf-8');

                    case 3:
                        data = _context.sent;

                        data = data.replace(/\/\*\*([\S\s]*?)\*\//gm, function (value) {
                            // 匹配占位符，这个判断不太稳定，以后改
                            if (value.indexOf(match) !== -1) {
                                switch (point) {
                                    case 'after':
                                        return value + '\n' + content;
                                    case 'before':
                                    default:
                                        return content + '\n' + value;
                                }
                            }
                            return value;
                        });

                        _context.next = 7;
                        return fse.outputFile(output, data);

                    case 7:
                        _context.next = 12;
                        break;

                    case 9:
                        _context.prev = 9;
                        _context.t0 = _context['catch'](0);

                        console.log(_context.t0);

                    case 12:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 9]]);
    }));

    return function insert(_x) {
        return _ref2.apply(this, arguments);
    };
}();