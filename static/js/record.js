
/*var page = 1; //页码第几页
var rows = 10; //每页显示的条数
*/
/*var tatol=${result.tatol!};
var pageSize=${result.pageSize!};
var total_page=Math.ceil(tatol/pageSize);*/
var pageinfo = {"total_page":"","tatol":"","currentPage":"","pageSize":""};
var sessionID="";
var userId="";
var refId="";
var displayName="";//登录人账号
var trueName="";//竞买人名称
$(function(){
	var isClear=getUrlParamByKey("isClear");//获取是否要清理本地cookie的决断
	if(isClear=="y"){//为y时需要清理
		delCookie("userInfo");
		var loginPop=getUrlParamByKey("loginPop");//为1时弹出登陆框
		if(loginPop==1){
			window.location.href=basePath+'/wap/index?loginPop=1';
		}else{
			window.location.href=basePath+'/wap/index';
		}
		
	}
});


var userInfo=getCookie("userInfo");
if(userInfo!=null && userInfo!="null" && typeof(userInfo)!='undefined'){
	
	var userInfoObj=JSON.parse(getCookie('userInfo'));
	var loginDate=userInfoObj.loginDate;
	var minCount=diffCurrentDate_min(new Date(loginDate));
	if(minCount>=0&&minCount<=30){
		sessionID=userInfoObj.sessionID;
		userId=userInfoObj.userId;
		displayName=userInfoObj.displayName;
		trueName=userInfoObj.trueName;
		refId=userInfoObj.refId;
	}else{
		setCookieDefualt("userInfo",null);
	}
}
//var information={"account":"","password":""};
//刷新验证码
function refreshCodeHeader(){
	  $("#captchaHeader").attr("src",basePath+"/captcha.jpg?t=" + $.now());
}
function refreshCodeHeaderca(){
	  $("#captchaHeaderca").attr("src",basePath+"/captcha.jpg?t=" + $.now());
}
function showBidRecord(id) {
	var id= id;
	pageinfo["id"] = id;
	showData();
	$('.record').show();
	$('.popup').show();
	$('#mask').width($(document.body).width());
	$('#mask').height($(document.body).height());
	$('#mask').show();
}

function showData(){
	pageinfo.currentPage = 1;
	pageinfo["type"] = "land";
	$.post(basePath+"/web/getBiddingRecordList",pageinfo,function(r){
		if(r.code == 0){
			var date=JSON.parse(r.pager);
			pageinfo.tatol=date.totalRecord;
			pageinfo.pageSize=date.pageSize;
			pageinfo.total_page=date.totalPage;
			appendHtml($("#table"),date.results);
			if(pageinfo.tatol>10){
				$(".paging").css("display","block");
			}else{
				$(".paging").css("display","none");
			}
			Page({
     			num:pageinfo.total_page,					//页码数
     			startnum:pageinfo.currentPage,				//指定页码
     			elem:$('#page3'),		//指定的元素
     			callback:function(n){
     				pageinfo.currentPage=n;
     				$.post(basePath+"/web/getBiddingRecordList",pageinfo,function(r){
     					if(r.code == 0){
     						appendHtml($("#table"),JSON.parse(r.pager).results);
     					}else{
     						$.Pop(r.msg,'alert',function(){});
     					}
     			    });
     			}
     		});
			
		}else{
			$.Pop(r.msg,'alert',function(){});
		}
    });
}

function searchHeader(){
	pageinfo["name"] = $("#search_name_header").val();
	pageinfo["beginTime"] = $("#selectBeginTime").val();
	pageinfo["endTime"] = $("#selectEndTime").val();
	showData();
}

function resetHeader(){
	$("#search_name_header").val("");
	$("#selectBeginTime").val("");
	$("#selectEndTime").val("");
}

function appendHtml(element,data){
	$(element).empty();
	var htmlStr="";
	htmlStr = '<tr style="background: #eee;">'+
	'<th>序号</th><th>竞买人</th><th>竞买出价(元)</th><th>竞价时间</th><th>状态</th>'+
	'</tr>';
	for(var i = 0; i < data.length; i++) {
		htmlStr+='<tr><td>'+data[i].rowno+'</td>';
		htmlStr+='<td>'+data[i].cardNo+'</td>';
		htmlStr+='<td>'+(data[i].price==null||data[i].price==undefined?"": commafy(data[i].price))+'</td>';
		htmlStr+='<td>'+data[i].offerDate+'</td>';
		htmlStr+='<td>'+data[i].statusName+'</td></tr>';
	}
	$(element).append(htmlStr);
}


function showhouseBidRecord(id){
	var id= id;
	pageinfo["id"] = id;
	pageinfo["type"] = "land";
	pageinfo.currentPage =1;
	$.post(basePath+"/web/getBiddingRecordList",pageinfo,function(r){
		if(r.code == 0){
			var date=JSON.parse(r.pager);
			pageinfo.tatol=date.totalRecord;
			pageinfo.pageSize=date.pageSize;
			pageinfo.total_page=date.totalPage;
			appendhouseHtml($("#BidRecordtabel"),date.results,date.totalRecord);
			if(pageinfo.tatol>10){
				$(".paging").css("display","block");
			}else{
				$(".paging").css("display","none");
			}
			Page({
     			num:pageinfo.total_page,					//页码数
     			startnum:pageinfo.currentPage,				//指定页码
     			elem:$('#page1'),		//指定的元素
     			callback:function(n){
     				pageinfo.currentPage=n;
     				$.post(basePath+"/web/getBiddingRecordList",pageinfo,function(r){
     					if(r.code == 0){
     						appendhouseHtml($("#BidRecordtabel"),JSON.parse(r.pager).results,JSON.parse(r.pager).totalRecord);
     					}else{
     						$.Pop(r.msg,'alert',function(){});
     					}
     			    });
     			}
     		});
			
		}else{
			$.Pop(r.msg,'alert',function(){});
		}
    });
}

/***
 * 房产标的详情页面，点击tab展示竞价记录
 * @param id
 */
function showHouseDetailBidRecord(id) {
	if(phare == '5'){//交易结束
		showHouseDetailBidRecordExt(id);
	}else {//
		setInterval(function(){
			showHouseDetailBidRecordExt(id);
		},houseDetailIntervalTime);
	}
	$(".paging").css("display","none");
}

