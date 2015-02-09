/* Copyright (c) 2010 Baidu, Inc. All Rights Reserved */
/*
* Tangram
* Copyright 2009 Baidu Inc. All rights reserved.
* 
* path: baidu/dom/getPosition.js
* author: --
* version: 1.0.0
* date: 2009/--/--
*/
/*
* Tangram
* Copyright 2009 Baidu Inc. All rights reserved.
* 
* path: baidu/dom/getDocument.js
* author: allstar
* version: 1.1.0
* date: 2009/11/17
*/
/*
* Tangram
* Copyright 2009 Baidu Inc. All rights reserved.
* 
* path: baidu/dom/g.js
* author: allstar, erik
* version: 1.1.0
* date: 2009/11/17
*/
/*
* Tangram
* Copyright 2009 Baidu Inc. All rights reserved.
* 
* path: baidu/dom.js
* author: allstar, erik
* version: 1.1.0
* date: 2009/12/02
*/
/*
* Tangram
* Copyright 2009 Baidu Inc. All rights reserved.
* 
* path: baidu.js
* author: allstar, erik
* version: 1.1.0
* date: 2009/12/2
*/
/**
* 声明baidu包
*/
var baidu = baidu || {
   version : "1-1-0"}; 
/**
* 声明baidu.dom包
*/
baidu.dom = baidu.dom || {
   }; 
/**
* 从文档中获取指定的DOM元素
* 
* @param {string|HTMLElement} id 元素的id或DOM元素
* @return {HTMLElement} DOM元素，如果不存在，返回null，如果参数不合法，直接返回参数
*/
baidu.dom.g = function (id) {
   if ('string' == typeof id || id instanceof String) {
      return document.getElementById(id); 
      }
   else if (id && id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
      return id; 
      }
   return null; 
   }; 
// 声明快捷方法
baidu.g = baidu.G = baidu.dom.g; 
/**
* 获取目标元素所属的document对象
*
* @param {HTMLElement|string} element 目标元素或目标元素的id
* @return {HTMLDocument} element所属的document对象
*/
baidu.dom.getDocument = function (element) {
   element = baidu.dom.g(element); 
   return element.nodeType == 9 ? element : element.ownerDocument || element.document; 
   }; 
/*
* Tangram
* Copyright 2009 Baidu Inc. All rights reserved.
* 
* path: baidu/dom/getStyle.js
* author: allstar
* version: 1.1.0
* date: 2009/11/18
*/
/*
* Tangram
* Copyright 2009 Baidu Inc. All rights reserved.
* 
* path: baidu/dom/_styleFixer.js
* author: allstar
* version: 1.1.0
* date: 2009/11/17
*/
/**
* 提供给setStyle与getStyle使用
*/
baidu.dom._styleFixer = baidu.dom._styleFixer || {
   }; 
/*
* Tangram
* Copyright 2009 Baidu Inc. All rights reserved.
* 
* path: baidu/dom/_styleFilter/filter.js
* author: allstar, erik
* version: 1.1.0
* date: 2009/12/02
*/
/*
* Tangram
* Copyright 2009 Baidu Inc. All rights reserved.
* 
* path: baidu/dom/_styleFilters.js
* author: allstar
* version: 1.1.0
* date: 2009/12/02
*/
/**
* 提供给setStyle与getStyle使用
*/
baidu.dom._styleFilter = baidu.dom._styleFilter || []; 
/**
* 为获取和设置样式的过滤器
* @private
*/
baidu.dom._styleFilter.filter = function (key, value, method) {
   for (var i = 0, filters = baidu.dom._styleFilter, filter; filter = filters[i]; i++) {
      if (filter = filter[method]) {
         value = filter(key, value); 
         }
      }
   return value; 
   }; 
/*
* Tangram
* Copyright 2009 Baidu Inc. All rights reserved.
* 
* path: baidu/string/toCamelCase.js
* author: erik
* version: 1.1.0
* date: 2009/11/30
*/
/*
* Tangram
* Copyright 2009 Baidu Inc. All rights reserved.
* 
* path: baidu/string.js
* author: erik
* version: 1.1.0
* date: 2009/11/15
*/
/**
* 声明baidu.string包
*/
baidu.string = baidu.string || {
   }; 
/**
* 将目标字符串进行驼峰化处理
* 
* @param {string} source 目标字符串
* @return {string} 驼峰化处理后的字符串
*/
baidu.string.toCamelCase = function (source) {
   return String(source).replace(/[-_]\D/g, function (match) { return match.charAt(1).toUpperCase(); });
   }; 
