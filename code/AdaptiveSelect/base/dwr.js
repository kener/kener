/**
 * DWR错误回调设置
 * @param {Object} batch
 * @param {Object} data
 * @author zuming@baidu.com
 */
function dwrErrorHandler(batch, data) {	
	switch (data.name) {
		case "dwr.engine.invalidHttpMethod":
			//Remoting method must be one of GET or POST
			break;
		case "dwr.engine.batchBegun":
			//Batch already begun
			break;
		case "dwr.engine.batchNotBegun":
			//No batch in progress
			break;
		case "dwr.engine.multipleServlets":
			//Can't batch requests to multiple DWR Servlets.
			break;
		case "dwr.engine.invalidRpcType":
			//RpcType must be one of dwr.engine.XMLHttpRequest or dwr.engine.IFrame or dwr.engine.ScriptTag
			break;
		case "dwr.engine.urlInvalid":			
			href(LOGIN_HREF);
			break;
		case "dwr.engine.timeout":
			if (window.rootTag) {
				href(DWR_TIMEOUT_URL);
			} else {
				href('../'+DWR_TIMEOUT_URL);
			}			
			//Timeout
			break;
	}		
}

/**
 * DWR警告回调设置
 * @param {Object} batch
 * @param {Object} data
 * @author zuming@baidu.com
 */
function dwrWarningHandler(batch, data) {
	switch (data.name) {
		case "dwr.engine.abort":
			//alert("dwr.engine.abort");
			break;
		case "dwr.engine.missingData":
			//No data received from server			
			break;
		case "dwr.engine.oldSafari":
			//Safari GET support disabled. See getahead.org/dwr/server/servlet and allowGetForSafariButMakeForgeryEasier.
			break;		
		case "dwr.engine.invalidMimeType":
			//Invalid content type
			break;
		case "dwr.engine.invalidReply":
			//Invalid reply from server
			break;
		case "dwr.engine.incompleteReply":
			//Incomplete reply from server
			break;
		case "dwr.engine.unexpectedType":
			//nexpected type: " + typeof data + ", attempting default converter.
			break;
	}	
}

var dwrIndexTag = 0;
/**
 * DWR错误处理初始化
 * @param {Object} ifIndex
 * @author zuming@baidu.com
 */
function dwrErrorInit(ifIndex) {
	if (ifIndex != undefined) {
		dwrIndexTag = ifIndex;
	}
	DWREngine.setTimeout(100000);
	DWREngine.setErrorHandler(dwrErrorHandler);
	DWREngine.setWarningHandler(dwrWarningHandler);	
}

/**
 * DWR异常
 */
function dwrErrorReturnNull() {
	if (window.rootTag) {
		href(DWR_SYSTEM_ERROR_URL);
	} else {
		href('../' + DWR_SYSTEM_ERROR_URL);
	}
}

/**
 * DWR回调后判断是否为无权限数据
 * @param {Object} data
 * @author zuming@baidu.com
 */
function rightValidate(data) {
	if (data == 'NOAUTH') {
		if (window.rootTag) {
			href(NOAUTH_URL);
		} else {
			href('../' + NOAUTH_URL);
		}
		return false;
	} else {
		return true;
	}
}