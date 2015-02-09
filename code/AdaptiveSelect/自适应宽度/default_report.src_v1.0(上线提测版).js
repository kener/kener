/**
 * 常规报告JavaScript文件
 * @author zuming@baidu.com
 */


/**
 * 常规报告UI组件发生变化时的处理函数
 */
var ReportUIChange = {
	
	/**
	 * 选择统计范围Select变化时的处理函数
	 * @author zuming@baidu.com tongyao@baidu.com
	 */	
	accountRangeChange: function() {
        // 判断当前账户范围类型
		
		ReportUISet.promoMethod.show();
		ReportUISet.methodInfoSet();
		
		ReportUISet.promoMethod.setValue("0");
        switch (accTypeSelect.getValue()) {
        case '0':
			if (singleUser) {
				ReportUISet.reportType.display([2], [3, 4, 5, 6, 7, 8, 9, 10]);
			} else {
				ReportUISet.reportType.display([2, 3], [4, 5, 6, 7, 8, 9, 10]);
			}
			IS_PURE_FENGCHAO = false;
            break;
        case '2':
			if (singleUser) {
				ReportUISet.reportType.display([3, 5, 6, 7, 8, 9, 10], [2, 4]);
			} else {
				ReportUISet.reportType.display([2, 3, 5, 6, 7, 8, 9, 10], [4]);
			}
			IS_PURE_FENGCHAO = true;
            break;
        }

		ReportUISet.reportType.set();
	},

	/**
	 * 推广方式发生改变时的处理方式
	 * @author zuming@baidu.com tongyao@baidu.com
	 */
	promoMethodChange: function() {
		ReportUISet.methodInfoSet();
		var promoMethodValue = promoMethodSelect.getValue();
		var accType = accTypeSelect.getValue();
	
		if(accType == "2"){
			if(G("Rr1").checked){
				ReportUISet.reportUnit.setOptions(reportUnitList[+accTypeSelect.getValue()]);	//因关键词选项有可能已被删除，因此重建统计对象范围列表	
			}
			
			if (promoMethodValue == "2") { //网盟推广
				if(reportUnitSelect.getValue() == "6"){	//如果已经选择关键词报告 
					reportUnitSelect.setSelect("5",true);//强制设定为推广单元报告并执行handle函数
				}
				if(reportUnitSelect.find('value','6') != -1){	//此处要加判断，不然IE6在选项不存在时会报错
					try {
						reportUnitSelect.del('value', "6"); // 删除关键词报告选项 ie6下偶尔有未知错误
					} catch(e){}
				}
			}
		
			if (singleUser) {
				if(promoMethodValue == "2"){	//网盟推广
					ReportUISet.reportType.display([3, 6, 7, 8, 9], [2, 4, 5, 10]);	
				} else {
					ReportUISet.reportType.display([3, 5, 6, 7, 8, 9, 10], [2, 4]);
				}
			} else {
				if(promoMethodValue == "2"){	//网盟推广
					ReportUISet.reportType.display([2, 3, 6, 7, 8, 9], [4, 5, 10]);	
				} else {
					ReportUISet.reportType.display([2, 3, 5, 6, 7, 8, 9, 10], [4]);
				}
			}
		}
	},
	
	/**
	 * 时间范围响应函数
	 * @author tongyao@baidu.com
	 */
	timeChange: function() {
		var threshold = stringToDate(SF_DETACH_DATE);
		var startDate = datePicker._ds._date;
		if(startDate <= threshold){	//选择日期跨越2009/12/01
			IS_BEFORE_DETACH = true;
			accTypeSelect.show();
			accTypeSelect.setSelect(accTypeSelect.getValue());
			show('AccountTypeLabel','inline');
			hide('AccountTypeSpan');
		} else {
			IS_BEFORE_DETACH = false;
			accTypeSelect.setSelect(2);
			accTypeSelect.hide();
			hide('AccountTypeLabel');
			show('AccountTypeSpan');
		}
	},
	
	/**
	 * 报告类型改变时
	 */
	reportTypeChange: function(e) {
		
		try {
			var e = window.event || arguments[0],
				target = e.target || e.srcElement;
		} catch (ex) {}
		
		
		ReportUISet.methodInfoSet();
		//记录分日报告多选框的状态以便恢复
		//对搜索词报告进行处理
		//注意，label的for会两次触发该事件。
		if (G("Rr10").checked && (target ? (target.tagName != "LABEL") : true) && (lastReportType != "Rr10")) {
			//记录上次复选框状态
			ReportUISet.daySensitive.lastStatus = G("DailyReport").checked;
			//禁用分日复选框
			ReportUISet.daySensitive.setValue(true);
			ReportUISet.daySensitive.setDisabled(true);
		} else if (lastReportType == "Rr10"){
			//根据记录的状态读取分日复选框
			ReportUISet.daySensitive.setValue(ReportUISet.daySensitive.lastStatus);
			ReportUISet.daySensitive.setDisabled(false);
		}
		//获取目前被选中的报告的id，并一致化
		//当用户刷新页面或点击页面其他区域导致该方法被调用时target可能为空
		if (target && target.tagName == "INPUT") {
			if (lastReportType != target.id) {
				lastReportType = target.id;
				ReportUISet.reportType.set();
			}
		}
	},
	
	/**
	 * 统计单位变化时
	 */
	reportUnitChange: function() {
		ReportUISet.reportRange.display();
		ReportUISet.methodInfoSet();
		switch (+accTypeSelect.getValue()) {
		case 0:
			ReportUISet.reportRange.setAllAccount();
			break;
		case 1:
			ReportUISet.reportRange.setClaAccount();
			break;
		case 2:
			ReportUISet.reportRange.setProAccount();
			break;
		}
	},
	
	/**
	 * 统计范围发生改变时
	 */
	reportRangeChange: {
		allAccChange: function() {
			buildReportTip();
		},
		
		claAccChange: function() {
			if (reportUnitSelect.getValue() == reportUnitList[1][0][1]) {
				buildReportTip();
			} else {
				MaterialClass.setSelect(4, rs1.getValue());
			}
		},
		
		proAccChange: function() {
			if (reportUnitSelect.getValue() == reportUnitList[2][0][1]) {
				buildReportTip();
			} else {
				MaterialClass.setSelect(3, rs1.getValue());
			}
		},
		
		planChange: function() {
			if (reportUnitSelect.getValue() <= reportUnitList[2][1][1]) {
				buildReportTip();
			} else {
				MaterialClass.setSelect(5, rs2.getValue());
			}
		},
		
		unitChange: function() {
			buildReportTip();
		},
		
		groupChange: function() {
			buildReportTip();
		},
		
		wordChange: function() {
			ReportUISet.methodInfoSet();
			buildReportTip();
		}
	},
	
	daySensitiveChange: function() {
		
	}
}

/**
 * 对报告控件进行控制
 */
var ReportUISet = {
	
	/**
	 * 选择统计范围设定
	 * @param {Object} value
	 */
	accountRange: {
		setValue: function(value) {
			accTypeSelect.setSelect(value);
		}
	},
	
	/**
	 * 推广方式控制
	 */
	promoMethod: {
		show: function() {
			show("PromoMethod", 1)
		},
		
		hide: function() {
			hide("PromoMethod");
		},
		setValue: function(value) {
			promoMethodSelect.setSelect(value);
		}
	},
	
	time: {
		setValue: function(value) {
			
		}
	},
	
	reportType: {
		
		set: function() {
			if (G("Rr1").checked) {					
				ReportUISet.reportRange.show();
				ReportUISet.reportUnit.setOptions(reportUnitList[+accTypeSelect.getValue()]);
				if (accTypeSelect.getValue() == "2" && promoMethodSelect.getValue() == "2") {	//专业版 +　网盟推广
					if(reportUnitSelect.find('value','6') != -1){
						try {
							reportUnitSelect.del('value', "6"); // 删除关键词报告选项 ie6下偶尔有未知错误
						} catch(e){}
					}
				}
			} else {	
				ReportUISet.reportRange.hide();
			}			
		},
		
		/**
		 * setReportTypeRadio
		 * 设置报告类型的Radiobox显示，在 账户类型select发生改变时调用，显示相应账户类型下的报告类型
		 * @param {array} s	显示的报告类似radio
		 * @param {array} h	隐藏的报告类型radio
		 * @author zuming@baidu.com
		 */		
		display: function(s, h) {
			var len = s.length;
			var nc = -1;
			for (var i = 0; i < len; i++) {
				if(s[i] == 9 && !AUTH_ARRAY[0]){	//当要显示地域报告，但无权限时
					h[h.length] = 9;
					continue;
				}
				if(s[i] == 10 && !AUTH_ARRAY[1]){   //当要显示搜索词报告，但无权限时
					h[h.length] = 10;
                    continue;
				}
				show("Rr" + s[i], 1);
				show("Lr" + s[i], 1);
				if (G("Rr" + s[i]).checked)	{
					nc = s[i];
				}
			}
			len = h.length;
			var hv = 0;
			for (var i = 0; i < len; i++) {
				hide("Rr" + h[i], 1);
				hide("Lr" + h[i], 1);
				if (G("Rr" + h[i]).checked)	{
					nc = h[i];
					hv = 1;
				}
			}	
			if (hv) {
				if (G("Rr2").style.display != 'none') {
					G("Rr2").checked = 1;
				} else {
					G("Rr3").checked = 1;
				}
			}			
		},
		
		setType: function(type) {
			
		}
	},
	
	/**
	 * 设置统计对象单位
	 */
	reportUnit: {
		setOptions: function(options) {
			reportUnitSelect.fill(options);
			ReportUIChange.reportUnitChange();
		},
		
		setValue: function(value) {
			
		}
	},
	
	/**
	 * 统计范围设置
	 */
	reportRange: {
		/**
		 * 显示选择统计范围
		 */
		show: function() {
			show("ReportRange");
		},
		
		/**
		 * 因此选择统计范围
		 */
		hide: function() {
			hide("ReportRange");
		},
				
		/**
		 * 控制选择统计范围显示
		 */
		display: function() {
			switch (+reportUnitSelect.getValue()) {
			case reportUnitList[0][0][1]:
			case reportUnitList[1][0][1]:
			case reportUnitList[2][0][1]:
				rs1.show();
				rs2.hide();
				rs3.hide();
				rs2._select.style.visibility = "visible";
				rs2._select.style.visibility = "hidden";
				rs3._select.style.visibility = "hidden";
				hide("AutoAllWord");
				hide(wordInput);
				break;
			case reportUnitList[1][1][1]:
			case reportUnitList[2][1][1]:
				rs1.show();
				rs2.show();
				rs3.hide();
				rs1._select.style.visibility = "visible";
				rs2._select.style.visibility = "visible";
				rs3._select.style.visibility = "hidden";
				hide(wordInput);
				hide("AutoAllWord");
				break;
			case reportUnitList[1][2][1]:
				if (accTypeSelect.getValue() == '1') {
					rs1.show();
					rs2.show();
					rs3.hide();
					rs1._select.style.visibility = "visible";
					rs2._select.style.visibility = "visible";
					rs3._select.style.visibility = "hidden";
					show(wordInput, 1);
					show("AutoAllWord", 1);
					wordInput.value = "请输入关键词名称";
				} else {
					rs1.show();
					rs2.show();
					rs3.show();
					rs1._select.style.visibility = "visible";
					rs2._select.style.visibility = "visible";
					rs3._select.style.visibility = "visible";
					show(wordInput, 1);
					show("AutoAllWord", 1);
					wordInput.value = "请输入关键词名称";
				}
				break;
			case reportUnitList[2][2][1]:	//推广单元
			case reportUnitList[2][4][1]:	//创意报告
				rs1.show();
				rs2.show();
				rs3.show();
				rs1._select.style.visibility = "visible";
				rs2._select.style.visibility = "visible";
				rs3._select.style.visibility = "visible";
				hide(wordInput, 1);
				hide("AutoAllWord", 1);
				break;			
			}
			ReportUISet.reportRange.setChangeHandle();
		},
		
		/**
		 * 各个select绑定事件
		 */
		setChangeHandle: function() {
			switch (+accTypeSelect.getValue()) {
			case 0:
				rs1.setHandle(ReportUIChange.reportRangeChange.allAccChange);
				break;
			case 1:
				rs1.setHandle(ReportUIChange.reportRangeChange.claAccChange);
				rs2.setHandle(ReportUIChange.reportRangeChange.groupChange);
				break;
			case 2:
				rs1.setHandle(ReportUIChange.reportRangeChange.proAccChange);
				rs2.setHandle(ReportUIChange.reportRangeChange.planChange);
				rs3.setHandle(ReportUIChange.reportRangeChange.unitChange);
				break;
			}			
		},
		
		setAllAccount: function() {
			MaterialClass.setSelect(1, 0);
		},
		
		setClaAccount: function() {
			MaterialClass.setSelect(8, 0);
		},
		
		setProAccount: function() {
			MaterialClass.setSelect(9, 0);
		},
		
		setPlan: function() {
			//MaterialClass.setSelect(1, 0);
		},
		
		setUnit: function() {
			//MaterialClass.setSelect(1, 0);
		},
		
		setGroup: function() {
			//MaterialClass.setSelect(1, 0);
		}
	},
	
	/**
	 * 分日统计地域控制
	 */
	daySensitive: {
		
		lastStatus : false,
		
		show: function() {
			show("ReportByDay");
		},
		
		hide: function() {
			hide("ReportByDay");
		},
		
		setValue: function(value) {
			G("DailyReport").checked = value;
		},
		
		setDisabled : function(flag) {
			G("DailyReport").disabled = flag;
		}
	},
	
	/**
	 * 不包含网盟推广数据提示信息
	 */
	methodInfoSet: function(){
		if(accTypeSelect.getValue() == "2" && promoMethodSelect.getValue() == '0' && reportUnitSelect.getValue() == "6"){
			if (trim(wordInput.value) === "" || trim(wordInput.value) === "请输入关键词名称") {
				hide('ReportMethodInfo');
			} else {
				show('ReportMethodInfo');
			}			
		} else {
			hide('ReportMethodInfo');
		}
	}
}


/**
 * 物料加载类
 * @author zuming@baidu.com
 */
var MaterialClass = {
	
	// 物料数据
	allAccount: {},
	claAccount: {},
	proAccount: {},
	plan: {},
	unit: {},
	group: {},
	
	// 当前请求值
	nowRequest: {
		mtlType: -1,
		parentId: -1
	},
	
	// 物料type名称对应
	MTL_TYPE_NAME: {
		1: "allAccount",
		3: "plan",
		4: "group",
		5: "unit",
		8: "claAccount",
		9: "proAccount"
	},
	
	/**
	 * 获取物料
	 * @param {Object} mtlType 物料类型，所有账户为1
	 * @param {Object} parentId 父ID，账户级为0
	 */
	setSelect: function(mtlType, parentId) {
		MaterialClass.nowRequest.mtlType = +mtlType;
		MaterialClass.nowRequest.parentId = +parentId;
		var _needReq = true;
		if (mtlType == 1) {
			// 需要所有账户
			if (MaterialClass.claAccount[0] && MaterialClass.claAccount[0].load && MaterialClass.proAccount[0] && MaterialClass.proAccount[0].load) {
				_needReq = false;
			}
		} else {
			var _dName = MaterialClass.MTL_TYPE_NAME[MaterialClass.nowRequest.mtlType];
			if (MaterialClass[_dName][parentId] && MaterialClass[_dName][parentId].load) {
				_needReq = false;
			}
		}
		if (mtlType >= 3 && mtlType <=5 && parentId <= 0) {
			_needReq = false;
		}
		
		if (_needReq) {
			MaterialClass.getMaterialRequest();
		} else {
			MaterialClass.fillSelect();
		}
	},
	
	/**
	 * 获取物料请求
	 */
	getMaterialRequest: function() {
		reportParamEnableSet(false);
		var accountId = rs1.getValue() || USER_ID;
		mtlDWR.getMaterial(USER_ID, accountId, MaterialClass.nowRequest.mtlType, MaterialClass.nowRequest.parentId, 1, {
			callback: MaterialClass.getMaterialResponse
		});	
	},
	
	/**
	 * 异步调用物料后返回
	 * @param {Object} data 返回数据
	 */
	getMaterialResponse: function(data) {
		if (!rightValidate(data)) {
			return
		}
		try {
			eval("data = " + data);
		} catch (e) {}
		
		if (MaterialClass.nowRequest.mtlType == 1 || MaterialClass.nowRequest.mtlType == 8 || MaterialClass.nowRequest.mtlType == 9) {
			// 所有账户
			MaterialClass.allAccount = {
				0: {
					load: true,
					data: []
				}				
			}
			MaterialClass.claAccount = {
				0: {
					load: true,
					data: []
				}
			};	
			MaterialClass.proAccount = {
				0: {
					load: true,
					data: []
				}
			};
			if (MaterialClass.nowRequest.mtlType == 1) {	//搜索推广->帐户报告
				for (var i = 0, len = data.length; i < len; i++) {
					if (+data[i][0] == 8) {
						MaterialClass.allAccount[0].data.push([data[i][2] + "(历史)", data[i][1]]);
						MaterialClass.claAccount[0].data.push([data[i][2] + "(历史)", data[i][1]]);
					} else {
						MaterialClass.allAccount[0].data.push([data[i][2], data[i][1]]);
						MaterialClass.proAccount[0].data.push([data[i][2], data[i][1]]);
					}
				}
			} else {	//专业版->帐户报告
				for (var i = 0, len = data.length; i < len; i++) {
					MaterialClass.allAccount[0].data.push([data[i][2] + "(历史)", data[i][1]]);
					MaterialClass.claAccount[0].data.push([data[i][2] + "(历史)", data[i][1]]);
					MaterialClass.allAccount[0].data.push([data[i][2], data[i][1]]);
					MaterialClass.proAccount[0].data.push([data[i][2], data[i][1]]);
				}
			}
		} else {
			var _dName = MaterialClass.MTL_TYPE_NAME[MaterialClass.nowRequest.mtlType];
			var _pid = MaterialClass.nowRequest.parentId;
			MaterialClass[_dName][_pid] = {
				load: true,
				data: []
			};
			for (var i = 0, len = data.length; i < len; i++) {
				MaterialClass[_dName][_pid].data.push([data[i][2], data[i][1]]);
			}
		}

		MaterialClass.fillSelect();
	},
	
	/**
	 * 填充Select
	 */
	fillSelect: function() {
		var mtlType = MaterialClass.nowRequest.mtlType;
		var parentId = MaterialClass.nowRequest.parentId;
		var _dName = MaterialClass.MTL_TYPE_NAME[mtlType];
		var matData = [];
		var noData = false;
		if (MaterialClass[_dName][parentId] && MaterialClass[_dName][parentId].data) {
			var matData = MaterialClass[_dName][parentId].data;
			eval("matData =" + JSON.encode(matData));	//值拷贝，避免污染原数据
			if(mtlType == 1){	//全部账户
				for(var i = 0, j = matData.length; i < j; i++){
					if(matData[i][0].indexOf('(历史)') == -1){
						matData[i][0] += '(专业)';
					}
				}
			}
			if (matData.length == 0) {
				noData = true;
			}
		}
		var fillData =[];
		switch (mtlType) {
		case 1:
			if (noData) {
				rs1.fill([["暂无账户", -1]]);
			} else {
				fillData.push(["全部账户", 0]);
				rs1.fill(fillData.concat(matData));
			}
			ReportUIChange.reportRangeChange.allAccChange();
			break;
		case 9:
			if (noData) {
				var txt = (IS_BEFORE_DETACH) ? '暂无专业版账户' : '暂无账户';
				rs1.fill([[txt, -1]]);
			} else {
				var txt = (IS_BEFORE_DETACH) ? '全部专业版账户' : '全部账户';
				fillData.push([txt, 0]);
				rs1.fill(fillData.concat(matData));
			}
			ReportUIChange.reportRangeChange.proAccChange();
			break;
		case 3:
			if (noData) {
				rs2.fill([["暂无推广计划", -1]]);
			} else {
				fillData.push(["全部推广计划", 0]);
				rs2.fill(fillData.concat(matData));
			}
			ReportUIChange.reportRangeChange.planChange();
			break;		
		case 4:
			if (noData) {
				rs2.fill([["暂无关键词组", -2]]);
			} else {
				fillData.push(["全部关键词组", -1]);
				rs2.fill(fillData.concat(matData));
			}
			ReportUIChange.reportRangeChange.groupChange();
			break;
		case 5:
			if (noData) {
				rs3.fill([["暂无推广单元", -1]]);
			} else {
				fillData.push(["全部推广单元", 0]);
				rs3.fill(fillData.concat(matData));
			}
			ReportUIChange.reportRangeChange.unitChange();
			break;	
		}
		reportParamEnableSet(true);
		buildReportTip();
	}
}

/**
 * 输出报告生成提示
 * @author zuming@baidu.com
 */
function buildReportTip() {
	if (!reportParamEnable) {
		return false;
	}

    switch (+reportUnitSelect.getValue()) {
    case reportUnitList[0][0][1]:
    case reportUnitList[2][0][1]:
        // 账户
        buildReportTipAccount();
        break;
    case reportUnitList[2][1][1]:
        // 推广计划
        buildReportTipPlan();
        break;
    case reportUnitList[2][2][1]:
        // 推广单元
        buildReportTipUnit();
        break;
    case reportUnitList[2][3][1]:
		//关键词
		buildReportTipRightRecWord();
        break;
	case reportUnitList[2][4][1]:
		//创意
		buildReportTipIdea();
        break;
    }
}

/**
 * 生成右侧页面指定范围报告：子账户为单元的报告提示信息
 * @author zuming@baidu.com
 */