/**
* 获取DOM元素的样式值
* 
* @param {HTMLElement|string} element 目标元素或目标元素的id
* @param {string} key 要获取的样式名
* @return {string} 要获取的样式值
*/
baidu.dom.getStyle = function (element, key) {
   var dom = baidu.dom; 
   element = dom.g(element); 
   key = baidu.string.toCamelCase(key); 
   var value = element.style[key]; 
   if (value) {
      return value; 
      }
   var fixer = dom._styleFixer[key], /* 在IE下，Element没有在文档树上时，没有currentStyle属性 */
   style = element.currentStyle || (baidu.browser.ie ? element.style : getComputedStyle(element, null)); 
   value = 'object' == typeof fixer && fixer.get ? fixer.get(element, style) : style[fixer || key]; 
   /* 检查结果过滤器 */
   if (fixer = dom._styleFilter) {
      value = fixer.filter(key, value, 'get'); 
      }
   return value; 
   }; 
// 声明快捷方法
baidu.getStyle = baidu.dom.getStyle; 
/*
* Tangram
* Copyright 2009 Baidu Inc. All rights reserved.
* 
* path: baidu/browser/ie.js
* author: allstar
* version: 1.1.0
* date: 2009/11/23
*/
/*
* Tangram
* Copyright 2009 Baidu Inc. All rights reserved.
* 
* path: baidu/browser.js
* author: allstar, erik
* version: 1.1.0
* date: 2009/12/02
*/
/**
* 声明baidu.browser包
*/
baidu.browser = baidu.browser || {
   }; 
