/**
 * 事件包装类
 * @param {event} event EventArgument
 * @author dongrui@baidu.com
 */
function Event(event) {
    event = event || window.event;
    this.target = event.target || event.srcElement;
    _extend(this, event);
    this.keyCode = event.which ? event.which : event.keyCode;
    this.rightClick = (event.which == 3) || (event.button == 2);
}

/**
 * 为页面元素添加事件监听器
 * @param {HTMLElement} element 页面元素
 * @param {String} eventType 监听的事件类型
 * @param {Function} listener 监听器
 * @author dongrui@baidu.com
 */
function addEvent(element, eventType, listener) {
    if (window.addEventListener) {
        element.addEventListener(eventType, listener, false);
    } else {
        element.attachEvent('on' + eventType, listener);
    }
}

/**
 * Stop Bubble
 * @param {Object} e
 */
function stopBubble(e) {
	var e = e || window.event;
	if (e.stopPropagation) {
		e.stopPropagation();
	}else {
		window.event.cancelBubble = true;
	}
}

/**
 * 终止默认事件
 * @param {Object} e
 */
function stopDefault(e) {
	if (e && e.preventDefault) {
		e.preventDefault();
	} else {
		window.event.returnValue = false;
	}
	return false;
}

/**
 * 为页面元素移除事件监听器
 * @param {HTMLElement} element 页面元素
 * @param {String} eventType 监听的事件类型
 * @param {Function} listener 监听器
 * @author dongrui@baidu.com
 */
function removeEvent(element, eventType, listener) {
    if (window.removeEventListener) {
        element.removeEventListener(eventType, listener, false);
    } else {
        element.detachEvent('on' + eventType, listener);
    }
}


/**
 * 判断键盘输入是否为回车
 * @param {Object} e
 * @param {Object} handle
 * @author zuming@baidu.com
 */ 
function enterKeyPress(e, handle, param) {
	e = e||window.event;
	if (e.keyCode == 13) {
		if (param) 	{
			handle(param);
		} else {
			handle();
		}
		return true;
	} else {
		return false;
	}
}
/**
 * 停止冒泡
 * @param {Object} e
 * @author tongyao@baidu.com
 */
function cancelBubbling(e){
	e = e || window.event;
	e.cancelBubble = true;
	if(e.stopPropagation) e.stopPropagation();
}