"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var syncTry = function syncTry(func) {
	try {
		func();
	} catch (e) {
		console.log(e);
	}
};

var asyncTry = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(func) {
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.prev = 0;
						_context.next = 3;
						return func();

					case 3:
						_context.next = 8;
						break;

					case 5:
						_context.prev = 5;
						_context.t0 = _context["catch"](0);

						console.log(_context.t0);

					case 8:
					case "end":
						return _context.stop();
				}
			}
		}, _callee, undefined, [[0, 5]]);
	}));

	return function asyncTry(_x) {
		return _ref.apply(this, arguments);
	};
}();