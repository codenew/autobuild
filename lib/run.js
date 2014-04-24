var autobuild = require('./core/autobuild.js');

var inited = false;

function run(config){
	if(inited) return;
	
	inited = true;
	
	config = autobuild.path.resolve(process.cwd(), config);
	
	autobuild.file.stat(config, function(err, stat){
		if(err){
			return autobuild.log.error(config + ' is not exists! Please check!');
		}
		
		if(!stat.isFile()){
			return autobuild.log.error(config + ' is not a file! Please check!');
		}

		config = require(config);

		if(!autobuild.file.existsSync(config.source = autobuild.path.normalize(config.source))){
			return autobuild.log.error('source dir: ' + config.source + ' is not exists! Please check!');
		}

		autobuild.config = config;
		autobuild.config.compile_dir = autobuild.path.dirname(config.source) + '/autobuild_compile';

		config.output = autobuild.path.normalize(config.output).replace(/\/$/, '');
		config.webroot = autobuild.path.normalize(config.webroot || config.output).replace(config.output, config.compile_dir).replace(/\/$/, '');

		autobuild.cache = {files: {}};
		autobuild.plugins_config = autobuild.file.existsSync('./plugins/config.js') ? require('./plugins/config.js') : {};

		require('./preProcess.js').init();
		require('./parse/parse.js').init();

		/*require('./parse/config.js').chain.forEach(function(parse){
			require('./parse/' + parse + '.js').init();
		});*/
	});
}

module.exports = function(argv){
	run(argv[0]);
};