var autobuild = require('../core/autobuild.js');
var CommonParse = require('./commonParse.js');

function JsParse(files){
	CommonParse.call(this, files);
}

autobuild.util.inherits(JsParse, CommonParse);

var instance;

module.exports = {
	init: function(files){
		return instance || (instance = new JsParse(files));
	}
};