/**
 * 自适应宽度Select：AdaptiveSelect类
 * @param {Number} objSelectBox 被替换的Select对应的SelectBox对象，没有则为ID
 * @param {Number} iMaxRow 下拉对大条数，默认为10；
 * @param {Number} iSelectWidth 选项框宽度，默认为元素自身宽度；
 * @param {Number} iMonitorInterval 监控时间间隔，默认为300ms
 * 
 * @requires SelectBox
 * @version v1.0 实现功能
 * @version v1.1 优化封装，修正下拉条第一次点击无效
 * @version v1.2 修正自身遮挡(动态改变span的positon属性)，默认宽度获取(offsetWidth)，不通过Show导致显示(轮询display)问题，
 * @author linzhifeng@baidu.com
 * @date 2010-05-12
 */
function AdaptiveSelect(objSelectBox, iMaxRow, iSelectWidth, iMonitorInterval){
	//外部必填配置参数
	if (typeof(objSelectBox) == 'string'){				//保存SelectBox对象
		//对SelectBox依赖
		this._originalSBox = new SelectBox(objSelectBox);				
	}
	else{
		this._originalSBox = objSelectBox;					
	}	
	this._originalSelect = this._originalSBox._select;		//保存原生Select对象
	var id = this._originalSBox._id;
	this.awSelectIDBase = 'awSelect' + id; 				//自适应SelectID
	this.awSelectTextIDBase = 'awSelectText' + id; 		//自适应Select显示框ID
	this.awArrowIDBase = 'awArrow' + id; 				//自适应Select显示框下拉箭头ID
	this.awOptGroupIDBase = 'optGroup' + id; 			//下拉列表组ID
	this.awOptIframeIDBase = 'optIframe' + id; 			//下拉列表遮盖层ID
	
	//外部可选配置参数初始化
	this.lineHeight = 15; 								//默认行高,需要同时修改相应的CSS
	this.awMaxHeight = ((typeof(iMaxRow) != 'number' || iMaxRow <= 0) ? 10 : iMaxRow) * this.lineHeight; 					//默认下拉选项最大高度
	this.awWidth = (typeof(iSelectWidth) != 'number' || iSelectWidth <= 0) ? this._originalSelect.offsetWidth : iSelectWidth; 	//选项宽度
	this.awMonitorInterval = (typeof(iMonitorInterval) != 'number' || iMonitorInterval <= 0) ? 300 : iMonitorInterval;	//间隔时间
		
	//私有成员变量
	this._originalSBoxDisplay = 1; 						//保存被替换的SelectBox显示隐藏状态
	this.awSelectDisplay = 0;							//缓存:保存awSelect的显示隐藏状态
	this.awSelectText = ""; 							//缓存:保存awSelect的Text值	
	this.focusLineNum = 0; 								//当前选中的项
	this.tMonitor = 0; 									//轮询Timer控制器
	this.isInside = 0; 									//鼠标是否在控件内
	
	//外观样式
	this.awSelectClass = 'awSelect'; 					//自适应Select样式类名
	this.awSelectHoverClass = 'awSelectHover';			//自适应Select鼠标悬停样式
	this.awSelectTextClass = 'awSelectText'; 			//自适应Select显示框默认样式类名
	this.awSelectTextFocusClass = 'awSelectTextFocus'; 	//自适应Select显示框聚焦样式类名
	this.awArrowClass = 'awArrow' 						//自适应Select下拉箭头样式类名
	this.awArrowHoverClass = 'awArrowHover';			//自适应Select下拉箭头鼠标悬停样式
	this.awOptGroupClass = 'awOptGroup'; 				//下拉列表组样式类名
	this.awOptIframeClass = 'awOptIframe'; 				//下拉列表遮盖层样式类名
	this.awOptSelected = 'awOptSelected'; 				//下拉列表被选中样式类名
	
	
	//接管SelectBox的显示隐藏函数
	this._originalSBox.awSelect = this;
	this._originalSelect.style.visibility = "hidden";
	this._originalSelect.style.display = 'none';	
	this._originalSBox.show = function(){
		this.awSelect._originalSBoxDisplay = 1;		
		this._select.style.display = 'none';
		this._select.style.visibility = "hidden";
		G(this.awSelect.awSelectIDBase).style.display = 'inline';
		this.awSelect.awSelectDisplay = 1;
	}
	this._originalSBox.hide = function(){
		this.awSelect._originalSBoxDisplay = 0;
		this._select.style.display = 'none';
		this._select.style.visibility = "hidden";
		G(this.awSelect.awSelectIDBase).style.display = 'none';	
		this.awSelect.awSelectDisplay = 0;	
	}
	
	this.init();
}

