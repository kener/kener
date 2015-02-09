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
	lockX = 1,
	table,tr,td,div,
    tableContent,
    syHandle,syContent,
	sxHandle,sxContent,
    con = baidu.g('con'),
	mes = baidu.g('mes')
	syTimer = 0,
	sxTimer = 0
	isChanging = false;

/**
 * 横向滚动响应
 */
function sxHandler(){
	if (isChanging){
		return;
	}
	isChanging = true;
	
    var list,
	    sWidth =sxHandle.scrollLeft;

	//定位需要调整的行号
	for (var i = lockX, l = advTableWidthMap.length; i < l; i++) {
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
			list = baidu.dom.q('adv_table_x_' + i,table,'div');
			/*
			for (var j = 0, len = list.length; j < len; j++){
				baidu.dom.hide(list[j].parentNode);
			}
			*/
			list[0].parentNode.style.width = 0;
		}			
		sxContent.style.width = sxContent.offsetWidth - (curChangeIdX - lastChangeIdX) + 'px';			
	}else if (curChangeIdX < lastChangeIdX){
		//恢复以前的宽度
		for (var i = curChangeIdX + 1; i <= lastChangeIdX; i++){				
			list = baidu.dom.q('adv_table_x_' + i,table,'div');
			/*
			for (var j = 0, len = list.length; j < len; j++){
				list[j].style.width = advTableWidthMap[i] + 'px';
				baidu.dom.show(list[j].parentNode);				
			}
			*/
			list[0].parentNode.style.width = advTableWidthMap[i] + 'px';				
		}
		sxContent.style.width = sxContent.offsetWidth + (lastChangeIdX - curChangeIdX) + 'px';
	}
	//调整最后一行宽度
	var d1,d2;
	d1 = new Date();
	list = baidu.dom.q('adv_table_x_' + curChangeIdX, table, 'div');
	//for (var j = 0, len = list.length; j < len; j++){
		list[0].style.width = advTableWidthMap[curChangeIdX] - sWidth + 'px';	
		//baidu.dom.show(list[j].parentNode);	
	//}
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
	while(!tar.getAttribute('idx') && tar.nodeType != 9){
		tar = tar.parentNode;
	}
	newLock = +tar.getAttribute('idx') + 1;
	for (var i = 0; i < newLock; i++){
		baidu.dom.addClass(baidu.dom.q('adv_table_x_' + i, table, 'div')[0], 'currentLock');
	}
	
	if (newLock <= lockX){				
		for (var i = newLock; i < lockX; i++){
			baidu.dom.removeClass(baidu.dom.q('adv_table_x_' + i, table, 'div')[0], 'currentLock');
		}
		lastChangeIdX++;
	}else{
		lastChangeIdX = newLock;
	}			
	lockX = newLock;
	restoreX(lockX, lastChangeIdX);
	sxHandle.scrollLeft = 0;
}

/**
 * 横向表头锁定变换
 * @param {Object} beginIdx
 * @param {Object} endIdx
 */
function restoreX(beginIdx, endIdx){
	var list;
	for (var i = beginIdx; i <= endIdx; i++){				
		list = baidu.dom.q('adv_table_x_' + i,table,'div');
		for (var j = 0, len = list.length; j < len; j++){
			list[j].style.width = advTableWidthMap[i] + 'px';
			baidu.dom.show(list[j].parentNode);
		}				
	}
	sxContent.style.width = table.offsetWidth + 'px';
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
	sxContent.style.borderBottom = '1px solid #fff';
	sxHandle.appendChild(sxContent);
	con.appendChild(sxHandle);
	
	tableContent = document.createElement('div');
	tableContent.className = 'adv_table_content'
	con.appendChild(tableContent);	
	
	table=document.createElement('table');
	table.style.width='100%';
	table.setAttribute('cellspacing',0);
	table.setAttribute('cellpadding',0);	
	
	/**
	 * 表头
	 */
	tr = document.createElement('tr');
	tr.id = 'AdvTableTr_0';
	for (var j = 0; j< 28; j++){
		td = document.createElement('th');
		div = document.createElement('div');
		div.innerHTML = 'Head_' + j;
		if (j >= lockX){
			div.className = 'adv_table_x_' + j;
		}else{
			div.className = 'currentLock adv_table_x_' + j;
		}
		
		div.setAttribute('idx', j);
		td.style.width = '100px';
		td.appendChild(div);
		tr.appendChild(td);
		
		div.onclick = lockXHandler;		
	}	
	table.appendChild(tr);
	
	
	/**
	 * 表体
	 */	
	for (var i = 1; i < 350; i++){
		tr = document.createElement('tr');
		tr.id = 'AdvTableTr_' + i;
		for (var j = 0; j< 28; j++){
			td = document.createElement('td');
			div = document.createElement('div');
			div.id = i +'_' + j;
			div.innerHTML = j +'_' + i;
			div.className = 'adv_table_x_' + j + ' adv_table_y_' + i;
			td.appendChild(div);
			tr.appendChild(td);			
		}		
		table.appendChild(tr);
		
	}	
	
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
		if (hidePoint || advTableHeightMap[i] > tableHeight){
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
	/**
	 * 滚动绑定
	 */
	syHandle.onscroll = function(){
		clearTimeout(syTimer);		
		syTimer = setTimeout(syHandler,50);
	};
	
	sxHandle.onscroll = function(){
		clearTimeout(sxTimer);
		sxTimer = setTimeout(sxHandler,20);
	};
}
init();
