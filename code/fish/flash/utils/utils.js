/**
 * @class: canvas 框架的工具类
 * @author: ningxiao
 * @version: 1.1
 * @namespace: flash.utils
 */
var flash = {};
var Stage = null;
var fps = 0;
var start_time;
var fpsDate;
flash.socket =null;// io.connect('http://192.168.202.204:8888/handle');
flash.utils = {
    ctx: null,
    canvas: null,
    xmlHttp: null,
    createXMLHttpRequest: function () {
        if (window.ActiveXObject) {
            this.xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        } else if (window.XMLHttpRequest) {
            this.xmlHttp = new XMLHttpRequest();
        }
    },
    createURL: function (url, callback) {
        var type = url.indexOf(".xml") != -1, data;
        this.createXMLHttpRequest();
        this.xmlHttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    if (callback) {
                        if (type) {
                            data = this.responseXML;
                        } else {
                            data = eval('(' + this.responseText + ')');
                        }
                        callback(data);
                    }
                }
            }
        }
        this.xmlHttp.open("GET", url, "true");
        this.xmlHttp.send(null);
    },
    provide: function (str) {  //创建空间
        var spas = str.split('.'), space = window, obj = null;
        for (var i = 0, len = spas.length; i < len; i++) {
            if (space[spas[i]]) {
                space = space[spas[i]];
            } else {
                space = space[spas[i]] = new Object();
            }
        }
    },
    inherits: function (child, parent) { //继承
        child.prototype = new parent();
        child.prototype.constructor = child;
    },
    bind: function (fn, selfObj) { //修改指定函数作用域
        if (fn.bind) {
            return fn.bind(selfObj);
        } else {
            return function () {
                fn.apply(selfObj, arguments);
            };
        }
    },
    isDemo: function (elem) { //判断一个元素是否为deom对象
        return elem.nodeType && elem.nodeType === 1 ? true : false
    },
    queueImg: function (srcs, imgs, fu) { //实现对图片队列加载
        var index = arguments[3] || 0, key, src;
        var loaImg = new Image(), data = srcs[index];
        for (key in data) {
            src = data[key];
        }
        loaImg.onload = function () {
            imgs[key] = loaImg;
            index++;
            if (index != srcs.length) {
                flash.utils.queueImg.call(this, srcs, imgs, fu, index);
            } else {
                fu.call(this);
            }
        };
        loaImg.src = src;
    },
    getImageData: function (imge, x, y, w, h) { //实现对部分元素像素点取得
        if (!this.ctx) {
            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext('2d');
        }
        this.canvas.setAttribute("width", w);
        this.canvas.setAttribute("height", h);
        this.ctx.clearRect(0, 0, parseInt(this.canvas.width), parseInt(this.canvas.height));
        this.ctx.drawImage(imge, x, y, w, h, 0, 0, w, h);
        return this.ctx.getImageData(0, 0, w, h);
    },
    setImageData: function (data, w, h) { //根据像素点生成透明png图片
        var img = new Image();
        if (!this.ctx) {
            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext('2d');
        }
        this.canvas.setAttribute("width", w);
        this.canvas.setAttribute("height", h);
        this.ctx.clearRect(0, 0, parseInt(this.canvas.width), parseInt(this.canvas.height));
        this.ctx.putImageData(data, 0, 0);
        //将图像输出为base64压缩的字符串  默认为image/png
        img.src = this.canvas.toDataURL();
        return img;
    },
    gUid: function () {//产生ID
        return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function (c) {
            var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();
    },
    getType: function (obj) {//取得对象的类型
        return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];
    },
    getPoint: function (obj) {
        var y = obj.offsetTop; //获取该元素对应父容器的上边距
        var x = obj.offsetLeft; //对应父容器的上边距
        //判断是否有父容器，如果存在则累加其边距
        while (obj = obj.offsetParent) {//等效 obj = obj.offsetParent;while (obj != undefined)
            y += obj.offsetTop; //叠加父容器的上边距
            x += obj.offsetLeft; //叠加父容器的左边距
        }
        return {x: x, y: y};
    },
    getLength: function (x0, y0, x1, y1) {
        var xl = x1 - x0;
        var yl = y1 - y0;
        return Math.sqrt(xl * xl + yl * yl);
    },
    fullScreen: function (element) {//设置全屏
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    },
    normal: function (element) {//退出全屏
        if (element.exitFullScreen) {
            element.exitFullScreen();
        } else if (element.mozCancelFullScreen) {
            element.mozCancelFullScreen();
        } else if (element.webkitCancelFullScreen) {
            element.webkitCancelFullScreen();
        }
    },
    checkMobile: function () {//验证是否是移动平台
        var pda_user_agent_list = new Array("2.0 MMP", "240320", "AvantGo", "BlackBerry", "Blazer", "Cellphone", "Danger", "DoCoMo", "Elaine/3.0", "EudoraWeb", "hiptop", "IEMobile", "KYOCERA/WX310K", "LG/U990", "MIDP-2.0", "MMEF20", "MOT-V", "NetFront", "Newt", "Nintendo Wii", "Nitro", "Nokia", "Opera Mini", "Opera Mobi", "Palm", "Playstation Portable", "portalmmm", "Proxinet", "ProxiNet", "SHARP-TQ-GX10", "Small", "SonyEricsson", "Symbian OS", "SymbianOS", "TS21i-10", "UP.Browser", "UP.Link", "Windows CE", "WinWAP", "Androi", "iPhone", "iPod", "iPad", "Windows Phone", "HTC");
        var pda_app_name_list = new Array("Microsoft Pocket Internet Explorer");
        var user_agent = navigator.userAgent.toString();
        for (var i = 0; i < pda_user_agent_list.length; i++) {
            if (user_agent.indexOf(pda_user_agent_list[i]) >= 0) {
                return true;
            }
        }
        var appName = navigator.appName.toString();
        for (var i = 0; i < pda_app_name_list.length; i++) {
            if (user_agent.indexOf(pda_app_name_list[i]) >= 0) {
                return true;
            }
        }
        return false;
    }, bugLog: function (val) {//利用webSocket 在手机上面调试输出日志
        if (flash.socket) {
            //flash.socket.emit('bugLog', val);
        } else {
            console.log(val);
        }
    }
}
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
    setTimeout(callback, 1000 / 60);
};