AdaptiveSelect.prototype = {
	//智能函数代理
	smartHandle : function (_that, handleType){
		switch (handleType){
			case 'txClick' :
				return function (){
							_that.clickTextInput(_that)
						}
			case 'kDown' :
				return function (event){
							_that.keydownTextInput(_that, event);
						}
			case 'txBlur' :
				return function (){
							_that.blurTextInput(_that);
						}	
			case 'btnClick' :
				return function (){
							_that.clickButton(_that);
						}	
			case 'txbtnMouseover' :
				return function(){
							_that.mouseOverTextInput(_that);
						}
			case 'txbtnMouseout' :
				return function(){
							_that.mouseOutTextInput(_that);
						}	
			case 'optClick':
				return function (event){
							_that.clickOpt(_that, event);
						}
			case 'optMouseOver':
				return function (event){
							_that.mouseOverOpt(_that, event);
						}
			case 'optMouseOut':
				return function (event){
							_that.mouseOutOpt(_that, event);
						}
			case 'optLinkMouseOver':
				return function (event){
							_that.mouseOverOptLink(_that, event);
						}
			case 'slectTextForbidden':
				return function (){
							//禁止用户选择文本
							return false;
						}
		}
	},
	
	//替换函数
	init : function (){
		var _this = this;
		
		//绘制覆盖层
		var optIframe = C('iframe');
		optIframe.src = '';	
		optIframe.id = _this.awOptIframeIDBase;
		optIframe.className = _this.awOptIframeClass;
		optIframe.style.display = 'none';
		
		//模仿顶部选择框
		var selectArea = C('span'),
		    textInput = C('input'),
			button = C('a');
		
		textInput.id = _this.awSelectTextIDBase;
		textInput.className = _this.awSelectTextClass;
		textInput.type = "text";
		textInput.readOnly = 'true';
		textInput.style.width = _this.awWidth - 18 + "px";					//固定宽度 = 用户设定-输入框外边距-图片宽度-图片外边距
		
		button.id = _this.awArrowIDBase;
		button.className = _this.awArrowClass;		
		button.hideFocus = 'true';
		
		selectArea.id = _this.awSelectIDBase;
		selectArea.className = _this.awSelectClass;
		selectArea.appendChild(textInput);
		selectArea.appendChild(button);
		selectArea.appendChild(optIframe);
				
		_this._originalSelect.parentNode.insertBefore(selectArea, _this._originalSelect);

		//显示框：点击，显示下拉选项
		textInput.onclick = this.smartHandle(this, 'txClick');
		//显示框：键盘输入，上、下、确定
		textInput.onkeydown = this.smartHandle(this, 'kDown');
		//显示框：失去焦点，恢复样式
		textInput.onblur = this.smartHandle(this, 'txBlur');
		//显示框：鼠标移进，改变下拉箭头样式
		textInput.onmouseover = button.onmouseover = this.smartHandle(this, 'txbtnMouseover');
		//显示框：鼠标移出，改变下拉箭头样式
		textInput.onmouseout = button.onmouseout = this.smartHandle(this, 'txbtnMouseout');
		//显示框：禁止用户选择文本
		textInput.onmousedown = textInput.onselectstart = this.smartHandle(this, 'slectTextForbidden');
		//显示框：点击下拉箭头，显示下拉选项
		button.onclick = this.smartHandle(this, 'btnClick');
		
		//监控被替换的select状态
		_this.startMonitor = function (){
			var newText = _this._originalSBox.getSelectedText(),
			    newDisplay = _this._originalSBoxDisplay;
			
			if (_this.awSelectText != newText) {
				G(_this.awSelectTextIDBase).value = newText;
				_this.awSelectText = newText;
			}
			if ((_this.awSelectDisplay != newDisplay)||(_this._originalSelect.style != 'none')){
				G(_this.awSelectIDBase).style.display = ((newDisplay == 1) ? 'inline' : 'none');
				_this.awSelectDisplay = newDisplay;
				_this._originalSelect.style.display='none';
				_this._originalSelect.style.visibility = "hidden";
			}				
			_this._originalSelect.style.display='none';
			_this._originalSelect.style.visibility = "hidden";
			_this.tMonitor = setTimeout(_this.startMonitor, _this.awMonitorInterval);
		}
		//取消监控
		_this.stopMonitor = function (){
			clearTimeout(_this.tMonitor);
		}
				
		_this.startMonitor();
	},
	
	/******显示框行为******/
	//显示框：点击，显示下拉选项
	clickTextInput : function (_that){
		//隐藏则显示，显示则隐藏
		if (G(_that.awOptGroupIDBase) != null){
			_that.hideOptions(_that);
			var mySelectText = G(_that.awSelectTextIDBase);
			mySelectText.className = _that.awSelectTextFocusClass;
			mySelectText.focus();
		}
		else {
			_that.showOptions(_that);
		}
	},
	//显示框：键盘输入，上、下、确定
	keydownTextInput : function (_that, event){		
		var event = event || window.event,
		    keynum = event.which ? event.which : event.keyCode;	
		if (keynum != 40 && keynum != 38) {
			if (keynum == 13) {	//回车											
				_that.hideOptions(_that);
				G(_that.awSelectTextIDBase).className = _that.awSelectTextFocusClass;	
			}
			return;
		}
		
		//改变原生select的值和模拟select的选项的显示
		var optGroup = G(_that.awOptGroupIDBase),
		    linkNum = (optGroup == null ? _that._originalSelect.selectedIndex : _that.focusLineNum),	//定位当前选项
		    mySelectText = G(_that.awSelectTextIDBase),													//模拟的select
		    selectLength = _that._originalSelect.length,												//原生Select的长度
		    optLink;	
		switch (keynum){
			case 40:	//Down
				if (linkNum < selectLength-1) {
					linkNum ++;
					_that.focusLineNum++;
					if (optGroup != null) {
						optLink = optGroup.getElementsByTagName("a");
						optGroup.scrollTop += (((linkNum+1) * _that.lineHeight) > (_that.awMaxHeight+optGroup.scrollTop) ? _that.lineHeight : 0);					
						optLink[linkNum - 1].className = "";
						optLink[linkNum].className = _that.awOptSelected;
					}	
					_that._originalSBox.setSelect(_that._originalSelect.options[linkNum].value);		
					_that.awSelectText = _that._originalSBox.getSelectedText();
					mySelectText.value = _that.awSelectText;											
				}						
				break;
			case 38:	//Up
				if (linkNum > 0) {
					linkNum --;
					_that.focusLineNum--;
					if (optGroup != null) {
						optLink = optGroup.getElementsByTagName("a");
						optGroup.scrollTop -= ((linkNum*_that.lineHeight)<optGroup.scrollTop?_that.lineHeight:0);
						optLink[linkNum + 1].className = "";
						optLink[linkNum].className = _that.awOptSelected;
					}	
					_that._originalSBox.setSelect(_that._originalSelect.options[linkNum].value);		
					_that.awSelectText = _that._originalSBox.getSelectedText();
					mySelectText.value = _that.awSelectText;
				}
				break;
			default:
				return;
		}
	},
	//显示框：失去焦点，隐藏下拉框并恢复样式
	blurTextInput : function (_that) {	
		if (!_that.isInside){
			_that.hideOptions(_that);
			_that.isInside = 0;			
			G(_that.awSelectTextIDBase).className = _that.awSelectTextClass;
		}	
	},
	//显示框：鼠标移进，改变下拉箭头样式
	mouseOverTextInput : function (_that){
		addClassName(_that.awArrowIDBase, _that.awArrowHoverClass);
		_that.isInside = 1;
	},
	//显示框：鼠标移出，改变下拉箭头样式
	mouseOutTextInput : function (_that){
		removeClassName(_that.awArrowIDBase, _that.awArrowHoverClass);
		_that.isInside = 0;
	},
	//显示框：点击下拉箭头，显示下拉选项
	clickButton : function (_that){
		_that.clickTextInput(_that);
		_that.isInside = 1;		//_that.isInside修正textInput.onblur的显示逻辑
	},
	//下拉选项：点击鼠标
	clickOpt : function (_that, event){
		var event = event || window.event;
		try {
			_that._originalSBox.setSelect(_that._originalSelect.options[(event.target || event.srcElement).id].value);
			var tempText = _that._originalSBox.getSelectedText();
			var mySelectText = G(_that.awSelectTextIDBase);
			_that.awSelectText = tempText;
			mySelectText.value = tempText;
			mySelectText.className = _that.awSelectTextFocusClass;
			mySelectText.focus();	
			_that.hideOptions(_that);
			_that.isInside = 0;
		} catch (e) {
		}			
	},
	//下拉选项：鼠标移进，改变样式
	mouseOverOpt : function (_that){
		_that.isInside = 1;
	},
	//下拉选项：鼠标移出，改变样式
	mouseOutOpt : function (_that){
		_that.isInside = 0;
		G(_that.awSelectTextIDBase).focus();
	},
	//下拉选项：鼠标移进，改变样式
	mouseOverOptLink : function (_that, event){
		var event = event || window.event;
		var linkNum = (event.target || event.srcElement).id;
		var optLink = G(_that.awOptGroupIDBase).getElementsByTagName("a");
		var optLength = optLink.length;
		for (var k = 0; k < optLength; k++) {
			optLink[k].className = "";
		}
		optLink[linkNum].className = _that.awOptSelected;
		_that.focusLineNum = linkNum;
	},	
	/******公用方法行为******/
	//显示下拉选项
	showOptions : function (_that){			
		addClassName(_that.awSelectIDBase, _that.awSelectHoverClass);
		//绘制列表层，每次触发是重绘列表以保证异步加载数据后列表的数据一致
		var optLength = _that._originalSelect.options.length,
			optLink,			
			optGroup = C('div');
		optGroup.id = _that.awOptGroupIDBase;		
		optGroup.className = _that.awOptGroupClass;		
		
				
		//绘制下拉项
		for(var j = 0; j < optLength; j++) {
			optLink = C('a');
			optLink.id = j;
			optLink.appendChild(document.createTextNode(_that._originalSelect.options[j].text));
			optLink.onmouseover = _that.smartHandle(_that, 'optLinkMouseOver');		//绑定列表鼠标移动响应
			optGroup.appendChild(optLink);
		}
		optGroup.onclick = _that.smartHandle(_that, 'optClick');					//绑定列表鼠标点击响应
		optGroup.onmouseover = _that.smartHandle(_that, 'optMouseOver');			//绑定鼠标移进
		optGroup.onmouseout = _that.smartHandle(_that, 'optMouseOut');				//绑定鼠标移出		
		optGroup.onmousedown = optGroup.onselectstart = _that.smartHandle(_that, 'slectTextForbidden');		//禁止用户选择文本		
		
		//装载进入
		var selectArea = G(_that.awSelectIDBase),
		    optIframe = G(_that.awOptIframeIDBase);
		optIframe.style.display = 'inline';
		selectArea.appendChild(optGroup);		
		
		//调整显示
		var linkNum = _that._originalSelect.selectedIndex;											//原生Select选项
		optGroup.getElementsByTagName("a")[linkNum].className = _that.awOptSelected;				//高亮显示
		_that.focusLineNum = linkNum;	
		
		//调整焦点		
		var mySelectText = G(_that.awSelectTextIDBase);
		mySelectText.className = _that.awSelectTextClass;
		mySelectText.focus();	
		_that.isInside = 0;	
		
		//调整宽			
		var autoWidth = optGroup.scrollWidth;//自适应宽度：获取div宽度即可
		if (Browser.IE > 0 && Browser.IE < 7) {														//自适应宽度：获取div宽度即可
			_that._originalSelect.style.display = 'block';	
			_that._originalSelect.style.width = 'auto';	
			autoWidth = _that._originalSelect.offsetWidth - 18;
			_that._originalSelect.style.display = 'none';
		}
		
		//调整高
		var autoHeight = optGroup.offsetHeight;														//自适应高度				
		if (autoHeight > _that.awMaxHeight + 2){													//超出指定最高需要调整，上线1px边框
			autoWidth = (autoWidth > (_that.awWidth - 16)  ? autoWidth + 16 : _that.awWidth);		//自适应宽度：如果比指定短用指定宽度
			optGroup.style.width = autoWidth + 1 + 'px';			
			optGroup.style.height = _that.awMaxHeight + 'px';
			optIframe.style.width = autoWidth + 3 + 'px';											//外iframe无边框需要加上div左右各1px边框宽度
			optIframe.style.height = _that.awMaxHeight + 'px';
			optGroup.scrollTop = (linkNum * _that.lineHeight - Math.floor (_that.awMaxHeight / _that.lineHeight / 2) * _that.lineHeight);				
		}
		else{
			autoWidth = (autoWidth > _that.awWidth ? autoWidth : _that.awWidth);					//自适应宽度：如果比指定短用指定宽度
			optGroup.style.width = autoWidth + 1 + 'px';												
			optIframe.style.width = autoWidth + 3 + 'px';
			optIframe.style.height = autoHeight;
		}					
	},
	//隐藏下拉列表
	hideOptions : function (_that){
		removeClassName(_that.awSelectIDBase, _that.awSelectHoverClass);
		var optGroup = G(_that.awOptGroupIDBase);
		if (optGroup != null){
   			optGroup.parentNode.removeChild(optGroup);
			G(_that.awOptIframeIDBase).style.display = 'none';
		}		
	}
}