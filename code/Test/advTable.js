/**
 * @author linzhifeng
 */
var tableHeight = 400,
    advTableHeightMap = [],
	advTableWidthMap = [],
    lastChangeIdX = 1,
	curChangeIdX = 1,
	lastChangeEndIdY = 1,
	lastChangeBeginIdY = 1,
	curChangeIdY = 1,
	lockX = 0,
	table,tr,td,div,div2,
    tableContent,
    syHandle,syContent,
	sxHandle,sxContent,
    con = baidu.g('con'),
	mes = baidu.g('mes')
	syTimer = 0,
	sxTimer = 0
	isChanging = false,
	isDraging = false,
	dragWidthTimer = 0,
	mozUserSelect = 0;

/**
 * 横向滚动响应
 */
function sxHandler(){
	if (isChanging){
		return;
	}
	isChanging = true;
	
    var sWidth =sxHandle.scrollLeft;

	//定位需要调整的行号
	for (var i = lockX + 1, l = advTableWidthMap.length; i < l; i++) {
		if (advTableWidthMap[i] < sWidth) {
			sWidth = sWidth - advTableWidthMap[i];
		}else{
			curChangeIdX = i;
			break;
		}
	}

	//console.log(curChangeIdX, lastChangeIdX);
	if (curChangeIdX > lastChangeIdX){
		//从需要调整的地方开始调整，已经调整的不需要再重绘了
		for (var i = lastChangeIdX; i < curChangeIdX; i++){
			baidu.g('AdvTableTh_' + i).style.width = 0;
		}			
		sxContent.style.width = sxContent.offsetWidth - (curChangeIdX - lastChangeIdX) + 'px';			
	}else if (curChangeIdX < lastChangeIdX){
		//恢复以前的宽度
		for (var i = curChangeIdX + 1; i <= lastChangeIdX; i++){				
			baidu.g('AdvTableTh_' + i).style.width = advTableWidthMap[i] + 'px';				
		}
		sxContent.style.width = sxContent.offsetWidth + (lastChangeIdX - curChangeIdX) + 'px';
	}
	//调整最后一行宽度
	var d1,d2;
	d1 = new Date();
	baidu.g('AdvTableTh_' + curChangeIdX).style.width = advTableWidthMap[curChangeIdX] - sWidth + 'px';
	d2 = new Date();
	mes.innerHTML = d2-d1;
	lastChangeIdX = curChangeIdX;

	//mes.innerHTML = mes.innerHTML +' ' +sxHandle.scrollLeft;
	isChanging = false;
}

/**
 * 纵向滚动响应
 */
function syHandler(){
	if (isChanging){
		return;
	}
	isChanging = true;
		
    var list,
	    sHeight =syHandle.scrollTop;
	
	//定位需要调整的行号
	for (var i = 1, l = advTableHeightMap.length; i < l; i++) {
		if (advTableHeightMap[i] >= sHeight) {
			curChangeIdY = i;
			break;
		}
	}
	//console.log(curChangeIdY +' ' +lastChangeBeginIdY +' ' +lastChangeEndIdY);
	if (curChangeIdY >= lastChangeBeginIdY){
		//先把显示的隐藏
		for (var i = lastChangeBeginIdY; i <= lastChangeEndIdY; i++){
			baidu.dom.hide(baidu.g('AdvTableTr_' + i));
		}
		//后显示
		for (var i = curChangeIdY + 1,len = advTableHeightMap.length; i < len; i++){				
			baidu.dom.show(baidu.g('AdvTableTr_' + i));
			if (advTableHeightMap[i] - advTableHeightMap[curChangeIdY] > tableHeight){	//优化
				lastChangeEndIdY = i;
				break;
			}
		}			
	}else if (curChangeIdY < lastChangeBeginIdY){	
		//先显示	
		for (var i = curChangeIdY,len = advTableHeightMap.length; i < len; i++){
			baidu.dom.show(baidu.g('AdvTableTr_' + i));
			if (advTableHeightMap[i] - advTableHeightMap[curChangeIdY] > tableHeight){
				//后把显示的隐藏
				for (var j = i; j < lastChangeEndIdY; j++){
					baidu.dom.hide(baidu.g('AdvTableTr_' + j));
				}
				lastChangeEndIdY = i;
				break;
			}
		}			
	}
	lastChangeBeginIdY = curChangeIdY;
	syContent.style.height = advTableHeightMap[advTableHeightMap.length-1] + ( lastChangeEndIdY - lastChangeBeginIdY ) + 'px';
	isChanging = false;
}

