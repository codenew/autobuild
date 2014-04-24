var util = require('./util.js');

module.exports = {
	notice: function(content){
		this.log(content, 'NOTICE');
	},
	
	error: function(content){
		this.log(content, 'ERROR');
	},
	
	log: function(content, type){
		console.log('[' + util.getTime() + '][' + type + '] ' + content);
	},
	
	warn: function(content){
		this.log(content, 'WARNING');
	}
};