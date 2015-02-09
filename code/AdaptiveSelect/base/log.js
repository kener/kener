/**
 * 日志统计前端请求类
 * @author zuming@baidu.com
 * @version 1.0.0
 */

/**
 * ECOM FE 使用的Log类
 * 使用时创建一个Log类的实例
 * var fclog = new EcomFELog({
 * 		url: "http://www.baidu.com/log/img/1.gif",
 * 		logObjectName: "ecom_fc_log_",
 * 		baseParam: {
 * 			userid: USER_ID,
 * 			module: "venus",
 * 			page: "unitList",
 * 			refer: getRefer	// 值可以为一个函数，在发送请求时动态获取函数返回值
 * 		},
 * 		sendBaseParamTag: false
 * })
 * 
 * @param {Object} param
 * 
 * @author zuming@baidu.com
 */
function EcomFELog(param) {
	if (param) {
		this.url = "" || param.url;
		this.logObjectName = "ecom_fe_log_" || param.logObjectName;
		this.baseParam = null || param.baseParam;
		this.sendBaseParamTag = param.sendBaseParamTag || true;
	} else {
		this.url = "";
		this.logObjectName = "ecom_fe_log_";
		this.baseParam = null;
		this.sendBaseParamTag = true;		
	}
	this.UrlLength = 900;
}