function showHouseDetailBidRecordExt(id) {
	if(houseDetailOffers!=null && houseDetailOffers.length>0){//如果页面中的定时任务已经获取到数据便直接获取，不需要再次发送请求
	
		appendLandBidRecordeHtml_offers($("#houseDetailBidRecord"),houseDetailOffers,houseDetailOfferCount);
	}else {
		$.post(basePath+"/web/landrecord?t=" + $.now(),{"id":id},function(r){
			if(r.code == 0){
				var offers=[];
				if(r.params.offers !=null && typeof(r.params.offers) != 'undefined'){
					offers=r.params.offers;
				}
				var offer_count='0'
				if(r.params.offer_count !=null && typeof(r.params.offer_count) != 'undefined'){
					offer_count=r.params.offer_count;
				}
				appendLandBidRecordeHtml_offers($("#houseDetailBidRecord"),offers,offer_count);
				// $(".paging").css("display","none");
			}else{
				$.Pop(r.msg,'alert',function(){});
			}
		});
	}
}

/***
 * 竞地价记录
 * @param id
 */

function showLandBidRecord(id){

	if(phare == '5'){//交易结束
		showLandBidRecordExt(id);
	}else {//
		setInterval(function(){
			showLandBidRecordExt(id);
		},landDetailIntervalTime);
	}
    if(landDetailOffers==null || landDetailOffers.length <= 0){
        $("#showLandBidRecordMore").hide();
    }else {
        $("#showLandBidRecordMore").show();
    }
	$(".paging").css("display","none");
}

function showLandBidRecordExt(id) {
	if(landDetailOffers!=null && landDetailOffers.length>0){//如果页面中的定时任务已经获取到数据便直接获取，不需要再次发送请求
		appendLandBidRecordeHtml_offers($("#BidRecordtabel"),landDetailOffers,landDetailOfferCount);
	}else {
		$.post(basePath+"/web/landrecord?t=" + $.now(),{"id":id},function(r){
			if(r.code == 0){
				var offers=[];
				if(r.params.offers !=null && typeof(r.params.offers) != 'undefined'){
					offers=r.params.offers;
				}
				if(r.params.offers2 !=null && typeof(r.params.offers2) != 'undefined'){
					landDetailOffers2=r.params.offers2;
				}
				if(r.params.offers !=null && typeof(r.params.offers) != 'undefined'){
					landDetailOffers=r.params.offers;
				}
				if(r.params.offer_count2 !=null && typeof(r.params.offer_count2) != 'undefined'){
					landDetailOfferCount2=r.params.offer_count2;
				}
				var offer_count='0'
				if(r.params.offer_count !=null && typeof(r.params.offer_count) != 'undefined'){
					offer_count=r.params.offer_count;
				}
				if(r.params.offer_count !=null && typeof(r.params.offer_count) != 'undefined'){
					landDetailOfferCount=r.params.offer_count;
				}
				appendLandBidRecordeHtml_offers($("#BidRecordtabel"),offers,offer_count);
				// $(".paging").css("display","none");
			}else{
				$.Pop(r.msg,'alert',function(){});
			}
		});
	}
}



function appendhouseHtml(element,data,total){
	$(element).empty();
	var htmlStr="";
	htmlStr = '<tr style="background: #eee;">'+
	'<th>序号</th><th>竞买人333</th><th>竞买出价(元)</th><th>竞价时间</th><th>状态</th>'+
	'</tr>';
	for(var i = 0; i < data.length; i++) {
		htmlStr+='<tr><td>'+(total+1-data[i].rowno)+'</td>';
		if(data[i].status!=null && data[i].status==2){
			htmlStr+='<td>'+(data[i].bidderName==null||data[i].bidderName==undefined?"":data[i].bidderName)+'</td>';
		}else{
			htmlStr+='<td>'+(data[i].cardNo==null||data[i].cardNo==undefined?"":data[i].cardNo)+'</td>';
		}
		htmlStr+='<td>'+(data[i].price==null||data[i].price==undefined?"": commafy(data[i].price))+'</td>';
		htmlStr+='<td>'+data[i].offerDate+'</td>';
		htmlStr+='<td>'+data[i].statusName+'</td></tr>';
	}
	$(element).append(htmlStr);
}
function appendlandHtml(element,data,total){//土地
	$(element).empty();
	var htmlStr="";
	htmlStr = '<tr style="background: #eee;">'+
	'<th>序号</th><th>竞买人444</th><th>竞买出价(元)</th><th>竞价时间</th><th>状态</th>'+
	'</tr>';
	for(var i = 0; i < data.length; i++) {
		htmlStr+='<tr><td>'+(total+1-data[i].rowno)+'</td>';
		if(data[i].status!=null && data[i].status==2){
			htmlStr+='<td>'+(data[i].bidder_name==null||data[i].bidder_name==undefined?"":data[i].bidder_name)+'</td>';
		}else{
			htmlStr+='<td>'+(data[i].card_no==null||data[i].card_no==undefined?"":data[i].card_no)+'</td>';
		}
		htmlStr+='<td>'+(data[i].price==null||data[i].price==undefined?"": commafy(data[i].price))+'</td>';
		htmlStr+='<td>'+data[i].offer_date+'</td>';
		htmlStr+='<td>'+(data[i].status==2?'成交价':'有效出价')+'</td></tr>';
	}
	$(element).append(htmlStr);
}
// function showareaRecord(id){
// 	var id= id;
// 	pageinfo["id"] = id;
// 	pageinfo["type"] = "land";
// 	pageinfo.currentPage =1;
// 	$.post(basePath+"/web/getAreaRecordList",pageinfo,function(r){
// 		if(r.code == 0){
// 			var date=JSON.parse(r.pager);
// 			pageinfo.tatol=date.totalRecord;
// 			pageinfo.pageSize=date.pageSize;
// 			pageinfo.total_page=date.totalPage;
// 			appendareaHtml($("#areaRecordtabel"),date.results,date.totalRecord);
// 			if(pageinfo.tatol>10){
// 				$(".paging").css("display","block");
// 			}else{
// 				$(".paging").css("display","none");
// 			}
// 			Page({
//      			num:pageinfo.total_page,					//页码数
//      			startnum:pageinfo.currentPage,				//指定页码
//      			elem:$('#page2'),		//指定的元素
//      			callback:function(n){
//      				pageinfo.currentPage=n;
//      				$.post(basePath+"/web/getAreaRecordList",pageinfo,function(r){
//      					if(r.code == 0){
//      						appendareaHtml($("#areaRecordtabel"),JSON.parse(r.pager).results,JSON.parse(r.pager).totalRecord);
//      					}else{
//      						$.Pop(r.msg,'alert',function(){});
//      					}
//      			    });
//      			}
//      		});
//
// 		}else{
// 			$.Pop(r.msg,'alert',function(){});
// 		}
//     });
// }

