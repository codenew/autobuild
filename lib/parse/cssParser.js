var autobuild = require('../core/autobuild.js');
var ImageParser = require('./imageParser.js');
var CssCompress = require('../compress/cssCompress.js');

var CssParser = module.exports = autobuild.util.inherits({
	extend: require('./commonParser.js'),

	type: 'css',
	
	_parse: function(file){
		var self = this;
		var info = this.__super._parse.apply(self, arguments);
		var depends = [];
		var dir = autobuild.path.dirname(file);

		info.content = info.content.replace(/(background(?:-image)?)\s*:\s*url\(['"]?([^'"\)]+)['"]?\)|@import url\(['"]?([^\)]+)['"]?\)\s*;?/g, function(_0, _1, _2, _3){
			if(_2){
				var realpath = self.getRealPathByUrl(_2, dir);
				var image = ImageParser.init().parse(realpath);

				//if not exists
				if(!image){
					return _0;
				}

				return r = _1 + ': url(' + self.getCache(realpath).get('md5webpath') + ')';
			}else if(_3){
				var _file = self.getRealPathByUrl(_3, dir);

				if(file == _file) return '';

				if(!self.parse(_file)){
					return _0;
				}else{
					depends.push(_file);
					return '@import url(' + self.getCache(_file).get('md5webpath') + ');';
				}
			}
		});

		info.depends = depends;

		return info;
	},

	compress: function(content, is_pkg){
		return new CssCompress({
			processImport: is_pkg ? true : false
		}).compress(content);
	}
});

var instance;

module.exports = {
	init: function(files){
		return instance || (instance = new CssParser(files));
	}
};