/**
* 判断是否为ie浏览器
*/
if (/msie (\d+\.\d)/i.test(navigator.userAgent)) { baidu.ie = baidu.browser.ie = parseFloat(RegExp['\x241']);
}
/*
* Tangram
* Copyright 2009 Baidu Inc. All rights reserved.
* 
* path: baidu/browser/opera.js
* author: allstar
* version: 1.1.0
* date: 2009/11/23
*/
/**
* 判断是否为opera浏览器
*/
if (/opera\/(\d+\.\d)/i.test(navigator.userAgent)) { baidu.browser.opera = parseFloat(RegExp['\x241']);
}
/*
* Tangram
* Copyright 2009 Baidu Inc. All rights reserved.
* 
* path: baidu/browser/isWebkit.js
* author: allstar
* version: 1.1.0
* date: 2009/11/23
*/
/**
* 判断是否为isWebkit
*/
baidu.browser.isWebkit = /webkit/i.test(navigator.userAgent); 
/*
* Tangram
* Copyright 2009 Baidu Inc. All rights reserved.
* 
* path: baidu/browser/isGecko.js
* author: allstar
* version: 1.1.0
* date: 2009/11/23
*/
/**
* 判断是否为isGecko
*/
baidu.browser.isGecko = /gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent); 
/*
* Tangram
* Copyright 2009 Baidu Inc. All rights reserved.
* 
* path: baidu/browser/isStrict.js
* author: allstar
* version: 1.1.0
* date: 2009/11/23
*/
/**
* 判断是否为标准模式
*/
baidu.browser.isStrict = document.compatMode == "CSS1Compat"; 
/*
* 获取目标元素元素相对于整个文档左上角的位置
*
* @param {HTMLElement|string} element 目标元素或目标元素的id
* @return {Object} 
* {
* left:xx,//{integer} 页面距离页面左上角的水平偏移量
* top:xx //{integer} 页面距离页面坐上角的垂直偏移量
* }
*/
baidu.dom.getPosition = function (element) {
var doc = baidu.dom.getDocument(element), browser = baidu.browser; 
element = baidu.dom.g(element); 
// Gecko browsers normally use getBoxObjectFor to calculate the position.
// When invoked for an element with an implicit absolute position though it
// can be off by one. Therefor the recursive implementation is used in those
// (relatively rare) cases.
var BUGGY_GECKO_BOX_OBJECT = browser.isGecko > 0 && doc.getBoxObjectFor && baidu.dom.getStyle(element, 'position') == 'absolute' && (element.style.top === '' || element.style.left === ''); 
// NOTE(arv): If element is hidden (display none or disconnected or any the
// ancestors are hidden) we get (0,0) by default but we still do the
// accumulation of scroll position.
var pos = {
"left" : 0, "top" : 0}; 
var viewportElement = (browser.ie && !browser.isStrict) ? doc.body : doc.documentElement; 
if(element == viewportElement) {
// viewport is always at 0,0 as that defined the coordinate system for this
// function - this avoids special case checks in the code below
return pos; 
}
var parent = null; 
var box; 
if(element.getBoundingClientRect) {
// IE and Gecko 1.9+
box = element.getBoundingClientRect(); 
pos.left = Math.floor(box.left) + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft); 
pos.top = Math.floor(box.top) + Math.max(doc.documentElement.scrollTop, doc.body.scrollTop); 
// IE adds the HTML element's border, by default it is medium which is 2px
// IE 6 and 7 quirks mode the border width is overwritable by the following css html { border: 0; }
// IE 7 standards mode, the border is always 2px
// This border/offset is typically represented by the clientLeft and clientTop properties
// However, in IE6 and 7 quirks mode the clientLeft and clientTop properties are not updated when overwriting it via CSS
// Therefore this method will be off by 2px in IE while in quirksmode
pos.left -= doc.documentElement.clientLeft; 
pos.top -= doc.documentElement.clientTop; 
if(browser.ie && !browser.isStrict) {
   pos.left -= 2; 
   pos.top -= 2; 
   }
}
else if (doc.getBoxObjectFor && !BUGGY_GECKO_BOX_OBJECT/* && !goog.style.BUGGY_CAMINO_*/
) {
// gecko
// Gecko ignores the scroll values for ancestors, up to 1.9. See:
// https://bugzilla.mozilla.org/show_bug.cgi?id=328881 and
// https://bugzilla.mozilla.org/show_bug.cgi?id=330619
box = doc.getBoxObjectFor(element); 
var vpBox = doc.getBoxObjectFor(viewportElement); 
pos.left = box.screenX - vpBox.screenX; 
pos.top = box.screenY - vpBox.screenY; 
}
else {
// safari/opera
parent = element; 
do {
   pos.left += parent.offsetLeft; 
   pos.top += parent.offsetTop; 
   // In Safari when hit a position fixed element the rest of the offsets
   // are not correct.
   if (browser.isWebkit > 0 && baidu.dom.getStyle(parent, 'position') == 'fixed') {
      pos.left += doc.body.scrollLeft; 
      pos.top += doc.body.scrollTop; 
      break; 
      }
   parent = parent.offsetParent; 
   }
while (parent && parent != element); 
// opera & (safari absolute) incorrectly account for body offsetTop
if(browser.opera > 0 || (browser.isWebkit > 0 && baidu.dom.getStyle(element, 'position') == 'absolute')) {
   pos.top -= doc.body.offsetTop; 
   }
// accumulate the scroll positions for everything but the body element
parent = element.offsetParent; 
while (parent && parent != doc.body) {
   pos.left -= parent.scrollLeft; 
   // see https://bugs.opera.com/show_bug.cgi?id=249965
   if (!b.opera || parent.tagName != 'TR') {
      pos.top -= parent.scrollTop; 
      }
   parent = parent.offsetParent; 
   }
}
return pos; 
};
/*
* Tangram
* Copyright 2009 Baidu Inc. All rights reserved.
* 
* path: baidu/event/preventDefault.js
* author: erik
* version: 1.1.0
* date: 2009/11/23
*/
/*
* Tangram
* Copyright 2009 Baidu Inc. All rights reserved.
* 
* path: baidu/event.js
* author: erik
* version: 1.1.0
* date: 2009/12/02
*/
/**
* 声明baidu.event包
*/
baidu.event = baidu.event || {
   }; 
/**
* 阻止事件的默认行为
* 
* @param {Event} event 事件对象
*/
baidu.event.preventDefault = function (event) {
if (event.preventDefault) {
  event.preventDefault(); 
  }
else {
  event.returnValue = false; 
  }
};

/**
* 声明baidu.page包
*/
baidu.page = baidu.page || {
   }; 
/**
* 获取横向滚动量
* 
* @return {number} 横向滚动量
*/
baidu.page.getScrollLeft = function () {
   var d = document; 
   return d.documentElement.scrollLeft || d.body.scrollLeft; 
   }; 
/*
* Tangram
* Copyright 2009 Baidu Inc. All rights reserved.
* 
* path: baidu/page/getScrollTop.js
* author: erik
* version: 1.1.0
* date: 2009/11/17
*/
/**
* 获取纵向滚动量
* 
* @return {number} 纵向滚动量
*/
baidu.page.getScrollTop = function () {
   var d = document; 
   return d.documentElement.scrollTop || d.body.scrollTop; 
   }; 

/**
* 声明baidu.browser包
*/
baidu.browser = baidu.browser || {
   }; 
/**
* 判断是否为ie浏览器
*/
if (/msie (\d+\.\d)/i.test(navigator.userAgent)) { baidu.ie = baidu.browser.ie = parseFloat(RegExp['\x241']);
}



baidu.dd = baidu.dd || {} ;

