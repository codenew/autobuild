var autobuild = require('../core/autobuild.js');

var CommonParse = module.exports = function(files){
	this.files = autobuild.util.makeArray(files);
	this.info = {};

	this.init();
};

CommonParse.prototype = {
	init: function(){
		var self = this;

		this.files.forEach(function(file){
			self.parse(file);
		});
	},

	parse: function(file){
		file = this.getPath(file);

		if(!this.info[file]){
			if(!autobuild.file.existsSync(file)) {
				autobuild.log.error(file + ' is not exists!');
				this.info[file] = {};
			}else{
				this._parse(file);
			}
		}
		
		return this.info[file];
	},

	_parse: function(file){
		//if(!autobuild.file.existsSync(file)) autobuild.log.error(file + ' is not exists!');
		//return {webpath: this.getWebPath(file.filename)};
	},

	getWebPath: function(file){
		return '/' + file.replace(autobuild.config.webroot, '').replace(/^\//, '');
	},

	getMd5WebPath: function(file, md5){
		if(!md5){
			md5 = autobuild.util.md5(autobuild.file.readFileSync(file));
		}

		file = this.getWebPath(file);
		return autobuild.path.dirname(file) + '/' + autobuild.path.basename(file, autobuild.path.extname(file)) + '_' + md5 + autobuild.path.extname(file);
	},

	getMd5Path: function(file, md5){
		if(!md5){
			md5 = autobuild.util.md5(autobuild.file.readFileSync(file));
		}

		return autobuild.path.dirname(file) + '/' + autobuild.path.basename(file, autobuild.path.extname(file)) + '_' + md5 + autobuild.path.extname(file);
	},

	getPath: function(file){
		return autobuild.config.webroot + this.getWebPath(file);
	}
};