/**
 * 横向表头锁定
 * @param {Object} event
 */
function lockXHandler(event){
	var event = event || window.event;
		tar = event.target || event.srcElement,
		newLock = 0;
	while(tar.tagName.toUpperCase() != 'TH' && tar.nodeType != 9){
		tar = tar.parentNode;
	}
	if (tar.id){
		newLock = +tar.id.slice(11);				
		if (newLock > lockX){
			//增加样式
			for (var i = 0; i <= newLock; i++){
				baidu.dom.addClass(baidu.g('AdvTableTh_' + i), 'currentLock');
			}
			lastChangeIdX = newLock + 1;
		}else if (newLock < lockX){
			//恢复以前			
			for (var i = newLock + 1; i <= lockX; i++){
				baidu.dom.removeClass(baidu.g('AdvTableTh_' + i), 'currentLock');
			}
			lastChangeIdX++;		
		}		
		restoreX(newLock+1, lastChangeIdX);			
		lockX = newLock;		
		sxHandle.scrollLeft = 0;
	}	
}

/**
 * 横向表头锁定变换
 * @param {Object} beginIdx
 * @param {Object} endIdx
 */
function restoreX(beginIdx, endIdx){
	var list;
	for (var i = beginIdx; i < advTableWidthMap.length; i++){
		baidu.g('AdvTableTh_' + i).style.width = advTableWidthMap[i] + 'px';				
	}
	sxContent.style.width = table.offsetWidth + 'px';
}	


function dragWidthBegin(event){
	var tempTh, pos,
	    event = event || window.event;
		tar = event.target || event.srcElement,
		id = tar.id.slice(13),
		dragDiv = baidu.g('kener');
		
	console.log('down -- ' + id);
	
	tempTh = baidu.g('AdvTableTh_' + id);
	pos = baidu.dom.getPosition(tempTh);
	dragDiv.style.left = pos.left + 'px';
	dragDiv.style.top = pos.top + 'px';
	dragDiv.style.height = tempTh.offsetHeight + 'px';
	dragDiv.style.width = tempTh.offsetWidth + 'px';
	dragDiv.setAttribute('tarId', id);
	baidu.dom.show(dragDiv);
	
	isDraging = true;
	dragWidthTimer = setTimeout(dragWidthMoniter,200);
	
	// 在拖曳过程中页面里的文字会被选中高亮显示，在这里修正
    baidu.on(document.body, "selectstart", unselect);
	// fixed for firefox
    mozUserSelect = document.body.style.MozUserSelect;
    document.body.style.MozUserSelect = "none";
}

function dragWidthEnd(){
	if (isDraging){
		var dragDiv = baidu.g('kener'),
		    id = dragDiv.getAttribute('tarId'),
			tempTh = baidu.g('AdvTableTh_' + id);
		console.log('up -- ' + id);
		
		tempTh.style.width = dragDiv.offsetWidth + 'px';
		baidu.dom.hide(dragDiv);
		clearTimeout(dragWidthTimer);
		isDraging = false;
		document.body.style.MozUserSelect = mozUserSelect;
		baidu.un(document.body, "selectstart", unselect);
	}	
}

function dragWidthMoniter(){
	var mPos = baidu.page.getMousePosition(),
	    dragDiv = baidu.g('kener'),
	    pos = baidu.dom.getPosition(dragDiv),
		id = dragDiv.getAttribute('tarId'),
		tempTh = baidu.g('AdvTableTh_' + id);
		
	dragDiv.style.width = mPos.x - pos.left + 'px';
	tempTh.style.width = mPos.x - pos.left + 'px';
	dragWidthTimer = setTimeout(dragWidthMoniter,200);
}

// 对document.body.onselectstart事件进行监听，避免拖曳时文字被选中
function unselect(e) {
    return baidu.event.preventDefault(e, false);
}
			
