function to_zero(m) {
	return m<10 ? '0'+ m : m;
};

export default {
	//将一个特定的时间戳格式化
	formate_time_stamp: function (params){
		if(params == 1523882019000 || params == null){
			return '';
		}else{
			var time = new Date(params);
			var y = time.getFullYear();
			var m = time.getMonth()+1;
			var d = time.getDate();
			var h = time.getHours();
			var mm = time.getMinutes();
			var s = time.getSeconds();
			return y+'-'+to_zero(m)+'-'+to_zero(d)+' '+to_zero(h)+':'+to_zero(mm)+':'+to_zero(s);

		}
	},

}
