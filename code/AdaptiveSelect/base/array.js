/**
 * 按照索引删除数组中某个元素
 * @param {Array} arr 需要做操作的数组
 * @param {Number} index 索引
 * @return {Array} 返回删除后的数组
 * @author zuming@baidu.com
 */
function arrayRemoveAt(arr, index) {
    return arr.splice(index, 1);
}

/**
 * 按照值删除数组中某些元素
 * @param {Array} arr 需要做操作的数组
 * @param {Object} value 值，默认为空字符串
 * @return {Boolean} 删除是否成功
 * @author zuming@baidu.com
 */
function arrayRemoveBy(arr, value) {
    value = value || "";
    var tmp = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        if (arr[i] != value) {
            tmp.push(arr[i]);
        }
    }
    return tmp;
}

/**
 * 删除数组中重复的元素
 * @param {Array} arr 需要做操作的数组
 * @return {Array} 删除掉重复的数组
 * @author zuming@baidu.com
 */
function arrayDistinct(arr) {
    var _tmp = [];
    if (arr.length != 0) {
        _tmp[0] = arr[0];
        var _exist = false;
        for (var i = 1, _arrlen = arr.length; i < _arrlen; i++) {
            _exist = false;
            for (var j = 0, _tmplen = _tmp.length; j < _tmplen; j++) {
                if (equal(arr[i], _tmp[j])) {
                    _exist = true;
                    break;
                }
            }
            if (!_exist) {
                _tmp.push(arr[i]);
            }
        }
    }
    return _tmp;
}
/**
 * 判断数组中是否存在一个元素
 * @param {Array} arr 数组
 * @param {Object} 需要查询的元素
 * @return {Number} 位置，-1表示没有
 * @author zuming@baidu.com
 */
function arrayHas(arr, element) {
	for (var i = 0, len = arr.length; i < len; i++) {
		if (equal(arr[i], element)){
			return i;
		}
	}
	return -1;
}