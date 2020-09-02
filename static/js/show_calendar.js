//var basePath=$("#index_basePath").val();
//---交易日历 start ----------------------------------------
var dat = new Date(curDate); //当前时间 
var nianD = dat.getFullYear(); //当前年份 
var yueD = dat.getMonth(); //当前月 
var tianD = dat.getDate(); //当前天 这保存的年月日 是为了 当到达当前日期 有对比 

var tradeContent = "";//交易信息

var specialObjs = [];
//日期格式：yyyy-MM
var yearMonth = (String(yueD + 1).length == 2) ? nianD + "-" + (yueD + 1) : nianD + "-0" + (yueD + 1);
getCalendarConfig(yearMonth);
/**
 * 获取交易日历配置信息
 */
document.getElementById("next_month").onclick = function () {
  dat.setMonth(dat.getMonth() + 1); //当点击下一个月时 对当前月进行加1; 
  var nian = dat.getFullYear(); //当前年份 
  var yue = dat.getMonth() + 1; //当前月 
  specialObjs = [];
  //日期格式：yyyy-MM
  var yearMonth = (String(yue).length == 2) ? nian + "-" + yue : nian + "-0" + yue;
  getCalendarConfig(yearMonth);
  //renderCalendarData(specialObjs); //重新执行渲染 获取去 改变后的 年月日 进行渲染; 
};
document.getElementById("prev_month").onclick = function () {
  dat.setMonth(dat.getMonth() - 1); //与下一月 同理 
  var nian = dat.getFullYear(); //当前年份 
  var yue = dat.getMonth() + 1; //当前月 
  specialObjs = [];
  //日期格式：yyyy-MM
  var yearMonth = (String(yue).length == 2) ? nian + "-" + yue : nian + "-0" + yue;
  getCalendarConfig(yearMonth);
};
function getCalendarConfig (yearMonth) {
  $.get(basePath + "/web/calendarConfig/queryByYearMonth", { "yearMonth": yearMonth }, function (r) {
    if (r.code === 0) {
      specialObjs = r.calendarConfigs;
      renderCalendarData(specialObjs); //进入页面第一次渲染 
    } else {
    }
  });
}
function renderCalendarData (specialObjs) {
  document.getElementById('calendar_content_date').innerHTML = "";

  var nian = dat.getFullYear(); //当前年份 
  var yue = dat.getMonth(); //当前月 
  var tian = dat.getDate(); //当前天 
  var arr = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
  document.getElementById('calendar_nian').innerText = nian + '年';
  document.getElementById('calendar_yue').innerHTML = '<span style="font-size: 30px">' + (yue + 1) + "</span>月";

  var setDat = new Date(nian, yue + 1, 1 - 1); //把时间设为下个月的1号 然后天数减去1 就可以得到 当前月的最后一天; 
  var setTian = setDat.getDate(); //获取 当前月最后一天 
  var setZhou = new Date(nian, yue, 1).getDay(); //获取当前月第一天 是 周几 
  var setzhou_lastday = new Date(nian, yue, setTian).getDay(); //获取当前月最后天 是 周几 
  setZhou = setZhou == 0 ? 7 : setZhou;
  //tr数
  var tr_count = Math.ceil((setTian + setZhou - 1) / 7);
  for (var i = 0; i < tr_count; i++) {
    $("#calendar tbody").append("<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
  }

  for (var i = setZhou; i < setTian + setZhou; i++) {
    var isSpecial = false;
    var landtype = 0;
    var housetype = 0;
    var businessType = "";
    var tradeInfoVos = [];
    for (var j = 0; j < specialObjs.length; j++) {
      businessType = specialObjs[j].businessType
      if ((i - setZhou + 1) == specialObjs[j].dd && businessType != '2' && businessType != '3' && businessType != '8') {
        isSpecial = true;
        for (var k = 0; k < specialObjs[j].tradeInfoVos.length; k++) {
          if (specialObjs[j].tradeInfoVos[k].businessType == '2' || specialObjs[j].tradeInfoVos[k].businessType == '3' || specialObjs[j].tradeInfoVos[k].businessType == '8') {
            housetype = 1;
          } else {
            landtype = 1;
          }

          tradeInfoVos.push(specialObjs[j].tradeInfoVos[k]);
        }
        break;
      }
      if ((businessType == '2' || businessType == '3' || businessType == '8') &&
        (((i - setZhou + 1) == specialObjs[j].limitdd && (specialObjs[j].batchType == "0" || specialObjs[j].batchType == "1"))
          || ((i - setZhou + 1) == specialObjs[j].offerdd && specialObjs[j].batchType == "6"))
      ) {

        isSpecial = true;
        for (var k = 0; k < specialObjs[j].tradeInfoVos.length; k++) {
          if (specialObjs[j].tradeInfoVos[k].businessType == '2' || specialObjs[j].tradeInfoVos[k].businessType == '3' || specialObjs[j].tradeInfoVos[k].businessType == '8') {
            housetype = 1;
          } else {
            landtype = 1;
          }
          tradeInfoVos.push((specialObjs[j].tradeInfoVos)[k]);
        }
        break;
      }


    }
    var $td_i = $($("#calendar tbody td").get(i - 1));
    if (nian == nianD && yue == yueD && (i - setZhou + 1) == tianD) {
      $td_i.css({ "color": "red", "font-weight": "bold" });
    }
    if (isSpecial) {
      if (landtype == 0 && housetype == 1) {//房产
        $td_i.css("background", "url(" + basePath + "/webpc/img/index/pin-red.gif) no-repeat right bottom #fff");
      } else if (landtype == 1 && housetype == 0) {//土地
        $td_i.css("background", "url(" + basePath + "/webpc/img/index/pin-blue.gif) no-repeat right bottom #fff");
      } else if (landtype == 1 && housetype == 1) {//房产土地都有
        $td_i.css("background", "url(" + basePath + "/webpc/img/index/pin-blue.gif) no-repeat right bottom #fff,url(" + basePath + "/webpc/img/index/pin-red.gif)  no-repeat center bottom #fff");
      }
      $td_i.css("position", "relative");
      $td_i.addClass("showinfos");
      $td_i.attr("data-infos", JSON.stringify(tradeInfoVos));

    }
    $td_i.html(i - setZhou + 1);
  }
  $('.showinfos').on('click', function () {
    var data = $(this).attr("data-infos");
    var obj = JSON.parse(data);
    var html = "";
    html += '<div class="infodialog">' +
      '<div> <span class="modeltop">当日交易内容</span><span class="close"></span></div>';


    if (obj.length != null && obj.length > 0) {
      for (var i = 0; i < obj.length; i++) {
        if (obj[i].businessType == "2" || obj[i].businessType == "3" || obj[i].businessType == "8") {
          if (obj[i].batchType == "6") {
            html += '<div class="modeltype">房产交易</div>' +
              '<div>' + obj[i].batchoffertime.substring(0, 4) + '第(' +
              obj[i].yearNo + ')场房产网络竞价交易 总第(' +
              obj[i].no + ')场,共' +
              obj[i].targetnum + '个标的,交易于' +
              obj[i].batchoffertime + '举行,竞买申请于' +
              (obj[i].endapplytime == null || obj[i].endapplytime == undefined ? '-' : obj[i].endapplytime) + ' 截止。<a href="/tiaim/wap/housenoticedetail?id=' + obj[i].id + '" target="_blank">详情点击</a></div>';
          } else if (obj[i].batchType == "0") {
            html += '<div class="modeltype">房产交易</div>' +
              '<div>' + obj[i].batchlimittime.substring(0, 4) + '第(' +
              obj[i].yearNo + ')场房产拍卖交易 总第(' +
              obj[i].no + ')场,共' +
              obj[i].targetnum + '个标的,交易于' +
              obj[i].batchlimittime + '举行,竞买申请于' +
              (obj[i].endapplytime == null || obj[i].endapplytime == undefined ? '-' : obj[i].endapplytime) + ' 截止。<a href="/tiaim/wap/housenoticedetail?id=' + obj[i].id + '" target="_blank">详情点击</a></div>';
          } else if (obj[i].batchType == "1") {
            html += '<div class="modeltype">房产交易</div>' +
              '<div>' + obj[i].batchlimittime.substring(0, 4) + '第(' +
              obj[i].yearNo + ')场房产挂牌交易 总第(' +
              obj[i].no + ')场,共' +
              obj[i].targetnum + '个标的,交易于' +
              obj[i].batchlimittime + '举行,竞买申请于' +
              (obj[i].endapplytime == null || obj[i].endapplytime == undefined ? '-' : obj[i].endapplytime) + ' 截止。<a href="/tiaim/wap/housenoticedetail?id=' + obj[i].id + '" target="_blank">详情点击</a></div>';
          }
        } else if (obj[i].businessType == "0") {
          html += '<div class="modeltype">自然资源交易</div>' +
            '<div><a href="' + basePath + '/wap/landDetail?id=' + obj[i].id + '&code=0015&goodId=' + obj[i].goodsId + '" target="_blank">' + (obj[i].no == null || obj[i].no == undefined ? '' : obj[i].no) + '</a> | ' + (obj[i].goodsUse == null || obj[i].goodsUse == undefined ? "" : obj[i].goodsUse) + '</div>' +
            '<div><span class="modeltag">起始价：</span>' + obj[i].beginPrice + '元</div>' +
            '<div><span class="modeltag">交易日期：</span>' + obj[i].auctionBeginTime + '</div>';
        } else {
          html += '<div class="modeltype">自然资源交易</div>' +
            '<div><a href="' + basePath + '/wap/landDetail?id=' + obj[i].id + '&code=0015&goodId=' + obj[i].goodsId + '" target="_blank">' + (obj[i].no == null || obj[i].no == undefined ? '' : obj[i].no) + '</a> | ' + (obj[i].goodsUse == null || obj[i].goodsUse == undefined ? "" : obj[i].goodsUse) + '</div>' +
            '<div><span class="modeltag">起始价：</span>' + obj[i].beginPrice + '元</div>' +
            '<div><span class="modeltag">交易日期：</span>' + obj[i].auctionBeginTime + '</div>';
        }

      }
    }
    html += '</div>';
    $('#content').append(html);
    $('.infodialog').click(function(){
    	 $('.infodialog').remove()
    })
  })
  // $(".showinfos").hover(

  //       function(){
  //     	  var data=$(this).attr("data-infos");
  //     	  var obj =JSON.parse(data);
  //     	  var html="";
  //     	  html+='<div class="infodialog">'+
  //     		'<div> <span class="modeltop">当日交易内容</span><span class="close"></span></div>';


  //     	  if(obj.length!=null&&obj.length>0){
  //     		 for (var i = 0; i < obj.length; i++) {
  //     			 if(obj[i].businessType=="2"||obj[i].businessType=="3"||obj[i].businessType=="8"){
  //     				 if(obj[i].batchType=="6"){
  //     					 html+= '<div class="modeltype">房产交易</div>'+
  //  	 	 	    		'<div>'+obj[i].batchoffertime.substring(0,4)+'第('+
  //  	 	 	    		obj[i].yearNo+')场房产网络竞价交易 总第('+
  //  	 	 	    		obj[i].no+')场,共'+
  //  	 	 	    		obj[i].targetnum+'个标的,交易于'+
  //  	 	 	    		obj[i].batchoffertime+'举行,竞买申请于'+
  //  	 	 	    		(obj[i].endapplytime==null || obj[i].endapplytime==undefined?'-':obj[i].endapplytime)+' 截止。<a href="/tiaim/web/housenoticedetail?id='+obj[i].id+'" target="_blank">详情点击</a></div>';
  //     				 }else if(obj[i].batchType=="0"){
  //     					 html+= '<div class="modeltype">房产交易</div>'+
  //     					 '<div>'+obj[i].batchlimittime.substring(0,4)+'第('+
  //     					 obj[i].yearNo+')场房产拍卖交易 总第('+
  //     					 obj[i].no+')场,共'+
  //     					 obj[i].targetnum+'个标的,交易于'+
  //     					 obj[i].batchlimittime+'举行,竞买申请于'+
  //     					 (obj[i].endapplytime==null || obj[i].endapplytime==undefined?'-':obj[i].endapplytime)+' 截止。<a href="/tiaim/web/housenoticedetail?id='+obj[i].id+'" target="_blank">详情点击</a></div>';
  //     				 }else if(obj[i].batchType=="1"){
  //     					 html+= '<div class="modeltype">房产交易</div>'+
  //     					 '<div>'+obj[i].batchlimittime.substring(0,4)+'第('+
  //     					 obj[i].yearNo+')场房产挂牌交易 总第('+
  //     					 obj[i].no+')场,共'+
  //     					 obj[i].targetnum+'个标的,交易于'+
  //     					 obj[i].batchlimittime+'举行,竞买申请于'+
  //     					 (obj[i].endapplytime==null || obj[i].endapplytime==undefined?'-':obj[i].endapplytime)+' 截止。<a href="/tiaim/web/housenoticedetail?id='+obj[i].id+'" target="_blank">详情点击</a></div>';
  //     				 }
  //     			 }else if(obj[i].businessType=="0"){
  //     				 html+= '<div class="modeltype">自然资源交易</div>'+
  // 	 	 	    		'<div><a href="'+basePath+'/web/landDetail?id='+obj[i].id+'&code=0015&goodId='+obj[i].goodsId+'" target="_blank">'+(obj[i].no==null||obj[i].no==undefined?'':obj[i].no)+'</a> | '+(obj[i].goodsUse==null || obj[i].goodsUse==undefined?"":obj[i].goodsUse)+'</div>'+
  //     				 '<div><span class="modeltag">起始价：</span>'+obj[i].beginPrice+'元</div>'+
  //  	 	 	    	'<div><span class="modeltag">交易日期：</span>'+obj[i].auctionBeginTime+'</div>';
  //     			 }else{
  //     				 html+= '<div class="modeltype">自然资源交易</div>'+
  // 	 	 	    		'<div><a href="'+basePath+'/web/commonDetail?id='+obj[i].id+'&code=0015&goodId='+obj[i].goodsId+'" target="_blank">'+(obj[i].no==null||obj[i].no==undefined?'':obj[i].no)+'</a> | '+(obj[i].goodsUse==null || obj[i].goodsUse==undefined?"":obj[i].goodsUse)+'</div>'+
  //     				 '<div><span class="modeltag">起始价：</span>'+obj[i].beginPrice+'元</div>'+
  //  	 	 	    	'<div><span class="modeltag">交易日期：</span>'+obj[i].auctionBeginTime+'</div>';
  //     			 }

  // 			} 
  //     	  }
  //     	  html+='</div>';
  //     	  $(this).append(html);
  //       } ,
  //       function(){
  //     	  $(this).find("div").remove()
  //       } 
  //   )

}