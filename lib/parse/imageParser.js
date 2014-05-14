var autobuild = require('../core/autobuild.js');

var ImageParser = module.exports = autobuild.util.inherits({
	extend: require('./commonParser.js')
});

var instance;

module.exports = {
	init: function(files){
		return instance || (instance = new ImageParser(files));
	}
};