/**
 * 获取竞***记录，第二指标竞买记录
 * @param id
 */
function showareaRecord(id){
	if(phare == '5'){//交易结束
		showAreaRecordExt(id);
	}else {//
		setInterval(function(){
			showAreaRecordExt(id);
		},landDetailIntervalTime);
	}
    if(landDetailOffers2==null || landDetailOffers2.length <= 0){
        $("#land2ndRecordMore").hide();
    }else {
        $("#land2ndRecordMore").show();
    }
	$(".paging").css("display","none");
}

function showAreaRecordExt(id) {
	if(landDetailOffers2!=null && landDetailOffers2.length>0){//如果页面中的定时任务已经获取到数据便直接获取，不需要再次发送请求
		appendareaHtml_offer2($("#areaRecordtabel"),landDetailOffers2,landDetailOfferCount2);
	}else {
		$.post(basePath+"/web/landrecord?t=" + $.now(),{"id":id},function(r){
			if(r.code == 0){
				var offers2=[];
				if(r.params.offers2 !=null && typeof(r.params.offers2) != 'undefined'){
					offers2=r.params.offers2;
				}
				var offer_count2='0'
				if(r.params.offer_count2 !=null && typeof(r.params.offer_count2) != 'undefined'){
					offer_count2=r.params.offer_count2;
				}
				if(r.params.offers2 !=null && typeof(r.params.offers2) != 'undefined'){
					landDetailOffers2=r.params.offers2;
				}
				if(r.params.offers !=null && typeof(r.params.offers) != 'undefined'){
					landDetailOffers=r.params.offers;
				}
				
				if(r.params.offer_count2 !=null && typeof(r.params.offer_count2) != 'undefined'){
					landDetailOfferCount2=r.params.offer_count2;
				}
				appendareaHtml_offer2($("#areaRecordtabel"),offers2,offer_count2);
				// $(".paging").css("display","none");
			}else{
				$.Pop(r.msg,'alert',function(){});
			}
		});
	}

}

function appendareaHtml(element,data,total){
	$(element).empty();
	var htmlStr="";
	htmlStr = '<tr style="background: #eee;">'+
		'<th>序号</th><th>竞买人555</th><th>竞'+(tradeconfig.name==undefined?'':tradeconfig.name)+'出价('+(tradeconfig.short_unit==undefined?'':tradeconfig.short_unit)+')</th><th>竞'+(tradeconfig.name==undefined?'':tradeconfig.name)+'时间</th><th>状态</th>'+
		'</tr>';
	for(var i = 0; i < data.length; i++) {
		htmlStr+='<tr><td>'+(total+1-data[i].rowno)+'</td>';
		if(data[i].status!=null && data[i].status==2){
			htmlStr+='<td>'+(data[i].bidderName==null||data[i].bidderName==undefined?"":data[i].bidderName)+'</td>';
		}else{
			htmlStr+='<td>'+(data[i].cardNo==null||data[i].cardNo==undefined?"":data[i].cardNo)+'</td>';
		}
		htmlStr+='<td>'+(data[i].price==null||data[i].price==undefined?"": commafy(data[i].price))+'</td>';
		htmlStr+='<td>'+data[i].offerDate+'</td>';
		htmlStr+='<td>'+data[i].statusName+'</td></tr>';
	}
	$(element).append(htmlStr);
}

function appendareaHtml_offer2(element,data,total){
	
	
//    <div class="conomy-tr">
//    <div>
//      <span>竞买人：</span>
//      <span>深圳市乐房网络科技有限公司</span>
//    </div>
//    <div class="middle">
//
//      <span>竞面积出价(㎡)：</span>
//      <span>2，0005,600。00</span>
//    </div>
//    <div class="middle">
//      <span>竞面积时间：</span>
//      <span>2019-11-01 12:00:00</span>
//    </div>
//      <div>
//      <span>状态：</span>
//      <span>2019-11-01 12:00:00</span>
//    </div>
//  </div>
	$(element).empty();
	var htmlStr="";
	for(var i = 0; i < data.length; i++) {
		htmlStr+='<div class="conomy-tr">';
		if(data[i].status!=null && data[i].status==2){
		htmlStr+=' <div>'+
		'               <span>竞买人：</span>'+
		'               <span>'+(data[i].bidder_name==null||data[i].bidder_name==undefined?"":data[i].bidder_name)+'</span>'+
		'          </div>'
     	}else{
		htmlStr+=' <div>'+
		'               <span>竞买人：</span>'+
		'               <span>'+(data[i].license_no==null||data[i].license_no==undefined?"":data[i].license_no)+'</span>'+
		'          </div>'
	    }
		
		htmlStr+=' <div class="middle">'+
		'               <span>竞面积出价(㎡)：</span>'+
		'               <span>'+(data[i].price==null||data[i].price==undefined?"": commafy(data[i].price))+'</span>'+
		'          </div>'+
		'           <div class="middle">'+
		'               <span>竞面积时间：</span>'+
		'               <span>'+data[i].offer_date+'</span>'+
		'          </div>'+
		'           <div>'+
		'               <span>状态：</span>'+
		'               <span>'+getStatusName(data[i].status)+'</span>'+
		'          </div>'+
		'          </div>'
		
	}
	$(element).append(htmlStr);
}
function appendLandBidRecordeHtml_offers(element, data, total) {

	$(element).empty();
	var htmlStr="";
	for(var i = 0; i < data.length; i++) {
		
		htmlStr+='<div class="conomy-tr">';
		if(data[i].status!=null && data[i].status==2){
		htmlStr+=' <div>'+
		'               <span>竞买人：</span>'+
		'               <span>'+(data[i].bidder_name==null||data[i].bidder_name==undefined?"":data[i].bidder_name)+'</span>'+
		'          </div>'
     	}else{
		htmlStr+=' <div>'+
		'               <span>竞买人：</span>'+
		'               <span>'+(data[i].license_no==null||data[i].license_no==undefined?"":data[i].license_no)+'</span>'+
		'          </div>'
	    }
		
		htmlStr+=' <div class="middle">'+
		'               <span>竞买出价(元)：</span>'+
		'               <span>'+(data[i].price==null||data[i].price==undefined?"": commafy(data[i].price))+'</span>'+
		'          </div>'+
		'           <div class="middle">'+
		'               <span>竞价时间：</span>'+
		'               <span>'+data[i].offer_date+'</span>'+
		'          </div>'+
		'           <div>'+
		'               <span>状态：</span>'+
		'               <span>'+getStatusName(data[i].status)+'</span>'+
		'          </div>'+
		'          </div>'
	}
	$(element).append(htmlStr);
}
/**
 * 竞地价记录显示更多
 * @param id
 */
