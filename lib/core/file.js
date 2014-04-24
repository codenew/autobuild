var fs = require('fs'), util = require('./util.js'), path = require('path');

function File(){}

File.prototype = fs;

File.prototype.getContentMd5 = function(filepath){
	return util.md5(fs.readFileSync(filepath));
};

File.prototype.mkdirs = function(dirpath, mode){
	if(this.existsSync(dirpath)) return;

	this.mkdirs(path.dirname(dirpath), mode);
	this.mkdirSync(dirpath, mode);
};

File.prototype.getFiles = function(dirpath, ext){
	var self = this;
	var files = [];

	this.readdirSync(dirpath).forEach(function(file){
		file = dirpath + '/' + file;

		if(self.statSync(file).isDirectory()){
			files.push.apply(files, self.getFiles(file, ext));
		}else if(self.statSync(file).isFile()){
			if(ext){
				ext = new RegExp('.(' + ext + ')', 'g');
				ext.test(path.extname(file)) && files.push(file);
			}else{
				files.push(file);
			}
		}
	});

	return files;
};

module.exports = new File;