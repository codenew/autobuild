var autobuild = require('../core/autobuild.js');

module.exports = autobuild.util.inherits({
	initialize: function(options){
		this.options = options;
	},

	compress: function(content, options){
		return content;
	}
});