var autobuild = require('../core/autobuild.js');
var Uglify = require('uglify-js'), CommonCompress = require('./commonCompress.js');

module.exports = autobuild.util.inherits({
	extend: CommonCompress,

	compress: function(content){
		return Uglify.minify(content, {fromString: true}).code;
	}
});