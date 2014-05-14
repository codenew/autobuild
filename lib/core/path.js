var path = require('path');

function Path(){};
Path.prototype = path;
Path.prototype.resolve2 = function(from, to){
	if(to.split('://').length > 1){
		return to;
	}

	return path.resolve(from, to);
};
module.exports = new Path;