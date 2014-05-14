var util = require('./util.js'), file = require('./file.js');

module.exports = util.inherits({
	initialize: function(file, cache_dir){
		this.file = file;
		this.cache_dir = cache_dir;
		this.cache_header_file = cache_dir.replace(/\/$/, '') + '/' + util.md5(file, 32) + '.h';
		this.cache_content_file = cache_dir.replace(/\/$/, '') + '/' + util.md5(file, 32) + '.c';

		this.init(); 
	},

	init: function(){
		file.mkdirs(this.cache_dir);

		if(!file.existsSync(this.cache_header_file)){
			file.writeFileSync(this.cache_content_file, '');
			this.cache = {};
			this.set({
				lastmodifytime: file.getLastModifyTime(this.file),
				realpath: file
			});
		}else{
			this.cache = JSON.parse(file.readFileSync(this.cache_header_file, 'utf-8'));
		}	
	},

	set: function(name, value){
		if(typeof name == 'object'){
			for(var i in name){
				this.set(i, name[i]);
			}

			return;
		}

		if(name != 'content'){
			this.cache[name] = value;
			file.writeFileSync(this.cache_header_file, JSON.stringify(this.cache));
		}else{
			file.writeFileSync(this.cache_content_file, value);
		}
	},

	get: function(name, _default){
		if(name != 'content'){
			return this.cache[name] || _default;
		}else{
			return file.readFileSync(this.cache_content_file, 'utf-8');
		}
	},

	isUpdate: function(){
		return this.get('lastmodifytime') != file.getLastModifyTime(this.file);
	}
});