function buildReportTipAccount() {
	var dr = ""
	if (G("DailyReport").checked) {
		dr = "每天";
	}
	if (rs1.getValue() < 0) {
		if (accTypeSelect.getValue() == 2 && IS_BEFORE_DETACH) {
			G("ReportRangeInfo").innerHTML = '<span class="wronginfoblock">您目前没有专业版账户，无法生成报告</span>';
		} else {
			G("ReportRangeInfo").innerHTML = '<span class="wronginfoblock">您目前没有账户，无法生成报告</span>';
		}
	} else if (rs1.getSelectedText() == '全部账户') {
		G("ReportRangeInfo").innerHTML = '为您提供当前时间段<b>所有账户</b>' + dr + '的数据分析报告';
	} else if (rs1.getSelectedText() == '全部专业版账户') {
		G("ReportRangeInfo").innerHTML = '为您提供当前时间段<b>所有专业版账户</b>' + dr + '的数据分析报告';
	} else {
		G("ReportRangeInfo").innerHTML = "为您提供当前时间段账户<b>" + escapeHTML(rs1.getSelectedText()).replace(/ /g, "&nbsp;") + "</b>" + dr + "的数据分析报告";		
	}
}


/**
 * 生成右侧页面指定范围报告：推广计划为单元的报告提示信息
 * @author zuming@baidu.com
 */
function buildReportTipPlan() {
	var dr = ""
	if (G("DailyReport").checked) {
		dr = "每天";
	}
	
	if (rs1.getValue() > 0) {	
		var tmp = [];
		tmp[tmp.length] = "为您提供当前时间段账户<b>";
		tmp[tmp.length] = escapeHTML(rs1.getSelectedText()).replace(/ /g, "&nbsp;");		
		if (rs2.getValue() > 0) {
			tmp[tmp.length] = "</b>下的推广计划<b>";
			tmp[tmp.length] = escapeHTML(rs2.getSelectedText()).replace(/ /g, "&nbsp;");
			tmp[tmp.length] = "</b>";
			tmp[tmp.length] = dr;				
			tmp[tmp.length] = "的数据分析报告";
			G("ReportRangeInfo").innerHTML = tmp.join("");			
		} else if (rs2.getSelectedText() == "全部推广计划") {
			tmp[tmp.length] = "</b>下的<b>所有推广计划</b>";
			tmp[tmp.length] = dr;				
			tmp[tmp.length] = "的数据分析报告";
			G("ReportRangeInfo").innerHTML = tmp.join("");				
		} else {
			G("ReportRangeInfo").innerHTML = '<span class="wronginfoblock">账户' + escapeHTML(rs1.getSelectedText()).replace(/ /g, "&nbsp;") + '下没有推广计划，无法生成报告</span>';
		}
	} else if (rs1.getSelectedText() == '全部专业版账户' || rs1.getSelectedText() == '全部账户') {
		var txt = (IS_BEFORE_DETACH) ? '专业版' : '';
		G("ReportRangeInfo").innerHTML = '为您提供当前时间段<b>所有' + txt + '账户</b>下的<b>所有推广计划</b>' + dr + '数据分析报告';
	} else {
		G("ReportRangeInfo").innerHTML = '<span class="wronginfoblock">您目前没有搜索推广账户，无法生成报告</span>';
	}	
}

/**
 * 生成右侧页面指定范围报告：推广单元为单位的报告提示信息
 * @author zuming@baidu.com
 */
function buildReportTipUnit() {
	var dr = ""
	if (G("DailyReport").checked) {
		dr = "每天";
	}
	
	if (rs1.getValue() > 0) {	
		var tmp = [];
		tmp[tmp.length] = "为您提供当前时间段账户<b>";
		tmp[tmp.length] = escapeHTML(rs1.getSelectedText()).replace(/ /g, "&nbsp;");		
		if (rs2.getValue() > 0) {
			tmp[tmp.length] = "</b>下的推广计划<b>";
			tmp[tmp.length] = escapeHTML(rs2.getSelectedText()).replace(/ /g, "&nbsp;");
		} else if (rs2.getSelectedText() == "全部推广计划") {
			tmp[tmp.length] = "</b>下的<b>所有推广计划";
		} else {
			G("ReportRangeInfo").innerHTML = '<span class="wronginfoblock">账户' + escapeHTML(rs1.getSelectedText()).replace(/ /g, "&nbsp;") + '下没有推广计划，无法生成报告</span>';
			return;
		}
		
		if (rs3.getValue() > 0) {
			tmp[tmp.length] = "</b>下的推广单元<b>";
			tmp[tmp.length] = escapeHTML(rs3.getSelectedText()).replace(/ /g, "&nbsp;");
			tmp[tmp.length] = "</b>";		
		} else if (rs3.getSelectedText() == "全部推广单元") {
			tmp[tmp.length] = "</b>下的<b>所有推广单元</b>";
		} else {
			G("ReportRangeInfo").innerHTML = '<span class="wronginfoblock">推广计划' + escapeHTML(rs2.getSelectedText()).replace(/ /g, "&nbsp;") + '下没有推广单元，无法生成报告</span>';
			return;
		}

		tmp[tmp.length] = dr;				
		tmp[tmp.length] = "的数据分析报告";
		G("ReportRangeInfo").innerHTML = tmp.join("");			
	} else if (rs1.getSelectedText() == '全部专业版账户' || rs1.getSelectedText() == '全部账户') {
		var txt = (IS_BEFORE_DETACH) ? '专业版' : '';
		G("ReportRangeInfo").innerHTML = '为您提供当前时间段<b>所有' + txt + '账户</b>下的<b>所有推广单元</b>' + dr + '数据分析报告';
	} else {
		G("ReportRangeInfo").innerHTML = '<span class="wronginfoblock">您目前没有搜索推广账户，无法生成报告</span>';
	}	
}

/**
 * 生成右侧页面指定范围报告：专业版账户下关键词为单元的报告提示信息
 * @author zuming@baidu.com
 */
function buildReportTipRightRecWord() {
	var dr = ""
	if (G("DailyReport").checked) {
		dr = "每天";
	}
	var tmp = [];
	if (rs1.getValue() > 0) {	
		tmp[tmp.length] = "为您提供当前时间段账户<b>";
		tmp[tmp.length] = escapeHTML(rs1.getSelectedText()).replace(/ /g, "&nbsp;");		
		if (rs2.getValue() > 0) {
			tmp[tmp.length] = "</b>下的推广计划<b>";
			tmp[tmp.length] = escapeHTML(rs2.getSelectedText()).replace(/ /g, "&nbsp;");
		} else if (rs2.getSelectedText() == "全部推广计划") {
			tmp[tmp.length] = "</b>下的<b>所有推广计划";
		} else {
			G("ReportRangeInfo").innerHTML = '<span class="wronginfoblock">账户' + escapeHTML(rs1.getSelectedText()).replace(/ /g, "&nbsp;") + '下没有推广计划，无法生成报告</span>';
			return;
		}
		
		if (rs3.getValue() > 0) {
			tmp[tmp.length] = "</b>下的推广单元<b>";
			tmp[tmp.length] = escapeHTML(rs3.getSelectedText()).replace(/ /g, "&nbsp;");
			tmp[tmp.length] = "</b>下的";		
		} else if (rs3.getSelectedText() == "全部推广单元") {
			tmp[tmp.length] = "</b>下的<b>所有推广单元</b>下的";
		} else {
			G("ReportRangeInfo").innerHTML = '<span class="wronginfoblock">推广计划' + escapeHTML(rs2.getSelectedText()).replace(/ /g, "&nbsp;") + '下没有推广单元，无法生成报告</span>';
			return;
		}

		tmp[tmp.length] = dr;				
		tmp[tmp.length] = "的数据分析报告";
		G("ReportRangeInfo").innerHTML = tmp.join("");			
	} else if (rs1.getSelectedText() == '全部专业版账户' || rs1.getSelectedText() == '全部账户') {
		var txt = (IS_BEFORE_DETACH) ? '专业版' : '';
		tmp[tmp.length] = '为您提供当前时间段<b>所有' + txt + '账户</b>下的';
	} else {
		G("ReportRangeInfo").innerHTML = '<span class="wronginfoblock">您目前没有搜索推广账户，无法生成报告</span>';
		return;
	}

	if (trim(wordInput.value) === "" || trim(wordInput.value) === "请输入关键词名称") {
		tmp[tmp.length] = "<b>所有关键词</b>";
	} else {
		tmp[tmp.length] = "关键词<b>" + trim(escapeHTML(wordInput.value)).replace(/ /g, "&nbsp;") + "</b>";
	}

	tmp[tmp.length] = dr;				
	tmp[tmp.length] = "的数据分析报告";
	G("ReportRangeInfo").innerHTML = tmp.join("");
}

/**
 * 生成右侧页面指定范围报告：创意为单位的报告提示信息
 * @author tongyao@baidu.com
 */
function buildReportTipIdea() {
	var dr = ""
	if (G("DailyReport").checked) {
		dr = "每天";
	}
	
	if (rs1.getValue() > 0) {	
		var tmp = [];
		tmp[tmp.length] = "为您提供当前时间段账户<b>";
		tmp[tmp.length] = escapeHTML(rs1.getSelectedText()).replace(/ /g, "&nbsp;");		
		if (rs2.getValue() > 0) {
			tmp[tmp.length] = "</b>下的推广计划<b>";
			tmp[tmp.length] = escapeHTML(rs2.getSelectedText()).replace(/ /g, "&nbsp;");
		} else if (rs2.getSelectedText() == "全部推广计划") {
			tmp[tmp.length] = "</b>下的<b>所有推广计划";
		} else {
			G("ReportRangeInfo").innerHTML = '<span class="wronginfoblock">账户' + escapeHTML(rs1.getSelectedText()).replace(/ /g, "&nbsp;") + '下没有推广计划，无法生成报告</span>';
			return;
		}
		
		if (rs3.getValue() > 0) {
			tmp[tmp.length] = "</b>下的推广单元<b>";
			tmp[tmp.length] = escapeHTML(rs3.getSelectedText()).replace(/ /g, "&nbsp;");
			tmp[tmp.length] = "</b>";		
		} else if (rs3.getSelectedText() == "全部推广单元") {
			tmp[tmp.length] = "</b>下的<b>所有推广单元</b>";
		} else {
			G("ReportRangeInfo").innerHTML = '<span class="wronginfoblock">推广计划' + escapeHTML(rs2.getSelectedText()).replace(/ /g, "&nbsp;") + '下没有推广单元，无法生成报告</span>';
			return;
		}

		tmp[tmp.length] = dr;				
		tmp[tmp.length] = "的创意的数据分析报告";
		G("ReportRangeInfo").innerHTML = tmp.join("");			
	} else if (rs1.getSelectedText() == '全部专业版账户' || rs1.getSelectedText() == '全部账户') {
		var txt = (IS_BEFORE_DETACH) ? '专业版' : '';
		G("ReportRangeInfo").innerHTML = '为您提供当前时间段<b>所有' + txt + '账户</b>下的<b>所有推广单元</b>' + dr + '的创意的数据分析报告';
	} else {
		G("ReportRangeInfo").innerHTML = '<span class="wronginfoblock">您目前没有搜索推广账户，无法生成报告</span>';
	}	
}

/**
 * 取得当前的报告类型radio
 * @author zuming@baidu.com
 */
function getReportTypeRadio() {
	for (var i = 1; i <= 10; i++) {
		if (G("Rr" + i).checked) {
			return(i);
		}
	}
}

/**
 * 设置Flash默认图表类型为折线
 * @author tongyao@baidu.com
 */
function setFlashType(){
	G('typeLine').checked = true;
}

/**
 * 取得Flash图表类型radio
 * @return 1-折线 0-柱状
 * @author tongyao@baidu.com
 */
function getFlashType(){
	if(G('typeLine').checked){
		flashType = 'ReportGraphyLineFlash1';
		return '1';
	} else {
		flashType = 'ReportGraphyBarFlash1';
		return '0';
	}
}

/**
 * 取得当前报告类型
 * @author zuming@baidu.com
 */
function getReportType() {
	switch(getReportTypeRadio()) {
		case 1:
			return 0;
		case 2:
			return 1;
		case 3:
			return 2;
		case 4:
			return 8;
		case 5:
			return 9;
		case 6:
			return 10;
		case 7:
			return 11;
		case 8:	//创意报告
			return 12;
		case 9:	//分地域报告	
			return 3;	
		case 10 : //搜索词报告
			return 6;
	}
}

/**
 * 请求报告数据
 * @author zuming@baidu.com
 */
function buildReportRequest() {
	
	requestType = 1;
	hide("SpaceHoverDiv");
	spaceLinkData.index = -1;
	
	if (checkDate()) {
		G("DateSelectError").innerHTML = "";
	} else {
		G("DateSelectError").innerHTML = "常规报告中可选的最大时间范围为一年，请您重新选择";
		return false;
	}
	
	// 如果是指定报告类型
	if (G("Rr1").checked) {
        // 右侧
        switch (+accTypeSelect.getValue()) {
        case 0:
            // 所有账户
            buildReportRequestDo();
            break;
        case 2:
            // 推荐账户
            if (reportUnitSelect.getValue() == reportUnitList[2][3][1]) {
                if (trim(wordInput.value) != "" && trim(wordInput.value) != "请输入关键词名称") {
                    // 专门为右侧专业搜词时使用
                    var _word = wordEscapeHTML(trim(wordInput.value));
                    mtlDWR.getWordidbyWordNameAndUnitid(USER_ID, +rs1.getValue(), +rs2.getValue(), +rs3.getValue(), _word, {
                        callback: buildReportRequestDo
                    });
                } else {
                    buildReportRequestDo();
                }
            } else {
                buildReportRequestDo();
            }
            break;
        default:
            buildReportRequestDo();
            break;
        }
	} else {
		buildReportRequestDo();
	}
}

/**
 * 针对关键词的转义
 * @author zuming@baidu.com
 */
