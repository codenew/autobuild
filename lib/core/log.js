var util = require('./util.js'), colors = require('colors');

colors.setTheme({
	notice: 'green',
	warn: 'yellow',
	debug: 'blue',
	error: 'red',
	log: 'white'
});

module.exports = {
	notice: function(content){
		this.log(content, 'NOTICE');
	},
	
	error: function(content){
		this.log(content, 'ERROR');
	},
	
	log: function(content, type){
		console.log(('[' + util.getTime() + '][' + type + ']' + content)[type.toLowerCase()]);
	},
	
	warn: function(content){
		this.log(content, 'WARN');
	}
};
