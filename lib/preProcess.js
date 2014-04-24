var autobuild = require('./core/autobuild.js'), path = require('path');

function cpCache(from, to){
	autobuild.file.readdirSync(from).forEach(function(file){
		var tmp_file = from + '/' + file;

		if(autobuild.file.statSync(tmp_file).isDirectory()){
			autobuild.file.mkdirs(to + '/' + file);
			cpCache(tmp_file, to + '/' + file);
		}else if(autobuild.file.statSync(tmp_file).isFile()){
			autobuild.file.writeFileSync(to + '/' + file, autobuild.file.readFileSync(tmp_file));
		}
	});
}

module.exports = {
	init: function(){
		autobuild.file.mkdirs(autobuild.config.compile_dir);
		cpCache(autobuild.config.source, autobuild.config.compile_dir);
	}
};