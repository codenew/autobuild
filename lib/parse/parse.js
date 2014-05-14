var autobuild = require('../core/autobuild.js');
var image = require('./imageParser.js'), css = require('./cssParser.js'), js = require('./jsParser.js');

module.exports = {
	init: function(){
		autobuild.file.clearDirectory(autobuild.config.cachedir);

		var image_parser = image.init(autobuild.file.getFiles(autobuild.config.source, 'jpg|jpeg|png|bmp|gif'));
		var css_parser = css.init(autobuild.file.getFiles(autobuild.config.source, 'css'));		
		var js_parser = js.init(autobuild.file.getFiles(autobuild.config.source, 'js'));

		if(autobuild.config.watch){
			setTimeout(function(){
				image_parser.init(autobuild.file.getFiles(autobuild.config.source, 'jpg|jpeg|png|bmp|gif'));
				css_parser.init(autobuild.file.getFiles(autobuild.config.source, 'css'));
				js_parser.init(autobuild.file.getFiles(autobuild.config.source, 'js'));

				setTimeout(arguments.callee, 1000);
			}, 1000);
		}
	}
};