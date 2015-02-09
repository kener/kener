/**
 * 数学函数
 * @author tongyao@baidu.com
 */

 /**
 * 输出小数点后为两位的格式化数字
 * @param {Number} d
 * @return {Number}
 * @author zuming@baidu.com
 */
function fixed(d) {
	d = +d;
	return(d.toFixed(2));	
}

/**
 * 四舍五入
 * @param {Object} d
 * @author zuming@baidu.com
 */
function round(d) {
	d = +d;
	return ( Math.round(d) );
}

/**
 * 输出百分比 
 * @param {Object} d
 * @author zuming@baidu.com
 */
function percent(d) {
	return ( fixed(d) + "%");
}

/**
 * 取整
 * @param {Object} d
 * @author tongyao@baidu.com
 */
function ceil(d){
	d = d - 0;
	return Math.ceil(d);
}
