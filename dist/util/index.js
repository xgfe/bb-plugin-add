'use strict';

module.exports = {
	getNow: function getNow() {
		var date = new Date();
		var dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		return dateString;
	}
};