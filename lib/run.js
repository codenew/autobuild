var autobuild = require('./core/autobuild.js');

function run(config, options){
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
		config.output = autobuild.path.normalize(config.output).replace(/\/$/, '');
		config.webroot = autobuild.path.normalize(config.webroot || config.output).replace(/\/$/, '');
		config.cachedir = autobuild.path.normalize(config.source + '/../cache');

		config.watch = options.watch;

		autobuild.plugins_config = autobuild.file.existsSync('./plugins/config.js') ? require('./plugins/config.js') : {};

		require('./parse/parse.js').init();
	});
}

module.exports = function(config, options){
	run(config, options);
};