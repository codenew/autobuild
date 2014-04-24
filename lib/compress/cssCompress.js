var autobuild = require('../core/autobuild.js');
var CommonCompress = require('./commonCompress.js'), CleanCSS = require('clean-css');

var CssCompress = module.exports = function(){};

autobuild.util.inherits(CssCompress, CommonCompress);

CssCompress.prototype.compressContent = function(content){
	return CleanCSS.process(content, {
		keepBreaks: true,
		processImport: true,
		root: '123'
	});
};