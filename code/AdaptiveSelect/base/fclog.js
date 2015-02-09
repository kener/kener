/**
 * 凤巢日志统计前端请求类
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
 */
function FCLog(param) {
	EcomFELog.call(this, param);
}

FCLog.prototype = new EcomFELog();

//初始化参数param只在第一次声明时传入
var FCLogGeneralAdapter = function(param){
	if (typeof window.FC_GE_LOG == 'undefined') {
		window.FC_GE_LOG = new FCLog({
			url: FC_LOG_URL,
			logObjectName: "FC_GE_LOG",
			baseParam: {
				userid:	USER_ID,
				version_id: 'HEAD'
			}
		});
		if(typeof param == 'object' && param){	//防止param为Null
			for(var item in param){
				window.FC_GE_LOG.baseParam[item] = param[item];
			}
		}
		window.FC_GE_LOG.tmpVariable = {};	//监控逻辑中可能使用的临时变量
	}
	addEvent(document.body,'mousedown',function(e){
		var element= e.target || event.srcElement;
		do{
			var param = GA(element,'FCLogParam') || null;
			if(param != null){
				eval('var param =' + param);
				if(typeof param == 'function'){
					param = param();
				}
				FC_GE_LOG.send(param);
				break;
			}
			element = element.parentNode;
		}while(element.nodeType != 9);	//上溯到HTML对象
	});
};