function wordEscapeHTML(str) {
	str = '' + str;
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * 构造获取报告数据请求
 * @param {Object} data
 * @author zuming@baidu.com
 */
function buildReportRequestDo(data) {
	if (typeof(data) == 'undefined' || rightValidate(data)) {
		var param = {
			accountRange: 0,	// 0所有账户，1经典，2专业
			platform: 0,
			startDate: 0,		// 起始日期
			endDate: 0,			// 结束日期
			reportType: 0,		// 报告类型，0指定范围，1账户报告，2分账户报告，8分关键词组报告，9分关键词报告，10分推广计划报告，11分单元，6为搜索词报告
			daySensitive: 0,	// 分日，0为不分，1
			accountid: USER_ID,
			groupid: -1,
			wordid: 0,
			planid: 0,
			unitid: 0,
			specifyType: 0,
			groupid2: 0,
			isFengchao: 0, // 1经典，2专业
			mtldim: 1,
			userid: USER_ID
		};
		param.accountRange = +accTypeSelect.getValue();
		param.isFengchao = param.accountRange;
		param.platform = +G("PromoMethodSelect").value;
		param.startDate = datePicker._value[0];
		param.endDate = datePicker._value[1];
		param.reportType = getReportType();
		
		if (dailyReportCheck.checked) {
			param.daySensitive = 1;
		}
		
		// 指定范围报告的参数设置        
        if (G("Rr1").checked) {
            param.mtldim = +reportUnitSelect.getValue();
            
            // 专业版账户
            if (param.accountRange == 2) {
				
				param.accountid = +rs1.getValue();
                if (param.accountid < 0 && (rs1.getSelectedText() !== "全部专业版账户" && rs1.getSelectedText() !== "全部账户")) {
                    var txt = (IS_BEFORE_DETACH) ? '专业版' : '';
					G("ReportRangeInfo").innerHTML = '<span class="wronginfoblock">您目前没有' + txt + '账户，无法生成报告</span>';
                    return false;
                }				
				
                // 统计对象单位为推广计划
				if (param.mtldim == reportUnitList[2][1][1] 
					|| param.mtldim == reportUnitList[2][2][1] 
					|| param.mtldim == reportUnitList[2][3][1]
					|| param.mtldim == reportUnitList[2][4][1]) {
					param.planid = +rs2.getValue();
					if (param.planid < 0 && rs1.getSelectedText() !== "全部推广计划") {
						G("ReportRangeInfo").innerHTML = '<span class="wronginfoblock">您目前没有推广计划，无法生成报告</span>';
						return false;
					}
				}
                
                // 统计对象单位为推广单元
                if (param.mtldim == reportUnitList[2][2][1] 
					|| param.mtldim == reportUnitList[2][3][1]
					|| param.mtldim == reportUnitList[2][4][1]) {
                    param.unitid = +rs3.getValue();
                    if (param.unitid < 0 && rs2.getSelectedText() !== "全部推广单元") {
                        G("ReportRangeInfo").innerHTML = '<span class="wronginfoblock">您目前没有推广单元，无法生成报告</span>';
                        return false;
                    }
                }
                
                // 统计对象单位为关键词
                if (param.mtldim == reportUnitList[2][3][1]) {
                    if (typeof(data) != 'undefined') {
                        param.wordid = +data;
                    } else {
                        if (wordInput.value == "" || wordInput.value == "请输入关键词名称") {
                            param.wordid = 0;
                        } else {
                            if (param.planid == 0 || param.unitid == 0) {
                                param.wordid = 0;
                            } else {
                                param.wordid = -1;
                            }
                        }
                    }
                    if (param.wordid < 0) {
                        G("ReportRangeInfo").innerHTML = '<span class="wronginfoblock">您输入的关键词没有在您所选择的统计对象范围内，无法生成报告</span>';
                        return false;
                    }
                }
            }
  
            // 全部账户
            if (param.accountRange == 0) {
                param.accountid = +rs1.getValue();
                if (param.accountid < 0 && rs1.getSelectedText() !== "全部账户") {
                    G("ReportRangeInfo").innerHTML = '<span class="wronginfoblock">您目前没有账户，无法生成报告</span>';
                    return false;
                }
				if (rs1.getSelectedText().indexOf("(历史)") != -1) {
					param.isFengchao = 1;
				} else {
					param.isFengchao = 2;
				}
            }
        } else {
            // 账户报告
            if (G("Rr2").checked) {
                param.mtldim = 1;
            }
            // 账户报告
            if (G("Rr3").checked) {
                param.mtldim = reportUnitList[0][0][1];
            }
            // 关键词报告
            if (G("Rr5").checked) {
                param.mtldim = reportUnitList[2][3][1];
            }
            // 推广计划报告
            if (G("Rr6").checked) {
                param.mtldim = reportUnitList[2][1][1];
            }
            // 推广单元报告
            if (G("Rr7").checked) {
                param.mtldim = reportUnitList[2][2][1];
            }
		
			// 创意报告
            if (G("Rr8").checked) {
                param.mtldim = reportUnitList[2][4][1];
            }
			
			// 分地域报告
            if (G("Rr9").checked) {
				param.accountid = 0; //分地域报告accountID如果不传0后台区分不了
                param.mtldim = reportUnitList[0][0][1];
            }
			
			//搜索词报告
			if (G("Rr10").checked) {
				param.mtldim = reportUnitList[2][4][1];
			}
        }
        
        if (param.accountRange == 2) {
            param.groupid2 = -11;
        }
        if (+accTypeSelect.getValue() == 0 && rs1.getSelectedText().indexOf('（专业）') != -1) {
            param.groupid2 = -11;
        }

        buildReportRequestSend(param);
		
	}
}

/**
 * 生成报告前预备做的事情
 * @author zuming@baidu.com
 */
function buildReportRequestReady() {
	
	//增加对搜索词报告的最大行数限制，删除最大200列显示
	if (G("Rr10").checked) {
		numPerPageSelect.del("value", "200");
		numPerPageSelect.setSelect(20, "noHandle");
		numPerPage = 20;
	} else {
		if (numPerPageSelect.find("value", "200") == -1) {
			numPerPageSelect.add(["200条", "200"]);
		}
	}
	
	G("BuildReportBtn").onclick = null;
	hide("BuildReportBtn");
	if (G("BuildReportLoading")) {
		show("BuildReportLoading", 1);
	} else {
		var loadingSpan = document.createElement('span');
		loadingSpan.innerHTML = LOADING;
		loadingSpan.id = "BuildReportLoading";
		G("BuildReportBtn").parentNode.appendChild(loadingSpan);
	}
		
	G("ReportChartDiv").style.height = "0px";
	
	hideFlashContainer("ReportGraphyLine1");
	hideFlashContainer("ReportGraphyBar1");	
}

/**
 * 发出生成报告的请求
 * @param {Object} param
 * @author zuming@baidu.com
 */
function buildReportRequestSend(param) {
	buildReportRequestReady();
	
	if (tb.tbody) {
		tb.fillLoading();
	}
	reportParamEnableSet(false);
	setDownloadParam(param);
	setNowReportParam(param);
	defaultreportDWR.generateReportData(USER_ID, param, {
		callback: buildReport
	});	
}

/**
 * 保存当前生成的报告参数
 * @param {Object} param
 * @author zuming@baidu.com
 */
function setNowReportParam(param) {
    nowReportParam = {};
    for (va in param) {
        nowReportParam[va] = param[va];
    }
    if (param.reportType == 0) {
        // 判断来源
        if (requestType == 1) {
            nowReportParam.accountName = rs1.getSelectedText();
            nowReportParam.groupName = rs2.getSelectedText();
            nowReportParam.planName = rs2.getSelectedText();
            nowReportParam.unitName = rs3.getSelectedText();
			nowReportParam.wordName = (nowReportParam.wordid == 0) ? "全部关键词" : escapeHTML(trim(wordInput.value));
        }
    }
}

/**
 * 常规报告历史纪录
 * @param {Object} cnt select容器ID
 * @param {Object} btn submit按钮ID
 * @param {Object} callback 请求所用函数
 * @author tongyao@baidu.com
 */
function DefaultReportHistory(cnt, btn, callback){
	this._key = '';
	this._value = '';
	this.size = DEFAULT_REPORT_HISTORY_SIZE;
	this.history = [];
	this.btn = G(btn);
	this.callback = callback;
	this.container = G(cnt); //select对象
	this.init();
}

DefaultReportHistory.prototype = {
	/**
	 * 初始化
	 */
	init: function(){
		
		this._key = DRH_KEY;
		try {
			this._value = this.load();
		}catch(ex){ //用户不正常删除Userdata文件导致本地存储永久失效时，此功能变更为仅记录当前页面中的所有操作
			this._value = '';
			return false;
		}
		if(this._value != ''){
			eval("var data = " + this._value);
			this.history = data;
		}
		this.render();
		var _this = this;
		this.container.onchange = this.container.onkeyup = function(){
			_this.clearHistory();
		}
		this.btn.onclick = function(){
			_this.request();
		}
	},
	
	/**
	 * 保存
	 */
	save: function(){
		this._value = JSON.encode(this.history);
		if(this.value != ''){
			Storager.set(this._key, this._value);
		}
		return true;	
	},
	
	/**
	 * 添加一条报告记录
	 * @param {Object} title 文字
	 * @param {Object} date	日期
	 * @param {Object} param 参数
	 */
	push: function(title, date, param){
		//限定纪录条数
		var _param = {}
		for (v in param) {
			_param[v] = param[v];
		}
		if(this.history.length == this.size){
			this.history.splice(0,1);
		}
		this.history.push([title, date, _param]);
		this.save();
		this.render();
	},
	
	/**
	 * 读取
	 */
	load: function(){
		this._value = Storager.get(this._key) || '';
		return this._value;
	},
	
	/**
	 * 渲染select，展现历史数据
	 */
	render: function(){
		this.container.options.length = 0;
		var len = this.history.length;
		var newOption = null;
		
		if(len == 0){
			newOption = document.createElement('option');
			newOption.value = '-1';
			newOption.innerHTML = '暂无历史纪录';
			this.container.appendChild(newOption);
		} else {
			for(var i = len; i > 0; i--){
				newOption = document.createElement('option');
				newOption.value = i - 1;
				newOption.innerHTML = this.history[i - 1][0];
				newOption.title = this.history[i - 1][1];
				this.container.appendChild(newOption);
			}
			newOption = document.createElement('option');
			newOption.value = -100;
			newOption.innerHTML = "清空历史记录...";
			newOption.title = "清空最近浏览历史记录";
			this.container.appendChild(newOption);			
		}
	},
	
	/**
	 * 请求报告
	 */
	request: function(){
		var index = this.container.options[this.container.selectedIndex].value;
		if (index >= 0) {
			if (this.history[index].length == 3) {
				var title = this.history[index][0];
				var param = this.history[index][2];
				requestType = 3;
				this.callback(param);
			}
		}
		return false;
	},
	
	/**
	 * 清空历史记录
	 */
	clearHistory: function() {
		var index = this.container.options[this.container.selectedIndex].value;
		if (index == -100) {
			// 开始清空
			this.history.length = 0;
			this.save();
			this.render();
		} else {
			return false;
		}
	}	
};

/**
 * 生成报告
 * @author zuming@baidu.com
 */
function buildReport(data) {
	if (rightValidate(data)) {
		show('ReportTableDiv');
		show('ReportChart1');
		show('AddOtherGraphyLinkDiv');
		
		nowSortIndex = -1;
		
		G("BuildReportBtn").onclick = buildReportRequest;
		show("BuildReportBtn");
		
		if (G("BuildReportLoading")) {
			hide("BuildReportLoading");
		}
		
		tb.init("ReportTable", [], "100%", "常规报告");
		
		var _hasShowData = false;
		if (data.indexOf('shows') != -1 || data.indexOf('clkrate') != -1 || data.indexOf('showpay') != -1) {
			_hasShowData = true;
		}
		buildReportTitle(_hasShowData);
		var hisTitle = getHistoryTitle();
		DRH.push(hisTitle.date + ' ' + hisTitle.title, hisTitle.date, nowReportParam);
		
		if (requestType != 1) {
			setFormShow();
		}
		
		buildReportBread();
		
		if (data == 'ERROR') {
			tb.fillNull("对不起，系统忙碌，请稍后再试");
			p.hide();
			clearDownLink();
			reportParamEnableSet(true);
			return false;
		}
		
		if (data == 'INVALID') {
			tb.fillNull("对不起，后台表单验证失败，请稍后再试");
			p.hide();
			clearDownLink();
			reportParamEnableSet(true);
			return false;
		}
		
		if (data == 'NOAUTH') {
			tb.fillNull("您无权查看此类型报告或展现相关数据");
			p.hide();
			clearDownLink();
			reportParamEnableSet(true);
			return false;
		}
		
		if (data == 'NOTALL') {
			tb.fillNull('对不起，数据量超过5000条，报告无法在网页正常显示，<span style="color:red;font-weight:bold">请点击表格右上方的链接直接下载报告</span>');
			p.hide();
			setDownLink();
			hide("NumPerPageSpan");
			reportParamEnableSet(true);
			return false;
		} else {
			show("NumPerPageSpan", 1);
		}
		
		if (data == 'OUTRANGE') {
			tb.fillNull("对不起，您选择的数据内容过多，请调整时间范围后再尝试生成");
			p.hide();
			clearDownLink();
			reportParamEnableSet(true);
			return false;
		}
		
		if (data == 'INVALID_REPORT') {
			tb.fillNull("不支持的报告，请选择其他类型报告");
			p.hide();
			clearDownLink();
			reportParamEnableSet(true);
			return false;
		}
		
		eval("tableData = " + data);
		buildReportTableHead();
		if (tableData.length > 1) {		
			footData = buildFootData(tableData.pop());
		}
		setDownLink();
		
		var recordNum = tableData.length;
		var pageNum = Math.ceil(recordNum / numPerPage);
		p.setLastPage(pageNum);
		
		
		reportParamEnableSet(true);
		getReportData(1);
		
		setFlashType(); //设置默认图表类型
		setFlash();
	}
	
	//记录信息
	if (G("Rr10").checked) {
		FC_GE_LOG.send({
			action:"generateQueryReport"
		});
	}
}

/**
 * 组装表尾数据
 * @param footData {Array} 表尾数据
 * @return {Array} 返回数据
 * @author tongyao@baidu.com
 */
function buildFootData(footData) {
	/**
	 * footdata内每行顺序为
	 * 消费，平均点击价格，点击，展现，点击率，千次展现消费
	 */
	var length = footData.length;
	var cols = defaultReportTableTitle.length;
	if(length == 3){ //三行总计
		var titleArray = ['搜索','网盟','全部'];
	} else {	//一行
		var titleArray = [''];
	}
	
	for(var i = 0; i < length; i++){
		var row = footData[i];
		var rowSize = row.length;
		if(rowSize < cols){
			for(var j = 1, k = cols - rowSize; j < k; j++){
				footData[i].unshift("");
			}
			footData[i].unshift(titleArray[i]);
		}
	}
	return footData;
}

/**
 * 生成常规报告面包屑
 * @author zuming@baidu.com
 */
function buildReportBread() {
	var _ACC_LENGTH = 20;
	var _GRP_LENGTH = 20;
	var _PLAN_LENGTH = 20;
	var _UNIT_LENGTH = 20;
	var _WORD_LENGTH = 20;
	if (nowReportParam.reportType == 0) {
		var tmp = [];
		switch (nowReportParam.mtldim) {
			case 2:	// 账户
				if (singleUser) {
					break;
				}
				tmp[tmp.length] = '<a href="#" onclick="breadLink(1);return false">账户</a>&nbsp;&gt;&nbsp;';
				tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.accountName), _ACC_LENGTH, '...');
				break;
			case 3: // 推广计划
				tmp[tmp.length] = '<a href="#" onclick="breadLink(1);return false">账户</a>&nbsp;&gt;&nbsp;';
				tmp[tmp.length] = '<a href="#" onclick="breadLink(9);return false">';
				tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.accountName), _ACC_LENGTH, '...');
				tmp[tmp.length]	= '</a>&nbsp;&gt;&nbsp;';
				tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.planName), _PLAN_LENGTH, '...');
				break;
			case 4: // 关键词组
				tmp[tmp.length] = '<a href="#" onclick="breadLink(1);return false">账户</a>&nbsp;&gt;&nbsp;';
				tmp[tmp.length] = '<a href="#" onclick="breadLink(8);return false">'
				tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.accountName), _ACC_LENGTH, '...');
				tmp[tmp.length]	= '</a>&nbsp;&gt;&nbsp;';
				tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.groupName), _GRP_LENGTH, '...');
				break; 
			case 5: // 推广单元
				tmp[tmp.length] = '<a href="#" onclick="breadLink(1);return false">账户</a>&nbsp;&gt;&nbsp;';
				tmp[tmp.length] = '<a href="#" onclick="breadLink(9);return false">';
				tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.accountName), _ACC_LENGTH, '...');
				tmp[tmp.length]	= '</a>&nbsp;&gt;&nbsp;';					
				tmp[tmp.length] = '<a href="#" onclick="breadLink(3);return false">'
				tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.planName), _PLAN_LENGTH, '...');
				tmp[tmp.length]	= '</a>&nbsp;&gt;&nbsp;';		
				tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.unitName), _UNIT_LENGTH, '...');
				break;
			case 6: // 关键词
				tmp[tmp.length] = '<a href="#" onclick="breadLink(1);return false">账户</a>&nbsp;&gt;&nbsp;';
				if (nowReportParam.accountRange == 1) {
					tmp[tmp.length] = '<a href="#" onclick="breadLink(8);return false">'
					tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.accountName), _ACC_LENGTH, '...');
					tmp[tmp.length]	= '</a>&nbsp;&gt;&nbsp;';
					tmp[tmp.length] = '<a href="#" onclick="breadLink(4);return false">'
					tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.groupName), _GRP_LENGTH, '...');
					tmp[tmp.length]	= '</a>&nbsp;&gt;&nbsp;';					
				} else if (nowReportParam.accountRange == 2) {
					tmp[tmp.length] = '<a href="#" onclick="breadLink(9);return false">';
					tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.accountName), _ACC_LENGTH, '...');
					tmp[tmp.length]	= '</a>&nbsp;&gt;&nbsp;';						
					tmp[tmp.length] = '<a href="#" onclick="breadLink(3);return false">'
					tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.planName), _PLAN_LENGTH, '...');
					tmp[tmp.length]	= '</a>&nbsp;&gt;&nbsp;';
					tmp[tmp.length] = '<a href="#" onclick="breadLink(5);return false">'
					tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.unitName), _UNIT_LENGTH, '...');
					tmp[tmp.length]	= '</a>&nbsp;&gt;&nbsp;';						
				}
				if(nowReportParam.wordName == '【'){
					tmp[tmp.length] = LANG.MARS.BEIDOU_KEYWORD + '关键词';
				} else {
					tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.wordName), _WORD_LENGTH, '...');	
				}
				break;		
			case 7:	//创意(无面包屑)
				break;				
		}
		G("ReportBread").innerHTML = tmp.join('');
		show("ReportBread");	
	} else {
		G("ReportBread").innerHTML = "";
		hide("ReportBread");
	}
}

/**
 * 生成报告表头
 * @author zuming@baidu.com
 */
function buildReportTableHead() {
	defaultReportTableTitle = [];
	var tmp = tableData.shift();
	
	for (var i = 0, len = tmp.length; i < len; i++) {		
		defaultReportTableTitle[defaultReportTableTitle.length] = colList[colMapping[tmp[i]]];
	}
	
	//如果用户选择的是搜索词报告，则添加新的操作列
	if (nowReportParam.reportType == 6) {
		QUERY_REPORT_RENDER.buildCol(defaultReportTableTitle);
	}
	
	setColumnIndex();
	tb.init("ReportTable", defaultReportTableTitle, "100%", "常规报告");	
}

/**
 * 生成报告标题
 * @author zuming@baidu.com
 */
function buildReportTitle(_hasShowData) {
	var title = [];
	switch (nowReportParam.reportType) {
		case 0:
			if (nowReportParam.mtldim == 2) {
				if (nowReportParam.accountName == "全部账户") {
					title[title.length] = '<b>全部账户</b>&nbsp;';
				} else {
					title[title.length] = '账户&nbsp;<b>' + escapeHTML(nowReportParam.accountName) + '&nbsp;</b>';
				}				
			}
			
			if (nowReportParam.mtldim == 4) {
				if (nowReportParam.groupName == "全部关键词组") {
					title[title.length] = '<b>全部关键词组</b>&nbsp;';
				} else {
					title[title.length] = '关键词组&nbsp;<b>' + escapeHTML(nowReportParam.groupName) + '&nbsp;</b>';
				}				
			}
			
			if (nowReportParam.mtldim == 3) {
				if (nowReportParam.planName == "全部推广计划") {
					title[title.length] = '<b>全部推广计划</b>&nbsp;';
				} else {
					title[title.length] = '推广计划&nbsp;<b>' + escapeHTML(nowReportParam.planName) + '&nbsp;</b>';
				}				
			}
			
			if (nowReportParam.mtldim == 5) {
				if (nowReportParam.unitName == "全部推广单元") {
					title[title.length] = '<b>全部推广单元</b>&nbsp;';
				} else {
					title[title.length] = '推广单元&nbsp;<b>' + escapeHTML(nowReportParam.unitName) + '&nbsp;</b>';
				}				
			}
			
			if (nowReportParam.mtldim == 6) {
				if (nowReportParam.wordName == "全部关键词") {
					title[title.length] = '<b>全部关键词</b>&nbsp;';
				} else if (nowReportParam.wordName == '【'){	//网盟推广关键词
					title[title.length] = LANG.MARS.BEIDOU_KEYWORD + '关键词';
				} else {
					title[title.length] = '关键词&nbsp;<b>' + escapeHTML(nowReportParam.wordName) + '&nbsp;</b>';
				}					
			}
			
			if (nowReportParam.mtldim == 7) {
				title[title.length] = '创意';			
			}
			break;		
		case 1:
			if (singleUser) {
				title[title.length] = "账户";
			} else {
				title[title.length] = "所有账户";
			}
			break;		
		case 2:
			if (singleUser) {
				title[title.length] = "账户";
			} else {
				title[title.length] = "分账户";
			}
			break;		
		case 8:
			title[title.length] = "关键词组";
			break;		
		case 9:
			title[title.length] = "关键词";		
			break;		
		case 10:
			title[title.length] = "推广计划";
			break;		
		case 11:
			title[title.length] = "推广单元";
			break;
		case 12:
			title[title.length] = "创意";
			break;
		case 3:
			if (nowReportParam.accountName) {
				title[title.length] = '账户&nbsp;<b>' + escapeHTML(nowReportParam.accountName) + '&nbsp;</b>';
				title[title.length] = '的';
			}
			title[title.length] = "分地域";
			break;
		case 6:
			title[title.length] = "搜索词";
			break;
	}	
	if (nowReportParam.daySensitive) {
		title[title.length] = "分日";
	}
	if (nowReportParam.reportType == 1 && !singleUser) {
		title[title.length] = "总报告";
	} else {
		title[title.length] = "报告";
	}
	

	if (_hasShowData) {	
		title[title.length] = '&nbsp;&nbsp;&nbsp;<p style="margin:9px 0 0 0;font-size:12px;color:#999;font-weight:normal">报告为非实时数据，系统可能无法为您提供3小时内的点击消费数据和当日展现数据（昨日展现数据每日中午12时起提供）。</p>';
		if (nowReportParam.reportType == 3){	//分地域报告的时间提示
			title[title.length] = '&nbsp;&nbsp;&nbsp;<p style="margin:0;font-size:12px;color:#999;font-weight:normal">系统只能为您提供自' + dateToString(stringToDate(AREA_QUERY_START, "YYYYMMDD"),'YYYY年MM月DD日') + '之后的分地域报告数据</p>';
		}
		if (nowReportParam.reportType == 6) { //搜索报告时增加显示数据信息
			title[title.length] = '&nbsp;&nbsp;&nbsp;<p style="margin:0;font-size:12px;color:#999;font-weight:normal">系统只能为您提供搜索推广方式下最近30天的搜索词分日报告数据。</p>';
		}
	}
	
	G("ReportTitle").innerHTML = title.join("");	
	
	var dr = [];
	/*
	dr[dr.length] = nowReportParam.startDate.substr(0, 4) + '年';
	dr[dr.length] = nowReportParam.startDate.substr(4, 2) + '月';
	dr[dr.length] = nowReportParam.startDate.substr(6, 2) + '日';
	dr[dr.length] = ' - ';
	dr[dr.length] = nowReportParam.endDate.substr(0, 4) + '年';
	dr[dr.length] = nowReportParam.endDate.substr(4, 2) + '月';
	dr[dr.length] = nowReportParam.endDate.substr(6, 2) + '日';	
	*/
	dr[dr.length] = nowReportParam.startDate.substr(0, 4) + '-';
	dr[dr.length] = nowReportParam.startDate.substr(4, 2) + '-';
	dr[dr.length] = nowReportParam.startDate.substr(6, 2);
	dr[dr.length] = ' 至 ';
	dr[dr.length] = nowReportParam.endDate.substr(0, 4) + '-';
	dr[dr.length] = nowReportParam.endDate.substr(4, 2) + '-';
	dr[dr.length] = nowReportParam.endDate.substr(6, 2);	
	G("ReportDateRange").innerHTML = escapeHTML(dr.join(""));
	G("ReportChartDate1").innerHTML = escapeHTML(dr.join(""));
}

/**
 * 生成历史记录标题
 * @return {Object} {title, date}
 * @author zuming@baidu.com
 */
function getHistoryTitle() {
	var tmp = [];
	var _ACC_LENGTH = 15;
	var _GRP_LENGTH = 13;
	var _PLAN_LENGTH = 13;
	var _UNIT_LENGTH = 13;
	var _WORD_LENGTH = 11;
	switch (nowReportParam.reportType) {
		case 0:
			if (nowReportParam.mtldim == 2) {
				tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.accountName), _ACC_LENGTH, '..');
			}
			
			if (nowReportParam.specifyType == 1) {
				tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.groupName), _GRP_LENGTH, '..');
			}
			
			if (nowReportParam.mtldim == 4) {
				tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.accountName), _ACC_LENGTH, '..');
				tmp[tmp.length] = ' ';
				tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.groupName), _GRP_LENGTH, '..');
			}
			
			if (nowReportParam.mtldim == 3) {
				tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.accountName), _ACC_LENGTH, '..');
				tmp[tmp.length] = ' ';
				tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.planName), _PLAN_LENGTH, '..');
			}
			
			if (nowReportParam.mtldim == 5) {
				tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.accountName), _ACC_LENGTH, '..');
				tmp[tmp.length] = ' ';				
				tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.planName), _PLAN_LENGTH, '..');
				tmp[tmp.length] = ' ';
				tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.unitName), _UNIT_LENGTH, '..');
			}
			
			if (nowReportParam.specifyType == 2) {
				tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.wordName), _WORD_LENGTH, '..');
			}
			
			if (nowReportParam.mtldim == 6) {
				if (nowReportParam.accountRange == 1) {
					tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.accountName), _ACC_LENGTH, '..');
					tmp[tmp.length] = ' ';
					tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.groupName), _GRP_LENGTH, '..');
					tmp[tmp.length] = ' ';
					tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.wordName), _WORD_LENGTH, '..');
				} else if (nowReportParam.accountRange == 2) {
					tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.accountName), _ACC_LENGTH, '..');
					tmp[tmp.length] = ' ';					
					tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.planName), _PLAN_LENGTH, '..');
					tmp[tmp.length] = ' ';
					tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.unitName), _UNIT_LENGTH, '..');
					tmp[tmp.length] = ' ';
					if(nowReportParam.wordName == '【'){
						tmp[tmp.length] = LANG.MARS.BEIDOU_KEYWORD + '关键词';
					} else {
						tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.wordName), _WORD_LENGTH, '..');
					}				
				}
			}
			
			//创意报告
			if (nowReportParam.mtldim == 7) {
				tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.accountName), _ACC_LENGTH, '..');
				tmp[tmp.length] = ' ';
				tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.planName), _PLAN_LENGTH, '..');
				tmp[tmp.length] = ' ';
				tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.unitName), _UNIT_LENGTH, '..');
				tmp[tmp.length] = ' 创意';
			} 
				
			tmp[tmp.length]	= "的";
			
			break;
		case 1:
			if (singleUser) {
				tmp[tmp.length] = "账户";
			} else {
				tmp[tmp.length] = "所有账户";
			}
			break;		
		case 2:
			if (singleUser) {
				tmp[tmp.length] = "账户";
			} else {
				tmp[tmp.length] = "分账户";
			}
			break;		
		case 8:
			tmp[tmp.length] = "关键词组";
			break;		
		case 9:
			tmp[tmp.length] = "关键词";		
			break;		
		case 10:
			tmp[tmp.length] = "推广计划";
			break;		
		case 11:
			tmp[tmp.length] = "推广单元";
			break;	
		case 12:
			tmp[tmp.length] = "创意";
			break;
		case 3:
			if(nowReportParam.accountName){	//时间跳转时在标题中补充账户名
				tmp[tmp.length] = getCutString(escapeHTML(nowReportParam.accountName), _ACC_LENGTH, '..');
				tmp[tmp.length] = '的';
			}
			tmp[tmp.length] = "分地域";
			break;	
		case 6:
			tmp[tmp.length] = "搜索词";
			break;
	}	
	if (nowReportParam.daySensitive) {
		tmp[tmp.length] = "分日";
	}

	if (nowReportParam.reportType == 1 && !singleUser) {
		tmp[tmp.length] = '总报告';
	} else {
		tmp[tmp.length] = '报告';
	}
	
	var dtmp = [];
	dtmp.push(nowReportParam.startDate.substr(0,4));
	//dtmp.push('年');
	dtmp.push(nowReportParam.startDate.substr(4,2));
	//dtmp.push('月');
	dtmp.push(nowReportParam.startDate.substr(6,2));
	//dtmp.push('日');	
	dtmp.push('-')
	dtmp.push(nowReportParam.endDate.substr(0,4));
	//dtmp.push('年');
	dtmp.push(nowReportParam.endDate.substr(4,2));
	//dtmp.push('月');
	dtmp.push(nowReportParam.endDate.substr(6,2));
	//dtmp.push('日');		
	
	return({
		title: tmp.join(""), 
		date: dtmp.join("")
	});
}


