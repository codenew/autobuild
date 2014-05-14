module.exports = {
	getDate: function(){
		var d = new Date;
		var year = d.getFullYear();
		var month = d.getMonth();
		var date = d.getDate();
		
		return year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date);
	},
	
	getTime: function(){
		var d = new Date;
		var hour = d.getHours();
		var minute = d.getMinutes();
		var second = d.getSeconds();

		return (hour < 10 ? '0' + hour : hour) + ':' + 
		(minute < 10 ? '0' + minute : minute) + ':' +
		(second < 10 ? '0' + second : second);
	},
	
	getDateTime: function(){
		return this.getDate() + ' ' + this.getTime(); 
	},

	md5: function(data, len){
		var hash = require('crypto').createHash('md5');
		hash.update(data);
		return hash.digest('hex').substring(0, len || 10);
	},

	each: function(obj, callback){
		for(var i in obj){
			obj.hasOwnProperty(i) && callback(obj[i], i);
		}
	},

	makeArray: function(arr){
		return arr ? Array.isArray(arr) ? arr : [arr] : [];
	},

	unique: function(arr){
		var obj = {}, uq = [];

		arr.forEach(function(v){
			if(obj[v]) return;

			obj[v] = true; 
			uq.push(v);
		});

		return uq;
	},

	inherits: function(opt){
		var fn = function(){
			this.initialize && this.initialize.apply(this, arguments);
		};
		
		fn.prototype = opt;
		fn.prototype.__proto__ = opt.extend && opt.extend.prototype || {};
		delete opt.extend;
		
		return fn;
	},

	isEmptyObject: function(obj){
		for(var i in obj){
			if(obj.hasOwnProperty(i)) return false;
		}

		return true;
	}
};