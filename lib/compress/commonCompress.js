var autobuild = require('../core/autobuild.js');

var f = module.exports = function(){};

f.prototype = {
	compress: function(files){
		var files = autobuild.util.makeArray(files);
		var content = [];

		files.forEach(function(file){
			if(!autobuild.file.existsSync(file)) return autobuild.log.error(file + ' is not a file! Please check!');

			content.push(autobuild.file.readFileSync(file));
		});

		return this.compressContent(content.join('\r\n'));
	},

	compressContent: function(content){}
};