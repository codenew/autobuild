var autobuild = require('../core/autobuild.js');
var image = require('./imageParser.js'), css = require('./cssParser.js'), js = require('./jsParser.js');

var parse = module.exports = {
	init: function(){
		if(autobuild.config.watch){
			setInterval(function(){
				parse.parse();
			}, 4000);
		}else{
			parse.parse();
		}
	},

	parse: function(){
		process.nextTick(function(){
			image.init(autobuild.file.getFiles(autobuild.config.source, 'jpg|jpeg|png|bmp|gif'));

			process.nextTick(function(){
				css.init(autobuild.file.getFiles(autobuild.config.source, 'css'));

				process.nextTick(function(){		
					js.init(autobuild.file.getFiles(autobuild.config.source, 'js'));
				});
			});
		});
	}
};