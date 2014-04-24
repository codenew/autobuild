var autobuild = require('../core/autobuild.js');
var CommonCompress = require('./commonCompress.js'), Uglify = require('uglify-js');

var JsCompress = module.exports = function(){};

autobuild.util.inherits(JsCompress, CommonCompress);

JsCompress.prototype.compressContent = function(content){
	return Uglify.minify(content, {
		fromString: true,
       	mangle: true
	}).code;
};