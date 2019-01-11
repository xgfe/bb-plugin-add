'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Compiler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _FileEditor = require('../util/FileEditor');

var _parser = require('../parser');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Compiler = exports.Compiler = function () {
	function Compiler(_ref) {
		var template = _ref.template,
		    output = _ref.output;

		_classCallCheck(this, Compiler);

		this.template = template;
		this.output = output;
		this.match = '';
		this.queue = [];
	}
	// compiler.comment('add').before.insert('yourContent');


	_createClass(Compiler, [{
		key: 'comment',
		value: function comment(scope, name) {
			var _this = this;

			var scopeName = name ? scope : 'bb-mt';
			var funcName = name ? name : scope;
			this.match = '@' + scopeName + ' ' + funcName;

			return {
				before: {
					insert: function insert(content) {
						_this.queue.push({
							action: 'insert',
							point: 'before',
							content: (0, _parser.convertKeyword)(content)
						});
					}
				},
				after: {
					insert: function insert(content) {
						_this.queue.push({
							action: 'insert',
							point: 'after',
							content: (0, _parser.convertKeyword)(content)
						});
					}
				}
			};
		}
		// 启动编译

	}, {
		key: 'start',
		value: function () {
			var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
				var _this2 = this;

				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								this.queue.forEach(function () {
									var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref3) {
										var action = _ref3.action,
										    point = _ref3.point,
										    content = _ref3.content;
										return regeneratorRuntime.wrap(function _callee$(_context) {
											while (1) {
												switch (_context.prev = _context.next) {
													case 0:
														if (!(action === 'insert')) {
															_context.next = 3;
															break;
														}

														_context.next = 3;
														return (0, _FileEditor.insert)({
															point: point,
															content: content,
															output: _this2.output,
															match: _this2.match
														});

													case 3:
													case 'end':
														return _context.stop();
												}
											}
										}, _callee, _this2);
									}));

									return function (_x) {
										return _ref4.apply(this, arguments);
									};
								}());

							case 1:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function start() {
				return _ref2.apply(this, arguments);
			}

			return start;
		}()
	}]);

	return Compiler;
}();