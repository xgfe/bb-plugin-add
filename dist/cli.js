'use strict';

require('./global');

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
	var core;
	return regeneratorRuntime.wrap(function _callee$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					_context.prev = 0;
					_context.next = 3;
					return new _core2.default();

				case 3:
					core = _context.sent;
					_context.next = 6;
					return core.init();

				case 6:
					_context.next = 11;
					break;

				case 8:
					_context.prev = 8;
					_context.t0 = _context['catch'](0);

					console.log(_context.t0);

				case 11:
				case 'end':
					return _context.stop();
			}
		}
	}, _callee, undefined, [[0, 8]]);
}))();