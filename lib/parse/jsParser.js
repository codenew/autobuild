var autobuild = require('../core/autobuild.js');
var JsCompress = require('../compress/jsCompress.js');

var JsParser = module.exports = autobuild.util.inherits({
	extend: require('./commonParser.js'),

	type: 'js',

	initialize: function(){
		this.type = 'js';
		this.__super.initialize.apply(this, arguments);
	},

	compress: function(content){
		return new JsCompress().compress(content);
	}
});

var instance;

module.exports = {
	init: function(files){
		return instance || (instance = new JsParser(files));
	}
};