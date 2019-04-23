//转盘刻画参考 http://www.17sucai.com/pins/14555.html
(function ($) {
	$.fn.AddRandomSelection = function (options) {
		var defaults = {
			/********** 标签属性设置 **********/
			defaultArray: '',/* 参与随机选择的成员，应设置成数据形式 */
			
			colors: '',/* 插件用到的颜色，应设置成数据形式 */
			rotateTime: '',/* 转盘旋转一次的时间，单位 s，默认是 6s */
			resultTitle: ''/* result 描述 */
			
		},
		settings = $.extend(defaults, options); //把传入的参数 options 合并到 defaults 里并赋给 settings；若 options 里的参数与 defaults 有重复，则 options 会覆盖 defaults 里的参数
		
		var _this = this;
		
		//选择区域的参数
		var selectionWidth = _this.width();
		
		//参与随机选择的数组
		var defaultArray = settings.defaultArray?settings.defaultArray:["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32"];
		
		//已选中对象数组
		var selectedArray = new Array();
		
		//result 描述
		var resultTitle = settings.resultTitle?settings.resultTitle:"当前已选中的结果如下：";
		
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
		
		
		var ifStart = false;
		var StartRolling = null;
		var curIndex;
		var resultGrp = $("#"+resultID+"");
		
		$("body").on("click", "#"+btnStartID+"", function(){
			if(!ifStart){
				$("#"+itemGrpID+" li").removeClass('current');
				$("#"+itemGrpID+" li").eq(curIndex).addClass('selected');
				if(selectedArray.length<defaultArray.length){
					ifStart = true;
					$("#"+btnStartID+"").html("停止");
				
					StartRolling = setInterval(function(){
						for(var i=0;i>-1;i++){
							curIndex = rnd(0,defaultArray.length-1);
							if(!ifRepeat(selectedArray,defaultArray[curIndex])){
								$("#"+itemGrpID+" li").removeClass('current');
								$("#"+itemGrpID+" li").eq(curIndex).addClass('current');
								return true;
							}
						}
					},60);	
				}else{
					alert("全员已被选中！");
				}		
			}else{
				setTimeout(function(){
					ifStart = false;
					$("#"+btnStartID+"").html("开始");
					clearInterval(StartRolling);
				
					var newCZ = $('<span class="cz">');
					newCZ.html(defaultArray[curIndex]);
					
					if(selectedArray.length!=0){
						resultGrp.append('、');
					}
					
					selectedArray.push(defaultArray[curIndex]);
					resultGrp.append(newCZ);
				},600);		
			}
		});
		
		$("body").on("click", "#"+itemGrpID+" li", function(){
			if(ifStart){
				ifStart = false;
				$("#"+btnStartID+"").html("开始");
				clearInterval(StartRolling);
			}else{
				$("#"+itemGrpID+" li").eq(curIndex).addClass('selected');
			}
			curIndex = $(this).index();
			$("#"+itemGrpID+" li").removeClass('current');
			$("#"+itemGrpID+" li").eq(curIndex).addClass('current selected');
			
			var newCZ = $('<span class="cz">');
			newCZ.html(defaultArray[curIndex]);
			
			if(selectedArray.length!=0){
				resultGrp.append('、');
			}
			
			selectedArray.push(defaultArray[curIndex]);
			resultGrp.append(newCZ);
			
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
