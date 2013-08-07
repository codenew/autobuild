var autobuild = require('./core/autobuild.js');
var path = require('path');

var inited = false;

function run(config){
	if(inited) return;
	
	inited = true;
	
	config = path.resolve(process.cwd(), config);
	console.log(config);
	
	autobuild.file.stat(config, function(err, stat){
		if(err){
			return autobuild.log.error(config + ' is not exists! Please check!');
		}
		
		if(!stat.isFile()){
			return autobuild.log.error(config + ' is not a file! Please check!');
		}
		
		config = require(config);
		
		
	});
}

module.exports = function(argv){
	run(argv[0]);
};