function showLandBidRecordMore(id){
    //转向网页的地址;
    var url="showLandBidRecordMore?id="+id;
    //网页名称，可为空;
    var name="竞地价记录";
    //弹出窗口的宽度;
    var iWidth=800;
    //弹出窗口的高度;
    var iHeight=700;
    //window.screen.height获得屏幕的高，window.screen.width获得屏幕的宽
    //获得窗口的垂直位置;
    var iTop = (window.screen.height-30-iHeight)/2;
    //获得窗口的水平位置;
    var iLeft = (window.screen.width-10-iWidth)/2;
    window.open(url,name,'height='+iHeight+',,innerHeight='+iHeight+',width='+iWidth+',innerWidth='+iWidth
        +',top='+iTop+',left='+iLeft+',toolbar=no,menubar=no,scrollbars=yes,resizeable=yes,location=no,status=no');
}

/**
 * 竞***记录，第二指标竞买记录查看更多
 * @param id
 */
function land2ndRecordMore(id){
    //转向网页的地址;
	var shortUnit=(tradeconfig.short_unit ==null || typeof(tradeconfig.short_unit)==undefined) ?tradeconfig.unit:tradeconfig.short_unit;
    var url="land2ndRecordMore?id="+id+"&recordName="+tradeconfig.name+"&shortUnit="+shortUnit;
    url=encodeURI(url);//编码处理
    //网页名称，可为空;
    var name="记录";
    //弹出窗口的宽度;
    var iWidth=800;
    //弹出窗口的高度;
    var iHeight=700;
    //window.screen.height获得屏幕的高，window.screen.width获得屏幕的宽
    //获得窗口的垂直位置;
    var iTop = (window.screen.height-30-iHeight)/2;
    //获得窗口的水平位置;
    var iLeft = (window.screen.width-10-iWidth)/2;
    window.open(url,name,'height='+iHeight+',,innerHeight='+iHeight+',width='+iWidth+',innerWidth='+iWidth
        +',top='+iTop+',left='+iLeft+',toolbar=no,menubar=no,scrollbars=yes,resizeable=yes,location=no,status=no');
}


/**
 * 获取状态名称
 * @param v
 * @returns {string}
 */
function getStatusName(v) {
	//0无效出价，1有效出价，2成交价
	if(v=='0'){
		return '无效出价';
	}else if(v=='1'){
		return '有效出价';
	}else if(v=='2'){
		return '成交价';
	}else {
		return ' ';
	}
}

//===========================================================//
/*
 * 单点登录
 */

if(sessionID==""){
	$(".enter2").show();
	$(".enter3").hide();
	$(".notLog").show();
	$(".logged").hide();
}else{
	if(displayName.length > 10){
		displayName = displayName.substring(0,10)+"...";
	}
	appendUserHtml($("#noHaveUser"),displayName);
	$(".enter3").show();
	$(".enter2").hide();
	$(".logged").show();
	$(".notLog").hide();
}


//点击登录
$('#login').click(function(){
	var account =$("#account").val();
	var password=$("#password").val();
	var captchaCodeHeader=$("#captchaCodeHeader").val();
	var res=login(account,password,captchaCodeHeader,"",1);
	if(res==1){
		$('.enter_case').hide();
		$('.popup').hide();
		$('#masks').hide();
	}

})
//ca点击登录
$('#loginca').click(function(){
	var res =loginca(captchaCodeHeader);
	if(res==1){
		$('.enter_case').hide();
		$('.popup').hide();
		$('#masks').hide();
	}else{
		refreshCodeHeaderca()
	}
})
//登录判断，登录成功，页面改变，可以跳转
function login(account,password,captchaCodeHeader,cakey,logintype){
	
	var urlStr =basePath+ "/web/isLogin";
	var rs=0;
		$.ajax({
			url: urlStr,
			type: "POST",
			async: false,
			data: {
				"account": account,
				"password": $.md5(password),
				"captchaCodeHeader":captchaCodeHeader,
				"cakey":cakey,
				"time":new Date().getTime()
			},
			dataType: "json", //指定服务器返回的数据类型
			success: function(r) {
				if(r.code == 0) {
					if(r.resultJson.state==1){//登录成功
						
						sessionID=r.resultJson.sessionID;
						userId=r.resultJson.userId;
						displayName=r.resultJson.userName;
						trueName =r.resultJson.displayName;
						refId=r.resultJson.refId;
						var userInfo = JSON.stringify({"sessionID":sessionID,"userId":userId,"displayName":displayName,"trueName":trueName,"refId":refId,"loginDate":dateFormat(new Date(),'yyyy/MM/dd HH:mm:ss')});
						//设置cooking
						setCookie("userInfo",userInfo,"s1800");
						appendUserHtml($("#noHaveUser"),displayName);
						$(".enter3").show();
						$(".enter2").hide();
						$(".notLog").hide();
						$(".logged").show();
						if(isWap==1){
							urlStr =basePath+ "/wap/index?sessionID="+sessionID+"&time="+new Date().getTime();
							window.location.href = urlStr;
						}else{
							isTarget();
						}
						rs= 1;
					}else if(r.resultJson.state==2){//登录失败
						var bidderId=r.resultJson.id;
						sessionID=r.resultJson.sessionID;
						var urlStr =basePath+ "/web/loginUploadFiles?bidderId="+bidderId+"&sessionID="+sessionID+"&time="+new Date().getTime();
						if(isWap==1){
							urlStr =basePath+ "/wap/index?sessionID="+sessionID+"&time="+new Date().getTime();
						}else{
							window.location.href = urlStr;
						}
						rs= 0;
					}else{
						alert(r.resultJson.message);
						if(logintype==1){
							refreshCodeHeader();
						}else{
							refreshCodeHeaderca()
						}
						$(".enter2").show();
						$(".enter3").hide();
						$(".notLog").show();
						$(".logged").hide();
						rs= 0;
					}
				}else{
					alert(r.msg, "提示！");
					if(logintype==1){
						refreshCodeHeader();
					}else{
						refreshCodeHeaderca();
					}
					rs= 0;
				}
				
			},
			error:function(XMLHttpRequest, textStatus, errorThrown) {
			       alert("登录失败！");
			       if(logintype==1){
						refreshCodeHeader();
					}else{
						refreshCodeHeaderca()
					}
			       rs= 0;
			}
		});
		return rs;
}
function loginca(){//CAd认证登录
	var result=szcaObj.ifUseCa('Login');
	if(result==1){
		
		var capt=$("#captchaCodeHeaderca").val()
		var caObj = szcaObj.getCertExt();
		var cakey=caObj.caKeyId
		var a=login("","",capt,cakey,2);
		return a;
	}else{
		
		return 0;
	}
}
function appendUserHtml(element,displayName){
	$(element).html("");
	var html='<div>'+
				'<span>您好！&nbsp;</span>'+
				'<span>'+displayName+'</span>&nbsp;&nbsp;&nbsp;&nbsp;'+
				'<a class="jumpCal" style="" onclick="jumpCal()"><img src="/tiaim/tradewebpc/images/wdjy.png" style="height:16px;" alt="#">我的交易</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
				'<a class="jumpCal" style="" onclick="personalData()"><img src="/tiaim/tradewebpc/images/zhzl.png"  style="height:16px;" alt="#">账号资料</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
				'<a href="#" onclick="logout()">退出</a>'+
				'</div>';
	$(element).html(html);
}




