/**
 * 获取document中的元素
 * @param {String|Object} dom 元素ID值
 * @return {Object}	DOM元素对象
 * @author zuming@baidu.com
 */
function G(dom) {
    if (typeof dom == "string") {
        return (document.getElementById(dom));
    } else {
        return (dom);
    }
}

/** 
 * 按tagName取得元素数组
 * @param {String|Object} dom 父节点名或对象
 * @param {String} tagname TagName
 * @return {Object} 返回o节点下tagName为n的元素数组
 * @author zuming@baidu.com
 */
function T(dom, tagname) {
    dom = G(dom);
    return (dom.getElementsByTagName(tagname));
}

/**
 * 创建DOM元素
 * @param {Object} tagname	创建元素的TagName
 * @return {Object}		创建的DOM元素
 * @author zuming@baidu.com
 */
function C(tagname) {
    return document.createElement(tagname);
}

/**
 * 创建表单
 * @param {String} action 表单Action
 * @param {String} method 表单Method
 * @param {Object} param 表单参数
 * @param {Object} appendTo append到的DOM节点
 * @return {Object} 创建的表单
 * @author zuming@baidu.com
 */
function Cform(action, method, param, appendTo) {
    var nf = C('form');
    nf.action = action;
    nf.method = method || 'post';
    if (typeof param != 'undefined') {
        for (v in param) {
            Cinput(nf, v, param[v]);
        }
    }
    if (typeof appendTo != 'undefined') {
        appendTo.appendChild(nf);
    } else {
		document.body.appendChild(nf);
	}
    return nf;
}

/**
 * 创建隐藏input
 * @param {Object} form	 input所属form
 * @param {Object} name	input的Name
 * @param {Object} value input的value
 * @author zuming@baidu.com
 */
function Cinput(form, name, value) {
    var ni = C('input');
    ni.name = name;
    ni.type = "hidden";
    ni.value = value;
    form.appendChild(ni);
}

/**
 * 获取DOM元素的属性
 * @param {Object} dom	DOM元素
 * @param {String} name	属性名
 * @return {Object} 属性值
 * @author zuming@baidu.com
 */
function GA(dom, name) {
    return G(dom).getAttribute(name);
}

/**
 * 显示一个元素
 * @param {Object} dom 要隐藏的元素id或者对象
 * @param {Object} display display属性
 * @author tongyao@baidu.com
 */
function show(dom, display) {
    dom = G(dom);
    if (dom) {
		if(display === '' || display == 1){
        	dom.style.display = '';
		} else {
        	dom.style.display = display || "block";
		}
		
    }
}


/**
 * 隐藏一个元素
 * @param {Object} dom 要隐藏的元素id或者对象
 * @author zuming@baidu.com
 */
function hide(dom) {
    dom = G(dom);
    if (dom) {
        dom.style.display = "none";
    }
}

/**
 * 显示一个元素
 * @param {String|Object} e 要隐藏的元素id或者对象
 * @param {Object} d 显示方式，表示对象的display是block属性还是非block属性
 * @author zuming@baidu.com
 */
/* by tongyao
function show(e, d) {
	if (typeof e == "string") {
		e = G(e);
	}
	if (e) {
		if (d != null) {
			e.style.display = "";
		} else {
			e.style.display = "block";
		}
	}
}*/
/**
 * 交替显示/隐藏元素
 * @param {Object} e
 */
function toggle(e){
	e = G(e);
	if(e.style.display == 'none'){
		show(e);
	} else {
		hide(e);
	}
}

/**
 * 判断一个元素是否隐藏
 * @param {Object} dom 需要判断的元素
 * @return {Boolean} true为隐藏
 * @author zuming@baidu.com
 */
function isHide(dom) {
    dom = G(dom);
    if (dom) {
        return (getStyle(dom,'display') == "none");
    }
    return false;
}

/**
 * 获取或者设置一个元素的innerHTML
 * @param {Object} dom 元素
 * @param {String} content innerHTML，为空时表示要获取元素的innerHTML
 * @return {String} 获取的innerHTML
 * @author zuming@baidu.com
 */
function html(dom, content) {
    dom = G(dom);
    if (dom) {
        if (typeof content == 'undefined') {
            return dom.innerHTML;
        } else {
            dom.innerHTML = content;
        }
    }
}

/**
 * 获取某个元素的left，top位置
 * @param {Object} dom 需要判断位置的元素
 * @return {Object} left,top
 * @author dongrui@baidu.com
 */
function getPosition(dom) {
	dom = G(dom);
    var left = dom.offsetLeft;
    var top = dom.offsetTop;
    
    while ((dom = dom.offsetParent)) {
        var tag = dom.tagName;
        if (tag == 'HTML' || tag == 'BODY') {
            break;
        }
        left += (dom.offsetLeft - dom.scrollLeft) || 0;
        top += (dom.offsetTop - dom.scrollTop) || 0;
    }
    return {
        'left': left,
        'top': top
    };
}

