/**
 * 获取某个子串在字符串中的位置
 * @param {Object} str
 * @param {Object} substr
 * @author zuming@baidu.com
 */
function getSubstrNumber(str, substr) {
	if (str === "" || substr === "") {
		return 0;
	}
	str = '' + str;
	var _tmp = str.split(substr);
	return _tmp.length - 1;
}


/**
 * 删除字符串中的首尾空白字符
 * @param {String} str 需要处理的字符串
 * @return {String} 处理过的字符串
 * @author dongrui@baidu.com
 */
function trim(str) {
	str = '' + str;
    return str.replace(/(^[\s\u3000\xa0]+|[\s\u3000\xa0]+$)/g, '');
};

/**
 * 编码字符串中的html敏感字符
 * @param {String} str 需要处理的字符串
 * @return {String} 处理过的字符串
 * @author zuming@baidu.com
 */
function escapeHTML(str) {
	str = '' + str;
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

/**
 * 反编码字符串中的html敏感字符
 * @param {String} str 需要处理的字符串
 * @return {String} 处理过的字符串
 * @author dongrui@baidu.com
 */
function unescapeHTML(str) {
	str = '' + str;
    return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
};

/**
 * URL Encode编码字符串
 * @param {String} str 需要处理的字符串
 * @return {String} 处理过的字符串
 * @author zuming@baidu.com
 */
function encode(str) {
	str = '' + str;
	return encodeURIComponent(str);
}

/**
 * URL Decode反编码字符串
 * @param {String} str 需要处理的字符串
 * @return {String} 处理过的字符串
 * @author zuming@baidu.com
 */
function decode(str) {
	return decodeURIComponent(str);
}

function escapeQuote(str){
	return str.replace(/'/g, "&#39;").replace(/"/g, '&quot;');
}

function addSlashes(str){
	return str.replace(/'/g,'\\\\\'').replace(/"/g,'\\\\\"');
}

/**
 * 字符串求长度(全角)
 * @param {String} str 需要求长的字符串
 * @return {Number} 长度
 * @author zuming@baidu.com
 */
function getLengthCase(str) {
	var len = str.length;
	str.replace(/[\u0080-\ufff0]/g, function (){len++;})
	return len;	
}

/**
 * 字符串截取部分(全角)
 * @param {String} str 字符串
 * @param {Number} len 截断保留长度
 * @return {String} 截断后的字符串
 * @author zuming@baidu.com
 */
function subStrCase(str, len) {
	while (getLengthCase(str) > len) {
		str = str.substr(0, str.length - 1);
	}
	return str;
}

/**
 * 插入软回车
 * @param {Object} s
 * @author zuming@baidu.com
 */
function insertWbr(s) {
	return String(s).replace(/(?:<[^>]+>)|(?:&[0-9a-z]{2,6};)|(.{1})/g, '$&<wbr>').replace(/><wbr>/g, '>');
}

/**
 * 截取字符串
 * @param {Object} str 字符串
 * @param {Object} len 长度
 * @param {Object} tailStr 尾部添加
 * @author zuming@baidu.com
 */
function getCutString(str, len, tailStr) {
	var tmp = unescapeHTML(str);
	if(typeof tailStr == 'undefined'){
		tailStr = '';
	}
	if (getLengthCase(tmp) > len) {
		if (tmp == str) {
			tmp = subStrCase(tmp,len) + tailStr;	
		} else {
			tmp = escapeHTML(subStrCase(tmp,len)) + tailStr;
		}
		return tmp;
	} else {
		return str;
	}
}

/**
 * 每三位增加逗号
 * @param {Object} str
 */
function addCommas(str){
	str += '';
	x = str.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
