/**
 * Baidu UE JavaScript Library
 * 
 * browser.js
 * @author UTer
 * @version $Revision: 1.1 $
 */
 

/**
 * 浏览器信息
 * 
 * <pre>
 * 当浏览器为safari的时候，Safari属性为引擎版本信息，非浏览器版本信息
 * 如safari3.0.4下，显示Safari属性值为523
 * </pre>
 */
var Browser = {
/**
     * IE版本信息
     * @public
     */
    IE: 0,


/**
	 * 是否IE6
	 */
	isIE6: false,    
/**
     * Firefox版本信息
     * @public
     * @owner Browser
     */
    Firefox: 0,
    
/**
     * Opera版本信息
     * @public
     * @owner Browser
     */
    Opera: 0,
    
/**
     * Safari版本信息
     * @public
     * @owner Browser
     */
    Safari: 0
};

(function () {
    var version = navigator.userAgent.match(/(IE|Firefox|Opera|Safari)[ \/](\d+(\.\d+)?)/i);
if (version && version.length) {
        Browser[version[1]] = parseInt(version[version.length - 2], 10);
    }
	
	if(Browser['IE'] > 0 && Browser['IE'] < 7){
		Browser['isIE6'] = true;
	}
})();