/**
 * 请求报告数据并显示
 * @param {Number} page
 * @author zuming@baidu.com
 */
function getReportData(page) {
	if (tableData.length > 0) {
		tb.fillLoading();
		
		p.setNowPage(page);
		p.show();
		
		var startRecord = 0;
		if (page != 1) {
			startRecord = (page - 1) * numPerPage;
		}
		var endRecord = startRecord + numPerPage;
		if (endRecord > tableData.length) {
			endRecord = tableData.length;
		}
		var dataTmp = [];
		
		//处理搜索词报告的表格渲染
		//注意，此处需要判断当前表格数据是否已经被渲染过。否则，在切换页码时会出现bug
		if (nowReportParam.reportType == 6) {
			for (var i = startRecord; i < endRecord; i++) {
				//填充checkbox和空数据
				dataTmp[dataTmp.length] = QUERY_REPORT_RENDER.padData(i);
			}
		} else {
			for (var i = startRecord; i < endRecord; i++) {
				dataTmp[dataTmp.length] = tableData[i];
			}
		}

		if (dataTmp.length > 0) {
			tb.fill(dataTmp);
			tb.buildMultiFoot(footData);
			
			if (!nowReportParam.daySensitive && getColumnIndex("关键词") != -1) {
				var rows = tb.tbody.rows.length;
				for(var i = 0; i < rows; i++){
					var kw = dataTmp[i][getColumnIndex("关键词")][1];	//当前行的关键词列
					if(kw == '【'){	//如果不分日且最后一行的关键词是虚拟出来的网盟数据
						var firstTdInRow = tb.tbody.rows[i].firstChild;
						if(firstTdInRow.firstChild){	//仅当目前有时间跳转链接时执行下列逻辑
							firstTdInRow.innerHTML = firstTdInRow.firstChild.innerHTML;	//去除日期列的时间跳转链接
						}	
					}
				}
			}
			
			var _nr = C('tr');
			var colsLength = tb.columns.length;
			
			var _nd = C('td');
			_nr.appendChild(_nd);
			_nd.align = 'left';
			_nd.innerHTML = '<b>　总计</b>';	
			
			if(tb.tbody.rows.length <= FOOT_TITLE_MIN_ROWS){	
				_nd.colSpan = colsLength;
			} else {	//超过FOOT_TITLE_MIN_ROWS阈值时，总计行显示表头数据项	
				for(var i = 1; i < colsLength; i++){	//跳过第一列
					var _td = C('td');
					_nr.appendChild(_td);
					_td.className = 'normal';
					_td.align = tb.columns[i].align;
					_td.innerHTML = tb.columns[i].title;
				}
			}
			
			tb.tfoot.insertBefore(_nr, tb.tfoot.rows[0]);
			Help.init();
		} else {
			tb.fillNull();
			p.hide();
		}
	} else {
		tb.fillNull();	
		p.hide();
		clearDownLink();	
	}
	
	hide(G("queryTableHeadUp"));
	hide(("queryTableHeadDown"));
	
	//增加对搜索词报告的数据回传处理
	//author luoyujia@baidu.com
	if (nowReportParam.reportType == 6) {
		//成功渲染完成，开始判断搜索词状态。
		//组装queryString
		var queryString = [];
		for (var i = startRecord % numPerPage; i < endRecord % numPerPage; ++i) {
			queryString[queryString.length] = dataTmp[i][0];
		}
		//清空关键词重复数据缓存
alert(1);
		QUERY_REPORT_RENDER.queryMap = {};
		mtlDWR.getQueryWordStat(USER_ID, queryString.join(";"), {
			callback : function(responseText) {
				if (responseText)
					QUERY_REPORT_RENDER.handleWordStateChange(responseText, startRecord);
				}
			});
		
		show(G("queryTableHeadUp"));
		show(G("queryTableHeadDown"));
		
		//初始化复选框
        var c1 = [],
			len = tb.tbody.rows.length;
        for (var i = 0; i < len; ++i) {
            c1[c1.length] = T(tb.tbody.rows[i].cells[0], "input")[0];
        }
        var sw = [T(tb.thead.rows[0].cells[0], "input")[0]];
        checkList.init(c1, sw, QUERY_REPORT_RENDER.setActiveStatus,
			QUERY_REPORT_RENDER.setActiveStatus,
			QUERY_REPORT_RENDER.setActiveStatus);
		
		//表格元素鼠标点击事件响应函数
		G("ReportTable").onclick = QUERY_REPORT_RENDER.tableClickHandler;
		G("queryKRUp").onclick = G("queryKRDown").onclick = QUERY_REPORT_RENDER.addwordsKR;
	}
}

/**
 * 点击面包屑发生的跳转
 * @param {int} clickMtlDim	当前点击的物料层级
 * @author zuming@baidu.com
 */
function breadLink(clickMtlDim) {
	requestType = 2;
	switch(clickMtlDim) {
		case 1:	// 点击账户，设置单位为账户
			nowReportParam.mtldim = reportUnitList[0][0][1];
			nowReportParam.accountid = 0;
			nowReportParam.accountName = "全部账户";
			nowReportParam.accountRange = (IS_PURE_FENGCHAO) ? 2 : 0;	// 点击账户时账户范围到所有账户
			nowReportParam.planid = 0;
			nowReportParam.planName = "全部推广计划";
			nowReportParam.unitid = 0;
			nowReportParam.unitName = "全部推广单元";
			nowReportParam.groupid = -1;
			nowReportParam.groupName = "全部关键词组";
			nowReportParam.wordid = 0;
			nowReportParam.wordName = "全部关键词";
			nowReportParam.platform = 0;
			nowReportParam.isFengchao = 0;
			buildReportRequestSend(nowReportParam);
			break;
		case 9:	// 点击专业版账户，设置单位为推广计划
			nowReportParam.mtldim = reportUnitList[2][1][1];
			nowReportParam.accountRange = 2;
			nowReportParam.planid = 0;
			nowReportParam.planName = "全部推广计划";
			nowReportParam.unitid = 0;
			nowReportParam.unitName = "全部推广单元";
			nowReportParam.groupid = -1;
			nowReportParam.groupName = "全部关键词组";
			nowReportParam.wordid = 0;
			nowReportParam.wordName = "全部关键词";
			//nowReportParam.platform = 1;
			nowReportParam.isFengchao = 2;
			buildReportRequestSend(nowReportParam);		
			break;
		
		case 3:	// 点击推广计划，设置单位为推广单元
			nowReportParam.mtldim = reportUnitList[2][2][1];
			nowReportParam.accountRange = 2;
			nowReportParam.unitid = 0;
			nowReportParam.unitName = "全部推广单元";
			nowReportParam.groupid = -1;
			nowReportParam.groupName = "全部关键词组";
			nowReportParam.wordid = 0;
			nowReportParam.wordName = "全部关键词";
			//nowReportParam.platform = 1;
			nowReportParam.isFengchao = 2;
			buildReportRequestSend(nowReportParam);		
			break;
		case 5:	// 点击推广单元，设置单位为关键词
			nowReportParam.mtldim = reportUnitList[2][3][1];
			nowReportParam.accountRange = 2;
			nowReportParam.groupid = -1;
			nowReportParam.groupName = "全部关键词组";
			nowReportParam.wordid = 0;
			nowReportParam.wordName = "全部关键词";
			//nowReportParam.platform = 1;
			nowReportParam.isFengchao = 2;
			buildReportRequestSend(nowReportParam);
			break;
	}
}

/**
 * 时间跳转
 * @author zuming@baidu.com
 */
function timeLink(link) {
    var rindex = getRowIndex(link.parentNode.parentNode);
    if (rindex != -1) {
        var param = {};
        for (v in nowReportParam) {
            param[v] = nowReportParam[v];
        }
        param.reportType = 0;
        param.daySensitive = 1;
        switch (+nowReportParam.mtldim) {
        case 1: // 账户
            param.reportType = 1;
            break;
        case reportUnitList[0][0][1]: // 账户
        	if(nowReportParam.reportType == 3){	//分地域报告时修改reportType
				param.reportType = nowReportParam.reportType;
			}
            var accTdIndex = getColumnIndex("账户");
            param.accountid = tableData[rindex][accTdIndex][0];
            param.accountName = tableData[rindex][accTdIndex][1];
            param.planid = 0;
            param.unitid = 0;
            param.groupid = -1;
            param.wordid = 0;
          	if (tableData[rindex][accTdIndex][1].indexOf("(历史)") != -1) {
                param.groupid2 = -11;
				param.isFengchao = 1;
            } else {
				param.groupid2 = -11;
				param.isFengchao = 2;
			}
            break;
        case reportUnitList[2][1][1]: // 推广计划
        	var accTdIndex = getColumnIndex("账户");
            var planTdIndex = getColumnIndex("推广计划");
            param.accountid = tableData[rindex][accTdIndex][0];
            param.accountName = tableData[rindex][accTdIndex][1];
            param.planid = tableData[rindex][planTdIndex][0];
            param.planName = tableData[rindex][planTdIndex][1];
            param.unitid = 0;
            param.groupid = -1;
            param.wordid = 0;
			param.isFengchao = 2;
            //param.groupid2 = 1;
            break;
        case reportUnitList[2][2][1]: // 推广单元
	        var accTdIndex = getColumnIndex("账户");
            var planTdIndex = getColumnIndex("推广计划");
            var unitTdIndex = getColumnIndex("推广单元");
            param.accountid = tableData[rindex][accTdIndex][0];
            param.accountName = tableData[rindex][accTdIndex][1];
            param.planid = tableData[rindex][planTdIndex][0];
            param.planName = tableData[rindex][planTdIndex][1];
            param.unitid = tableData[rindex][unitTdIndex][0];
            param.unitName = tableData[rindex][unitTdIndex][1];
            param.groupid = -1;
            param.wordid = 0;
			param.isFengchao = 2;
            //param.groupid2 = 1;
            break;
        case reportUnitList[2][3][1]: // 关键词
            if (param.accountRange == 2) {
                // 专业
				var accTdIndex = getColumnIndex("账户");
                var planTdIndex = getColumnIndex("推广计划");
                var unitTdIndex = getColumnIndex("推广单元");
                var wordTdIndex = getColumnIndex("关键词");
                param.accountid = tableData[rindex][accTdIndex][0];
       			param.accountName = tableData[rindex][accTdIndex][1];
                param.groupid = -1;
                param.planid = tableData[rindex][planTdIndex][0];
                param.planName = tableData[rindex][planTdIndex][1];
                param.unitid = tableData[rindex][unitTdIndex][0];
                param.wordid = tableData[rindex][wordTdIndex][0];
                param.unitName = tableData[rindex][unitTdIndex][1];
                param.wordName = tableData[rindex][wordTdIndex][1];
                param.groupid2 = -11;
				param.isFengchao = 2;
            }
            break;
		case reportUnitList[2][4][1]: // 创意
			var accTdIndex = getColumnIndex("账户");
            var planTdIndex = getColumnIndex("推广计划");
            var unitTdIndex = getColumnIndex("推广单元");
            param.accountid = tableData[rindex][accTdIndex][0];
   			param.accountName = tableData[rindex][accTdIndex][1];
            param.groupid = -1;
            param.planid = tableData[rindex][planTdIndex][0];
            param.planName = tableData[rindex][planTdIndex][1];
            param.unitid = tableData[rindex][unitTdIndex][0];
            param.unitName = tableData[rindex][unitTdIndex][1];
            param.groupid2 = -11;
			param.isFengchao = 2;
            break;
        }
        requestType = 2;
        buildReportRequestSend(param);
    }
}


/**
 * 获取当前点击的链接位于数据中的index
 * @param {Object} r
 * @return {int} 索引值
 * @author zuming@baidu.com
 */
function getRowIndex(r) {
	var trlist = tb.tbody.rows;
	for (var i = 0, len = trlist.length; i < len; i++) {
		if (r == trlist[i]) {
			return numPerPage * ( p._nowPage - 1 ) + i;
		}
	}
	return -1;	
}

/**
 * 鼠标移动到空间移动的链接时，弹出浮动窗
 * @param {Object} e	链接
 * @author zuming@baidu.com tongyao@baidu.com
 */
function spaceHover(e) {
	var t = e.srcElement || e.target;
	if (t.tagName != 'A') {
		return false;
	}
	var _index = getRowIndex(t.parentNode.parentNode);
	
	if (spaceLinkData.index == _index) {
		return;
	}
	spaceLinkData.index = _index;
	
	var _di = getColumnIndex("日期");
	spaceLinkData.date = tableData[_index][_di];
	
	var scrollTop;
	var scrollLeft;
	if (typeof window.pageYOffset != 'undefined') {
		scrollLeft = window.pageXOffset;
		scrollTop = window.pageYOffset;
	}
	else if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
		scrollLeft = document.documentElement.scrollLeft;
		scrollTop = document.documentElement.scrollTop;
	}
	else if (typeof document.body != 'undefined') {
		scrollLeft = document.body.scrollLeft;
		scrollTop = document.body.scrollTop;
	}

	var _left = e.pageX || scrollLeft + e.clientX;
	var _top = e.pageY || scrollTop + e.clientY;
	G("SpaceHoverDiv").style.left = _left + 2 + 'px';
	G("SpaceHoverDiv").style.top = _top - 40 + 'px';
	switch(nowReportParam.mtldim) {
		case 1: // 账户
			if (singleUser) {
				return;
			}
			G("SpaceReportLink").innerHTML = "账户报告";
			G("SpaceVenusLink").innerHTML = "";
			G("SpaceVenusLink").href = "javascript:void(0);";
			break;
		case reportUnitList[0][0][1]:	// 账户
			var _sAccI = getColumnIndex("账户");
			spaceLinkData.accountid = tableData[_index][_sAccI][0];
			spaceLinkData.accountName = tableData[_index][_sAccI][1];
			
			G("SpaceReportLink").innerHTML = "推广计划报告";
			G("SpaceVenusLink").innerHTML = "账户";
			G("SpaceVenusLink").href = VENUS_HOST + "plan/planListAction.do?userid=" + spaceLinkData.accountid;		
				
			/*
			if (t.innerHTML.indexOf("专业") == -1 && IS_BEFORE_DETACH) {
				G("SpaceReportLink").innerHTML = "关键词组报告";
				G("SpaceVenusLink").innerHTML = "账户";
				G("SpaceVenusLink").href = CLASSICS_BASE_URL + CLASSICS_GROUP_URL + spaceLinkData.accountid;				
			} else {
				G("SpaceReportLink").innerHTML = "推广计划报告";
				G("SpaceVenusLink").innerHTML = "账户";
				G("SpaceVenusLink").href = VENUS_HOST + "plan/planListAction.do?userid=" + spaceLinkData.accountid;		
			}
*/

			break;
		case reportUnitList[2][1][1]: // 推广计划
			var _sAccI = getColumnIndex("账户");
			var _pI = getColumnIndex("推广计划");
			if (_pI >= 0) {
				spaceLinkData.accountid = tableData[_index][_sAccI][0];
				spaceLinkData.accountName = tableData[_index][_sAccI][1];
				spaceLinkData.planid = tableData[_index][_pI][0];
				spaceLinkData.planName = tableData[_index][_pI][1];
				
				G("SpaceReportLink").innerHTML = "推广单元报告";
				if (tableData[_index][_pI][1].indexOf('已删除') == -1) {
					//G("SpaceVenusLink").innerHTML = "推广单元列表";
					G("SpaceVenusLink").innerHTML = "推广计划";
				} else {
					G("SpaceVenusLink").innerHTML = "";
				}
				G("SpaceVenusLink").href = VENUS_HOST + "unit/unitListAction.do?userid=" + spaceLinkData.accountid + "&planid=" + spaceLinkData.planid;
			}
			break;
		case reportUnitList[2][2][1]:	// 推广单元
			var _sAccI = getColumnIndex("账户");
			var _pI = getColumnIndex("推广计划");
			var _uI = getColumnIndex("推广单元");
			if (_pI >= 0 && _uI >= 0) {
				spaceLinkData.accountid = tableData[_index][_sAccI][0];
				spaceLinkData.accountName = tableData[_index][_sAccI][1];
				spaceLinkData.planid = tableData[_index][_pI][0];
				spaceLinkData.planName = tableData[_index][_pI][1];
				spaceLinkData.unitid = tableData[_index][_uI][0];
				spaceLinkData.unitName = tableData[_index][_uI][1];
				
				if(nowReportParam.accountRange == 2 && nowReportParam.platform == 2){	//网盟推广不提供关键词报告
					G("SpaceReportLink").innerHTML = "";
				} else {
					G("SpaceReportLink").innerHTML = "关键词报告";
				}
				
				if (tableData[_index][_uI][1].indexOf('已删除') == -1) {
					G("SpaceVenusLink").innerHTML = "推广单元";
				} else {
					G("SpaceVenusLink").innerHTML = "";
				}
				
				G("SpaceVenusLink").href = VENUS_HOST + "material/materialListAction.do?userid=" + spaceLinkData.accountid + "&planid=" + spaceLinkData.planid + "&unitid=" + spaceLinkData.unitid
			}
			break;
		case reportUnitList[2][3][1]:	// 关键词
			spaceLinkData.index = -1;
			return;
			break;		
		case reportUnitList[2][4][1]:	//粒度：创意
			if (nowReportParam.reportType == 6) {//类型：搜索词报告
				var queryAccountId = getColumnIndex("账户");
				var queryPlanId = getColumnIndex("推广计划");
				var queryUnitId = getColumnIndex("推广单元");
				if (queryPlanId >= 0 && queryUnitId >= 0) {
					spaceLinkData.accountid = tableData[_index][queryAccountId][0];
					spaceLinkData.planid = tableData[_index][queryPlanId][0];
					spaceLinkData.unitid = tableData[_index][queryUnitId][0];
					G("SpaceReportLink").innerHTML = "";
					//判断当前用户正在关注的对象，推广单元或者推广计划并跳转。
					//同时判断当前计划或单元是否已被删除。
					if (t.parentNode == tb.tbody.rows[_index % numPerPage].childNodes[queryPlanId] && t.innerHTML .indexOf("已删除") == -1) {//用户选择的是推广计划
						G("SpaceVenusLink").innerHTML = "推广计划";
						G("SpaceVenusLink").href = VENUS_HOST + "plan/planListAction.do?userid=" + spaceLinkData.accountid + "&planid=" + spaceLinkData.planid;
					} else if(t.innerHTML .indexOf("已删除") == -1) {
						G("SpaceVenusLink").innerHTML = "推广单元";
						G("SpaceVenusLink").href = VENUS_HOST + "unit/unitListAction.do?userid=" + spaceLinkData.accountid + "&unitid=" + spaceLinkData.unitid;
					} else {
						//计划或单元已删除，直接返回。
						return;
					}
				}
			}
			break;
	}
	show("SpaceHoverDiv");
}

/**
 * 空间跳转鼠标移动离开后
 * @author zuming@baidu.com tongyao@baidu.com
 */
function spaceOut() {
    var e = window.event || arguments[0];
    var t = e.srcElement || e.target;
    var reltg = (e.relatedTarget) ? e.relatedTarget : e.toElement;
    if (t.id == "SpaceHoverDiv") {
        while (reltg && reltg != t && reltg.tagName != 'BODY') {
            reltg = reltg.parentNode
        }
        if (reltg && reltg == t) {
            return false;
        }
    } else {
        if (t.tagName == 'A' && t.parentNode.tagName == "TD") {
            if (reltg && reltg.id == "SpaceHoverDiv") {
                return false;
            }
        } else {
            return false;
        }
    }
    spaceLinkData.index = -1;
    hide("SpaceHoverDiv");
}

/**
 * 空间跳转到其它报告
 * @author zuming@baidu.com
 */
function spaceReportLink() {
	spaceLinkData.index = -1;
	hide("SpaceHoverDiv");
	
	var param = {};
	for (v in nowReportParam) {
		param[v] = nowReportParam[v];
	}
	
	if (nowReportParam.daySensitive) {
		param.startDate = spaceLinkData.date.replace(/-/g,"");
		param.endDate = spaceLinkData.date.replace(/-/g,"");
	}
	
	switch(nowReportParam.mtldim) {
		case 1: // 账户
			param.mtldim = reportUnitList[0][0][1];
			//param.reportType = 2; // 分账户报告
			param.reportType = 0;
			param.accountid = 0;
			if (param.accountRange == 2) {
				var txt = (IS_BEFORE_DETACH) ? '专业版' : '';
				param.accountName = "全部" + txt + "账户";
				param.isFengchao = 2;
			} else if (param.accountRange == 0) {
				param.accountName = "全部账户";
				param.isFengchao = 0;					
			}
			break;

		case reportUnitList[0][0][1]:	// 账户
			param.accountRange = 2;
			param.reportType = 0;
			//param.platform = 1;
			param.mtldim = reportUnitList[2][1][1];				
			param.accountid = spaceLinkData.accountid;
			param.accountName = spaceLinkData.accountName;			
			param.planid = 0;
			param.planName = "全部推广计划";
			param.groupid2 = -11;
			param.isFengchao = 2;
			
			break;
			
		case reportUnitList[2][1][1]:	// 推广计划
			param.accountRange = 2;
			param.mtldim = reportUnitList[2][2][1];
			param.reportType = 0;
			param.accountid = spaceLinkData.accountid;
			param.accountName = spaceLinkData.accountName;			
			param.groupid = -1;
			param.planid = spaceLinkData.planid;
			param.planName = spaceLinkData.planName;
			param.unitid = 0;
			param.unitName = "全部推广单元";
			param.isFengchao = 2;
			break;
			
		case reportUnitList[2][2][1]:	// 推广单元
			param.accountRange = 2;
			param.mtldim = reportUnitList[2][3][1];
			param.reportType = 0;
			param.accountid = spaceLinkData.accountid;
			param.accountName = spaceLinkData.accountName;	
			param.groupid = -1;
			param.planid = spaceLinkData.planid;
			param.planName = spaceLinkData.planName;
			param.unitid = spaceLinkData.unitid;
			param.unitName = spaceLinkData.unitName;
			param.wordid = 0;
			param.wordName = "全部关键词"
			param.isFengchao = 2;
			break;
			
		case reportUnitList[2][3][1]:	// 关键词
		case reportUnitList[2][4][1]:	// 搜索词
			return false;
			break;		
	}
	requestType = 2;
	buildReportRequestSend(param);
}

