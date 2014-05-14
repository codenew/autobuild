var autobuild = require('../core/autobuild.js');

module.exports = autobuild.util.inherits({
	initialize: function(files){
		this.info = {};
		this.pkg = {};

		this.init(files);
	},

	init: function(files){
		var self = this;

		self.files = autobuild.util.makeArray(files);

		if(!autobuild.config.watch){
			self.files.forEach(function(file){
				self.parse(file);
			});

			self.outputPkg();
		}else{
			self.files.forEach(function(file){
				var cache = self.getCache(file);

				if(cache.isUpdate()){
					cache.updateModifyTime();
					self.reParse(file);
				}
			});
		}
	},

	parse: function(file){
		if(this.info[file] === undefined){
			if(!autobuild.file.existsSync(file)) {
				autobuild.log.warn(file + ' is not exists!');
				this.info[file] = false;
			}else{
				this.reParse(file);
				this.info[file] = true;	
			}
		}

		return this.info[file];
	},

	reParse: function(file){
		var cache = this.getCache(file);
		var info = this._parse(file);
		cache.set(info);
		this.output(info.md5outputpath, info.content);
	},

	_parse: function(file){
		return {
			webpath: this.getWebPath(file),
			md5webpath: autobuild.config.md5 ? this.getMd5WebPath(file) : this.getWebPath(file),
			outputpath: this.getOutputPath(file),
			md5outputpath: autobuild.config.md5 ? this.getOutputMd5Path(file) : this.getOutputPath(file) ,
			path: file,
			content: autobuild.file.readFileSync(file, 'utf-8')
		};
	},

	getWebPath: function(file){
		file = autobuild.path.relative(autobuild.config.webroot, this.getOutputPath(file));

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

		file = this.getOutputPath(file);
		return autobuild.path.dirname(file) + '/' + autobuild.path.basename(file, autobuild.path.extname(file)) + '_' + md5 + autobuild.path.extname(file);
	},

	getOutputPath: function(file){
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

	output: function(path, content, is_pkg){	
		this.writeFile(path, autobuild.config.compress ? this.compress(content, is_pkg) : content);
	},

	compress: function(content){
		return content;
	},

	outputPkg: function(){
		var self = this;
		var config = (autobuild.config.pkg || {})[self.type] || {};

		autobuild.util.each(config, function(reg, index){
			var files = [];

			autobuild.util.makeArray(reg).forEach(function(v){
				for(var file in self.info){
					if(v.constructor == RegExp && v.test(file) || typeof v == 'string' && file.indexOf(v) > -1){
						files.push(file);
					}
				}

				var content = [], path_array = [];

				autobuild.util.unique(files).forEach(function(file){
					if(!self.info[file]) return;

					var cache = self.getCache(file);

					content.push(cache.get('content', ''));
					path_array.push(cache.get('md5outputpath'));
				});

				if(path_array.length == 0) return;

				content = content.join('\r\n');

				var pkgname = autobuild.config.output + '/pkg/' + self.type + '/' + index + '.' + self.type;
				var md5path = self.getOutputMd5Path(pkgname, autobuild.util.md5(path_array.join('')));
				
				self.output(md5path, content, true);
			});
		});	
	},

	writeFile: function(file, content){
		autobuild.file.mkdirs(autobuild.path.dirname(file));
		autobuild.file.writeFileSync(file, content);
	},

	getCache: function(file){
		return new autobuild.filecache(file, autobuild.config.cachedir);
	}
});