//跳转到竞买人界面
function jumpCal(flag,type){
	if(sessionID==""){
		ejectLogin()//登陆框
		return ;
	}
	if(typeof(type) == 'undefined'){
		type = "bill";
	}
	if(typeof(flag) == 'undefined'){
		flag = "";
	}
	//请求后台重定向，ajax请求页面不跳转
	var urlStr =basePath+ "/wap/jumpBidder"+"?sessionID="+sessionID+"&type="+type+"&flag="+flag+"&time="+new Date().getTime();
	window.open(urlStr)
	//window.location.href = urlStr;
}

//跳转到竞买人界面
function tradeRegister(){
	
	//请求后台重定向，ajax请求页面不跳转
	var urlStr =basePath+ "/web/tradeRegister"+"?time:"+new Date().getTime();
	window.open(urlStr)
	//window.location.href = urlStr;
}

//跳转到个人资料
function personalData(){
	if(sessionID==""){
		ejectLogin()//登陆框
		return ;
	}
	var id =userId;
	//请求后台重定向，ajax请求页面不跳转
	var urlStr =basePath+ "/wap/personalData"+"?sessionID="+sessionID+"&id="+id+"&time:"+new Date().getTime();
	window.open(urlStr)
	//window.location.href = urlStr;
}

function forgetPas(){
	//请求后台重定向，ajax请求页面不跳转
	var urlStr =basePath+ "/wap/forgetPas";
	window.location.href = urlStr;
}

//退出登录
function logout(){
	var urlStr =basePath+ "/web/logout"+"?time:"+new Date().getTime();
	$.ajax({
		url: urlStr,
		type: "GET",
		dataType: "json", //指定服务器返回的数据类型
		success: function(r) {
			if(r.code == 0) {
				if(r.resultJson.state==1){//退出登录成功
					delCookie("userInfo");
					$(".enter2").show();
					$(".enter3").hide();
					$(".notLog").show();
					$(".logged").hide();
				}
			}
			else{
				alert(r.msg, "提示！");
			}
		}
	});
}

//===========================================================//
/*
 * 我要收藏/我要竞卖/我要报价
 */
