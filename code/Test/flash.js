/**
 * Flash相关函数
 * @author tongyao@baidu.com
 */

/**
 * 构造Flash结构HTML
 * @param {Object} idad
 * @param {Object} swfurl
 * @param {Object} wad
 * @param {Object} had
 * @param {Object} vs
 * @author tongyao@baidu.com
 */
function buildFlash(idad, swfurl, wad, had, vs){
	var str = "<object classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" codebase=\"http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0\" width=\"" + wad + "\" height=\"" + had + "\" id=\"" + idad + "\" align=\"middle\">";
	str += "<param name=\"allowScriptAccess\" value=\"always\">";
	str += "<param name=\"quality\" value=\"high\">";
	str += "<param name=\"wmode\" value=\"opaque\">";
	//str += "<param name=\"wmode\" value=\"transparent\">";
	str += "<param name=\"movie\" value=\"" + swfurl + "\">";
	str += "<param name=\"flashvars\" value=\"" + vs + "\">";
	str += "<embed wmode=\"opaque\" src=\"" + swfurl + "\" flashvars=\"" + vs + "\" quality=\"high\" width=\"" + wad + "\" height=\"" + had + "\" name=\"" + idad + "\" align=\"middle\" allowScriptAccess=\"always\" type=\"application/x-shockwave-flash\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\">";
	str += "</object>";
	return str;
}

/**
 * 创建Flash
 * @param {Object} idad
 * @param {Object} swfurl
 * @param {Object} wad
 * @param {Object} had
 * @param {Object} vs
 * @author tongyao@baidu.com
 */
function createFlash(idad, swfurl, wad, had, vs){
	document.write(buildFlash(idad, swfurl, wad, had, vs));
}



/**
 * Flash读取完毕
 * @author zuming@baidu.com
 */
function flashLoaded() {	
	window.flashLoadedTag = true;
}

/**
 * 获取数据请求
 * @param {Object} obj
 * @author zuming@baidu.com
 */
function getData(obj) {
	if (window.flashLoadedTag) {
		thisMovie(obj).getData();
	} else {
		setTimeout("getData('" + obj + "')", 500);
	}
}

/**
 * Flash显示Loading
 * @param {Object} obj
 * @author tongyao@baidu.com
 */
function startLoad(obj) {
	if (window.flashLoadedTag) {
		thisMovie(obj).startLoad();
	} else {
		setTimeout("startLoad('" + obj + "')", 500);
	}
}

/**
 * 获取Flash
 * @param {String} movieName FlashID
 * @param {Object} 返回flash对象
 * @author tongyao@baidu.com
 */
function thisMovie(movieName) {
	return document.embeds[movieName] || window[movieName] || document[movieName];
}

/**
 * 设置数据
 * @return 返回flash需要的xml数据
 * @author zuming@baidu.com
 */
function setData() {
	return(xmlData);
}

/**
 * 调用Flash方法
 * @param {Object} flashId FlashID
 * @param {Object} flashFun Flash方法
 * @param {Object} funParam 方法所用参数数组，空参时传undefined，仅当callback为空时可为空
 * @param {Object} callback 回调函数，可为空
 */
function invokeFlash(flashId, flashFun, funParam, callback, pollingTime){
	var res,
	    fl = thisMovie(flashId);
		//fl = document[flashId] || window[flashId]
	if (typeof fl != 'undefined'){
		var func = eval('thisMovie("' + flashId + '").' + flashFun);
		if (typeof func == 'function'){
			if (typeof funParam == 'undefined'){
				funParam = [];
			}
			if (typeof callback == 'function'){
				res = func.apply(fl,funParam);
				callback(res);
				
			}else{
				res = func.apply(fl,funParam);
				
			}
			return res;			
		}
	}

	if (typeof pollingTime != 'undefined'){
		pollingTime += 1;
	}else{
		pollingTime = 1;
	}
	
	if (pollingTime < 30){
		setTimeout(function(){
			return function(){
				invokeFlash(flashId, flashFun, funParam, callback, pollingTime);
			}			
		}(flashId, flashFun, funParam, callback, pollingTime), 500);
		return 'polling';
	}else{
		if (typeof callback == 'function'){
			callback(false);			
		}	
		return false;
	}    
}
