var autobuild = require('../core/autobuild.js');

module.exports = autobuild.util.inherits({
	initialize: function(files){
		var self = this;

		self.files = autobuild.util.makeArray(files);
		self.info = {};
		self.pkg = {};

		self.files.forEach(function(file){
			self.parse(file);
		});

		self.outputPkg();
	},

	parse: function(file){
		if(this.info[file] === undefined){
			if(!autobuild.file.existsSync(file)) {
				autobuild.log.warn(file + ' is not exists!');
				this.info[file] = false;
			}else{
				var cache = this.getCache(file);
				var info = this._parse(file);
				cache.set(info);
				this.info[file] = true;
				this.output(info.md5outputpath, info.content);
			}
		}

		return this.info[file];
	},

	_parse: function(file){
		return {
			webpath: this.getWebPath(file),
			md5webpath: this.getMd5WebPath(file),
			outputpath: this.getOuputPath(file),
			md5outputpath: this.getOutputMd5Path(file),
			path: file,
			content: autobuild.file.readFileSync(file, 'utf-8')
		};
	},

	getWebPath: function(file){
		file = autobuild.path.relative(autobuild.config.webroot, this.getOuputPath(file));

		if(file[0] != '.'){
			file = '/' + file.replace(/^\//, '');
		}

		return file;
	},

	getMd5WebPath: function(file, md5){
		if(!md5){
			md5 = autobuild.util.md5(autobuild.file.readFileSync(file));
		}

		file = this.getWebPath(file);
		return autobuild.path.dirname(file) + '/' + autobuild.path.basename(file, autobuild.path.extname(file)) + '_' + md5 + autobuild.path.extname(file);
	},

	getOutputMd5Path: function(file, md5){
		if(!md5){
			md5 = autobuild.util.md5(autobuild.file.readFileSync(file));
		}

		file = this.getOuputPath(file);
		return autobuild.path.dirname(file) + '/' + autobuild.path.basename(file, autobuild.path.extname(file)) + '_' + md5 + autobuild.path.extname(file);
	},

	getOuputPath: function(file){
		return file.replace(autobuild.config.source, autobuild.config.output);
	},

	getRealPathByUrl: function(file, relative){
		if(file[0] == '/'){
			return autobuild.config.source + file;
		}else if(file.split('://').length > 1){
			return file;
		}else{
			return autobuild.path.resolve(relative, file);
		}
	},

	output: function(path, content){	
		this.writeFile(path, content);
	},

	outputPkg: function(){},

	writeFile: function(file, content){
		autobuild.file.mkdirs(autobuild.path.dirname(file));
		autobuild.file.writeFileSync(file, content);
	},

	getCache: function(file){
		return new autobuild.filecache(file, autobuild.config.cachedir);
	}
});