/**
 * 点击关键词时发生的跳转
 * @param {Object} obj 点击的链接
 * @author zuming@baidu.com
 */
function spaceWordReportLink(obj) {
	spaceLinkData.index = -1;
	hide("SpaceHoverDiv");	
		
	var ri = getRowIndex(obj.parentNode.parentNode);
	var ci = getColumnIndex("关键词");
	var wid = tableData[ri][ci][0];
	
	
	// 专业
	var ai = getColumnIndex("账户");
	var aid = tableData[ri][ai][0];
	var aname = tableData[ri][ai][1];
	var pi = getColumnIndex("推广计划");
	var pid = tableData[ri][pi][0];
	var pname = tableData[ri][pi][1];
	var ui = getColumnIndex("推广单元");
	var uid = tableData[ri][ui][0];
	var uname = tableData[ri][ui][1];
	mtlDWR.getWinfoidByWordidAndUnitid(USER_ID, wid, uid, aid, {
		callback: getRightWordIsDelResponse(aid, aname, pid, pname, uid, uname)
	});		
	
}

/**
 * 专业版账户下关键词是否存在回调
 * @author zuming@baidu.com
 */
function getRightWordIsDelResponse(accid, accname, planid, planname, unitid, unitname) {
	return (function(data){
		if (rightValidate(data)) {
			if (+data == -1 || +data == -2) {
				alert("关键词已删除/转移");
			} else {
				var nf = Cform(WORD_SET_URL + accid, "POST");
				var fui = Cinput(nf, "userid", accid);
				var fpi = Cinput(nf, "planid", planid);
				var fpn = Cinput(nf, "planname", planname);
				var fui = Cinput(nf, "unitid", unitid);
				var fun = Cinput(nf, "unitname", unitname);
				var fwi = Cinput(nf, "winfoids", '[' + data + ']');
				nf.target = "_blank";
				nf.submit();
				nf = null;				
			}
		}
	});
}


/**
 * 每页显示页数发生改变时
 * @author zuming@baidu.com
 */
function numPerPageSelectChange() {
	numPerPage = +numPerPageSelect.getValue();
	var pageNum = Math.ceil(tableData.length / numPerPage);
	p.setLastPage(pageNum);
	getReportData(1);
}

///////// Flash 交互部分 /////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Flash读取完毕
 * @author zuming@baidu.com
 */
function flashLoaded() {
	if (Browser.IE > 0) {
		flashLoadedTag.line = true;
		flashLoadedTag.bar = true;
	}
	if (flashType == "ReportGraphyLineFlash1") {
		flashLoadedTag.line = true;
	} else {
		flashLoadedTag.bar = true;
	}
}

/**
 * 获取数据请求
 * @param {Object} obj
 * @author zuming@baidu.com
 */
function getData(obj) {
	if ((getFlashType() == 1 && flashLoadedTag.line) || (getFlashType() == 0 && flashLoadedTag.bar)) {
	//if (window.flashLoadedTag) {
		thisMovie(obj).getData();
	} else {
		setTimeout("getData('" + obj + "')", 500);
	}
}

/**
 * Flash显示Loading
 * @param {Object} obj
 * @author tongyao@baidu.com
 */
function startLoad(obj) {
	if ((getFlashType() == 1 && flashLoadedTag.line) || (getFlashType() == 0 && flashLoadedTag.bar)) {
	//if (window.flashLoadedTag) {
		thisMovie(obj).startLoad();
	} else {
		setTimeout("startLoad('" + obj + "')", 500);
	}
}

/**
 * 获取Flash
 * @param {String} movieName FlashID
 * @param {Object} 返回flash对象
 * @author zuming@baidu.com
 */
function thisMovie(movieName) {
	return document[movieName] || window[movieName];
}

/**
 * 设置数据
 * @return 返回flash需要的xml数据
 * @author zuming@baidu.com
 */
function setData() {
	return(xmlData);
}

//////////// Flash 数据及控制 //////////////////////////////////////////////////////////////////////////////////////////////

/**
 * setFlash
 * 在生成报告后调用，用于控制Flash图表是否显示
 * @author zuming@baidu.com tongyao@baidu.com
 */
function setFlash() {
	var len = tableData.length;
	if(isIE6){
		clearInterval(fixFlashRepeater);
		fixFlashTimer = 10;
	}
	// 判断是否分日，非分日的不显示
	if (nowReportParam.daySensitive) {
		setFlashItem();	 //根据表头判断图表可显示的指标类型
		sumItemsGroupByDate();  //合并属于同一天的数据,并对有关比值从新计算
		setFlashData();		//组装Flash所需XML数据
	} else {
		hideFlashContainer('ReportGraphyLine1');
		hideFlashContainer('ReportGraphyBar1');
	}	
}

/**
 * 合并属于同一天的数据,并对有关比值从新计算
 * @author tongyao@baidu.com
 */
function sumItemsGroupByDate() {

	//值传递而非引用传递 并将逆序日期转为顺序
	flashData = JSON.encode(tableData);
	eval("flashData = " +flashData);
	flashData.reverse();
	
	//获取当前表格的日期列
	var dateColumn = getColumnIndex("日期"),
	leng = flashData.length,
	emptyDateAdapter = []; //补全日期的适配器
	
	if(leng == 0){
		return true;
	}
	
	var len = flashData[0].length;
	for(var i = 1; i < len; i++){	
		emptyDateAdapter.push(0);	
	}
	
	for(var i = 0; i < leng; i++){
		for(var j = 0; j < len; j++){
			//将-转化为0
			flashData[i][j] = (flashData[i][j] == "-") ? 0 : flashData[i][j];		
		}
	}
	
	//请求数据的天数
	var startDate = stringToDate(nowReportParam.startDate);
	startDate.setHours(0,0,0,0);

	var endDate = stringToDate(nowReportParam.endDate);
	
	endDate.setHours(0,0,0,0);

	var requestDays = (startDate - endDate) / (24*3600*1000) + 1;
	
	/**
	 * sum() with group by date
	 */
	var j = 0;
	for (j = 0; j < flashData.length; j++) { //此处不可将flashData.length事先定义
		if (j != 0 && flashData[j - 1][dateColumn] == flashData[j][dateColumn]) {
			var length = flashData[j-1].length;
			if(length != 0){
				for (var x = 1; x < length; x++) {
					if(defaultReportTableTitle[x].title == '平均点击价格'){
						flashData[j - 1][x] = AVP(j);
					} else if(defaultReportTableTitle[x].title == '点击率'){
						flashData[j - 1][x] = CR(j);
					} else if (defaultReportTableTitle[x].title == '千次展现消费'){
						flashData[j - 1][x] = EX(j);
					} else  if (typeof flashData[j - 1][x] == "number"){
						flashData[j - 1][x] += flashData[j][x];
					}
				}
				arrayRemoveAt(flashData,j);
				j--;	
			}
		} else if(j != 0 ){
			var prevDate = new Date(flashData[j - 1][dateColumn].replace(/-/g,'/'));
			var currentDate = new Date(flashData[j][dateColumn].replace(/-/g,'/'));

			var gap = (currentDate - prevDate) / (24*3600*1000);
			
			//相邻两行间隔大于1天,进行补全
			if(gap > 1){
				for(var y = gap - 1; y > 0; y--){
					//生成该日日期
					
					var date = new Date(prevDate - 0 + (y * 24 * 3600 * 1000)),
					dataForQuery = ["0"].concat([dateToString(date,'YYYY-MM-DD')].concat(emptyDateAdapter)),
					dataForOther = [dateToString(date,'YYYY-MM-DD')].concat(emptyDateAdapter);
					flashData.splice(j, 0, (dateColumn == 1) ? dataForQuery : dataForOther);
				}
			}
		}
	}
	
	var firstDateInFlash = new Date(flashData[0][dateColumn].replace(/-/g,'/'));
	var endDateInFlash = new Date(flashData[flashData.length - 1][dateColumn].replace(/-/g,'/'));
	
	//开始日期不符，进行补全
	if (firstDateInFlash != startDate){
		var gap = (firstDateInFlash - startDate) / (24*3600*1000);
		for(var i = gap -1; i >= 0; i--){
			//生成该日日期
			var date = new Date(startDate - 0 + (i * 24 * 3600 * 1000)),
			dataForQuery = ["0"].concat([dateToString(date,'YYYY-MM-DD')].concat(emptyDateAdapter)),
			dataForOther = [dateToString(date,'YYYY-MM-DD')].concat(emptyDateAdapter);
			//稍微有些硬编码 但是没办法……新同学注意了！
			flashData.unshift((dateColumn == 1) ? dataForQuery : dataForOther);
		}
	}
	
	//结束日期不符，进行补全
	if (endDateInFlash != endDate){
		var gap = (endDate - endDateInFlash) / (24*3600*1000);
		for(var i = gap -1; i >= 0; i--){
			//生成该日日期
			var date = new Date(endDate - 0 - (i * 24 * 3600 * 1000)),
			dataForQuery = ["0"].concat([dateToString(date,'YYYY-MM-DD')].concat(emptyDateAdapter)),
			dataForOther = [dateToString(date,'YYYY-MM-DD')].concat(emptyDateAdapter);
			flashData.push((dateColumn == 1) ?  dataForQuery : dataForOther);
		}
	}
}

/**
 * 根据表头判断图表可展示的指标类型
 * @author tongyao@baidu.com
 */
function setFlashItem(){
	var html = '';
	if (getColumnIndex('点击量') != -1){
		html += '<input type="checkbox" name="reportItem" value="点击量" id="itemClk" /><label for="itemClk">点击量</label>';
	}
	
	if(getColumnIndex('消费') != -1){
		html += '<input type="checkbox" name="reportItem" value="消费" id="itemPay" checked="checked"/><label for="itemPay">消费</label>';
	}
	
	if (getColumnIndex('展现量') != -1){
		html += '<input type="checkbox" name="reportItem" value="展现量" id="itemShow"/><label for="itemShow">展现量</label>';
	}
	
	if(getColumnIndex('点击率') != -1){
		html += '<input type="checkbox" name="reportItem" value="点击率" id="itemClkrate"/><label for="itemClkrate">点击率</label>';
	}
	
	if(getColumnIndex('平均点击价格') != -1){
		html += '<input type="checkbox" name="reportItem" value="平均点击价格" id="itemAvgprice"/><label for="itemAvgprice">平均点击价格</label>';
	}
	
	if(getColumnIndex('千次展现消费') != -1){
		html += '<input type="checkbox" name="reportItem" value="千次展现消费" id="itemShowpay"/><label for="itemShowpay">千次展现消费</label>';
	}
	
	if(html != ''){
		G('item_radio').innerHTML = '<b>指标：</b>' + html;
	}
	
	ItemClass.init();
}

/**
 * Flash统计项选项类
 * @author tongyao@baidu.com
 */
var ItemClass = {
	
	// 可选最多的统计项
	maxCount: 3,

	// 目前计数器
	nowCount: 0,
	
	// 已选择项堆栈
	nowChecked: [],
	
	// 容器
	container: null,
	
	/**
	 * 将所有checkbox置为无效
	 */
	disableAll: function() {
		var list = T("item_radio", "input");
		for (var i = 0, len = list.length; i < len; i++) {
			if (!list[i].checked) {
				list[i].disabled = 1;
			}
		}	
	},

	/**
	 * 将所有checkbox置为有效
	 */
	availableAll: function() {
		var list = T("item_radio", "input");
		for (var i = 0, len = list.length; i < len; i++) {
			list[i].disabled = 0;
		}	
	},	
	
	/**
	 * 取得当前所选的统计项，返回所选checkbox的value数组
	 * @return {array} 
	 */
	getChecked: function() {
		var rel = [];
		for (var i = 0, len = ItemClass.nowChecked.length; i < len; i++) {
			rel.push(G(ItemClass.nowChecked[i]).value);
		}
		return rel;
	},
	
	/**
	 * 添加Item
	 */
	add: function(t){
		ItemClass.nowChecked.push(t.id);
		ItemClass.nowCount++;
		while (ItemClass.nowCount > ItemClass.maxCount) {
			// 如果已选项数量达到上限
			G(ItemClass.nowChecked[0]).checked = 0;
			ItemClass.del(G(ItemClass.nowChecked[0]));
		}
	},

	/**
	 * 删除Item
	 */
	del: function(t) {
		arrayRemoveAt(ItemClass.nowChecked, arrayHas(ItemClass.nowChecked,t.id));
		ItemClass.nowCount--;
	},
	
	/**
	 * 清空
	 */
	clear: function(){
		ItemClass.nowChecked.length = 0;
		ItemClass.nowCount = 0;
	},
	/**
	 * 点击事件处理
	 */
	_clickHandler: function() {
		var e = window.event || arguments[0];
		var t = e.target || e.srcElement;
		if (t.tagName.toLowerCase() == "input" && t.type.toLowerCase() == "checkbox") {
			if (t.checked) {
				ItemClass.add(t);				
			} else {
				ItemClass.del(t);
			}
			setFlashData();
		}
				
	},
	
	/**
	 * 获得加载时的选择状况
	 */
	_getInitStatus : function(){
		var list = T("item_radio", "input");
		for (var i = 0, len = list.length; i < len; i++) {
			if(list[i].checked){
				ItemClass.add(list[i]);
			}
		}	
	},
	
	/**
	 * 绑定点击事件
	 */
	init: function() {
		ItemClass.clear();
		ItemClass.container = G('item_radio');
		G("item_radio").onclick = ItemClass._clickHandler;
		ItemClass._getInitStatus();
	}
}

/**
 * setFlashData
 * 进行Flash所需XML数据的组装
 * @author tongyao@baidu.com
 */
function setFlashData() {
	G("ReportChartDiv").style.height = 'auto';
	
	var len = flashData.length;
	var dateColumn = getColumnIndex("日期");
	
	//对柱状图进行数量限制
	if(getFlashType() == 0 
	   && getFlashDataNumber() > DEF_MAX_BARGRAPHY
	   && len !=0){
	   		hideFlashContainer('ReportGraphyLine1');
			hideFlashContainer('ReportGraphyBar1');
			G('ReportChartDate1').innerHTML = '数据量过大，图表无法显示';
			return true;
	}
	
	G('ReportChartDate1').innerHTML = G('ReportDateRange').innerHTML;
	
	var items = ItemClass.getChecked();
	var length = items.length;
	var index = [];
	
	/*if(length == 0){
		//未选择任何指标时，Flash显示loading
		startLoad(flashType);
		return true;
	}*/
	
	for(var i = 0; i < length; i++){
		index[index.length] = getColumnIndex(items[i]);
	}

	var xml =[];
	var temp = [];
	xml[xml.length] = '<?xml version="1.0" encoding="utf-8"?>';
	
	for(var i = 0; i < length; i++){
		temp.push('tag'+ i +'="' + items[i] +'"')
	}	
	
	xml[xml.length] = '<data ' + temp.join(' ') + '>';
	
	for (var i = 0; i < len; i++) {
		var tmp =[];
		for (var j = 0; j < length; j++) {
			var data = null;
			if(items[j] == '点击率'){
				data = ctlrateItem(flashData[i][index[j]]);
			} else if (items[j] == '千次展现消费') {
				data = payavshowItem(flashData[i][index[j]]);
			} else {
				data = fixed(flashData[i][index[j]]);
			}
			tmp[tmp.length] = 'data' + j + '="' + data + '"'
		}
		var date = stringToDate(flashData[i][dateColumn], "YYYY-MM-DD").getDate() + '日';
		xml[xml.length] = '<record overTag="' + flashData[i][dateColumn] + '" xAxisTag="' + date +'" ' + tmp.join(' ') + '/>';
		tmp.splice(0,tmp.length);
	}

	xml[xml.length] = "</data>";
	xmlData = xml.join("");
	if(flashType == 'ReportGraphyLineFlash1'){
		showFlashContainer('ReportGraphyLine1');
		hideFlashContainer('ReportGraphyBar1');
	} else {
		showFlashContainer('ReportGraphyBar1');
		hideFlashContainer('ReportGraphyLine1');
	}
	getData(flashType);
    
    if (isIE6) { //修复IE6下Flash不显示的bug 
        fixFlashRepeater = setInterval(function() {
            fixFlashTimer = fixFlashTimer - 1;
            var zoom = G('ReportGraphyLine1').parentNode.style.zoom;
            if (zoom == 1) {
                G('ReportGraphyLine1').parentNode.style.zoom = '0';
            } else {
                G('ReportGraphyLine1').parentNode.style.zoom = '1';
            }
            
            if (fixFlashTimer <= 0) { //此修复仅循环10次
                clearInterval(fixFlashRepeater);
            }
        }, 300);
    }
}

/**
 * 隐藏Flash容器
 * @param {Object} obj
 * @author zuming@baidu.com
 */
function hideFlashContainer(obj) {
	obj = G(obj);
	obj.style.left = "-5000px";
}

/**
 * 显示Flash容器
 * @param {Object} obj
 * @author zuming@baidu.com
 */
function showFlashContainer(obj) {
	obj = G(obj);
	obj.style.left = "0px";
}

/**
 * 计算平均点击价格
 * @author tongyao@baidu.com
 */
function AVP(index) {
	var dataIndex = [-1, -1];	
	dataIndex[0] = getColumnIndex("消费");
	dataIndex[1] = getColumnIndex("点击量");
	
	var avpIndex = getColumnIndex("平均点击价格");
	
	/**
	 * 判断计算所用的两个运算数是否已在本循环之前执行过累加操作
	 * 如未执行过累加操作，则进行临时累加。
	 */
	if(dataIndex[0] < avpIndex){
		var operand1 = flashData[index - 1][dataIndex[0]];
	} else {
		var operand1 = flashData[index - 1][dataIndex[0]] + flashData[index][dataIndex[0]];
	}
	
	if(dataIndex[1] < avpIndex){
		var operand2 = flashData[index - 1][dataIndex[1]];
	} else {
		var operand2 = flashData[index - 1][dataIndex[1]] + flashData[index][dataIndex[1]];
	}

	
	return (operand2 != 0) ? fixed(operand1 / operand2) : 0;		
}

/**
 * 计算点击率
 * @author tongyao@baidu.com
 */
function CR(index) {
	var dataIndex = [-1, -1];
	dataIndex[0] = getColumnIndex("点击量");
	dataIndex[1] = getColumnIndex("展现量");
	
	var CRIndex = getColumnIndex("点击率");
	
	/**
	 * 判断计算所用的两个运算数是否已在本循环之前执行过累加操作
	 * 如未执行过累加操作，则进行临时累加。
	 */
	if(dataIndex[0] < CRIndex){
		var operand1 = flashData[index - 1][dataIndex[0]];
	} else {
		var operand1 = flashData[index - 1][dataIndex[0]] + flashData[index][dataIndex[0]];
	}
	
	if(dataIndex[1] < CRIndex){
		var operand2 = flashData[index - 1][dataIndex[1]];
	} else {
		var operand2 = flashData[index - 1][dataIndex[1]] + flashData[index][dataIndex[1]];
	}
	
	return (operand2 != 0) ? (operand1 / operand2).toFixed(4) : 0;	
}

/**
 * 计算千次展现消费
 * @author tongyao@baidu.com
 */
function EX(index) {
	var dataIndex = [-1, -1];
	dataIndex[0] = getColumnIndex("消费");
	dataIndex[1] = getColumnIndex("展现量");
	
	var EXIndex = getColumnIndex("千次展现消费");
	
	/**
	 * 判断计算所用的两个运算数是否已在本循环之前执行过累加操作
	 * 如未执行过累加操作，则进行临时累加。
	 */
	if(dataIndex[0] < EXIndex){
		var operand1 = flashData[index - 1][dataIndex[0]];
	} else {
		var operand1 = flashData[index - 1][dataIndex[0]] + flashData[index][dataIndex[0]];
	}
	
	if(dataIndex[1] < EXIndex){
		var operand2 = flashData[index - 1][dataIndex[1]];
	} else {
		var operand2 = flashData[index - 1][dataIndex[1]] + flashData[index][dataIndex[1]];
	}
	return (operand2 != 0) ? fixed((operand1 * 1000) / operand2) : 0;		
}

/**
 * 获取某个表头所在的index
 * @param {String} title	表头名称
 * @return {int} index
 * @author zuming@baidu.com
 */
function getColumnIndex(title) {
	if (columnIndex[title] >= 0) {
		return columnIndex[title];
	} else {
		return -1;
	}
	/* remove by zuming
	for (var i = 0; i < defaultReportTableTitle.length; i++) {
		if (defaultReportTableTitle[i].title == title) {
			return i;
		}
	}
	return -1;
    */
}

/**
 * 设置表格列hash
 */
function setColumnIndex() {
	columnIndex = {};
	for (var i = 0; i < defaultReportTableTitle.length; i++) {
		columnIndex[defaultReportTableTitle[i].title] = i;
	}
}

/**
 * 用于记录表格列
 */
var columnIndex = {};

/**
 * 获取如果生成flash图表的数据量(仅为柱状图计算)
 * @param {int} flash图表类型，1-折线 0-柱状
 * @return {int} flash图表的数据量
 * @author zuming@baidu.com, tongyao@baidu.com
 */
