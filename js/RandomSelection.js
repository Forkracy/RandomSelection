(function ($) {
	$.fn.AddRandomSelection = function (options) {
		var defaults = {
			/********** 标签属性设置 **********/
			defaultArray: '',/* 参与随机选择的成员，应设置成数据形式 */
			rollSpeed: null, /* 随机跳动的速度，默认为 60 （ms） */
			rollTime: null, /* 点击开始到停止之间的随机跳动的次数，默认为 30 */
			alertText: '', /* 全部选中之后的弹框内容 */
			resultTitle: '' /* result 描述 */
		},
		settings = $.extend(defaults, options); //把传入的参数 options 合并到 defaults 里并赋给 settings；若 options 里的参数与 defaults 有重复，则 options 会覆盖 defaults 里的参数
		
		var _this = this;
		
		//选择区域的参数
		var selectionWidth = _this.width();
		
		//参与随机选择的数组
		var defaultArray = settings.defaultArray?settings.defaultArray:["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15"];
		
		//已选中对象数组
		var selectedArray = new Array();
		
		//随机跳动的速度，默认为 60 （ms）
		var rollSpeed = settings.rollSpeed?settings.rollSpeed:60;
		
		//点击开始到停止之间的随机跳动的次数，默认为 30
		var rollTime = settings.rollTime?settings.rollTime:30;
		
		//result 描述
		var resultTitle = settings.resultTitle?settings.resultTitle:"当前已选中的结果如下：";
		
		//全部选中之后的弹框内容
		var alertText = settings.alertText?settings.alertText:"内容已全部被选中！";
		
		//ID 后缀
		var idSuffix = Date.parse(new Date())/1000,
			selectionWrapperID = "selectionWrapper-"+ idSuffix,
			itemGrpID = "itemGrp-"+ idSuffix,
			btnStartID = "btnStart-"+ idSuffix,
			resultID = "result-"+ idSuffix;
		
		initSelectionNode();
		
		function initSelectionNode(){
			var selectionWrapper = $("<div id='"+selectionWrapperID+"' class='selectionWrapper'>");
			selectionWrapper.css({"width":_this.width(),"position":"relative"});
			
			var itemGrp = $("<ul id='"+itemGrpID+"' class='itemGrp'>");
			selectionWrapper.append(itemGrp);
			
			var btnStart = $("<button id='"+btnStartID+"' class='btnStart'>开始</button>");
			selectionWrapper.append(btnStart);
			
			var resultDiv = $("<div id='"+resultID+"' class='result'>");
			var resultTitleNode = $("<h3>"+resultTitle+"</h3>");
			resultDiv.append(resultTitleNode);
			selectionWrapper.append(resultDiv);		
			
			_this.append(selectionWrapper);
			
			for(var i=0;i<defaultArray.length;i++){
				$("#"+itemGrpID+"").append("<li>"+ defaultArray[i] +"</li>");
			}
			
		}
		
		//记录当前状态
		var ifStart = false;
		
		//旋转定时器
		var StartRolling = null;
		
		//当前选中的 item 索引
		var curIndex;
		
		//点击之后的跳动次数，每次点击之后会清零
		var curRollTime = 0;
		
		//选中结果的 div
		var resultGrp = $("#"+resultID+"");
		
		$("body").on("click", "#"+btnStartID+"", function(){
			if(!ifStart){
				$("#"+itemGrpID+" li").removeClass('current');
				$("#"+itemGrpID+" li").eq(curIndex).addClass('selected');
				if(selectedArray.length<defaultArray.length){
					ifStart = true;
					curRollTime = 0;
					$("#"+btnStartID+"").addClass('disable');
					StartRolling = setInterval(function(){
						for(var i=0;i>-1;i++){
							curIndex = rnd(0,defaultArray.length-1);
							if(!ifRepeat(selectedArray,defaultArray[curIndex])){
								$("#"+itemGrpID+" li").removeClass('current');
								$("#"+itemGrpID+" li").eq(curIndex).addClass('current');
								curRollTime++;
								if(curRollTime>rollTime){
									addNewItem();
								}
								return true;
							}
						}
					},rollSpeed);	
				}else{
					alert(alertText);
				}		
			}
		});
		
		function addNewItem(){
			ifStart = false;
			$("#"+btnStartID+"").removeClass('disable');
			clearInterval(StartRolling);
		
			var newItem = $('<span class="cz">');
			newItem.html(defaultArray[curIndex]);
			
			if(selectedArray.length!=0){
				//resultGrp.append('、');
			}
			
			selectedArray.push(defaultArray[curIndex]);
			resultGrp.append(newItem);
		}
		
		$("body").on("click", "#"+itemGrpID+" li", function(){
			if(ifStart){
				ifStart = false;
				$("#"+btnStartID+"").removeClass('disable');
				clearInterval(StartRolling);
			}else{
				$("#"+itemGrpID+" li").eq(curIndex).addClass('selected');
			}
			curIndex = $(this).index();
			$("#"+itemGrpID+" li").removeClass('current');
			$("#"+itemGrpID+" li").eq(curIndex).addClass('current selected');
			
			var newItem = $('<span>');
			newItem.html(defaultArray[curIndex]);
			
			if(selectedArray.length!=0){
				//resultGrp.append('、');
			}
			
			selectedArray.push(defaultArray[curIndex]);
			resultGrp.append(newItem);
			
		});
		
		//判断 str 是否存在于 array 数组中
		function ifRepeat(array,str){
			for(var i=0;i<array.length;i++){
				if(array[i]==str){
					return true;
				}
			}
			return false;
		}
			
		function rnd(n, m){
			return Math.floor(Math.random()*(m-n+1)+n)
		}
		
	}
})(jQuery);
