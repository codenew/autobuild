var autobuild = require('../core/autobuild.js');
var CommonParser = require('./commonParser'), ImageParser = require('./imageParser.js');
var CssCompress = require('../compress/cssCompress.js');

var CssParser = module.exports = autobuild.util.inherits({
	extend: CommonParser,

	_parse: function(file){
		var self = this;
		var info = CommonParser.prototype._parse.apply(self, arguments);
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

	output: function(path, content){
		var min = new CssCompress({
			processImport: false
		}).compress(content);

		this.writeFile(path, min);
	},

	outputPkg: function(){
		var self = this;
		var config = (autobuild.config.pkg || {}).css || {};
		var compress = new CssCompress({
			root: autobuild.config.webroot
		});

		autobuild.util.each(config, function(reg, index){
			var files = [];

			autobuild.util.makeArray(reg).forEach(function(v){
				for(var file in self.info){
					if(v.constructor == RegExp && v.test(file) || typeof v == 'string' && file.indexOf(v) > -1){
						files.push(file);
					}
				}

				var content = [];

				autobuild.util.unique(files).forEach(function(file){
					if(!self.info[file]) return;
					content.push(self.getCache(file).get('content') || '');
				});

				var content = compress.compress(content.join('\r\n'));
				var file = autobuild.config.output + '/pkg/css/' + index + '.css';
				var md5path = self.getOutputMd5Path(file, autobuild.util.md5(content));
				self.writeFile(md5path, content);
			});
		});	
	}
});

var instance;

module.exports = {
	init: function(files){
		return instance || (instance = new CssParser(files));
	}
};