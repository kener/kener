
/**
 * 取得一个对象的类型
 * @param {Object} obj
 * @return {String} 对象类型，array, number, object, number
 * @author tongyao@baidu.com
 */
function getObjectType(obj){
    if (Object.prototype.toString.apply(obj) === '[object Array]') {
        return 'array';
    };
    return (typeof(obj));
}

/**
 * 判断两个对象的值是否一样
 * @param {Object} obj1 比较对象1
 * @param {Object} obj2 比较对象2
 * @return {Boolean} true一样，false不一样
 * @author zuming@baidu.com
 */
function equal(obj1, obj2){
    if (typeof obj1 == typeof obj2) {
        switch (getObjectType(obj1)) {
        case "string":
        case "number":
            return (obj1 == obj2);
        case "array":
            if (obj1.length == obj2.length) {
                for (var i = 0, len = obj1.length; i < len; i++) {
                    if (equal(obj1[i], obj2[i])) {
                        continue;
                    } else {
                        return false;
                    }
                }
                return true;
            } else {
                return false;
            }
        case "object":
            if (getLength(obj1) == getLength(obj2)) {
                for (v in obj1) {
                    if (equal(obj1[v], obj2[v])) {
                        continue;
                    } else {
                        return false;
                    }
                }
                return true;
            } else {
                return false;
            }
        }
    } else {
        return false;
    }
}

/**
 * 获取一个对象的长度，字符串返回字符串长度，数组返回数组长度，对象返回对象属性的数量。
 * @param {Object} obj 需要判断的对象
 * @return {Number} 长度
 * @author zuming@baidu.com
 */
function getLength(obj){
    switch (getObjectType(obj)) {
    case "string":
    case "number":
    case "array":
        return obj.length;
    case "object":
        var _c = 0;
        for (v in obj) {
			if(obj.hasOwnProperty(v)){
            	_c++;
			}
        }
        return _c;
    }
    return 0;
}

/**
 * URL去掉HTTP://头
 * @param {String} url
 * @return {String} url
 * @author zuming@baidu.com
 */
function removeUrlPrefix(url){
    url = url.replace(/：/g, ':').replace(/．/g, '.').replace(/／/g, '/');
    while (trim(url).toLowerCase().indexOf('http://') == 0) {
        url = trim(url.replace(/http:\/\//i, ''));
    }
    return url;
}

/**
 * 动态加载Script
 * @param {Object} url
 * @author tangram tongyao@baidu.com
 */
function loadScript(url, callback){
	var scr = document.createElement("SCRIPT"),
        scriptLoaded = 0;
    
    // IE和opera支持onreadystatechange
    // safari、chrome、opera支持onload
    scr.onload = scr.onreadystatechange = function () {
        // 避免opera下的多次调用
        if (scriptLoaded) {
            return;
        }
        
        var readyState = scr.readyState;
        if ('undefined' == typeof readyState
            || readyState == "loaded"
            || readyState == "complete") {
            scriptLoaded = 1;
            try {
                ('function' == typeof callback) && callback();
            } finally {
                if(scr && scr.parentNode){
                    scr.parentNode.removeChild(scr);
                }
                scr.onload = scr.onreadystatechange = null;
                scr = null;
            }
        }
    };
    
    scr.setAttribute('type', 'text/javascript');
    scr.setAttribute('src', url);
    document.getElementsByTagName("head")[0].appendChild(scr);
}
