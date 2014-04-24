var autobuild = require('../core/autobuild.js');
var CommonParse = require('./commonParse.js'), ImageParse = require('./imageParse.js');
var CssCompress = require('../compress/cssCompress.js');

function CssParse(){
	CommonParse.apply(this, arguments);
	this.compress();
}

autobuild.util.inherits(CssParse, CommonParse);

CssParse.prototype._parse = function(file){
	var self = this;
	var content = autobuild.file.readFileSync(file, 'utf-8'), depends = [];

	var info = self.info[file] = {
		webpath: this.getWebPath(file)
	};

	content = content.replace(/(background(?:-image)?)\s*:\s*url\(['"]?([^'"\)]+)['"]?\)/g, function(_0, _1, _2){
		var image = ImageParse.init().parse(autobuild.path.resolve(autobuild.path.dirname(file), _2));

		if(autobuild.util.isEmptyObject(image)){
			return _0;
		}

		return _1 + ': url("' + image.md5webpath + '")';
	});

	// content = content.replace(/@import url\(['"]?([^\)]+)['"]?\)\s*;?/g, function(_0, _1){
	// 	var _file = autobuild.path.resolve(autobuild.path.dirname(file), _1);

	// 	if(file == _file) return '';

	// 	var result = self.parse(_file);

	// 	if(autobuild.util.isEmptyObject(result)){
	// 		return _0;
	// 	}else{
	// 		depends.push(result);
	// 		return '@import url(' + result.md5webpath + ')';
	// 	}
	// });

	info.md5webpath = this.getMd5WebPath(file, autobuild.util.md5(content));
	info.md5path = this.getMd5Path(file, autobuild.util.md5(content));
	info.depends = depends;
	info.content = content;

	this._compress(file);
};

CssParse.prototype.compress = function(){
	var self = this;
	var config = (autobuild.config.pkg || {}).css || {};

	autobuild.util.each(config, function(reg, index){
		var files = [];

		autobuild.util.makeArray(reg).forEach(function(v){
			for(var file in self.info){
				if(v.constructor == RegExp && v.test(file) || typeof v == 'string' && file.indexOf(v) > -1){
					files.push(file);
				}
			}

			files = autobuild.util.unique(files);
			var compress = new CssCompress();
		});
	});
};

CssParse.prototype._compress = function(file){
	var info = this.info[file];
	console.log(new CssCompress().compressContent(info.content));
	autobuild.file.writeFileSync(info.md5path, new CssCompress().compressContent(info.content));
};

var instance;

module.exports = {
	init: function(files){
		return instance || (instance = new CssParse(files));
	}
};