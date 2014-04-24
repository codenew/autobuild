var autobuild = require('../core/autobuild.js');
var CommonParse = require('./commonParse.js');

function ImageParse(){
	CommonParse.apply(this, arguments);
}

autobuild.util.inherits(ImageParse, CommonParse);

ImageParse.prototype._parse = function(file){
	var info = this.info[file] = {
		webpath: this.getWebPath(file),
		md5path: this.getMd5Path(file),
		md5webpath: this.getMd5WebPath(file),
		content: autobuild.file.readFileSync(file, 'utf-8')
	};

	autobuild.file.writeFileSync(info.md5path, info.content);
};

var instance;

module.exports = {
	init: function(files){
		return instance || (instance = new ImageParse(files));
	}
};