/**
 * 遍历DOM使所有的select无效（应该只需要IE6下做），应用于存在Mask层的页面
 * @param {Object} d true/false
 * @author tongyao@baidu.com zuming@baidu.com
 */ 
function selectDisable(d) {
	if (Browser.IE && Browser.IE < 7){
		oSel = T(document, "select");
		for (var i = 0; i < oSel.length; i++) {
			oSel[i].disabled = d;
		}
	}
}

/**
 * 切换Select显示状态
 * @param {Object} display
 */
function toggleSelect(display){
	if (Browser.IE && Browser.IE < 7){
		display = display || '';
		oSel = T(document, "select");
		for (var i = 0; i < oSel.length; i++) {
			if(display){
				show(oSel[i], '');
			} else {
				hide(oSel[i]);
			}
		}
	}
}


/**
 * 链接
 * @param {Object} id
 * @author zuming@baidu.com
 */
function href(url) {
	location.href = url;
}

/**
 * 在新窗口中打开链接
 * @param {Object} url
 * @author zuming@baidu.com
 */
function hrefInNewWindow(url, param) {
	var nf = Cform(url, "GET");	
	nf.target = "_blank";
	
	for (_p in param) {
		var ni = Cinput(nf, _p, param[_p]);
	}
	nf.submit();
	nf = null;
}



/**
 * 显示遮挡层
 * @author lizheng
 * @param {Object} d 指定是否需要使页面中的select无效，ie6下需要，其它无需
 * @param (Object) e 指定遮挡层的id
 * @author zuming@baidu.com
 */
function showMask(d, e, word){
	d = d||0;
	d++;
	//selectDisable(d);
	e = e||'MaskDiv';
	show(e);
	var h = document.documentElement.scrollHeight;
	G(e).style.height = h + "px";
	
	if (typeof word != 'undefined') {
		if (G("MaskTitleDiv")) {
			var wdiv = G("MaskTitleDiv")
		} else {
			var wdiv = C("div");
			wdiv.id = "MaskTitleDiv";
			document.body.appendChild(wdiv);
		}
		wdiv.innerHTML = word;
		wdiv.style.height = '30px';
		wdiv.style.backgroundColor = '#FFF9C8';
		wdiv.style.color = '#000';
		wdiv.style.border = '1px solid #EEE495';
		wdiv.style.padding = '20px';
		wdiv.style.textAlign = 'center';
		wdiv.style.zIndex = '23053';
		wdiv.style.position = 'absolute';
		wdiv.style.width = "945px";
		wdiv.style.marginLeft = "-495px";
		wdiv.className = 'panel';
		wdiv.style.top = document.documentElement.scrollTop + 100 + 'px';
		wdiv.style.left = '50%';
		show(wdiv);
		
		if (!G("MaskFrameForTitle")) {
			var maskFrame = document.createElement("iframe");
			maskFrame.id = "MaskFrameForTitle"
			maskFrame.className = "maskFrame";
			maskFrame.scrolling = "no";
			maskFrame.frameborder = "0";
			document.body.appendChild(maskFrame);
			maskFrame.style.top = G("MaskTitleDiv").offsetTop + 'px';
			maskFrame.style.left = G("MaskTitleDiv").offsetLeft + 'px';
			maskFrame.style.width = G("MaskTitleDiv").offsetWidth + 'px';
			maskFrame.style.height = G("MaskTitleDiv").offsetHeight + 'px';
			show(maskFrame);
		} else {
			var maskFrame = G("MaskFrameForTitle");
			show(maskFrame);
			maskFrame.style.top = G("MaskTitleDiv").offsetTop + 'px';
			maskFrame.style.left = G("MaskTitleDiv").offsetLeft + 'px';
			maskFrame.style.width = G("MaskTitleDiv").offsetWidth + 'px';
			maskFrame.style.height = G("MaskTitleDiv").offsetHeight + 'px';
		}
	}
}

/**
 * 隐藏遮挡层
 * @param {Object} d 指定是否需要使页面中的select有效，ie6下需要，其它无需
 * @author zuming@baidu.com
 */
function hideMask (d, e) {	
	e = e||'MaskDiv';	
	//selectDisable(d);
	hide(e);
	
	if (G("MaskTitleDiv")) {
		hide("MaskTitleDiv");
	}
	
	if (G("MaskFrameForTitle")) {
		hide("MaskFrameForTitle");
	}
}

/**
 * 浮动窗口显示控制
 * @param {Object} id 浮动层的ID
 * @param {boolean} display 是否显示
 * @param {string} oriorkey 创意关键词专用
 * @author zuming@baidu.com
 */