function getFlashDataNumber() {
	if (nowReportParam.daySensitive) {
		var d1 = stringToDate(nowReportParam.startDate);
		var d2 = stringToDate(nowReportParam.endDate);
		d1.setHours(0, 0, 0, 0);
		d2.setHours(0, 0, 0, 0);
		// 计算一共选择了多少个日期
		var dateNumber = (d2 - d1) / 1000 / 60 / 60 / 24;
		return dateNumber;
	} else {
		return 0;
	}
}


/////////////// Flash 结束 ///////////////////////////////////////////////////////////////////////////////

/**
 * 检查日期选择是否合法
 * @author zuming@baidu.com
 */
function checkDate() {	

	var _s = new Date(datePicker._ds._date);
	_s.setFullYear(_s.getFullYear() + 1);
	_s.setDate(_s.getDate() - 1);
	
	if (_s < datePicker._de._date) {
		return false;
	} else {
		return true;
	}
	
	/*
	var _d = new Date();
	_d.setFullYear(dp1._date.getFullYear() + 1, dp1._date.getMonth(), dp1._date.getDate() - 1);
	if (_d < dp2._date) {
		return false;
	} else {
		return true;
	}
	*/	
}

/**
 * 检查日期选择是否符合规则并给出提示
 * @author zuming@baidu.com
 */
function checkDateSelect() {
	if (checkDate()) {
		G("DateSelectError").innerHTML = "";
	} else {
		G("DateSelectError").innerHTML = "常规报告中可选的最大时间范围为一年，请您重新选择";
	}
}


var reportParamEnable = false;

/**
 * 生成报告时控制参数选择是否能选
 * @param {boolean} param true表示有效，false无效
 * @author zuming@baidu.com
 */
function reportParamEnableSet(param) {
	reportParamEnable = param;
	if (param) {
		accTypeSelect.enable()
		reportUnitSelect.enable();
		G("DatePickerContainer").className = "double-dp-avi";
		datePickerInit.containerHandleInit();
		
		rs1.enable();
		rs2.enable();
		rs3.enable();
		wordInput.readOnly = false;
		show("BuildReportBtn", 1);
	} else {
		accTypeSelect.disable();
		reportUnitSelect.disable();
		G("DatePickerContainer").className = "double-dp-dis";
		if (datePicker._cancelHandle) {
			datePicker._cancelHandle();
		}
		G("DatePickerContainer").onclick = null;
		
		rs1.disable();
		rs2.disable();
		rs3.disable();
		wordInput.readOnly = true;		
		hide("BuildReportBtn");
	}
	G("PromoMethodSelect").disabled = !param;
	var _c = T("ReportSize", "input");
	for (var i = 0; i < _c.length; i++) {
		_c[i].disabled = !param;
	}
	//添加对搜索词报告的强制分日处理
	if (G("Rr10").checked) {
		G("DailyReport").disabled = true;
	} else {
		G("DailyReport").disabled = !param;		
	}
	G("historySelectFilter").disabled = !param;
	G("historySelectSubmit").disabled = !param;
}

/**
 * 设置下载报告参数表单
 * @param {Object} param
 * @author zuming@baidu.com
 */
function setDownloadParam(param) {	
	G("Fuserid").value = param.userid;
	G("FaccountRange").value = param.accountRange;
	G("Fplatform").value = param.platform;
	G("FstartDate").value = param.startDate;
	G("FendDate").value = param.endDate;
	G("FreportType").value = param.reportType;
	G("FdaySensitive").value = param.daySensitive;	
	G("Faccountid").value = param.accountid;
	G("FspecifyType").value = param.specifyType;
	G("Fgroupid").value = param.groupid;
	G("Fgroupid2").value = param.groupid2;
	G("Fwordid").value = param.wordid;
	G("Fplanid").value = param.planid;
	G("Funitid").value = param.unitid;
	G("Fmtldim").value = param.mtldim;
	G("FisFengchao").value = param.isFengchao;
}

/**
 * 设置下载的是excel还是txt
 * @author zuming@baidu.com
 */
function setDownLink() {
	show("ReportDown");
	G("DownReportExcelLink").onclick = function() {
		downloadExcelFile();
		return false;
	}
	G("DownReportTextLink").onclick = function() {
		downloadTextFile();
		return false;
	}	
}

/**
 * 清除下载链接
 * @author zuming@baidu.com
 */
function clearDownLink() {
	hide("ReportDown");
	G("DownReportExcelLink").onclick = null;
	G("DownReportTextLink").onclick = null;
}

/**
 * 下载Excel文件
 * @author zuming@baidu.com
 */
function downloadExcelFile() {
	var nf = G("DefaultReportForm");
	nf.action = "downloadCsvReportdataAction.do";
	G("Ffcstar").value = getCookie('__cas__st__3');	//csrf token
	Cinput(nf,'fromars',IS_SF_REPORT);
	nf.submit();
}
/**
 * 下载Text文件
 * @author zuming@baidu.com
 */
function downloadTextFile() {
	var nf = G("DefaultReportForm");
	nf.action = "downloadTxtReportdataAction.do";
	G("Ffcstar").value = getCookie('__cas__st__3');	//csrf token
	Cinput(nf,'fromars',IS_SF_REPORT);
	nf.submit();
}

/**
 * 展现数控制
 * @author zuming@baidu.com
 */
function showItem(d) {
	if (d == '-') {
		return '-';
	} else {
		return Math.round(d);
	}
}

/**
 * 点击率
 * @author zuming@baidu.com
 */
function ctlrateItem(d) {
	if (d == '-') {
		return '-';
	} else {
		return fixed(100*d) + '%';
	}	
}

/**
 * 千次展现消费
 * @author zuming@baidu.com
 */
function payavshowItem(d) {
	if (d == '-') {
		return '-';
	} else {
		return fixed(d);
	}	
}

/**
 * 创意列输出
 * @param {Object} d 创意数组
 * @return {String} 创意html
 * @author zuming@baidu.com
 */
function cycont(d) {
	var tmp = [],
		className = 'idea noborder';
		
	tmp = IDEA_RENDER.idea(d, className);
	
	return(tmp.join(""));	
}

/**
 * 获取当前排序列对应的列索引
 * @param {String} title 列名
 * @return {int} 列索引
 * @author zuming@baidu.com
 */
function getNowSortIndex(title) {
	for (var i = 0, len = defaultReportTableTitle.length; i < len; i++) {
		if (defaultReportTableTitle[i].title == title) {
			return i;
		}
	}
}

/**
 * 按日期排序
 * @param {Object} di 排序顺序
 * @author zuming@baidu.com
 */
function sortByDate(di) {
	nowSortIndex = getNowSortIndex("日期");
	if (di == 'sortdown') {
		tableData.sort(sortBySPmethod);
	} else {
		tableData.sort(sortBySPmethod2);
	}
	getReportData(1);
}

/**
 * 按消费排序
 * @param {Object} di 排序顺序
 * @author zuming@baidu.com
 */
function sortByConsum(di) {
	nowSortIndex = getNowSortIndex("消费");
	if (di == 'sortdown') {
		tableData.sort(sortBySPmethod);
	} else {
		tableData.sort(sortBySPmethod2);
	}
	getReportData(1);
}

/**
 * 按价格排序
 * @param {Object} di 排序顺序
 * @author zuming@baidu.com
 */
function sortByPrice(di) {
	nowSortIndex = getNowSortIndex("平均点击价格");
	if (di == 'sortdown') {
		tableData.sort(sortBySPmethod);
	} else {
		tableData.sort(sortBySPmethod2);
	}
	getReportData(1);
}

/**
 * 按点击排序
 * @param {Object} di 排序顺序
 * @author zuming@baidu.com
 */
function sortByClick(di) {
	nowSortIndex = getNowSortIndex("点击量");
	if (di == 'sortdown') {
		tableData.sort(sortBySPmethod);
	} else {
		tableData.sort(sortBySPmethod2);
	}
	getReportData(1);
}

/**
 * 按展现排序
 * @param {Object} di 排序顺序
 * @author zuming@baidu.com
 */
function sortByShow(di) {
	nowSortIndex = getNowSortIndex("展现量");
	if (di == 'sortdown') {
		tableData.sort(sortBySPmethod);
	} else {
		tableData.sort(sortBySPmethod2);
	}
	getReportData(1);
}

/**
 * 按点击率排序
 * @param {Object} di 排序顺序
 * @author zuming@baidu.com
 */
function sortByCP(di) {
	nowSortIndex = getNowSortIndex("点击率");
	if (di == 'sortdown') {
		tableData.sort(sortBySPmethod);
	} else {
		tableData.sort(sortBySPmethod2);
	}
	getReportData(1);
}

/**
 * 按千次展现消费排序
 * @param {Object} di 排序顺序
 * @author zuming@baidu.com
 */
function sortBySP(di) {
	nowSortIndex = getNowSortIndex("千次展现消费");
	if (di == 'sortdown') {
		tableData.sort(sortBySPmethod);
	} else {
		tableData.sort(sortBySPmethod2);
	}
	getReportData(1);
}

/**
 * 排序函数 逆序
 * @param {Object} a
 * @param {Object} b
 * @author zuming@baidu.com
 */
function sortBySPmethod(a, b) {
	if (a[nowSortIndex] != '-' && b[nowSortIndex] != '-') {

		if (a[nowSortIndex] > b[nowSortIndex]) {
			return -1;
		} else if (a[nowSortIndex] < b[nowSortIndex]) {
			return 1;
		} else {
			return 0;
		}			
		
	} else {
		if (a[nowSortIndex] == '-' && b[nowSortIndex] == '-') {
			return 0;
		} else {
			if (a[nowSortIndex] == '-') {
				return 1;
			} else {
				return -1;
			}
		}
	}
}

/**
 * 排序函数 顺序
 * @param {Object} a
 * @param {Object} b
 * @author zuming@baidu.com
 */
function sortBySPmethod2(a, b) {
	if (a[nowSortIndex] != '-' && b[nowSortIndex] != '-') {
		if (a[nowSortIndex] < b[nowSortIndex]) {
			return -1;
		} else if (a[nowSortIndex] > b[nowSortIndex]) {
			return 1;
		} else {
			return 0;
		}
	} else {
		if (a[nowSortIndex] == '-' && b[nowSortIndex] == '-') {
			return 0;
		} else {
			if (a[nowSortIndex] == '-') {
				return 1;
			} else {
				return -1;
			}
		}
	}
}

/**
 * 输出日期列
 * @param {Object} d
 * @author zuming@baidu.com
 */
function setDate(d) {
	if (nowReportParam.daySensitive || !IS_PURE_FENGCHAO) {
		return d;
	} else {
		// 非分日
		return '<a href="#" onclick="timeLink(this);return false">' + d + '</a>';
	}
	
}

/**
 * 输出账户列
 * @param {Object} d
 * @author zuming@baidu.com
 */
function setAccount(d) {
	if (nowReportParam.mtldim == 1 && IS_PURE_FENGCHAO) {
		var tmp = [];
		tmp[tmp.length] = '<a href="#" onmouseout="spaceOut(event)" onmouseover="spaceHover(event);return false" onclick="spaceReportLink();return false">';
		tmp[tmp.length] = escapeHTML(d[1]);
		tmp[tmp.length] = '</a>';
		return tmp.join("");
	} else {
		return escapeHTML(d[1]);
	}
}

/**
 * 输出账户列
 * @param {Object} d
 * @author zuming@baidu.com
 */
function setSubAccount(d) {
	if (typeof d == 'string') {
		return escapeHTML(d);
	} else {
		if (nowReportParam.reportType!=3 	//分地域报告没有空间跳转。
			&& nowReportParam.mtldim == reportUnitList[0][0][1] && IS_PURE_FENGCHAO) {
			var tmp = [];
			tmp[tmp.length] = '<a href="#" onmouseout="spaceOut(event)" onmouseover="spaceHover(event)" onclick="spaceReportLink();return false">';
			tmp[tmp.length] = escapeHTML(d[1]);
			tmp[tmp.length] = '</a>';
			return tmp.join("");
		} else {
			return escapeHTML(d[1]);
		}
	}
}

/**
 * 输出推广计划列
 * @param {Object} d
 * @author zuming@baidu.com
 */
function setPlan(d) {
	if (typeof d == 'string') {
		return escapeHTML(d);
	} else {
		//增加推广计划渲染对搜索词报告的支持
		if ((nowReportParam.mtldim == reportUnitList[2][1][1] || nowReportParam.reportType == 6) && IS_PURE_FENGCHAO) {
			var tmp = [];
			tmp[tmp.length] = '<a href="#" onmouseout="spaceOut(event)" onmouseover="spaceHover(event)" onclick="spaceReportLink();return false">';
			tmp[tmp.length] = escapeHTML(d[1]);
			tmp[tmp.length] = '</a>';
			return tmp.join("");
		} else {
			return escapeHTML(d[1]);
		}
	}	
}

/**
 * 输出推广单元列
 * @param {Object} d
 * @author zuming@baidu.com tongyao@baidu.com
 */
function setUnit(d) {	
	if (typeof d == 'string') {
		return escapeHTML(d);
	} else {
		if ((nowReportParam.mtldim == reportUnitList[2][2][1] || nowReportParam.reportType == 6)  && IS_PURE_FENGCHAO) {
			var onClick = "spaceReportLink();return false;";
			var onMouseover = "spaceHover(event)";
			var onMouseout = "spaceOut(event)";
			if(nowReportParam.accountRange == 2 && nowReportParam.platform == 2){	//网盟推广不提供空间跳转
				onClick = 'return false;'
				if(d[1].indexOf('已删除') != -1){		//如果同时也不存在venus链接，则不显示浮动窗
					onClick = onMouseover = onMouseout = '';
				}
			}
			var tmp = [];
			if(onClick == '' && onMouseout == '' && onMouseout == ''){	//如果三个响应函数都不存在，则不以链接形式显示
				tmp[tmp.length] = escapeHTML(d[1]);
			} else {
				tmp[tmp.length] = '<a href="#" onmouseout="' + onMouseout + '" onmouseover="' + onMouseover + '" onclick="' + onClick + '">';
				tmp[tmp.length] = escapeHTML(d[1]);
				tmp[tmp.length] = '</a>';
			}
			return tmp.join("");
		} else {
			return escapeHTML(d[1]);
		}
	}	
}

/**
 * 输出关键词列
 * @param {Object} d
 * @author zuming@baidu.com
 */
function setWord(d) {
	if (typeof d == 'string') {
		return wordEscapeHTML(unescapeHTML(d));
	} else {
		if(d[1] == '【'){	//网盟推广关键词
			return '<i>' + LANG.MARS.BEIDOU_KEYWORD + '</i>';
		}
		if (nowReportParam.mtldim == reportUnitList[1][2][1] && IS_PURE_FENGCHAO) {
			var tmp = [];
			tmp[tmp.length] = '<a href="#" onclick="spaceWordReportLink(this);return false">';
			tmp[tmp.length] = wordEscapeHTML(unescapeHTML(d[1]));
			tmp[tmp.length] = '</a>';
			return tmp.join("");
		} else {
			return wordEscapeHTML(unescapeHTML(d[1]));
		}
	}	
}

/**
 * 更新表单
 * @author zuming@baidu.com
 */
function setFormShow() {
	accTypeSelect.setSelect(nowReportParam.accountRange);
	promoMethodSelect.setSelect(nowReportParam.platform);
	
	
	/*
	G("DailyReport").checked = nowReportParam.daySensitive;
	dp1._date = stringToDate(nowReportParam.startDate);
	dp1._dInput.value = dp1.dateFormat(dp1._date);
	dp2._date = stringToDate(nowReportParam.endDate);
	dp2._dInput.value = dp2.dateFormat(dp2._date);

	switch (nowReportParam.reportType) {
		case 0:
			G("Rr1").checked = true;
			break;
		case 1:
			G("Rr2").checked = true;
			break;
		case 2:
			G("Rr3").checked = true;
			break;
		case 8:
			G("Rr4").checked = true;
			break;
		case 9:
			G("Rr5").checked = true;
			break;
		case 10:
			G("Rr6").checked = true;
			break;
		case 11:
			G("Rr7").checked = true;
			break;
		case 14:
			G("Rr8").checked = true;
			break;
		case 15:
			G("Rr9").checked = true;
			break;
	}
	setRange();

	if (nowReportParam.reportType == 0) {
		reportUnitSelect.setSelect(nowReportParam.mtldim);
		switch (nowReportParam.mtldim) {
			case reportUnitList[0][0][1]:	// subacc
				rs1.setSelect(nowReportParam.accountid);
				break;
			case reportUnitList[1][1][1]:	// group
				rs1.setSelect(nowReportParam.accountid);
				rs2.setSelect(nowReportParam.groupid);
				break;
			case reportUnitList[1][2][1]:	// word
				if (nowReportParam.accountRange == 1) {
					rs1.setSelect(nowReportParam.accountid);
					rs2.setSelect(nowReportParam.groupid);						
					wordInput.value = unescapeHTML(nowReportParam.wordName);
				} else {
					rs1.setSelect(nowReportParam.planid);
					rs2.setSelect(nowReportParam.unitid);						
					wordInput.value = unescapeHTML(nowReportParam.wordName);						
				}
				break;
			case reportUnitList[2][1][1]:	// plan
				rs1.setSelect(nowReportParam.planid);
				break;
			case reportUnitList[2][2][1]:	// unit
				rs1.setSelect(nowReportParam.planid);
				rs2.setSelect(nowReportParam.unitid);				
				break;
			
		}
	}
	*/
}

// 排序索引
var nowSortIndex = -1;

// 表格列
var defaultReportTableTitle = [];

// 表格
var tb = new DataTable("ReportTable", defaultReportTableTitle, "100%", "常规报告");

// 总计行
var footData = [];

// 后台与colList的映射表
var colMapping = {
	"date": 0,
	"userid": 1,
	"subid": 2,
	"planid": 3,
	//"wgrpid": 4,
	"unitid": 4,
	"winfoid": 5,
	"paysum": 6,
	"avgprice": 7,
	"clks": 8,
	"shows": 9,
	"clkrate": 10,
	"showpay": 11,
	"ideaid" : 12,
	'provid' : 13,
	'query' : 14
};

// 表格字段定义
var colList = [	
	{"title":"日期", "align":"left","sort":sortByDate, "render": setDate},
	{"title":"账户", "align":"left","render": setAccount},
	{"title":"账户", "align":"left", "render":setSubAccount},	
	{"title":"推广计划", "align":"left", "render":setPlan},
	{"title":"推广单元", "align":"left", "render":setUnit},
	{"title":"关键词", "align":"left", "render":setWord},
	{"title":"消费", "align":"right", "render": fixed,"sort":sortByConsum},	
	{"title":"平均点击价格", "align":"right", "render": fixed,"sort":sortByPrice,needHelp:'平均点击价格'},
	{"title":"点击量", "align":"right", "render": round,"sort":sortByClick},
	{"title":"展现量", "align":"right", "render": showItem,"sort":sortByShow,needHelp:'展现量'},
	{"title":"点击率", "align":"right", "render": ctlrateItem,"sort":sortByCP,needHelp:'点击率'},
	{"title":"千次展现消费", "align":"right", "render": payavshowItem,"sort":sortBySP,needHelp:'千次展现消费'},
	{"title":"创意", "align":"left", "render": cycont},
	{"title":"地域", "align":"left"},
	{"title":"搜索词", "align":"left"}
];


// 统计对象单位
var reportUnitList = [
	[["账户", 2]],
	[["账户", 2], ["关键词组", 4], ["关键词", 6]],
	[["账户", 2], ["推广计划", 3], ["推广单元", 5], ["关键词", 6], ['创意', 7]]
];

// flash是否读取标示
//var flashLoadedTag = false;

var flashLoadedTag = {
	line: false,
	bar: false
};

/**
 *搜索词报告数据表格渲染处理对象
 *@author Yarm luoyujia@baidu.com
 */
