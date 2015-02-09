/**
 * 本地存储API
 * 测试时请使用127.0.0.1或localhost  file://路径将导致Firefox Security Error
 * @author tongyao@baidu.com
 */

if(!Storager){
	var Storager = function(){};
}

if(window.globalStorage){ // Firefox
	Storager = function(){
		this.store = globalStorage[location.host.split(':')[0]];
	};
	
	Storager.prototype = {
		set : function(key, value){
			this.store[key] = value;
			return;
		},
		get : function(key){
			return this.store[key] || '';
		},
		remove : function(key){
			this.store.removeItem(key);
		}		
	};
} else if(window.ActiveXObject){ //Internet Explorer
	Storager = function(key){
		try{
			this.key = key;
			document.documentElement.addBehavior("#default#userdata");
			document.documentElement.load(this.key)
		}catch(ex){}
	};
	
	Storager.prototype = {
		set : function(key, value){
			try{
				document.documentElement.setAttribute(key, value);
				document.documentElement.save(this.key)
			}catch(ex){}
		},
		get : function(key){
			try{
				data = document.documentElement.getAttribute(key);
				if (data) {
					return data;
				}
			}catch(ex){}
		},
		remove : function(key){
			try{
				document.documentElement.removeAttribute(key);
				document.documentElement.save(this.key);
			}catch(ex){}		
		}
	}; 
} else { //其他浏览器(使用Flash)

	var Storager = function(){
		this.swfName = "$_" + new Date().getTime().toString(32); //随机名称
		this.swfFile = STORAGER_FLASH; //Flash地址
		
		var flash = C('div');
		flash.id = this.swfName;
		flash.style.position = 'absolute';
		flash.style.left = '-99999px';
		flash.innerHTML = buildFlash(this.swfName,this.swfFile,1,1,'');
		document.body.appendChild(flash);
	};

	Storager.prototype = {
		set: function(key, value){
			thisMovie(this.swfName).setItem(key, value);
		},
		get: function(key){
			return thisMovie(this.swfName).getItem(key) || '';
		},
		remove: function(key){
			thisMovie(this.swfName).removeItem(key);
		}
	};
}
