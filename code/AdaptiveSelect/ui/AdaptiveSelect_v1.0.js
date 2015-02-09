/**
 * 自适应宽度Select：AdaptiveSelect类
 * @param {Number} objSelectBox 被替换的SelectBox；
 * @param {Number} iMaxRow 下拉对大条数；
 * @param {Number} iSelectWidth 选项框宽度；
 * @param {Number} iMonitorInterval 监控时间间隔
 * 
 * @requires SelectBox
 * @version v1.0 
 * @author linzhifeng@baidu.com
 * @date 2010-04-21
 */
function AdaptiveSelect(objSelectBox, iMaxRow, iSelectWidth, iMonitorInterval){
	//外部必填配置参数
	this._originalSBox = objSelectBox;					//保存SelectBox对象
	this._originalSelect = objSelectBox._select;		//保存原生Select对象
	var id = objSelectBox._id;
	this.awSelectIDBase = 'awSelect' + id; 				//自适应SelectID
	this.awSelectTextIDBase = 'awSelectText' + id; 		//自适应Select显示框ID
	this.awArrowIDBase = 'awArrow' + id; 				//自适应Select显示框下拉箭头ID
	this.awOptGroupIDBase = 'optGroup' + id; 			//下拉列表组ID
	this.awOptIframeIDBase = 'optIframe' + id; 			//下拉列表遮盖层ID
			
	//外部可选配置参数初始化
	this.lineHeight = 15; 								//默认行高,需要同时修改相应的CSS
	this.awMaxHeight = ((typeof(iMaxRow) != 'number' || iMaxRow < 0) ? 10 : iMaxRow) * this.lineHeight; 					//默认下拉选项最大高度
	this.awWidth = (typeof(iSelectWidth) != 'number' || iSelectWidth < 0) ? (objSelectBox._select.style.width).slice(0,-2)-0 : iSelectWidth; 	//选项宽度
	this.awMonitorInterval = (typeof(iMonitorInterval) != 'number' || iMonitorInterval < 0) ? 300 : iMonitorInterval;	//间隔时间

	//私有成员变量
	this._originalSBoxDisplay = 1; 						//保存被替换的SelectBox显示隐藏状态
	this.awSelectDisplay = 0;							//缓存:保存awSelect的显示隐藏状态
	this.awSelectText = ""; 							//缓存:保存awSelect的Text值	
	this.focusLineNum = 0; 								//当前选中的项
	this.tMonitor = 0; 									//轮询Timer控制器
	this.isInside = 0; 									//鼠标是否在控件内
	
	//外观样式
	this.awSelectClass = 'awSelect'; 					//自适应Select样式类名
	this.awSelectTextClass = 'awSelectText'; 			//自适应Select显示框默认样式类名
	this.awSelectTextFocusClass = 'awSelectTextFocus'; 	//自适应Select显示框聚焦样式类名
	this.awArrowClass = 'awArrow' 						//自适应Select下拉箭头样式类名
	this.awOptGroupClass = 'awOptGroup'; 				//下拉列表组样式类名
	this.awOptIframeClass = 'awOptIframe'; 				//下拉列表遮盖层样式类名
	this.awOptSelected = 'awOptSelected'; 				//下拉列表被选中样式类名
	
	
	//接管SelectBox的显示隐藏函数
	objSelectBox.awSelect = this;
	objSelectBox._select.style.display = 'none';		//IE6中当同时设置visibility和display时visibility优先
	objSelectBox._select.style.visibility = "hidden";
	objSelectBox.show = function(){
		this.awSelect._originalSBoxDisplay = 1;
		this._select.style.display = 'none';
		this._select.style.visibility = "hidden";
	}
	objSelectBox.hide = function(){
		this.awSelect._originalSBoxDisplay = 0;
		this._select.style.display = 'none';
		this._select.style.visibility = "hidden";
	}
	
	this.init();
}
AdaptiveSelect.prototype = {	
	//替换函数
	init : function (){
		var _this = this;
		//绘制覆盖层
		var optIframe = C('iframe');
		optIframe.src = '';	
		optIframe.id = this.awOptIframeIDBase;
		optIframe.className = this.awOptIframeClass;
		
		//模仿顶部选择框
		var selectArea = C('span');	
		var textInput = C('input');
		var button = C('a');
		
		textInput.id = this.awSelectTextIDBase;
		textInput.className = this.awSelectTextClass;
		textInput.type = "text";
		textInput.readOnly = 'true';
		textInput.style.width = this.awWidth - 18 + "px";					//固定宽度 = 用户设定-输入框外边距-图片宽度-图片外边距
		
		button.id = this.awArrowIDBase;
		button.className = this.awArrowClass;		
		button.hideFocus = 'true';
		
		selectArea.id = this.awSelectIDBase;
		selectArea.className = this.awSelectClass;
		selectArea.appendChild(textInput);
		selectArea.appendChild(button);
		selectArea.appendChild(optIframe);
		optIframe.style.display = 'none';			
		this._originalSelect.parentNode.insertBefore(selectArea, this._originalSelect);

		//选项：点击，显示下拉选项
		textInput.onclick = function(){			
			//隐藏则显示，显示则隐藏
			if (G(_this.awOptGroupIDBase) != null){
				_this.hideOptions();
				var mySelectText = G(_this.awSelectTextIDBase);
				mySelectText.className = _this.awSelectTextFocusClass;
				mySelectText.focus();
			}
			else {
				_this.showOptions();
			}
		};
		
		//选项：键盘输入，上下
		textInput.onkeydown = function(event)
		{		
			var event = event || window.event;
			var keynum = event.which ? event.which : event.keyCode;	
			if (keynum != 40 && keynum != 38) {
				if (keynum == 13) {	//回车											
					_this.hideOptions();
					G(_this.awSelectTextIDBase).className = _this.awSelectTextFocusClass;	
				}
				return;
			}
			//改变原生select的值和模拟select的选项的显示
			var optGroup = G(_this.awOptGroupIDBase);
			var linkNum = (optGroup == null?_this._originalSelect.selectedIndex:_this.focusLineNum);	//定位当前选项
			var mySelectText = G(_this.awSelectTextIDBase);												//模拟的select
			var selectLength = _this._originalSelect.length;											//原生Select的长度
			var optLink;	
			switch (keynum){
				case 40:	//Down
					if (linkNum < selectLength-1) {
						linkNum ++;
						_this.focusLineNum++;
						if (optGroup != null) {
							optLink = optGroup.getElementsByTagName("a");
							optGroup.scrollTop += (((linkNum+1) * _this.lineHeight) > (_this.awMaxHeight+optGroup.scrollTop) ? _this.lineHeight : 0);					
							optLink[linkNum - 1].className = "";
							optLink[linkNum].className = _this.awOptSelected;
						}	
						_this._originalSBox.setSelect(_this._originalSelect.options[linkNum].value);		
						_this.awSelectText = _this._originalSBox.getSelectedText();
						mySelectText.value = _this.awSelectText;											
					}						
					break;
				case 38:	//Up
					if (linkNum > 0) {
						linkNum --;
						_this.focusLineNum--;
						if (optGroup != null) {
							optLink = optGroup.getElementsByTagName("a");
							optGroup.scrollTop -= ((linkNum*_this.lineHeight)<optGroup.scrollTop?_this.lineHeight:0);
							optLink[linkNum + 1].className = "";
							optLink[linkNum].className = _this.awOptSelected;
						}	
						_this._originalSBox.setSelect(_this._originalSelect.options[linkNum].value);		
						_this.awSelectText = _this._originalSBox.getSelectedText();
						mySelectText.value = _this.awSelectText;
					}
					break;
				default:
					return;
			}
		};
		
		//选项：失去焦点，恢复样式
		textInput.onblur = function() {	
			G(_this.awSelectTextIDBase).className = _this.awSelectTextClass;
			if (!_this.isInside){
				_this.hideOptions();
				_this.isInside = 0;
			}
		};
		//选项：禁止文本选择
		textInput.onmousedown = textInput.onselectstart = function() {
			return false;
		}
		//下拉箭头：点击，显示下拉选项，_this.isInside修正textInput.onblur的显示逻辑
		button.onclick = function () {
			textInput.onclick();
			_this.isInside = 1;
		};
		
		//选项：鼠标移进，改变样式; 下拉箭头：鼠标移进，改变样式
		textInput.onmouseover = button.onmouseover = function() {
			addClassName(_this.awArrowIDBase, 'awArrowHover');
			_this.isInside = 1;
		};
		
		//选项：鼠标移出，改变样式; 下拉箭头：鼠标移出，改变样式
		textInput.onmouseout = button.onmouseout = function() {
			removeClassName(_this.awArrowIDBase, 'awArrowHover');
			_this.isInside = 0;
		};			
		
		//下拉列表：显示
		this.showOptions = function () {			
			//绘制列表层，每次触发是重绘列表以保证异步加载数据后列表的数据一致			
			var optGroup = C('div');
			optGroup.id = _this.awOptGroupIDBase;		
			optGroup.className = _this.awOptGroupClass;
			//选项Group：移动鼠标，改变样式
			optGroup.onmouseover = function(){
				_this.isInside = 1;
			};
			//选项Group：移出鼠标，改变位置状态位
			optGroup.onmouseout = function(){
				_this.isInside = 0;
				 G(_this.awSelectTextIDBase).focus();			
			};
			
			var optLength = _this._originalSelect.options.length;
			var optLink;
			//禁止用户选择文本
			this.slectTextForbidden = function(){
				return false;
			}
			//选项Link：点击鼠标
			this.onOptClick = function(event){
				var event = event || window.event;
				_this._originalSBox.setSelect(_this._originalSelect.options[(event.target || event.srcElement).id].value);
				var tempText = _this._originalSBox.getSelectedText();
				var mySelectText = G(_this.awSelectTextIDBase);
				_this.awSelectText = tempText;
				mySelectText.value = tempText;
				mySelectText.className = _this.awSelectTextFocusClass;
				mySelectText.focus();	
				_this.hideOptions();		
			};
			//选项Link：移动鼠标，改变样式
			this.onOptLinkMouseOver = function(event){
				var event = event || window.event;
				var linkNum = (event.target || event.srcElement).id;
				var optLink = G(_this.awOptGroupIDBase).getElementsByTagName("a");
				var optLength = optLink.length;
				for (var k = 0; k < optLength; k++) {
					optLink[k].className = "";
				}
				optLink[linkNum].className = _this.awOptSelected;
				_this.focusLineNum = linkNum;
				_this.isInside = 1;
			};
			
			//绘制下拉项
			for(var j = 0; j < optLength; j++) {
				optLink = C('a');
				optLink.id = j;
				optLink.appendChild(document.createTextNode(_this._originalSelect.options[j].text));
				optGroup.appendChild(optLink);
	
				optLink.onclick = this.onOptClick;					//绑定列表鼠标点击响应
				optLink.onmouseover = this.onOptLinkMouseOver;		//绑定列表鼠标移动响应
				//禁止用户选择文本
				optLink.onmousedown = this.slectTextForbidden;
				optLink.onselectstart = this.slectTextForbidden;
			}				
			
			//装载进入
			var selectArea = G(_this.awSelectIDBase);
			optIframe.style.display = 'inline';
			selectArea.appendChild(optGroup);
			
			
			//调整显示
			var linkNum = _this._originalSelect.selectedIndex;											//原生Select选项
			optGroup.getElementsByTagName("a")[linkNum].className = _this.awOptSelected;				//高亮显示
			_this.focusLineNum = linkNum;	
			
			//调整焦点		
			var mySelectText = G(_this.awSelectTextIDBase);
			mySelectText.className = _this.awSelectTextClass;
			mySelectText.focus();	
			_this.isInside = 0;	
			
			//调整宽高			
			var autoWidth = optGroup.offsetWidth;
			if (Browser.IE > 0 && Browser.IE < 8) {														//自适应宽度：获取div宽度即可
				_this._originalSelect.style.display = 'block';	
				_this._originalSelect.style.width = 'auto';	
				autoWidth = _this._originalSelect.offsetWidth - 18;
				_this._originalSelect.style.display = 'none';
			}
		
			var autoHeight = optGroup.offsetHeight;														//自适应高度				
			if (autoHeight > _this.awMaxHeight + 2){													//超出指定最高需要调整，上线1px边框
				autoWidth = (autoWidth > (_this.awWidth - 16)  ? autoWidth + 16 : _this.awWidth);		//自适应宽度：如果比指定短用指定宽度
				optGroup.style.width = autoWidth + 1 + 'px';			
				optGroup.style.height = _this.awMaxHeight + 'px';
				optIframe.style.width = autoWidth + 3 + 'px';											//外iframe无边框需要加上div左右各1px边框宽度
				optIframe.style.height = _this.awMaxHeight + 'px';
				optGroup.scrollTop = (linkNum * _this.lineHeight - Math.floor (_this.awMaxHeight / _this.lineHeight / 2) * _this.lineHeight);				
			}
			else{
				autoWidth = (autoWidth > _this.awWidth ? autoWidth : _this.awWidth);					//自适应宽度：如果比指定短用指定宽度
				optGroup.style.width = autoWidth + 1 + 'px';												
				optIframe.style.width = autoWidth + 3 + 'px';
				optIframe.style.height = autoHeight;
			}			
		};
		
		//下拉列表：隐藏
		this.hideOptions = function(){
			var optGroup = G(_this.awOptGroupIDBase);
			if (optGroup != null){
	   			optGroup.parentNode.removeChild(optGroup);
				G(_this.awOptIframeIDBase).style.display = 'none';
			}		
		};
		
		//监控被替换的select状态
		this.startMonitor = function(){
			var newText = "";
			var newDisplay = 0;				
			newText = _this._originalSBox.getSelectedText();
			newDisplay = _this._originalSBoxDisplay;
			_this._originalSelect.style.visibility = "hidden";	//IE6中当同时设置visibility和display时visibility优先
			if (_this.awSelectText != newText) {
				G(_this.awSelectTextIDBase).value = newText;
				_this.awSelectText = newText;
			}
			if (_this.awSelectDisplay != newDisplay){
				G(_this.awSelectIDBase).style.display = ((newDisplay == 1) ? 'inline' : 'none');
				_this.awSelectDisplay = newDisplay;
			}				
			_this.tMonitor = setTimeout(_this.startMonitor, _this.awMonitorInterval);
		}
		//取消监控
		this.stopMonitor = function (){
			clearTimeout(_this.tMonitor);
		}
				
		this.startMonitor();
	}
}