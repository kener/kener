/**
 * Cookie函数
 * @author tangram tongyao@baidu.com
 */

function getCookie(key) {
	var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)");
    var result = reg.exec(document.cookie);
    if (result) {
        return result[2] || null;
    }
	return null;
}
 