EcomFELog.prototype = {
	
	/**
	 * 发送日志统计请求
	 * @param {Object} param
	 * 
	 * @author zuming@baidu.com
	 */
	send: function(param) {
		var p;
		var url = param.url || this.url;
		var logSessionID = new Date().getTime();
		
		// 基本参数设定
		var baseParam = {};
		
		if (typeof param.sendBaseParamTag == "undefined") {
			// 用户单次请求不带有单独的是否发送基本信息的标示
			if (this.sendBaseParamTag) {
				for (p in this.baseParam) {
					baseParam[p] = (typeof this.baseParam[p] == "function") ? this.baseParam[p]() : this.baseParam[p];
				}
			}
		} else {
			// 如果sendBaseParamTag为true，并且存在baseParam，则认为这次请求需要发送baseParam
			if (param.sendBaseParamTag) {
				for (p in this.baseParam) {
					baseParam[p] = (typeof this.baseParam[p] == "function") ? this.baseParam[p]() : this.baseParam[p];
				}				
			}
		}
		
		// 有没有必备参数
		if (typeof param.mustParam != "undefined") {
			for (p in param.mustParam) {
				baseParam[p] = (typeof param.mustParam[p] == "function") ? param.mustParam[p]() : param.mustParam[p];
			}
		}

		// 其它参数设定
		var otherParam = {};
		for (p in param) {
			if (p != "url" && p != "mustParam") {
				otherParam[p] = (typeof param == "function") ? param[p]() : param[p];
			}
		}

		// 获取URL list
		var urlList = this._getRequestUrl(logSessionID, url, baseParam, otherParam);

		// 发送请求
		for (var i = 0, len = urlList.length; i < len; i++) {
			this._request(logSessionID, i, urlList[i]);
		}
	},
	
	/**
	 * 产生日志请求
	 * @param {String} logSessionID
	 * @param {Number} index
	 * @param {String} url
	 * 
	 * @author zuming@baidu.com
	 */
	_request: function(logSessionID, index, url) {
		// 申明图片，并赋给一个全局对象，这样就不会被浏览器垃圾回收机制回收了
		var n = this.logObjectName + '_' + logSessionID + '_' + index + '_' +  + (new Date()).getTime();
		window[n] = new Image();
		var c = window[n];
		
		// 对Image()对象添加事件监听，以便快速释放对象资源
        c.onload = (c.onerror = function() {
            window[n] = null;
        });
		
		// 产生请求
		c.src = url;
		// 释放变量c，避免产生内存泄漏的可能	
		c = null;  			
	},
	
	/**
	 * 组装URL
	 * @param {String} logSessionID
	 * @param {String} url
	 * @param {Object} baseParam
	 * @param {Object} otherParam
	 * @return {Array} URL 数组
	 * 
	 * @author zuming@baidu.com
	 */
	_getRequestUrl: function(logSessionID, url, baseParam, otherParam) {
		var p;
		var urlList = [];
		
		var baseUrl = [];
		if (baseParam) {
			for (p in baseParam) {
				baseUrl.push(p + "=" + baseParam[p]);
			}
		}
		baseUrl = baseUrl.join("&");
		baseUrl = (baseUrl == "") ? "" : "&" + baseUrl;
		
		var tmpUrl = url + '?_lsid=' + logSessionID + '&_lsix=1' + baseUrl;
		var i = 1;
		for (p in otherParam) {
			if (Object.prototype.toString.apply(otherParam[p]) === '[object Array]') {
				// 是个数组
				var _a = otherParam[p];
				var _tu = [];
				var _ts = tmpUrl.length + p.length + 2;
				for (var j = 0, len = _a.length; j < len; j++) {
					_ts += _a[j].length + 1;
					if (_ts > this.UrlLength) {
						urlList.push(tmpUrl + '&' + p + '=' + _tu.join());
						i++;
						_tu = [];
						_ts = tmpUrl.length + p.length + 2;
						tmpUrl = url + '?_lsid=' + logSessionID + '&_lsix=' + i + baseUrl;
						j--;
					} else {
						_tu.push(_a[j]);
					}
				}
				if (_tu.length > 0) {
					tmpUrl += '&' + p + '=' + _tu.join();
				}
			} else {
				if (tmpUrl.length + p.length > this.UrlLength) {
					urlList.push(tmpUrl);
					i++;
					tmpUrl = url + '?_lsid=' + logSessionID + '&_lsix=' + i + baseUrl;
				}
				tmpUrl += '&' + p + '=' + otherParam[p];
			}
		}
		
		urlList.push(tmpUrl);
		return urlList;
	},
	
	/**
	 * 添加用户页面行为监控
	 * 
	 * @param {Object} el			监控的HTML DOM节点，可以为一个DOM对象或者为DOM对象的ID
	 * @param {Object} eventType	监控的事件类别："click", "mouseover", "mouseout", "keypress", "keyup", "keydown"等
	 * @param {Object} logfn		监控时触发的具体日志请求函数
	 * 
	 * @author zuming@baidu.com
	 */
	addEvent: function(el, eventType, logfn) {
		if (typeof logfn == "undefined") {
			var logfn = this._sendDomEvent;
		}
		if (typeof el == 'string') {
			el = document.getElementById(el);
		}
		if (el) {
			if (window.addEventListener) {
				try {
					el.addEventListener(eventType, logfn, false);
				} catch (ex) {
				}
			} else if (window.attachEvent) {
				try {
					el.attachEvent("on" + eventType, logfn);
				} catch (ex) {
				}
			}
		}
	},
	
	/**
	 * 监控事件触发时，默认的日志请求方法
	 * 只发送最基础的事件信息
	 * 
	 * @param {Object} e 事件
	 * 
	 * @author zuming@baidu.com
	 */
	_sendDomEvent: function(e) {
		e = e || window.event;
		var t = e.srcElement || e.target;
		var param = {};
		param.eventType = e.type;
		param.targetId = t.id;
		param.targetTag = t.tagName;
		
		if (e.type.indexOf("click") != -1 || e.type.indexOf("mouse") != -1) {
			// 鼠标事件
			param.clientX = e.clientX;
			param.clientY = e.clientY;
			param.shiftKey = e.shiftKey;
			param.ctrlKey = e.ctrlKey;
			param.altKey = e.altKey;
		} else if (e.type =="press" || e.type == "keyup" || e.type == "keydown"){
			// 键盘事件
			param.keyCode = e.keyCode;
			param.shiftKey = e.shiftKey;
			param.ctrlKey = e.ctrlKey;
			param.altKey = e.altKey;			
		}
		
		this.send(param);
	}
}