//我要收藏
function myCollection(id){
	
	if(sessionID==""){
		ejectLogin()//登陆框
		return ;
	}
	
		var targetId =id;
		var explain='门户收藏'+targetNo;//收藏说明  先写死的
		var urlStr =basePath+ "/web/myCollection";
		$.ajax({
			url: urlStr,
			type: "GET",
			data: {
				"targetId": targetId,
				"userId": userId,
				"explain":explain,
				"sessionID":sessionID,
				"time":new Date().getTime()
			},
			dataType: "json", //指定服务器返回的数据类型
			success: function(r) {
				if(r.code == 0) {
					if(r.resultJson.state==1){//收藏成功
						
						//var isOk=confirm("已成功收藏当前标的，是否立即前往我的收藏查看？")
						//if(isOk==true){
						//	jumpCal("collect");
						//}
						$('.please1').css('display','none');
						$('.please11').css('display','block');
						
					}else if(r.resultJson.state==2){//我要收藏失败
						alert(r.resultJson.message);
					}else{
						alert(r.resultJson.message);
					}
				}else{
					alert(r.msg, "提示！");
				}
				
			}
		});
	
	
}
//取消收藏
function moveCollection(id){
	if(sessionID==""){
		ejectLogin()//登陆框
		return ;
	}
	
		var targetId =id;
		var explain='门户收藏'+targetNo;//收藏说明  先写死的
		var urlStr =basePath+ "/web/moveCollection";
		$.ajax({
			url: urlStr,
			type: "GET",
			data: {
				"targetId": targetId,
				"userId": userId,
				"explain":explain,
				"sessionID":sessionID,
				"time":new Date().getTime()
			},
			dataType: "json", //指定服务器返回的数据类型
			success: function(r) {
				if(r.code == 0) {
					if(r.resultJson.state==1){//取消收藏成功
						
						$('.please11').css('display','none');
						$('.please1').css('display','block');
						
					}else if(r.resultJson.state==2){//我要收藏失败
						alert(r.resultJson.message);
					}else{
						alert(r.resultJson.message);
					}
				}else{
					alert(r.msg, "提示！");
				}
				
			}
		});
}
function mybiddingext(targetId,explain){
	var urlStr =basePath+ "/web/getBiddingDataUrl";
	$.ajax({
		url: urlStr,
		type: "GET",
		data: {
			"targetId": targetId,
			"userId": userId,
			"explain":explain,
			"sessionID":sessionID,
			
		},
		dataType: "json", //指定服务器返回的数据类型
		success: function(r) {
			if(r.code == 0) {
				if(r.resultJson.state == 1){
					var targetId = r.resultJson.target[0].id;
					var targetsNo = r.resultJson.target[0].no;
					var businessType = r.resultJson.target[0].business_type;
					var urlStr =basePath+ '/web/myBiddingUrl?userId='+userId+'&targetId='+targetId+'&targetsNo='+encodeURI(targetsNo)+'&sessionID='+sessionID+'&displayName='+encodeURI(trueName)+'&businessType='+businessType;
					window.location.href = urlStr;
				}else{
					alert(r.resultJson.message);
				}
			}else{
				alert(r.msg, "提示！");
			}
			
		}
	});
}
//我要竞卖
function myBidding(id){
	
	if(sessionID==""){
		ejectLogin()//登陆框
		return false;
	}
	if(isStop!=1&isSuspend!=1&(status==3||status==4)){
		var targetId =id;
		var explain='门户收藏'+targetNo;//收藏说明  先写死的
		
		/******************************************接口整合后************************************************/
		var urlStr =basePath+ "/web/findConditionById";
		$.ajax({
			url: urlStr,
			type: "GET",
			data: {
				"targetId": targetId
			},
			dataType: "json", //指定服务器返回的数据类型
			success: function(r) {
				if(r.code == 0) {
					if(r.result==null||r.result.endNoticeTime==null||r.result.endNoticeTime==""){
						mybiddingext(targetId,explain);
					}else{
						if(confirm("本标设置了竞买条件，需要通过资格审查方能参与交易，请详细阅读公告中的相关条款后再进行申请，是否继续申请?")){
							mybiddingext(targetId,explain);
						}
						
					}
				}else{
					alert(r.msg, "提示！");
				}
				
			}
		});
		
	}else{
		if(isStop==1){
			alert("当前标的状态为 已终止，暂不能申请竞买!");
		}else if(isSuspend==1){
			alert("当前标的状态为 已中止，暂不能申请竞买!");
		}else if(status==5){
			alert("当前标的状态为 已成交，暂不能申请竞买!");
		}else{
			alert("当前标的状态为 未成交，暂不能申请竞买!");
		}
	}
}
	//我要竞卖
	function myBiddinghouse(id){
		
		if(sessionID==""){
			ejectLogin()//登陆框
			return false;
		}
		if(isStop!=1&isSuspend!=1&(status==3||status==4)){
			var targetId =id;
			var explain='门户收藏'+targetNo;//收藏说明  先写死的
			
			/******************************************接口整合后************************************************/
			var urlStr =basePath+ "/web/findConditionById";
			$.ajax({
				url: urlStr,
				type: "GET",
				data: {
					"targetId": targetId
				},
				dataType: "json", //指定服务器返回的数据类型
				success: function(r) {
					if(r.code == 0) {
						mybiddingext(targetId,explain);
					}else{
						alert(r.msg, "提示！");
					}
					
				}
			});
			
		}else{
			if(isStop==1){
				alert("当前标的状态为 已终止，暂不能申请竞买!");
			}else if(isSuspend==1){
				alert("当前标的状态为 已中止，暂不能申请竞买!");
			}else if(status==5){
				alert("当前标的状态为 已成交，暂不能申请竞买!");
			}else{
				alert("当前标的状态为 未成交，暂不能申请竞买!");
			}
		}
	
	/******************************************接口整合后************************************************/
	
	/*var urlStr =basePath+ "/web/myCollection";
	$.ajax({
		url: urlStr,
		type: "GET",
		data: {
			"targetId": id,
			"userId": userId,
			"explain":explain,
			"sessionID":sessionID,
			"time":new Date().getTime()
		},
		dataType: "json", //指定服务器返回的数据类型
		success: function(r) {
			if(r.code == 0) {
				if(r.resultJson.state==1||r.resultJson.state==2){//收藏成功
				//	userId displayName='+encodeURI(displayName)+
				var urlStr =basePath+ '/web/myLandBidding?userId='+userId+'&targetId='+targetId+'&bidderId='+refId+'&sessionID='+sessionID+'&displayName='+encodeURI(displayName);
				window.location.href = urlStr;	
					$('.please1').css('display','none');
					$('.please11').css('display','block');
					var urlString =basePath+ "/web/myLandBidding";
					
					$.ajax({
						url: urlString,
						type: "GET",
						data: {
							"targetId": id,
							"userId": userId,
							"bidderId":refId,
							"sessionID":sessionID,
							"displayName":displayName
						},
						dataType: "json", //指定服务器返回的数据类型
						success: function(r) {
							if(r.code == 0) {
								if(r.resultJson!=null){//收藏成功
									
									if(r.resultJson.allowUnion == 0 && r.resultJson.isUnion == 1){
										alert("该宗地联合竞买人无法申请");
									    return;
									}
									var targetId=r.resultJson.id;
									var targetsNo=r.resultJson.no;
									var businessType=r.resultJson.business_type;
									
									var urlStr =basePath+ '/web/myBiddingUrl?userId='+userId+'&targetId='+targetId+'&targetsNo='+targetsNo+'&sessionID='+sessionID+'&displayName='+encodeURI(displayName)+'&businessType='+businessType;
									window.location.href = urlStr;		
									
								}else{//我要收藏失败
									alert("该标的未收藏，申请竞买失败！");
								}
							}else{
								alert("申请竞买失败！");
							}
							
						}
					});
					
					
				}else if(r.resultJson.state==0){//我要收藏失败
					var message=r.resultJson.message
					if(message.indexOf("收藏") != -1){
						message=message.replace('收藏', '申请竞买');
					}
					alert(message);
				}
				var urlStr =basePath+ '/web/myBidding?userId='+userId+'&targetId='+targetId+'&bidderId='+refId+'&sessionID='+sessionID+'&displayName='+encodeURI(displayName);
				window.location.href = urlStr;	
			}else{
				alert(r.msg, "提示！");
			}
			
		}
	});*/
	/*if(sessionID==""){
		ejectLogin()//登陆框
		return ;
	}
	
	if(isStop!=1&isSuspend!=1&(status==3||status==4)){
		if(new Date(biddingBeginTime)<new Date(currentTime)&&new Date(currentTime)<new Date(biddingEndTime)){
			var bidderName=displayName;
			var targetsNo=targetNo;//多个宗地号
			var targetId=id;
			///house/preparehouse/readme.html?bidderName=房产测试人员6&businessType=0&targetsNo=J306-0035(G306-0133),J306-0035(G306-0133)
			var urlStr =basePath+ '/web/myBidding?bidderName='+encodeURI(bidderName)+'&sessionID='+sessionID+'&businessType='+businessType+'&targetsNo='+targetsNo+'&userId='+userId+'&targetIds='+targetId;
			window.location.href = urlStr;
			
			var targetId =id;
			var explain='门户收藏'+targetNo;//收藏说明  先写死的
			var urlStr =basePath+ "/web/myCollection";
			$.ajax({
				url: urlStr,
				type: "GET",
				data: {
					"targetId": targetId,
					"userId": userId,
					"explain":explain,
					"sessionID":sessionID
				},
				dataType: "json", //指定服务器返回的数据类型
				success: function(r) {
					if(r.code == 0) {
						if(r.resultJson.state==1){//收藏成功
						//	userId displayName='+encodeURI(displayName)+
						var urlStr =basePath+ '/web/myBidding?userId='+userId+'&targetId='+targetId+'&bidderId='+refId+'&sessionID='+sessionID+'&displayName='+encodeURI(displayName);
						window.location.href = urlStr;	
							
						}else if(r.resultJson.state==0){//我要收藏失败
							alert(r.resultJson.message);
						}
					}else{
						alert(r.msg, "提示！");
					}
					
				}
			});
			
			
		}else{
			$('.please22').css('display','none');
			$('.please2').css('display','block');
			alert("不在竞买时间内，暂不能申请竞买!");
		}
		
	}else{
		if(isStop==1){
			alert("当前标的状态为 已终止，暂不能申请竞买!");
		}else if(isSuspend==1){
			alert("当前标的状态为 已中止，暂不能申请竞买!");
		}else if(status==5){
			alert("当前标的状态为 已成交，暂不能申请竞买!");
		}else{
			alert("当前标的状态为 未成交，暂不能申请竞买!");
		}
	}*/
	
	
}
//我要报价
function myOffer(id,basetype){
	if(sessionID==""){
		ejectLogin()//登陆框
		return ;
	}
	//currentTime="2019/01/28 10:25:00";
	if(isStop!=1&isSuspend!=1&(status==3||status==4)){
		if(transType==0||transType==3||transType==4){
				var urlStr =basePath+ "/web/getBiddingQualification";
				$.ajax({
					url: urlStr,
					type: "GET",
					data: {
						"targetId": id,
						"uid": userId,
						"time":new Date().getTime()
					},
					dataType: "json", //指定服务器返回的数据类型
					success: function(r) {
						/*var urlStr =basePath+ "/web/myOffer"+"?userId="+userId+"&sessionID="+sessionID+"&targetIds="+id+"&batchId="+batchId;
						window.location.href = urlStr;*/
						if(r.code == 0) {
							if(r.result!=null&&r.result.status==1){
								if(new Date(beginFocusTime)<=new Date(currentTime)&&new Date(currentTime)<=new Date(endFocusTime)){
									var urlStr =basePath+ "/web/myOffer"+"?userId="+userId+"&sessionID="+sessionID+"&targetIds="+id+"&batchId="+batchId+"&transType="+transType+"&basetype="+basetype;
									window.location.href = urlStr;
								}else{
									$('.please33').css('display','none');
									$('.please3').css('display','block');
									if(transType==4){
										alert("不在网上报价时间内，暂不能报价");
									}else{
										alert("不在挂牌时间内，暂不能报价");
									}
									
								}
							}else{
								alert("当前标的还没有 获得竞买资格，无法正常报价!");
							}
						}
						
					}
				});
				
		}
	}else{
		if(isStop==1){
			alert("当前标的状态为 已终止，暂不能申请竞买!");
		}else if(isSuspend==1){
			alert("当前标的状态为 已中止，暂不能申请竞买!");
		}else if(status==5){
			alert("当前标的状态为 已成交，暂不能申请竞买!");
		}else{
			alert("当前标的状态为 未成交，暂不能申请竞买!");
		}
	}
	
}
//我要报价
function myOfferhouse(id,basetype){
	if(sessionID==""){
		ejectLogin()//登陆框
		return ;
	}
	//currentTime="2019/01/28 10:25:00";
	if(isStop!=1&isSuspend!=1&(status==3||status==4)){
		if(transType==0||transType==1||transType==6){
				var urlStr =basePath+ "/web/getBiddingQualification";
				$.ajax({
					url: urlStr,
					type: "GET",
					data: {
						"targetId": id,
						"uid": userId,
						"time":new Date().getTime()
					},
					dataType: "json", //指定服务器返回的数据类型
					success: function(r) {
						/*var urlStr =basePath+ "/web/myOffer"+"?userId="+userId+"&sessionID="+sessionID+"&targetIds="+id+"&batchId="+batchId;
						window.location.href = urlStr;*/
						if(r.code == 0) {
							if(r.result!=null&&r.result.status==1){
								if(new Date(beginFocusTime)<=new Date(currentTime)&&new Date(currentTime)<=new Date(endFocusTime)){
									var urlStr =basePath+ "/web/myOffer"+"?userId="+userId+"&sessionID="+sessionID+"&targetIds="+id+"&batchId="+batchId+"&transType="+transType+"&basetype="+basetype;
									window.location.href = urlStr;
								}else{
									$('.please33').css('display','none');
									$('.please3').css('display','block');
									if(transType==6){
										alert("不在网上报价时间内，暂不能报价");
									}else{
										alert("不在挂牌时间内，暂不能报价");
									}
									
								}
							}else{
								alert("未获得该标的报价资格!");
							}
						}
						
					}
				});
				
		}
	}else{
		if(isStop==1){
			alert("当前标的状态为 已终止，暂不能申请竞买!");
		}else if(isSuspend==1){
			alert("当前标的状态为 已中止，暂不能申请竞买!");
		}else if(status==5){
			alert("当前标的状态为 已成交，暂不能申请竞买!");
		}else{
			alert("当前标的状态为 未成交，暂不能申请竞买!");
		}
	}
	
}

