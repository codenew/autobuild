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
	}
};