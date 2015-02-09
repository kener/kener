/**
 * @author linzhifeng
 */
var tableHeight = 400,
    advTableHeightMap = [],
	advTableWidthMap = [],
    lastChangeIdX = 1,
	curChangeIdX = 1,
	lastChangeIdY = 1,
	curChangeIdY = 1,
	lockX = 1,
	table,tr,td,div,
    tableContent,
    syHandle,syContent,
	sxHandle,sxContent,
    con = baidu.g('con'),
	mes = baidu.g('mes')
	syTimer = 0,
	sxTimer = 0;

function restoreX(beginIdx,endIdx){
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

function sxHandler(){
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
	console.log(curChangeIdX, lastChangeIdX);
	if (curChangeIdX > lastChangeIdX){
		//从需要调整的地方开始调整，已经调整的不需要再弄了
		for (var i = lastChangeIdX; i < curChangeIdX; i++){
			list = baidu.dom.q('adv_table_x_' + i,table,'div');
			for (var j = 0, len = list.length; j < len; j++){
				baidu.dom.hide(list[j].parentNode);
			}
		}			
		sxContent.style.width = sxContent.offsetWidth - (curChangeIdX - lastChangeIdX) + 'px';			
	}else if (curChangeIdX < lastChangeIdX){
		//恢复以前的宽度
		for (var i = curChangeIdX + 1; i <= lastChangeIdX; i++){				
			list = baidu.dom.q('adv_table_x_' + i,table,'div');
			for (var j = 0, len = list.length; j < len; j++){
				list[j].style.width = advTableWidthMap[i] + 'px';
				baidu.dom.show(list[j].parentNode);				
			}				
		}
		sxContent.style.width = sxContent.offsetWidth + (lastChangeIdX - curChangeIdX) + 'px';
	}
	//调整最后一行宽度
	list = baidu.dom.q('adv_table_x_' + curChangeIdX, table, 'div');
	for (var j = 0, len = list.length; j < len; j++){
		list[j].style.width = advTableWidthMap[curChangeIdX] - sWidth + 'px';	
		baidu.dom.show(list[j].parentNode);	
	}
	lastChangeIdX = curChangeIdX;

	mes.innerHTML = mes.innerHTML +' ' +sxHandle.scrollLeft;
}

function syHandler(){	
    var list,
	    sHeight =syHandle.scrollTop,d1,d2,d3;
	
	d1 = new Date();
	//定位需要调整的行号
	for (var i = 1, l = advTableHeightMap.length; i < l; i++) {
		if (advTableHeightMap[i] < sHeight) {
			sHeight = sHeight - advTableHeightMap[i];
		}else{
			curChangeIdY = i;
			break;
		}
	}
	d2 = new Date();
	console.log(curChangeIdY, lastChangeIdY);
	if (curChangeIdY > lastChangeIdY){
		//从需要调整的地方开始调整，已经调整的不需要再弄了
		for (var i = lastChangeIdY; i < curChangeIdY; i++){
			baidu.dom.hide(baidu.g('AdvTableTr_' + i));
		}
		syContent.style.height = syContent.offsetHeight - (curChangeIdY - lastChangeIdY) + 'px';			
	}else if (curChangeIdY < lastChangeIdY){
		//恢复以前的高度
		baidu.dom.hide(table);
		for (var i = curChangeIdY + 1; i <= lastChangeIdY; i++){				
			list = baidu.dom.q('adv_table_y_' + i,table,'div');
			for (var j = 0, len = list.length; j < len; j++){
				list[j].style.height = advTableHeightMap[i] + 'px';
			}
			baidu.dom.show(baidu.g('AdvTableTr_' + i));
		}
		baidu.dom.show(table);
		syContent.style.height = syContent.offsetHeight + (lastChangeIdY - curChangeIdY) + 'px';
	}
	d3 = new Date();
	//调整最后一行高度
	list = baidu.dom.q('adv_table_y_' + curChangeIdY,table,'div');
	for (var j = 0, len = list.length; j < len; j++){
		list[j].style.height = sHeight + 'px';		
	}
	lastChangeIdY = curChangeIdY;
	mes.innerHTML = (d1-0) + ' ' + (d2-d1) + ' ' + (d3-d2) + ' ' + (new Date() -  d3);
	//mes.innerHTML = syHandle.scrollTop;
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
	sxContent.style.borderTop = '1px solid #fff';
	sxHandle.appendChild(sxContent);
	con.appendChild(sxHandle);
	
	tableContent = document.createElement('div');
	tableContent.className = 'adv_table_content'
	con.appendChild(tableContent);	
	
	table=document.createElement('table');
	table.style.width='100%';
	table.setAttribute('cellspacing',0);
	table.setAttribute('cellpadding',0);	
	
	tr = document.createElement('tr');
	tr.id = 'AdvTableTr_0';
	for (var j = 0; j< 28; j++){
		td = document.createElement('th');
		div = document.createElement('div');
		div.innerHTML = 'Head_' + j;
		div.className = 'adv_table_x_' + j;
		div.setAttribute('idx', j);
		td.appendChild(div);
		tr.appendChild(td);
		
		div.onclick = function(event){
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
	}	
	table.appendChild(tr);
		
	for (var i = 1; i < 150; i++){
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
	
	syContent.style.height = table.offsetHeight + 'px';
	sxContent.style.width = table.offsetWidth + 'px';
	
	for (var i = 0; i < lockX; i++){
		baidu.dom.addClass(baidu.dom.q('adv_table_x_' + i, table, 'div')[0], 'currentLock');
	}
	
	var list = table.getElementsByTagName('tr');
	for (var i = 0, l=list.length; i < l; i++){
		advTableHeightMap[i] = list[i].offsetHeight;
		if (list[i].offsetTop > tableHeight){
			baidu.dom.hide(list[i])
		}	
	}
	list = list[0].getElementsByTagName('th');
	for (var i = 0, l=list.length; i < l; i++){
		advTableWidthMap[i] = list[i].offsetWidth;
	}	
	
	
	syHandle.onscroll = function(){
		clearTimeout(syTimer);		
		syTimer = setTimeout(syHandler,30);
	};
	
	sxHandle.onscroll = function(){
		clearTimeout(sxTimer);
		//baidu.g('mes2').innerHTML = baidu.g('mes2').innerHTML + ' ' +sxTimer;
		sxTimer = setTimeout(sxHandler,30);
	};
}
init();
