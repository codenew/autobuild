var autobuild = require('../core/autobuild.js');
var html = require('./htmlParse.js'), js = require('./jsParse.js'), css = require('./cssParse.js');

module.exports = {
	init: function(){
	//	js.init(autobuild.file.getFiles(autobuild.config.compile_dir, 'js'));
		
		css.init(autobuild.file.getFiles(autobuild.config.compile_dir, 'css'));
		

		// autobuild.file.getFiles(autobuild.config.compile_dir, 'html|tpl').forEach(function(file){
		// 	html.init(file);
		// });
	}
};