//弹出登录框
function ejectLogin(){
	$('.enter_case').show();
	refreshCodeHeader();
	$('.popup').show();
	$('.record').hide();
	$('#mask').width($(document.body).width());
	$('#mask').height($(document.body).height());
	$('#mask').show();
	var url=window.location.href;
	if(url.search("web/landDetail")!=-1||url.search("web/houseDetail")!=-1){
		$('.please11').css('display','none');
		$('.please1').css('display','block');
		$('.please22').css('display','none');
		$('.please2').css('display','block');
		$('.please33').css('display','none');
		$('.please3').css('display','none');
	}
}

//判断是否再标的详情页面登陆
function isTarget(){
	var url=window.location.href;
	if(url.search("web/landDetail")!=-1||url.search("web/houseDetail")!=-1){
		isCollection();
		isQualifications();
		isOffer();
	}
}

//给定时间与当前相差分钟数计算
function diffCurrentDate_min(date){
	var curDate=new Date();
	return ( curDate.getTime() - date.getTime())/(60 * 1000)
}

//对Date的扩展，将 Date 转化为指定格式的String   
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
//例子：   
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
function dateFormat(date, fmt) { //author: meizz   
	var o = {
		"M+" : date.getMonth() + 1, //月份           
		"d+" : date.getDate(), //日           
		"h+" : date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时           
		"H+" : date.getHours(), //小时           
		"m+" : date.getMinutes(), //分           
		"s+" : date.getSeconds(), //秒           
		"q+" : Math.floor((date.getMonth() + 3) / 3), //季度           
		"S" : date.getMilliseconds()
	//毫秒           
	};
	var week = {
		"0" : "/u65e5",
		"1" : "/u4e00",
		"2" : "/u4e8c",
		"3" : "/u4e09",
		"4" : "/u56db",
		"5" : "/u4e94",
		"6" : "/u516d"
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt
				.replace(
						RegExp.$1,
						((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f"
								: "/u5468")
								: "")
								+ week[date.getDay() + ""]);
	}
	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
} 

