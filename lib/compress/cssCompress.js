var autobuild = require('../core/autobuild.js');
var CommonCompress = require('./commonCompress.js'), CleanCSS = require('clean-css');

module.exports = autobuild.util.inherits({
	extend: require('./commonCompress.js'),

	compress: function(content){
		var c = new CleanCSS(this.options).minify(content);
		return c;
	}
});