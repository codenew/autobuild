var autobuild = require('../core/autobuild.js');
var CommonParser = require('./commonParser.js');
var JsCompress = require('../compress/jsCompress.js');

var JsParser = module.exports = autobuild.util.inherits({
	extend: CommonParser,

	output: function(path, content){
		var min = new JsCompress().compress(content);
		this.writeFile(path, min);
	},

	outputPkg: function(){
		var self = this;
		var config = (autobuild.config.pkg || {}).js || {};
		var compress = new JsCompress();

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
				var file = autobuild.config.output + '/pkg/js/' + index + '.js';
				var md5path = self.getOutputMd5Path(file, autobuild.util.md5(content));
				self.writeFile(md5path, content);
			});
		});	
	}
});

var instance;

module.exports = {
	init: function(files){
		return instance || (instance = new JsParser(files));
	}
};