baidu.dd._dragBehavior = function(element){
    var dragBehavior = this;

    dragBehavior.element = element;
    dragBehavior.firstStart = 1;


    dragBehavior.start = function(eventArg, range){
        var element = baidu.G(dragBehavior.element);

        dragBehavior._setCapture(element);
		
		
		var marginTop = element.style.marginTop,
			marginLeft = element.style.marginLeft;
		
		marginLeft = +marginLeft.substr(0,marginLeft.length - 2);
		marginTop = +marginTop.substr(0,marginTop.length - 2);
		
        if(range){
            dragBehavior.range = [];
            var width = element.offsetWidth;
            var height = element.offsetHeight;
            dragBehavior.range[0] = range[0] - marginLeft;          //最小left
            dragBehavior.range[1] = range[2] - width - marginLeft;  //最大left
            dragBehavior.range[2] = range[1] - marginTop;          //最小top
            dragBehavior.range[3] = range[3] - height - marginTop; //最大top
        }else{
            dragBehavior.range = null;
        }
        

        dragBehavior.orgMoveHandler = document.onmousemove;

        dragBehavior.lastMouseX = eventArg.clientX;
        dragBehavior.lastMouseY = eventArg.clientY;


        dragBehavior.epos = baidu.dom.getPosition(element),
			
        dragBehavior.lastEleX = dragBehavior.epos['left'] - marginLeft,
        dragBehavior.lastEleY = dragBehavior.epos['top'] - marginTop,
					
        dragBehavior._timer = 0;
        dragBehavior._date = new Date();

        function addStyle(name, value){
            // FIXME 需要注意IE下面36个style标签的问题
            var ss = document.styleSheets;
            if(!ss || ss.length <= 0){
                // console.log("not found styleSheets, create a new one");
                var e = document.createElement("STYLE");
                e.type = "text/css";
                // 即便文档中没有写HEAD标签, 实际上还是可以取到的
                var head = document.getElementsByTagName("HEAD")[0];
                head.appendChild(e);
            }
            ss = document.styleSheets;
            ss = ss[ss.length - 1];

            // 对于IE和Opera9.5+, DOM元素是支持currentStyle属性的
            // 对于其它的浏览器(非IE), DOM元素是支持getComputedStyle方法, 功能和currentStyle是一样的
            // 对于非IE浏览器, 访问的是document.styleSheets[1].cssRules[1]
            // 对于IE浏览器, 访问的是document.styleSheets[1].rules[1], 但是这个属性返回的内容是不正确的
            // 不包含@imports中申明的样式, 如果需要访问的话, 还得通过document.styleSheets[1].imports
            // 删除样式的时候, IE中是addRule和removeRule, 其它浏览器中是insertRule和deleteRule
          
            if(baidu.ie){
                // console.log("add css rule for ie");
                ss.addRule(name, value);
            }else{
                // console.dir("add css rule for !ie");
                ss.insertRule(name + " { " + value + " }", ss.cssRules.length);
            }
        };

        dragBehavior.onmoveHandler = function(eventArg){
            if(dragBehavior.firstStart){
                dragBehavior.onstart();
                dragBehavior.firstStart = 0;
                dragBehavior.ifr = baidu.G("tangram_drag_ifr");
                if(!dragBehavior.ifr){
                    dragBehavior.ifr = document.createElement("div");
                    var ifr = dragBehavior.ifr;
                    ifr.id = ifr.className = "tangram_drag_ifr";
                    addStyle('#tangram_drag_ifr', 'position: absolute;width: 100%;height: 100%;background: #fff;z-index: 10000;opacity: 0;filter: alpha(opacity=0);-ms-filter: alpha(opacity=0);-moz-user-select: none;-webkit-user-select: none;');
                    ifr.onselectstart = function(){
                        return false;
                    };
                    document.body.appendChild(ifr);
                }
                dragBehavior.ifr.style.display = "block";
                dragBehavior.ifr.style.top = baidu.page.getScrollTop() + "px";
                dragBehavior.ifr.style.left = baidu.page.getScrollLeft() + "px";
            }


            var nowTime = dragBehavior._date.getMilliseconds();

            if(nowTime - dragBehavior._timer < 20){
                return ;    
            }

            var 
                //现在鼠标位置
                cx = eventArg.clientX,
                cy = eventArg.clientY,
                //现在元素应该被移动到
                mx = dragBehavior.lastEleX + (cx - dragBehavior.lastMouseX),
                my = dragBehavior.lastEleY + (cy - dragBehavior.lastMouseY);


            if(dragBehavior.range){
                mx = mx < dragBehavior.range[0] ? dragBehavior.range[0] : (mx > dragBehavior.range[1] ? dragBehavior.range[1] : mx);
                my = my < dragBehavior.range[2] ? dragBehavior.range[2] : (my > dragBehavior.range[3] ? dragBehavior.range[3] : my);
                /*console.log(mx);*/
                /*console.log(my);*/
            }
            /*console.log(dragBehavior.lastEleX + "-" + dragBehavior.lastEleY);*/

            dragBehavior.lastEleX = mx;
            dragBehavior.lastEleY = my;

            //移动元素
            element.style.left = mx + "px";
            element.style.top  = my + "px";
            //保存现在鼠标位置
            dragBehavior.lastMouseX = cx; 
            dragBehavior.lastMouseY = cy; 

            //调用onmove
            dragBehavior.onmove(
                    {
                        "elementX":mx,
                        "elementY":my,
                        "mouseX":cx,
                        "mouseY":cy,
                        "element":dragBehavior.element
                    }
                    );

        };
        document.onmousemove = function(e){
            dragBehavior.onmoveHandler(window.event || e);
        };
    };

    dragBehavior.stop = function(){
        dragBehavior.ifr = baidu.G("tangram_drag_ifr");
        if(dragBehavior.ifr){
            dragBehavior.ifr.style.display = "none";
        }
        dragBehavior.onstop(
                    {
                        "elementX":dragBehavior.lastEleX,
                        "elementY":dragBehavior.lastEleY,
                        "mouseX":dragBehavior.lastMouseX,
                        "mouseY":dragBehavior.lastMouseY,
                        "element":dragBehavior.element
                    }
                );
        document.onmousemove = dragBehavior.orgMoveHandler;
        dragBehavior._releaseCapture(baidu.G(dragBehavior.element));
    };

    dragBehavior.onstart = function() {};
    dragBehavior.onmove = function() {};
    dragBehavior.onstop = function() {};

    dragBehavior._captureElem = null;
    dragBehavior._setCapture = function(element){
        dragBehavior._captureElem = element;
        if(element.setCapture){
            element.setCapture();
        }else{
            // TODO baidu.global
            // TODO chrome还是有问题
            // TODO 非IE浏览器的setCapture和releaseCapture的实现
            if(baidu.isGecko){
                // codes from GWT's DOMImplMozilla.java
                window.addEventListener("mouseout", function(evt){
                    var cap = dragBehavior._captureElem;
                    if(cap && !evt.relatedTarget){
                        if("html" == evt.target.nodeName.toLowerCase()){
                            var muEvent = document.createEvent("MouseEvents");
                            muEvent.initMouseEvent("mouseup", true, true, window, 0, evt.screenX, evt.screenY,
                                    evt.clientX, evt.clientY, evt.ctrlKey, evt.altKey, evt.shiftKey, evt.metaKey,
                                    evt.button, null);
                            cap.dispatchEvent(muEvent);
                        }
                    }
                }, true);


            }
        }
    };

    dragBehavior._releaseCapture = function(element){
        
        dragBehavior._captureElem = null;

        if(element.releaseCapture){
            element.releaseCapture();
        //}else{
            
        }
    };
};

