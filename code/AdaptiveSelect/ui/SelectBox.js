
/**
 * 下拉框类
 * @param {Object} id
 * @param {Object} onchangeHandle
 * @param {Object} className
 * @author zuming@baidu.com
 */
function SelectBox(id, onchangeHandle, className) {
	this._id = "";
	this._select = null;
	this._class = "";
	this._onChangeHandle = null;
	this.length = 0;
	this._data = [];
	if (id) {
		this.init(id, onchangeHandle, className);
	}
}

SelectBox.prototype = {
	
	/**
	 * 初始化
	 * @param {Object} id
	 * @param {Object} className
	 * @param {Object} handleArray
	 */
	init: function(id, onchangeHandle, className) {
		this._id = id;		
		this._select = G(id);
		this._class = className;
		if ( className ) {
			this._select.className = className;
		}
		if ( onchangeHandle != null ) {
			this._onChangeHandle = onchangeHandle;
			this._select.onkeyup = this._select.onchange = onchangeHandle;
		}
		this.length = this._select.length;
	},
	
	/**
	 * 设置变化时的处理函数
	 * @param {Object} handle
	 * @author zuming@baidu.com
	 */
	setHandle: function(handle) {
		this._onChangeHandle = handle;
		this._select.onkeyup = this._select.onchange = handle;
	},
	
	/**
	 * 填充options
	 * @param {Object} a	数组，格式为[["option1 text", value],["option2 text", value]]
	 */
	fill: function(a) {
		if (a != null) {
			if (this._data.length == 0) {
				this.cls();
				var len = a.length;
				for (var i = 0; i < len; i++) {
					this.add(a[i]);
				}
				this.length = this._select.length;			
			} else {
				if (this._data.join("@@@@####") != a.join("@@@@####")) {
					this.cls();
					var len = a.length;
					for (var i = 0; i < len; i++) {
						this.add(a[i]);
					}
					this.length = this._select.length;
				}
			}
		}
	},
	
	/**
	 * 清除
	 */
	cls: function() {
		while (this._select.firstChild) {
			this._select.removeChild(this._select.lastChild);
		}
	},
	
	/**
	 * 添加一个option
	 * @param {Object} a option内容，格式为[option text, value]
	 */
	add: function(a) {
		if (a.length == undefined || a.length > 0) {
			var newNode = document.createElement("option");
			newNode.value = (typeof a == "object") ? a[1] : a;
			var text = (typeof a == "object") ? a[0] : a;
			var newNodeText = document.createTextNode(text)
			newNode.appendChild(newNodeText);
			this._select.appendChild(newNode);
			this.length = this._select.length;
		}
	},
	
	/**
	 * 删除某个option
	 * @param {Object} type		"index", "text", "value"
	 * @param {Object} value
	 * @author zuming@baidu.com tongyao@baidu.com
	 */
	del: function(type, value) {
		switch(type) {
			case 'index':
				this._select.remove(value);
				break;
			case 'text':
				var len = this._select.length;
				for (var i = 0; i < len; i++) {
					if (this._select.options[i].text == value) {
						break;
					}					
				}
				if (i < len) {
					this._select.remove(i);
				}
				break;
			case 'value':
				var len = this._select.length;
				for (var i = 0; i < len; i++) {
					if (this._select.options[i].value == value) {
						if (i < len) {
							this._select.remove(i);
						}
						break;
					}					
				}
				break;
		}
	},

	/**
	 * 按照type查找元素的位置
	 * @param {Object} type
	 * @param {Object} value
	 * @author tongyao@baidu.com
	 */
	find: function(type, value){
		var index = -1;
		switch(type){
			case "value":
				var len = this._select.length;
				for (var i = 0; i < len; i++) {
					if (this._select.options[i].value == value) {
						index = i;
					}					
				}
				break;
		}
		return index;
	},
	
	/**
	 * 取得当前选择的option的文字
	 */
	getSelectedText: function() {
		if (this._select.selectedIndex != -1) {
			return (this._select.options[this._select.selectedIndex].text);
		} else {
			return "";
		}
	},
	
	/**
	 * 取得当前选中的值
	 */
	getValue: function() {
		return(this._select.value);
	},
	
	/**
	 * 设置当前的select选中某个值
	 * @param {Object} value 值
	 * @param {Object} handleNoRun 是否允许变化处理函数
	 */
	setSelect: function(value, handleNoRun) {
		var len = this._select.options.length;
		for (var i = 0; i < len; i++) {
			if (this._select.options[i].value == value) {		
				this._select.options[i].setAttribute('selected', 'selected');
				this._select.selectedIndex = i;
				break;
			}
		}
		if (typeof(handleNoRun) != 'undefined' && handleNoRun == 'noHandle') {
			
		} else {
			if (this._onChangeHandle != null) {
				this._onChangeHandle();
			}
		}
	},	
	
	/**
	 * 使控件无效
	 */
	disable: function() {
		this._select.disabled = "disabled";
	},
	
	/**
	 * 使控件有效
	 */
	enable: function() {
		this._select.disabled = 0;
	},
	
	/**
	 * 显示控件
	 * @param {Object} block 是否为block
	 */
	show: function(block) {
		if (block) {
			show(this._select);
		} else {
			show(this._select, 1)
		}
	},
	
	/**
	 * 隐藏控件
	 */
	hide: function() {
		hide(this._select);
	}
};