init = function(){	
	syHandle = document.createElement('div');
	syHandle.className = 'scroll_y_handle';
	syContent = document.createElement('div');
	syHandle.appendChild(syContent);
	con.appendChild(syHandle);
	
	sxHandle = document.createElement('div');
	sxHandle.className = 'scroll_x_handle';
	sxContent = document.createElement('div');
	sxContent.style.borderBottom = '1px solid #ECECEC';
	sxHandle.appendChild(sxContent);
	con.appendChild(sxHandle);
	
	tableContent = document.createElement('div');
	tableContent.className = 'adv_table_content'
	con.appendChild(tableContent);	
	
	table=document.createElement('table');
	table.style.width='800px';
	table.width = "800";
	table.setAttribute('cellspacing',0);
	table.setAttribute('cellpadding',0);	
	
	/**
	 * 表头
	 */
	thead = document.createElement('thead');
	tr = document.createElement('tr');
	thead.appendChild(tr);
	tr.id = 'AdvTableTr_0';
	for (var j = 0; j< 10; j++){
		td = document.createElement('th');		
		if (j <= lockX){
			td.className = 'currentLock';
		}		
		td.id= 'AdvTableTh_' + j;
		td.style.width = '100px';
		
		div = document.createElement('div');
		div.innerHTML = 'Head_' + j;
		
		div2 = document.createElement('div');
		div2.id = 'AdvTableDrag_' + j;
		div2.className = 'ui_drag_handle';
		div2.innerHTML = '&nbsp';
		div2.onmousedown = dragWidthBegin;
		//div2.onmouseup = dragWidthEnd;
		
		td.appendChild(div2);
		td.appendChild(div);
		tr.appendChild(td);
		
		td.onclick = lockXHandler;		
	}	
	table.appendChild(thead);
	
	
	/**
	 * 表体
	 */	
	tbody = document.createElement('tbody');
	for (var i = 1; i < 50; i++){
		tr = document.createElement('tr');
		tr.id = 'AdvTableTr_' + i;
		for (var j = 0; j< 10; j++){
			td = document.createElement('td');
			
			div = document.createElement('div');
			div.innerHTML = j +'_' + i;
			
			td.appendChild(div);
			tr.appendChild(td);			
		}		
		tbody.appendChild(tr);
		
	}	
	table.appendChild(tbody);
	
	tableContent.appendChild(table);
	
	/**
	 * 初始化高、宽记录
	 */
	var list = table.getElementsByTagName('tr'),
	    hidePoint = false;
	lastChangeBeginIdY = 1;
	advTableHeightMap[0] = list[0].offsetHeight;
	//repain reflow分开处理性能高N(>10)倍
	for (var i = 1, l = list.length; i < l; i++){
		advTableHeightMap[i] = advTableHeightMap[i-1] + list[0].offsetHeight;
		/*
		if (hidePoint || advTableHeightMap[i] > tableHeight){
			baidu.dom.hide(list[i]);
			if (!hidePoint){
				lastChangeEndIdY = i;
			}
			hidePoint = true;
		}
		*/	
	}
	for (var i = 1, l = list.length; i < l; i++){
		if (hidePoint || (advTableHeightMap[i] - advTableHeightMap[lastChangeBeginIdY]) > tableHeight){
			
			baidu.dom.hide(list[i]);
			if (!hidePoint){
				lastChangeEndIdY = i;
			}
			hidePoint = true;
		}
	}
	syContent.style.height = advTableHeightMap[advTableHeightMap.length-1] + ( lastChangeEndIdY - lastChangeBeginIdY ) + 'px';
	list = list[0].getElementsByTagName('th');
	for (var i = 0, l=list.length; i < l; i++){
		advTableWidthMap[i] = list[i].offsetWidth;
	}	
	sxContent.style.width = table.offsetWidth + list.length + 'px';
	//baidu.g('mes').innerHTML = (d2-d1) +' ' + (d3-d2) + ' ' + (d4-d3);
	
	div = document.createElement('div');
	div.id = 'kener';
	div.className = 'kener';
	document.body.appendChild(div);
	/**
	 * 滚动绑定
	 */
	syHandle.onscroll = syHandler
	/*function(){
		clearTimeout(syTimer);		
		syTimer = setTimeout(syHandler,50);
	};
	*/
	sxHandle.onscroll = sxHandler
	/*function(){
		clearTimeout(sxTimer);
		sxTimer = setTimeout(sxHandler,50);
	};
	*/
	baidu.on(document.body,'mouseup',dragWidthEnd);
}
init();