baidu.dd.drag = function(element, eventArg, options){
    var me = baidu.dd.drag;

    me.nowDragging = baidu.G(element);
    
    me.o = new baidu.dd._dragBehavior(me.nowDragging);

    me.o.onstart = options.onstart || function(){};
    me.o.onmove = options.onmove || function(){};
    me.o.onstop = options.onstop || function(){};

    me.o.start(eventArg, options.range);
};
baidu.dd.drag.stop = function(){
    var me = baidu.dd.drag;
    if(typeof me.o != 'undefined'){
        me.o.stop();
    }
};


baidu.dd.dragable = function(element, options){
    var handler =  baidu.G(options.handler) || baidu.G(element);
    baidu.dd.dragable.draging = false;


    options.onbeforestart = options.onbeforestart || function(){};
    options.onstart = options.onafterstart || function(){};
    delete options.onafterstart;


    handler.onmousedown = function(e){
        e = window.event || e;
        if(!baidu.dd.dragable.draging){
            options.onbeforestart();
            baidu.dd.dragable.orgUpHandler = document.onmouseup;
            baidu.dd.drag(element, e, options);
            baidu.dd.dragable.draging = true;
            baidu.event.preventDefault(e);
        }
        return false;
    };

    handler.onselectstart = function(){
        return false;
    }

    document.onmouseup = 
        function(){
            if(baidu.dd.dragable.draging){
                baidu.dd.drag.stop();
                document.onmouseup = baidu.dd.dragable.orgUpHandler;
                baidu.dd.dragable.draging = false;
            }
        };
};