function floatWindowShow(id, display, oriorkey) {
	if (display) {
		show(id);
		window.oldFloatWindowTop = G(id).offsetTop;
		G(id).style.top = G(id).offsetTop + document.documentElement.scrollTop + 'px';
		showMask(null, "MaskDivColor");
		
		if (oriorkey) {
			T(id, "span")[0].innerHTML = oriorkey;
		}
		
		if (!G("MaskFrameForFloat")) {
			var maskFrame = document.createElement("iframe");
			maskFrame.id = "MaskFrameForFloat"
			maskFrame.className = "maskFrame";
			maskFrame.scrolling = "no";
			maskFrame.frameborder = "0";
			document.body.appendChild(maskFrame);		
			maskFrame.style.top = G(id).offsetTop + 'px';
			maskFrame.style.left = G(id).offsetLeft + 'px';
			maskFrame.style.width = G(id).offsetWidth + 'px';
			maskFrame.style.height = G(id).offsetHeight + 'px';
			show(maskFrame);
		} else {			
			var maskFrame = G("MaskFrameForFloat");
			show(maskFrame);
			maskFrame.style.top = G(id).offsetTop + 'px';
			maskFrame.style.left = G(id).offsetLeft + 'px';
			maskFrame.style.width = G(id).offsetWidth + 'px';
			maskFrame.style.height = G(id).offsetHeight + 'px';			
		}		
		
	} else {
		hide(id);
		hideMask(null, "MaskDivColor");
		if(window.oldFloatWindowTop != undefined){
       	 	G(id).style.top = window.oldFloatWindowTop + 'px';
        	oldFloatWindowTop = null;
		}

		if (G("MaskFrameForFloat")) {
			hide("MaskFrameForFloat");
		}
	}
}	
/**
 * 面板关闭按钮样式控制
 * @param {Object} e 
 * @author zuming@baidu.com
 */
function closeBtnClass(e, c) {
	if (c) {
		e.style.backgroundColor = "#D6EDFF"			// 鼠标移动到按钮上时的样式
	} else {
		e.style.backgroundColor = "#FFF";			// 鼠标离开时的样式
	}
}

/**
 * @author tongyao@baidu.com zhengxin@baidu.com 
 * @param {Object} classname
 * @param {Object} el
 */
function getElementsByClassName(classname , el , tagname ){
    var father = el?G(el):document;
	var tagname = tagname || "*";
    var forSelect = father.getElementsByTagName(tagname);
    var els = [];
    for(var i = 0 , l = forSelect.length ; i<l ; i++){
		var classNameArray = forSelect[i].className.split(' '); //支持空格分隔的多个className
		for(var j = 0, len = classNameArray.length; j < len; j++){	
	        if(classNameArray[j] == classname){
	            els.push(forSelect[i]);
	        }
		}
    }
    return els;
}

/**
 * addClassName 增加classname
 * @param {Object} el
 * @param {Object} classname
 */
var addClassName = function(el , classname ){
    el = G(el);
    var oname = el.className || "";
	if(oname){
		 el.className = el.className + " " + classname;
	} else {
		 el.className = classname;
	}
   
};

/**
 * removeClassName 移除classname
 * @param {Object} el
 * @param {Object} classname
 */
var removeClassName = function(el , classname ){
    el = G(el);
	if(!el) return;
    var oname = el.className || "";
    oname = oname.split(" ");
    for(var i=0,l=oname.length ; i<l ; i++ ){
        if( oname[i] == classname ){
            oname[i] = "";
        }
    }
    el.className = oname.join(" ");
};

/**
 * 元素是否有classname
 * @param {Object} el
 * @param {Object} classname
 */
function hasClassName(el , classname){
    el = G(el);
    var oname = el.className || "";
    oname = oname.split(" ");
    for(var i=0,l=oname.length ; i<l ; i++ ){
        if( oname[i] == classname ){
            return true;
        }
    }
    return false;
};

/**
 * 
 * @param {Object} referenceNode
 * @param {Object} newNode
 * @author tongyao@baidu.com
 */
function insertAfter( referenceNode, newNode ){
    referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );
}

/**
 * 获取元素当前属性
 * @param {Object} el
 * @param {Object} property
 */
var getStyle = function( el , property ){
    el = G(el);
    if (window.getComputedStyle) { // W3C DOM method
            property = (property === 'float') ? property = 'cssFloat' : property;

            var value = el.style[property],
                computed;
            
            if (!value) {
                computed = el['ownerDocument']['defaultView']['getComputedStyle'](el, null);
                if (computed) { // test computed before touching for safari
                    value = computed[property];
                }
            }
            
            return value;
    } else if (el['currentStyle']) {
            var value;

            switch(property) {
                case 'opacity' :// IE opacity uses filter
                    value = 100;
                    try { // will error if no DXImageTransform
                        value = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;

                    } catch(e) {
                        try { // make sure its in the document
                            value = el.filters('alpha').opacity;
                        } catch(err) {
                            
                        }
                    }
                    return value / 100;
                case 'float': // fix reserved word
                    property = 'styleFloat'; // fall through
                default: 
                    property = property;
                    value = el['currentStyle'] ? el['currentStyle'][property] : null;
                    return ( el.style[property] || value );
            }
    }

};