/**
 * 获取URL路径中的参数
 * @param k
 * @returns
 */
function getUrlParamByKey(k) {
    var regExp = new RegExp('([?]|&)' + k + '=([^&]*)(&|$)');
    var result = window.location.href.match(regExp);
    if (result) {
        return decodeURIComponent(result[2]);
    } else {
        return null;
    }
}

/**
 *获取备注
 * @param url
 * @returns 
 */
function gethouseremark(url) {
	$.ajax({
		url: basePath+ "/web/remarkwebhtml",
		type: "POST",
		data: {"url": url},
		dataType: "json", //指定服务器返回的数据类型
		success: function(r) {
	
			if(r.code == 0) {
				
				if(r.remarthtml==null||r.remarthtml==""||r.remarthtml==undefined){
					$("#houseremarkId").html('<div style="margin-top:40px;font-size:18px;text-align:center">没有备注</div>');
				}else{
					
					$("#houseremarkId").html(r.remarthtml);
				}
			}
			
		}
	});
}
/**
 * 数字格式转换成千分位
 *@param{Object}num
 */
function commafy(num){
  if(num==""){
   return"";
  }
  if(isNaN(num)){
   return"";
  }
  num = num+"";
  if(/^.*\..*$/.test(num)){
   var pointIndex =num.lastIndexOf(".");
   var intPart = num.substring(0,pointIndex);
   var pointPart =num.substring(pointIndex+1,num.length);
   intPart = intPart +"";
    var re =/(-?\d+)(\d{3})/
    while(re.test(intPart)){
     intPart =intPart.replace(re,"$1,$2")
    }
   num = intPart+"."+pointPart;
  }else{
   num = num +"";
    var re =/(-?\d+)(\d{3})/
    while(re.test(num)){
     num =num.replace(re,"$1,$2")
    }
  }
  return num;
}

// function countdown(){//倒计时开始
// 	// 当前时间
// 	nowTime+=1000;
// 	// 2016/12/22 hh:mm:ee
// 	// 结束时间
// 	var endTime = new Date(etime);//2020/03/28 20:23:12
// 	// 相差的时间
// 	var t = endTime.getTime() - nowTime;
// 	if(t<=0){
// 		document.getElementById('d').innerHTML = 0;
// 		document.getElementById('h').innerHTML = 0;
// 		document.getElementById('i').innerHTML = 0;
// 		document.getElementById('s').innerHTML = 0;
// 		return false;
// 	}
//
// 	var d = Math.floor(t/1000/60/60/24);
//
// 	var h = Math.floor(t/1000/60/60%24);
// 	var i = Math.floor(t/1000/60%60);
// 	var s = Math.floor(t/1000%60);
//
// 	document.getElementById('d').innerHTML = d;
// 	document.getElementById('h').innerHTML = h;
// 	document.getElementById('i').innerHTML = i;
// 	document.getElementById('s').innerHTML = s;
//
// 	setTimeout(countdown, 1000);
// }

function countdown(){//倒计时开始
	landSetInterval=setInterval(function(){
		// 当前时间
		nowTime+=1000;
		// 2016/12/22 hh:mm:ee
		// 结束时间
		var endTime = new Date(etime);//2020/03/28 20:23:12
		// 相差的时间
		var t = endTime.getTime() - nowTime;
		if(t<=0){
			document.getElementById('d').innerHTML = 0;
			document.getElementById('h').innerHTML = 0;
			document.getElementById('i').innerHTML = 0;
			document.getElementById('s').innerHTML = 0;
			return false;
		}

		var d = Math.floor(t/1000/60/60/24);

		var h = Math.floor(t/1000/60/60%24);
		var i = Math.floor(t/1000/60%60);
		var s = Math.floor(t/1000%60);

		document.getElementById('d').innerHTML = d;
		document.getElementById('h').innerHTML = h;
		document.getElementById('i').innerHTML = i;
		document.getElementById('s').innerHTML = s;
	},1000);
}

// function countup(){//倒计时开始
// 	// 当前时间
// 	started+=1000;
//
// 	if(started<=0){
// 		document.getElementById('d').innerHTML = 0;
// 		document.getElementById('h').innerHTML = 0;
// 		document.getElementById('i').innerHTML = 0;
// 		document.getElementById('s').innerHTML = 0;
// 		setTimeout(countup, 1000);
// 	}else{
// 		var d = Math.floor(started/1000/60/60/24);
//
// 		var h = Math.floor(started/1000/60/60%24);
// 		var i = Math.floor(started/1000/60%60);
// 		var s = Math.floor(started/1000%60);
//
// 		document.getElementById('d').innerHTML = d;
// 		document.getElementById('h').innerHTML = h;
// 		document.getElementById('i').innerHTML = i;
// 		document.getElementById('s').innerHTML = s;
//
// 		setTimeout(countup, 1000);
//
// 	}
//
// }

function countup(){//倒计时开始

    setInterval(function(){
        // 当前时间
        started+=1000;

        if(started<=0){
            document.getElementById('d').innerHTML = 0;
            document.getElementById('h').innerHTML = 0;
            document.getElementById('i').innerHTML = 0;
            document.getElementById('s').innerHTML = 0;
        }else{
            var d = Math.floor(started/1000/60/60/24);

            var h = Math.floor(started/1000/60/60%24);
            var i = Math.floor(started/1000/60%60);
            var s = Math.floor(started/1000%60);

            document.getElementById('d').innerHTML = d;
            document.getElementById('h').innerHTML = h;
            document.getElementById('i').innerHTML = i;
            document.getElementById('s').innerHTML = s;
        }
    },landDetailIntervalTime);

}

//通过license_count的值，返回-1暂不公开，0无人竞买，1一人，2多人
function bidderNumberStr(num) {
	if(num == null || typeof (num) =='undefined'){
		return '';
	}
	if(num == '-1'){
		return '-'
	}else if(num == '0'){
		return '无人竞买'
	}else if(num == '1'){
		return '一人竞买'
	}else if(num == '2'){
		return '多人竞买'
	}
}