var QUERY_REPORT_RENDER = {
	
	/**
	 *获取搜索词状态后的回调函数
	 */
	handleWordStateChange : function(responseText, startRecord) {
				
		//全局错误处理
		if (!rightValidate(responseText)) {
			return;
		} else if (responseText == "") {
			dwrErrorReturnNull();
			return;
		}
		
		//手动渲染
		var cellData = responseText.split(","), 
			len = cellData.length,
			actionColumnIndex = getColumnIndex("操作"),
			tmp;
		for (var i = startRecord; i < len; ++i) {//重新渲染操作列
			QUERY_REPORT_RENDER.reRenderCell(i, actionColumnIndex, cellData[i]);

			//搜索词去重处理，缓存行数据
			tmp = tableData[i][0];
			if (!QUERY_REPORT_RENDER.queryMap[tmp]) {
				QUERY_REPORT_RENDER.queryMap[tmp]= "" + i;
			} else {
				QUERY_REPORT_RENDER.queryMap[tmp] += "," + i;
				QUERY_REPORT_RENDER.queryMap.repeat = true;
			}
		}
	},
	
	/**
	 *添加否定关键词时的回调函数
	 */
	handleAddNegKWCallBack : function(responseArray) {
		//全局错误处理
		if (!rightValidate(responseArray)) {
			return;
		} else if (responseArray == "") {
			dwrErrorReturnNull();
			return;
		}
		
		eval("responseArray = " + responseArray);
		floatWindowShow("queryFloatWait",0);
		//构造新的浮出层显示
		var tmpData = {}, 
			i, 
			floatData = {};
		//取出存在于缓冲区的唯一数据
		for (i in QUERY_REPORT_RENDER.floatRowData) {
			break;
		}
		tmpData.data = QUERY_REPORT_RENDER.floatRowData[i].data;
		tmpData.failed = !(responseArray[0][0] == "true");
		//从配置文件中直接获取映射到错误类型的文字信息
		tmpData.message = (responseArray[0][0] == "true") ? //添加为否定关键词成功
			((G("qfaNegSelect").value == 1) ? //获取匹配模式
				"匹配模式：精确否定关键词" :
				"匹配模式：否定关键词") : 
			((LANG.QUERY[responseArray[0][0]]) ?
				LANG.QUERY[responseArray[0][0]] : //添加失败，读取失败信息 
				responseArray[0][1]); //添加失败，Aka错误
		//否定关键词标志位
		tmpData.negative = true;
		floatData[i] = tmpData;
		
		//添加否定关键词成功之后的日志记录
		FC_GE_LOG.send({
			action : "addKeywordFromQueryReportSuccess",
			isBatch : 1,
			amount : (tmpData.failed) ? 0 : 1,
			wmatch : G("qfaNegSelect").value - 0
		});
		
		//传入状态字2，显示添加否定关键词成功页面
		QUERY_REPORT_RENDER.showFloat(2, floatData);
	},
	
	/**
	 *添加关键词返回后的回调函数
	 */
	handleAddKWCallBack : function(responseArray) {//重新显示页面内容
		//全局错误处理
		if (!rightValidate(responseArray)) {
			return;
		} else if (responseArray == "ERR_NEWWORD_TOOMANY") {
			alert("单次不得超出100个");
			return;
		} else if (responseArray == "") {
			dwrErrorReturnNull();
			return;
		}
		
		eval("responseArray = " + responseArray);
		floatWindowShow("queryFloatWait",0);
		//根据回传数据创建新的浮动层数据
		var tmpData = {},
			//~ tmpData.length = 0;
			//计数器
			index = 0,
			succeedItems = 0;
		for(var i in QUERY_REPORT_RENDER.floatRowData) {//每条数据的格式为{data, failed, message, least}
			//数据回传时可保证QUERY_REPORT_RENDER.floatRowData为纯数据
			//~ ++tmpData.length;
			tmpData[i] = {};
			tmpData[i].data = QUERY_REPORT_RENDER.floatRowData[i].data;
			tmpData[i].failed = (responseArray[index][0] == "false");
			//构造信息。如果添加成功，则信息为：已添加！出价XX元
			//如果低于最低展现价格，则信息为：添加成功，出价XX元，最低展现价格为XX元
			//如果添加失败，则直接从LANG.QUERY中读取错误信息，或者直接读取回传数据中的错误信息
			tmpData[i].message = (LANG.QUERY[responseArray[index][1]]) ?//失败，从LANG.QUERY中读取错误信息
				LANG.QUERY[responseArray[index][1]] : (tmpData[i].failed ?//失败，直接读取错误数据
					responseArray[index][2] : (responseArray[index][2] ?//成功，但是低于最低展现价格
						('添加成功，出价' + responseArray[index][1] + '元') : //直接成功
						('已添加！出价' +  + responseArray[index][1] + '元')));
			tmpData[i].least = (responseArray[index][0] == "low") ? responseArray[index][2] : undefined;
			++index;
			//统计成功单词数
			if (!tmpData[i].failed) {
				++succeedItems;
			}
		}
		
		//添加关键词成功之后的日志记录
		FC_GE_LOG.send({
			action : "addKeywordFromQueryReportSuccess",
			isBatch : 1,
			amount : succeedItems,
			wmatch : (G("qfaSelect").value - 0)
		});
		
		//传入状态字2，显示添加成功页面
		QUERY_REPORT_RENDER.showFloat(2, tmpData);
	},
	
	setActiveStatus : function() {
		if (checkList.getLength() != 0) {
			qbaButton_Up.enable();
			qbaButton_Down.enable();
		} else {
			qbaButton_Up.disable();
			qbaButton_Down.disable();
		}
	},
	
	/**
	 *表格被点击之后的事件处理函数
	 */
	tableClickHandler : function(e) {
		
		var e = e || window.event,
			target = e.target || e.srcElement,
			tarId = target.id;
		if (tarId.match("queryAction")) {//表格中的操作列中的操作被点击。此处，只有表格中的操作列的id值满足条件。
			QUERY_REPORT_RENDER.queryActionHandler(e);
		}
	},
	
	/**
	 *表格上的KR链接被点击，触发主动推荐
	 */
	addwordsKR : function(e) {
		
		var nf = Cform(MERCURY_HOST + 'spread/initKeywordRecommend.do?userid=' + USER_ID + '&actv=true&refer=queryReportLink', 'post');
		nf.target = "_blank";
		Cinput(nf, 'userid', USER_ID);
		nf.submit();
	},
	
	/**
	 *批量操作的处理函数
	 */
	queryBanchHandler : function(e) {
		
		var e = e || window.event,
			target = e.target || e.srcElement;
		//记录日志
		FC_GE_LOG.send({
			action : "addKeywordFromQueryReport",
			isBatch :1
		});
		
		var floatData = {},//批量操作时，传入数据为一个哈希表
			uniqueId,
			checkedItems = checkList.getCheckedList(),
			len = checkedItems.length,
			rowIndex;
		for (var i = 0; i < len; ++i) {
			rowIndex = checkedItems[i].id.match(/\d+/)[0];
			uniqueId = tableData[rowIndex][0];
			if (!QUERY_REPORT_RENDER.queryMap[uniqueId].match(",") ||
				(QUERY_REPORT_RENDER.queryMap[uniqueId].split(",")[0] == rowIndex)) {//发现重复元素，并且当前元素不是重复元素中的第一个，则不显示该元素；
				
				floatData[rowIndex] = {};
				//获取存储于checkBox的id中的行索引数据并填充到floatData中。
				floatData[rowIndex].data = tableData[rowIndex];
			}
			//~ floatData[floatData.length] = tableData[i];
		}
		QUERY_REPORT_RENDER.showFloat(1, floatData);
	},
	
	buildCol : function(tar) {
		
		tar.unshift({"title": "","align": "left","width": "1%","noborder": true,"render": QUERY_REPORT_RENDER.renderCheckBox,"headRender": QUERY_REPORT_RENDER.renderCheckHead});
		tar[tar.length] = {"title": "操作","align": "left", "render": QUERY_REPORT_RENDER.renderQueryStatus};
	},
	
	/**
	 *对给定index的列进行重新渲染。该渲染操作同时也会为模型重新写入数据。
	 *注意写入起始行号，否则从第0行开始直到将dataArray中所有数据读取完成。
	 */
	reRenderCell : function(rowIndex, colIndex, cellData) {
		
			tableData[rowIndex][colIndex] = cellData;
			tb.tbody.rows[rowIndex % numPerPage].children[colIndex].innerHTML = 
				defaultReportTableTitle[colIndex].render(cellData, rowIndex);
	},
	
	/**
	 *对表格数据新型操作。
	 *该操作将在原来的数据上为表格添加首行和尾行操作。
	 *@param tbDataRow 原表格特定行的数据
	 */
	padData : function(rowIndex) {
		
		var tbDataRow = tableData[rowIndex];
		//注意！该方法存在硬编码，强制判断列数！
		//如果当前表格已经被渲染，则不需要再添加新的数据。
		//目前采取的方式是，硬编码。
		if (tbDataRow.length != 9) {
			tbDataRow.unshift("");
			tbDataRow[tbDataRow.length] = "";
		}
		tbDataRow[0] = rowIndex;
		//注意，因为表头中已经添加了新列，因此表格数据中获取到的index需要后移。
		//将表格行的唯一id值压入Checkbox等待渲染
		return tbDataRow;
	},
	
	/**
	 *渲染表头
	 */
	renderCheckHead : function(d) {
		
		return '<input id="selectAllCheckUp" type="checkbox"/>';
	},
	
	/**
	 *对表格首列进行填充。同时，该操作也会刷新表格数据
	 */
	renderCheckBox : function(d) {
		
		var bufData = [];
		//注意，当选择的列数据数改变时表格会被重新渲染。
		bufData[bufData.length] = tableData[d][getColumnIndex("账户")][0];
		bufData[bufData.length] = tableData[d][getColumnIndex("推广计划")][0];
		bufData[bufData.length] = tableData[d][getColumnIndex("推广单元")][0];
		bufData[bufData.length] = tableData[d][getColumnIndex("搜索词")];
		tableData[d][0] =  (bufData.join(",")).toLowerCase();
		return '<input id="queryCheck' + d + '" type="checkbox"/>';
	},
	
	/**
	 *渲染返回后的搜索词状体列
	 */
	renderQueryStatus : function(d, rowIndex) {
		
		//第一次载入页面或页面最大显示个数发生更改时直接返回
		if ((d == "") || (rowIndex == undefined)) {
			return;
		}
		var tmp = [];
		tmp[tmp.length] = '<div id= "qaDiv' + rowIndex + '" style="height:22px;" class="queryUsable ';
		tmp[tmp.length] = QUERY_REPORT_RENDER.queryStatus[d];
		//如果当前数据列不为0，即不可再操作，则将该行置为不可操作状态。
		if (d != "0") {
			QUERY_REPORT_RENDER._disableCheck(rowIndex % numPerPage);
		}
		return tmp.join("");
	},
	
	/**
	 *搜索词报告末尾列操作点击事件处理函数
	 */
	queryActionHandler : function(e) {
		
		var e = e || window.event,
			target = e.target || e.srcElement;
		//显示浮动层的同时添加缓存数据
		if (target.id != "queryActionButton") {//添加为关键词
			
			var rowIndex = getRowIndex(target.parentNode.parentNode.parentNode),
				//用哈希传入数据，键值为行号
				tmp = {};
				tmp[rowIndex] = {};
			tmp[rowIndex].data = tableData[rowIndex];
			QUERY_REPORT_RENDER.showFloat(((target.id == "queryActionNeg") ? 0 : 1), tmp);
		} else {//操作按钮
			QUERY_REPORT_RENDER.showQueryNegative(getRowIndex(target.parentNode.parentNode.parentNode));
		}
	},
	
	/**
	 *搜索词报告弹出框鼠标点击事件处理函数
	 */
	queryFloatChlickHandler : function(e) {
		
		var e = e || window.event,
			target = e.target || e.srcElement,
			tagName = target.tagName.toLowerCase();
		//当浮出层上的“删除”、“更多推荐”等超链接被点击
		if (tagName == "a") {
			if(target.id.match("removeQuery")) {//删除某项
				//同时处理视图和模型数据
				QUERY_REPORT_RENDER.removeQuery(target.parentNode);
			} else if (target.id.match("linkToPasvKR")) {//更多推荐KR入口
				//取得存储于id中的数字作为index
				QUERY_REPORT_RENDER.linkToPasvKR(target.id.match(/\d+/));
			} else if (target.id.match("modifyKwBid")) {//关键词设置KR入口
				QUERY_REPORT_RENDER.modifyKwBid(target.id.match(/\d+/));
			}
		} else if (target.name == "bidCheck") {//添加关键词时复选框被点击
			var node = G("selfBidInput"),
				//flag用于表示是否为“自定义”出价被点击，据此禁用“确定”按钮，并且清空自定义文本框之后的错误信息。
				flag = G("qfaSelfBid").checked;
			node.style.visibility = flag ? "visible" : "hidden";
			node.value = "0";
			G("queryFloatConfirmPos").disabled = flag;
			G("selfBidTip").innerHTML = "";
		} else if (target.type == "button" && !target.disabled) {//确定、取消按钮被点击
			
			//做一次强制隐藏。原控件可能导致的问题：如果未隐藏而直接再次显示，则可能出现显示错位的bug。
			floatWindowShow("addQueryFloat",0);
			
			if (target.id.match("queryFloatConfirm")) {//确定，发送数据
				//添加一个“请等待，数据处理中...”的浮动层
				floatWindowShow("queryFloatWait",1);		
				//强制focus防止用户误点回车。
				G("queryFloatWait").focus();
				//组装和记录查询列
				var queryString = [];
				//floatRowData为一个哈希表。
				for (var i in QUERY_REPORT_RENDER.floatRowData) {
					//~ if (i == "length") {
						//~ continue;
					//~ }
					queryString[queryString.length] = QUERY_REPORT_RENDER.floatRowData[i].data[0];
				}
				
				if (target.id == "queryFloatConfirmPos") {//添加关键词
					//出价信息
					var bid = (G("qfaSelfBid").checked) ? (G("selfBidInput").value - 0) 
						: ((G('qfaUnitBid').checked) ? 0 : -1);
					MarsWordMgr.addKeywordsFromQueryReport(USER_ID, queryString.join(";"), bid, G("qfaSelect").value, {
						callback : QUERY_REPORT_RENDER.handleAddKWCallBack});
				} else {//添加否定关键词
					MarsWordMgr.addNegativesFromQueryReport(USER_ID, queryString.join(";"), G("qfaNegSelect").value, {
						callback : QUERY_REPORT_RENDER.handleAddNegKWCallBack});
				}
			} else if (target.id == "queryFloatClose") {//关闭按钮被点击，刷新表格数据
				QUERY_REPORT_RENDER.queryFloatCloseHandler();
			}
			//所有按钮均会触发批量操作的重置
			QUERY_REPORT_RENDER.setActiveStatus();
		}
	},
	
	/**
	 *关闭浮动层及表格数据更新
	 */
	queryFloatCloseHandler : function() {
		
		//使用交互数据缓冲区的数据对表格重新渲染
		//注意，此时数据已经是一个哈希表
		var actionColumnIndex = getColumnIndex("操作"),
			repeatRows,
			status,
			len,
			j;
		for (var i in QUERY_REPORT_RENDER.floatRowData) {
			//~ if (i == "length") {//当遍历至length元素时跳过
				//~ continue;
			//~ }
			if (!QUERY_REPORT_RENDER.floatRowData[i].failed) { //（否定）关键词添加成功
				//重新渲染操作列
				QUERY_REPORT_RENDER.reRenderCell(i, 
					actionColumnIndex, 
					(QUERY_REPORT_RENDER.floatRowData[i].negative ? //未被添加为关键词
						((QUERY_REPORT_RENDER.floatRowData[i].message.match("精确")) ? "3" : "2") : //读取匹配模式
						"1"));
			} else if (QUERY_REPORT_RENDER.floatRowData[i].message.match("被删除")) {//单元或计划已被删除。此message源自错误信息中的message。
				QUERY_REPORT_RENDER.reRenderCell(i, actionColumnIndex, "-1");
			}
			
			//重复元素判断
			repeatRows = QUERY_REPORT_RENDER.queryMap[(QUERY_REPORT_RENDER.floatRowData[i]["data"]["0"])];
			if (repeatRows.match(",")) {//发现重复元素
				repeatRows = repeatRows.split(",");
				len = repeatRows.length;
				status = tableData[i][actionColumnIndex];
				for (j = 0; j < len; ++j) {//遍历所有重复行，并选择性地重新渲染。
					//如果当前行已渲染，则跳过
					if (repeatRows[j] != i) {
						QUERY_REPORT_RENDER.reRenderCell(repeatRows[j], actionColumnIndex, status);
					}
				}
			}
		}
	},
	
	/**
	 *禁用特定行的复选框
	 */
	_disableCheck : function(index) {
		
		var node = G("queryCheck" + index);
		//将复选框置灰
		node.disabled = true;
		node.checked = false;
		tb.table.rows[(index - 0) + 1].className="";
	},
	
	/**
	 *搜索词报告弹出框键盘事件处理函数
	 */
	queryFloatKeyupHandler : function(e) {
		
		var e = e || window.event,
			target = e.target || e.srcElement;
		//添加关键词时自定义出价文本框触发事件		
		//将提示文本内容置空
		G("selfBidTip").innerHTML = "";
		
		//禁用“确定”按钮，阻止非法数据提交
		G("queryFloatConfirmPos").disabled = true;
		
		var value = G("selfBidInput").value;
		if (value == "") {//文本框为空
			return;
		} else if (isNaN(value)) {//出价中包含非数字
			G("selfBidTip").innerHTML="出价必须为数字";
		} else if (value.match(/\.\d{3,}/)) {//多余2位小数
			G("selfBidTip").innerHTML="出价只能保留两位小数";
		} else {
			value = value - 0;
			if (value == 0) {//出价为0
				G("selfBidTip").innerHTML="出价必须高于0元";
			} else if (value >= 1000) {
				G("selfBidTip").innerHTML="出价不能高于999.99元";
			} else {//识别成功，恢复“确认按钮”
				G("queryFloatConfirmPos").disabled = false;
			}
		}
	},
	
	/**
	 *当添加否定关键词时select控件选项变化时的处理函数
	 */
	selectChangeHandler : function(node) {
		if (node.value == "1") {//1：精确否定关键词
			G("queryNegtivePre").style.display="";
			G("queryNegtiveNor").style.display="none";
		} else {//0：否定关键词
			G("queryNegtivePre").style.display="none";
			G("queryNegtiveNor").style.display="";
		}
	},
	
	/**
	 *控制操作列中的“添加为否定关键词”的显示和隐藏
	 */
	showQueryNegative : function(rowIndex) {
		
		var node = G("qaDiv" + rowIndex);
		node.style.height = (node.style.height == "22px") ? "44px":"22px";
	},
	
	/**
	 *显示浮动提示框，该提示框中将展示用户的操作：添加关键词、添加否定关键词
	 *@negative {boolean} 当前状态：0，添加否定关键词;1：添加关键词；2：批量添加关键词
	 *@rowData 行数据。当为多行操作时，该参数应为一个包含多列数据的数组。
	 */
	showFloat : function(status, rowData) {
		
		if (status == 0 || status == 1) {//添加（否定）关键词时记录日志
			//记录日志			
			FC_GE_LOG.send({
				action : ((status) ? "addKeywordFromQueryReport" : "addNegwordFromQueryReport"),
				isBatch : 0
			});
		}
		
		QUERY_REPORT_RENDER.floatRowData = rowData;
		//计算rowData的行数
		var tmp, 
		
			randData = false,//缓存rowData中的最后一组数据，用于判断是否添加偏移量
			len = 0, 
			msg = QUERY_REPORT_RENDER.queryMsg,
		
			//分别缓存成功和失败的关键词列表，如果列表长度为0则不显示
			successItems = [],
			failedItems = [],
			tmpItem,
			
			//构造消息体上方的提示文字
			msgTip;
		for(tmp in rowData) {
			++len;
			randData = tmp;
		}
		var offset = (rowData[randData].negative) ? 6 : 0, //添加否定关键词成功时偏移量为6
			tmp = [];
		//根据不同状态决定偏移量，根据偏移量从缓存数据中取值并在特定位置显示。
		tmp[tmp.length] = '<h3><span>';
		tmp[tmp.length] = ((len == 1) ? "" : "批量") + msg[status][0 + offset];
		tmp[tmp.length] = '</span><span class="closebtn" id="qfCanlcel" onmouseover="closeBtnClass(this, 1);" onmouseout="closeBtnClass(this, 0);"></span></h3>';
		tmp[tmp.length] = '<div class="qfBody" id="qfBody">';
		//上层数据，添加（否定）关键词时为关键词列表，返回结果时为添加成功的关键词列表。
		//填充消息体
		//当指定为批量操作时，消息体内数据更改
		//~ var len = rowData.length;
		//~ for (var i = 0; i < len; ++i) {
		for (var i in rowData) {
			//当消息符合条件时创建，否则创建至失败列表
			//注意，!rowData.status可能为两种情况：undefined、false。
			//~ if (i == "length") {
				//~ continue;
			//~ }
			tmpItem = QUERY_REPORT_RENDER.buildMessageItem(i, msg[status], offset, ((len > 1 && !rowData[randData].message) ? "取消" : undefined));
			if (rowData[i].failed) {
				failedItems[failedItems.length] = tmpItem;
			} else {
				successItems[successItems.length] = tmpItem;
			}
			//重复信息提示是否显示的标志位
			if (QUERY_REPORT_RENDER.queryMap[rowData[i].data[0]].match(",")) {//当前元素与其他元素重复
				msgTip = true;
			}
		} 
		//是否显示重复信息
		msgTip = msgTip ?  QUERY_REPORT_RENDER.duplicatedMsg : "";
		//添加成功关键词列表
		if(successItems.length != 0) {
			//成功信息
			tmp[tmp.length]  = QUERY_REPORT_RENDER._buildMsgArea(msg[status][1], msg[status][2 + offset]  + msgTip, successItems);
		}
		//添加失败关键词列表
		if(failedItems.length != 0) {
			//失败信息
			//当成功信息中已经显示了重复提示时，忽略此处的重复提示。
			msgTip = (successItems.length == 0) ? msgTip : "";
			tmp[tmp.length]  = QUERY_REPORT_RENDER._buildMsgArea(msg[status][1], msg[status][5 + offset] + msgTip, failedItems);
		}
		//填充弹出框的操作栏
		tmp[tmp.length] = QUERY_REPORT_RENDER.queryFloatAction[status];
		tmp[tmp.length] = QUERY_REPORT_RENDER.queryFloatConfrim[status];
		html(G("addQueryFloat"), tmp.join(""));
		
		//添加事件处理函数
		G("qfBody").onclick = QUERY_REPORT_RENDER.queryFloatChlickHandler;
		if (status == 1) {
			var node = G("selfBidInput");
			node.onchange = QUERY_REPORT_RENDER.queryFloatKeyupHandler;
			//用于修复Firefox下onchange事件不能及时被响应的问题
			node.onkeyup=function() {node.blur();node.focus();};
		}
		
		G("qfCanlcel").onclick = function(){
			floatWindowShow('addQueryFloat',0);
			if (status == 2) {
				QUERY_REPORT_RENDER.queryFloatCloseHandler();
			}
			QUERY_REPORT_RENDER.setActiveStatus();
		}
		
		floatWindowShow("addQueryFloat",1);
		
		//显示浮动层时强制将当前浮动层的第一个按钮状态置为focus，否则将会在用户持续点击时触发异常。
		var floatButtons = G("addQueryFloat").getElementsByTagName("input"),
			buttonSizes = floatButtons.length,
			i;
		for (i = 0; i < buttonSizes; ++i) {
			if(floatButtons[i].type == "button") {
				floatButtons[i].focus();
				break;
			}
		}
	},
	
	/**
	 *创建消息体
	 */
	_buildMsgArea : function(head1, head2, items) {
		
		var tmp = [];
		tmp[tmp.length] = '<div class="qfHead">';
		tmp[tmp.length] = head1;
		tmp[tmp.length] = '<span class="queryRed">' + items.length;
		tmp[tmp.length] = '</span>' + head2;
		//决定返回框的最大高度
		tmp[tmp.length] = '</div><div class="' + ((items[0].match(/queryMsgItem/g).length == 3) ?  "queryMsgAreaBack" : "queryMsgArea") + '">';
		tmp[tmp.length] = items.join("");
		tmp[tmp.length] = '</div>';
		return tmp.join("");
	},
	
	/**
	 *为关键词报告的浮出层构造关键词的消息数据项。
	 */
	buildMessageItem : function(index, msg, offset, cancelButton) {
		
		var rowData = QUERY_REPORT_RENDER.floatRowData,
			result = [];
		result[result.length] = '<div id="queryItem' + index + '">';
		//判断是否需要对每一项数据的“取消”按钮
		if(cancelButton) {
			result[result.length] = '<a class="queryFloatCancel" href="javascript:;" id="removeQuery' + index + '">' + cancelButton + '</a>';
		}
		result[result.length] = '<div class="queryMsgHead"><b>';
		result[result.length] = rowData[index].data[getColumnIndex("搜索词")];
		result[result.length] = '</b></div><div class="queryMsgItem"><span class="queryGrayer">';
		result[result.length] = msg[4 + offset] + '</span>';
		result[result.length] = rowData[index].data[getColumnIndex("推广计划")][1];
		result[result.length] = '</div><div class="queryMsgItem"><span class="queryGrayer">';
		result[result.length] = msg[3 + offset] + '</span>';
		result[result.length] = rowData[index].data[getColumnIndex("推广单元")][1];
		//判断是否需要添加额外信息
		if(rowData[index].message) {
			result[result.length] = '</div><div class="queryMsgItem">';
			if (rowData[index].failed) {//添加失败
				result[result.length] = '<span class="queryRed">提示：';
				result[result.length] = rowData[index].message;
				result[result.length] = '</span><br>';
			} else {//添加成功
				result[result.length] = '<span class="queryGreen">';
				result[result.length] = rowData[index].message;
				//当offset等于6时为添加否定关键词返回信息。
				if (offset == 6) {
					result[result.length] = '</span><br>';
				} else if (!rowData[index].least) {//无最低展现价格项，即完全成功
					result[result.length] = '</span>&nbsp;&nbsp;&nbsp;&nbsp;<a id="linkToPasvKR' + index + '">更多推荐</a><br>';
				} else {//低于最低展现价格
					result[result.length] = '</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="queryRed">最低展现价格为' + rowData[index].least;
					result[result.length] = '元&nbsp;&nbsp;&nbsp;&nbsp;</span><a id="modifyKwBid' + index;
					result[result.length] = '">点这里修改</a><br>';
				}
			}
		}
		result[result.length] = '</div></div>';
		return result.join("");
	},
	
	/**
	 *从弹出框中删除某一个搜索词
	 */
	removeQuery : function(node) {
		
		node.parentNode.removeChild(node);
		//删除rowDatas中特定的行
		//从node中取出当前正在处理的数据的缓存位置
		delete QUERY_REPORT_RENDER.floatRowData[node.id.match(/\d/)[0] - 0];
		//添加判断，如果框中只剩一个词，则不能再取消。
		var len = getLength(QUERY_REPORT_RENDER.floatRowData),
			tmp;
		if (len == 1) {
			//查找最后剩下的元素，并隐藏其”取消“按钮
			for (tmp in QUERY_REPORT_RENDER.floatRowData) {
				if (tmp!="length") break;
			}
			G("removeQuery" + tmp).style.display = "none";
		}
	},
	
	/**
	 *获得更多推荐KR入口
	 */
	linkToPasvKR : function(index) {
		
		var refer = (getLentgh(QUERY_REPORT_RENDER.floatRowData) == 1) ? 'queryReportAddWord' : 'queryReportAddWordBatch',
			rowData = QUERY_REPORT_RENDER.floatRowData[index].data,
			word = wordEscapeHTML(rowData[getColumnIndex("搜索词")]).replace(/\r/g, '').split("\n").join(""),
			nf = Cform(MERCURY_HOST + 'spread/InitAddWordsKR.do?userid=' + USER_ID + '&refer=' + refer + '&wordText=' + encode(word.replace(/'/g,"\\\&#39;"), 'post')),
			plan = rowData[getColumnIndex("推广计划")],
			unit = rowData[getColumnIndex("推广单元")];
		nf.target = "_blank";
		Cinput(nf, 'userid', USER_ID);
		Cinput(nf, 'planid', plan[0]);
		Cinput(nf, 'planname', plan[1]);
		Cinput(nf, 'unitid', unit[0]);
		Cinput(nf, 'unitname', unit[1]);
		nf.submit();
	},
	
	/** 
	 *修改关键词入口
	 */
	modifyKwBid : function(index) {
		
		var rowData = QUERY_REPORT_RENDER.floatRowData[index].data[0].split(","),
			form = Cform(VERNES_HOST + 'material/wordOpAction.do?userid=' + USER_ID);
		form.target = "_blank";
		Cinput(form,'winfoids','[' + rowData[3] + ']');
		Cinput(form,'userid',USER_ID);
		Cinput(form,'planid',rowData[1]);
		Cinput(form,'unitid',rowData[2]);
		form.submit();
	},
	
	queryMsg : [
		//添加否定关键词
		["添加否定关键词", "您要添加为单元级别的否定关键词有", '个：<br><span class="queryGrayer qfaHeadMsg">以下词被搜索到后将不触发您的推广结果。</span>', "推广单元：", "推广计划："],
		//单独添加关键词
		["添加关键词", "您要添加的关键词有", "个：", "所属推广单元：", "所属推广计划："],
		//添加关键词成功和添加否定关键词成功将共享这一组状态字，因为页面中的其他内容二者是一致的；通过偏移量决定界面显示内容。
		["添加关键词", "以下", "个关键词已添加：", "所属推广单元：", "所属推广计划：", "个关键词未成功：", "添加否定关键词", "以下", "个关键词已添加为否定关键词：", "所属推广单元：", "所属推广计划：", "个关键词未被添加为否定关键词："],
	],
	
	/**
	 *应用于浮出层中“添加关键词”等操作时的操作按钮。
	 */
	queryFloatAction : [
		//添加否定关键词
		'<div class="qfaSelectDiv">\
			<p style="padding:0;display:inline">匹配模式：</p>&nbsp;\
			<select id="qfaNegSelect" onchange="QUERY_REPORT_RENDER.selectChangeHandler(this);">\
				<option value="1" selected="true">精确否定关键词</option>\
				<option value="0">否定关键词</option>\
			</select>\
			<span class="queryGrayer" id="queryNegtivePre">即搜索词与所选词完全一致</span>\
			<span class="queryGrayer" id="queryNegtiveNor" style="display:none">即搜索词中完全包含所选词</span>\
		</div>',
		//添加关键词
		'<div class="queryPositive"><p style="padding:0;display:inline">出价：</p>\
			<input type="radio" name="bidCheck" id="qfaUnitBid" class="qfaBidCheck" checked="true"/><label for="qfaUnitBid">采用所属单元出价</label>\
			<div class="floatCheckOffset"><input type="radio" name="bidCheck" id="qfaLeastBid" class="floatCheckOffset"/><label for="qfaLeastBid">采用最低展现价格</label></div>\
			<div class="floatCheckOffset"><input type="radio" name="bidCheck" id="qfaSelfBid" class="qfaBidCheck"/><label for="qfaSelfBid">自定义</label>\
			<input type="text" value="0" id="selfBidInput" size="3" style="visibility:hidden" maxlength="6"/>\
			<span id="selfBidTip" style="color:#ff0000"/></span></div>\
		</div>\
		<div class="qfaSelectDiv">\
			<p style="padding:0;display:inline">匹配模式：</p>&nbsp;\
			<select id="qfaSelect">\
				<option value="2" selected="true">广泛</option>\
				<option value="0">精确</option>\
				<option value="1">短语</option>\
			</select>\
		</div>',
		//添加（否定）关键词返回状态
		'<div><br></div>'],
	
	/**
	 *应用于浮动层中的确定按钮
	 */
	queryFloatConfrim : [
		'<div><input type="button" value="确定" id="queryFloatConfirmNeg"/>&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" value="取消" id="queryFloatCancel"/></div>',
		'<div><input type="button" value="确定" id="queryFloatConfirmPos"/>&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" value="取消" id="queryFloatCancel"/></div>',
		'<div><input type="button" value="关闭" id="queryFloatClose"/></div>'
	],
	
	/**
	 *搜索词报告表格末尾的状态列数据
	 */
	queryStatus : {
		"-1" : '"><p class="queryGray">计划/单元已被删除</p></div>',
		"0" : '"><a class="queryUsable" id="queryActionButton"></a>\
				<a id="queryActionPos" class="qalabel" href="javascript:;">添加为关键词</a>\
				<a id="queryActionNeg" class="qalabel" href="javascript:;">添加为否定关键词</a>\
			</div>',
		"1" : 'queryActionAddkw"><p class="queryGreen">已添加为关键词</p></div>',
		"2" : 'queryActionAddNkw"><p class="queryGray">已添加为否定关键词</p></div>',
		"3" : 'queryActionAddNkw"><p class="queryGray">已添加为精确否定关键词</p></div>'
	},
	
	/**
	 *缓存当重复元素出现时应显示在浮动层上的信息
	 */
	duplicatedMsg : '<br><span class="queryGrayer qfaHeadMsg">您已选择的词存在部分重复，已进行去重处理。</span>',
		
	/**
	 *缓存浮出层上需要与后台进行交互的数据。
	 *该数组中的数据格式为：{data, failed, message, least}，分别代表原始行数据、状态、消息、最低展现价格<最低展现价格可选>如果不包含，则默认只存储数据。
	 */
	floatRowData : {},
		
	/**
	 *去重缓冲。该动作仅发生于批量操作入口处
	 */
	queryMap : {}
}

// 初始化数据加载标示
var dataInit = {
	loaded: false,
	count: 0,
	needToCount: 0
}

// 是否有默认的词
var defInit = false;

// 当前报告的参数
var nowReportParam = {};

var tableData = [];

//经过处理后的原始flash数据数组
var flashData = [];

//传递给flash的xml字符串
var xmlData = '';

//Flash图表ID
var flashType = 'ReportGraphyLine1';

//常规报告历史纪录实例
var DRH = {};

//常规报告历史记录key
var DRH_KEY = '';

// 空间跳转使用的存储结构,当前浮动出的窗口是由第几行触发的
var spaceLinkData = {
	index: -1,
	accountid: 0,
	planid: 0,
	groupid: 0,
	unitid: 0,
	wordid: 0,
	date: ""
}

// 每页显示的数量
var numPerPage = 0;

// 生成报告的来源：1表示通过按钮，2表示时空跳转，3表示从历史记录
var requestType = 0;

//IE6判定
var isIE6 = (window.navigator.appVersion.indexOf("MSIE 6.0") > 0) ? true : false;

if(isIE6){ //修复Flash不显示及错位问题的计时器，仅对于IE6
	var fixFlashTimer = 10;
	var fixFlashRepeater = null;
}

var lastReportType = "";

/**
 * 日历初始化
 * @author zuming@baidu.com
 */
function datePickerInit() {
	earlytime = earlytime.substr(4, 2) + '/' + earlytime.substr(6, 2) + '/' + earlytime.substr(0, 4);
	starttime = starttime.substr(4, 2) + '/' + starttime.substr(6, 2) + '/' + starttime.substr(0, 4);
	endtime = endtime.substr(4, 2) + '/' + endtime.substr(6, 2) + '/' + endtime.substr(0, 4);
	
	window.datePicker = new DatePickerDouble();
	datePicker.setParam({
		container:'DatePickerContainer', 
		startDate: earlytime, 
		endDate: endtime, 
		showDate: "", 
		confirmHandle: datePickerInit.datePicekerConfirm,
		cancelHandle: function() {
			datePicker.hide();
			hide("MaskDiv");			
		}
	});	
	
	datePicker.init(earlytime, endtime, datePickerInit.datePicekerConfirm, datePicker._cancelHandle);
	
	datePickerInit.containerHandleInit();
	datePicker._ds.setDateValue(datePicker._ds._date, new Date(starttime));
	datePicker._de.setDateValue(datePicker._de._date, new Date(endtime));
	datePicker._value = [
		dateToString(datePicker._ds._date, "YYYYMMDD"),
		dateToString(datePicker._de._date, "YYYYMMDD")
	];
	G("DatePickerValue").innerHTML = dateToString(datePicker._ds._date, "YYYY-MM-DD") + '/' + dateToString(datePicker._de._date, "YYYY-MM-DD");
	
}

/**
 * 日历控件与快捷方式的监听函数
 * @author zuming@baidu.com
 */
datePickerInit.containerHandleInit = function() {
	G('DatePickerContainer').onclick = function(){
		if(datePicker._obj.style.display == 'none'){
			datePicker.show('DatePickerValue', {x:-30, y:20});
			showMask();
			G("MaskDiv").onclick = function() {
				datePicker.hide();
				hide("MaskDiv");
			}
		} else {
			datePicker.hide();
			hide("MaskDiv");
		}
	}	
}

/**
 * 日期选择确定
 * @author zuming@baidu.com
 */
datePickerInit.datePicekerConfirm = function() {
	if (datePicker._ds._date < datePicker._de._date) {
		var _s = new Date(datePicker._ds._date);
		var _e = new Date(datePicker._de._date);
		var _td = new Date(_s);
	} else {
		var _s = new Date(datePicker._de._date);
		var _e = new Date(datePicker._ds._date);
		var _td = new Date(_s);		
	}
	_td.setFullYear(_td.getFullYear() + 1);
	_td.setDate(_td.getDate() - 1);
	
	if (_td < _e) {
		datePicker._info.innerHTML = "常规报告中可选的最大时间范围为一年，请您重新选择";
		return;
	}
	
	datePicker._info.innerHTML = "";
	datePicker._value = [
		dateToString(_s, "YYYYMMDD"),
		dateToString(_e, "YYYYMMDD")
	];
	datePicker.hide();
	G("DatePickerValue").innerHTML = dateToString(_s, "YYYY-MM-DD") + '/' + dateToString(_e, "YYYY-MM-DD");
	hide("MaskDiv");
	
	ReportUIChange.timeChange();
}

var singleUser = false;

var IS_PURE_FENGCHAO = false;	//是否纯凤巢
var IS_BEFORE_DETACH = false;	//选择日期是否跨越SF切换日

function domReady() {
	dwrErrorInit();
	if (+ACCOUNT_NUMBER > 1) {
		singleUser = false;
	} else {
		singleUser = true;
		G("Lr2").innerHTML = "账户报告";
		G("Lr3").innerHTML = "账户报告";
	}
	hide("ReportPageLoading");
	show(G("AccountType").parentNode.parentNode);
	show(G("ReportSize").parentNode);
	show(G("BuildReportBtn").parentNode)
	DRH_KEY = 'drh_20091208' + OPT_UID + '_' + USER_ID; //构造存储key

	try {
		Storager = new Storager(DRH_KEY);
	} catch (ex) {}
	
	if (G("Rr2")) {
		G("Rr2").checked = 1;
	}
	window.noShowDataDate = stringToDate(NO_SHOWDATA_LASTDATE);
	datePickerInit();
	
	window.accTypeSelect = new SelectBox("AccountTypeSelect", ReportUIChange.accountRangeChange);
	window.reportUnitSelect = new SelectBox("ReportUnitSelect", ReportUIChange.reportUnitChange);
	window.rs1 = new SelectBox("ReportRangeSelect1");
	window.rs2 = new SelectBox("ReportRangeSelect2");
	window.rs3 = new SelectBox("ReportRangeSelect3");
	window.wordInput = new SelectBox("ReportRangeSelect3");
	
	keywordsInput = new InputBox();
	
	window.wordInput = G("KeywordsInput");
	wordInput.onfocus = function(){
		wordInput.select();
	}
	wordInput.onkeyup = ReportUIChange.reportRangeChange.wordChange; //buildReportTip;
	wordInput.maxLength = 50;
	
	window.dailyReportCheck = G("DailyReport");
	G("DailyReport").onclick = buildReportTip;
	
	G("ReportSize").onclick = ReportUIChange.reportTypeChange;
	
	G("BuildReportBtn").onclick = buildReportRequest;
	
	if (G("PromoMethodSelect")) {
		window.promoMethodSelect = new SelectBox("PromoMethodSelect", ReportUIChange.promoMethodChange);
		//ReportUIChange.promoMethodChange();
	}
	
	window.p = new Pagination("Page", 1, 1, 1, 2, getReportData);
	
	window.numPerPageSelect = new SelectBox("NumPerPageSelect", numPerPageSelectChange);
	numPerPageSelect.fill(DEF_NUMPERPAGE);
	numPerPageSelect.setSelect(100, "noHandle");
	numPerPage = +numPerPageSelect.getValue();

	Navigation.init();
	
	var token = "&fcstar=" + getCookie('__cas__st__3');	//csrf token
	//注册日期在12.01切换之前时显示历史报告链接
	if(stringToDate(REG_DATE) < stringToDate(SF_DETACH_DATE)){
		G('accountTypeTipHref').href = MARS_HOST + "report/defaultReportAction.do?fromars=1&uid=" + SHOW_USER_ID  + token;
		show(G('accountTypeTipHref').parentNode);
	}
	
	ReportUIChange.timeChange();
	
	G("SpaceHoverDiv").onmouseout = spaceOut;
	G("SpaceReportLink").onclick = function(){
		spaceReportLink();
		return false;
	}	
	G("SpaceVenusLink").target = "_blank";

	reportParamEnableSet(true);
	
	//常规报告历史纪录
	DRH = new DefaultReportHistory('historySelectFilter', 'historySelectSubmit', buildReportRequestSend);
	
	//变化Flash图表类型
	G('typeLine').onclick = G('typeBar').onclick = setFlashData;
	
	window.onfocus = function() {
		hide("SpaceHoverDiv");
		spaceLinkData.index = -1;
	}
	
}
window.onload = function(){
	accTypeSelect.setSelect(2);	//不用onload会导致IE下变回刷新前的值	
	//强制进行一次调用，防止因用户刷新页面导致的数据错误
	ReportUIChange.reportTypeChange();
	//记录日志信息
	FCLogGeneralAdapter({
		optid: OPT_UID,
		module: "mars",
		page: "default_report"
	});
	
	/**
	 *应用于query报告的临时变量
	 */
	qbaButton_Up = new Button("qbaButtonUp", "添加为关键词", "rcbtn3", "rcbtn3_disabled", QUERY_REPORT_RENDER.queryBanchHandler, 1);
	qbaButton_Down = new Button("qbaButtonDown", "添加为关键词", "rcbtn3", "rcbtn3_disabled", QUERY_REPORT_RENDER.queryBanchHandler, 1);
	checkList = new CheckList();

	//add by linzhifeng@baidu.com自适应Select
	new AdaptiveSelect(rs1,10,123,300);		//对象，下拉列最大条数，定宽，监控时间
	new AdaptiveSelect(rs2,10,123,300);		
	new AdaptiveSelect(rs3,10,123,300);		
}

/**
 * 自适应宽度Select：AdaptiveSelect类，依赖SelectBox
 * @param {Number} objSelectBox 被替换的SelectBox；
 * @param {Number} iMaxRow 下拉对大条数；
 * @param {Number} iSelectWidth 选项框宽度；
 * @param {Number} iMonitorInterval 监控时间间隔
 * @author linzhifeng@baidu.com
 */
function AdaptiveSelect(objSelectBox,iMaxRow,iSelectWidth,iMonitorInterval){
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
	this.awMaxHeight = ((typeof(iMaxRow) != 'number' || iMaxRow < 0) ? 2 : iMaxRow) * this.lineHeight; 					//默认下拉选项最大高度
	this.awWidth = (typeof(iSelectWidth) != 'number' || iSelectWidth < 0) ? objSelectBox.style.width : iSelectWidth; 	//选项宽度
	this.awMonitorInterval = (typeof(iMonitorInterval) != 'number' || iMonitorInterval < 0) ? 500 : iMonitorInterval;	//间隔时间

	//私有成员变量
	this._originalSBoxDisplay = 0; 						//保存被替换的SelectBox显示隐藏状态
	this.awSelectDisplay = 1;							//缓存:保存awSelect的显示隐藏状态
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
	objSelectBox.show = function(){
		this.awSelect._originalSBoxDisplay = 1;
		this._select.style.display = 'none';
	}
	objSelectBox.hide = function(){
		this.awSelect._originalSBoxDisplay = 0;
		this._select.style.display = 'none';
	}
	
	this.init();
}
AdaptiveSelect.prototype = {	
	//替换函数
	init:function(){
		var _this = this;
		//绘制覆盖层
		var optIframe = C('iframe');
		optIframe.src = '';	
		optIframe.id = _this.awOptIframeIDBase;
		optIframe.className = _this.awOptIframeClass;
		
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
			_this._originalSelect.style.display = 'block';	
			_this._originalSelect.style.width = 'auto';	
			var autoWidth = optGroup.offsetWidth;														//自适应宽度：获取div宽度即可
			_this._originalSelect.style.display = 'none';
			
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
			if (_this.awselectDisplay != newDisplay){
				G(_this.awSelectIDBase).style.display = ((newDisplay == 1) ? 'inline' : 'none');
				_this.awselectDisplay = newDisplay;
			}					
			_this.tMonitor = setTimeout(_this.startMonitor, _this.awMonitorInterval);
		};
		
		//取消监控
		this.stopMonitor = function()	{
			clearTimeout(_this.tMonitor);
		};
		
		this.startMonitor();
	}
}

