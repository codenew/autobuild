var autobuild = require('./core/autobuild.js');
var inited = false;

function run(config){
	if(inited) return;
	
	if(!autobuild.file.statSync(config).isFile()){
		return autobuild.log.error(config + ' is not a file! Please check!');
	}else{
		inited = true;
		config = require(config);
		
		
	}
}

module.exports = function(argv){
	run(argv[0]);
};