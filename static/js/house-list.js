var html = "";
var currentPage = 0;
var canLoader=true
if (pageinfo.type == "" || pageinfo.type == null) {
  pageinfo.type = "2,3,8";
}
$(function () {


});
mui.init({
	  pullRefresh: {
	    container: '.droploader',

	    down: {
	      callback: function () {

	        let that = this
	        html = ''
	        currentPage = 1
	        pageinfo["currentPage"] = currentPage

	        setTimeout(function () {
	          $.post(basePath + "/web/getTargetJson?", pageinfo, function (r) {
	            if (r.code == 0) {
	              if (!r.result.targets.length) {
	                that.endPullupToRefresh(true);
	                appendHtml($("#house"), []);
	                return
	              }
	              appendHtml($("#house"), r.result.targets, that.endPulldownToRefresh());
	              appendTatolHtml($("#all"), r.result.alltatol);
	              appendTatolHtml($("#today"), r.result.todaytatol);
	              appendTatolHtml($("#thisweek"), r.result.weektatol);
	              appendTatolHtml($("#thismonth"), r.result.monthtatol);
	              $('.loader-contain').hide()
	       
	            }
	          });

	        }, 300)
	      }
	    },
	    up: {
	      contentrefresh: '正在加载...',
	      auto: true,
	      callback: function () {	
	    	
	
	        let that = this
	        currentPage++
	        pageinfo["currentPage"] = currentPage

	        setTimeout(function () {
	          $.post(basePath + "/web/getTargetJson?", pageinfo, function (r) {
	            if (r.code == 0) {
	              if (!r.result.targets.length) {
	                that.endPullupToRefresh(true);
	                appendHtml($("#house"), []);
	                return
	              }
	              appendHtml($("#house"), r.result.targets, that.endPullupToRefresh());
	              appendTatolHtml($("#all"), r.result.alltatol);
	              appendTatolHtml($("#today"), r.result.todaytatol);
	              appendTatolHtml($("#thisweek"), r.result.weektatol);
	              appendTatolHtml($("#thismonth"), r.result.monthtatol);
	              $('.loader-contain').hide()
	        
	            }
	          });

	        }, 300)
	      }
	    }
	  }
	});
mui('body').on('tap','a',function(){document.location.href=this.href;});

function search (key,value) {
  pageinfo["name"] = $("#search_name").val();
  pageinfo.currentPage = 1;
//  pageinfo["area"] = getAreas();
//  pageinfo["status"] = getStatus();
//  pageinfo["type"] = getbusiness();
//pageinfo["stopstatus"] = getStatusIsStop();
//pageinfo["suspendstatus"] = getStatusIsSupend();
  pageinfo[key]=value
 
  html = ''
  $("#house").html('')
  currentPage = 0
  
  mui('.droploader').pullRefresh().refresh(true);
  mui('.droploader').pullRefresh().pullupLoading()
//  $.post(basePath + "/web/getTargetJson", pageinfo, function (r) {
//    if (r.code == 0) {
//      pageinfo.tatol = r.result.tatol;
//      pageinfo.pageSize = r.result.pageSize;
//      pageinfo.total_page = Math.ceil(r.result.tatol / r.result.pageSize);
//
//
//      appendHtml($("#house"), r.result.targets);
//      if (pageinfo.tatol > 12) {
//        $(".paging").css("display", "block");
//      } else {
//        $(".paging").css("display", "none");
//      }
//      Page({
//        num: pageinfo.total_page,					//页码数
//        startnum: pageinfo.currentPage,				//指定页码
//        elem: $('#page1'),		//指定的元素
//        callback: function (n) {
//          pageinfo.currentPage = n;
//          $.post(basePath + "/web/getTargetJson", pageinfo, function (r) {
//            if (r.code == 0) {
//              appendHtml($("#house"), r.result.targets);
//            } else {
//              var html = '<div style="text-align: center;"><img src="' + basePath + '/tradewebpc/images/img_default3.png"  /></div>';
//
//              $("#house").html(html);
//            }
//          });
//        }
//      });
//
//    } else {
//      var html = '<div style="text-align: center;"><img src="' + basePath + '/tradewebpc/images/img_default3.png"  /></div>';
//
//      $("#house").html(html);
//    }
//  });
}

function getListJson () {
  pageinfo.currentPage = 1;
  $.post(basePath + "/web/getTargetJson?", pageinfo, function (r) {
    if (r.code == 0) {
      pageinfo.tatol = r.result.tatol;
      pageinfo.pageSize = r.result.pageSize;
      pageinfo.total_page = Math.ceil(r.result.tatol / r.result.pageSize);
      appendHtml($("#house"), r.result.targets);
      if (pageinfo.tatol > 12) {
        $(".paging").css("display", "block");
      } else {
        $(".paging").css("display", "none");
      }
      Page({
        num: pageinfo.total_page,					//页码数
        startnum: pageinfo.currentPage,				//指定页码
        elem: $('#page1'),		//指定的元素
        callback: function (n) {
          pageinfo.currentPage = n;
          $.post(basePath + "/web/getTargetJson", pageinfo, function (r) {
            if (r.code == 0) {
              appendHtml($("#house"), r.result.targets);
            } else {
              var html = '<div style="text-align: center;"><img src="' + basePath + '/tradewebpc/images/img_default3.png"  /></div>';

              $("#house").html(html);
            }
          });
        }
      });

    } else {
      var html = '<div style="text-align: center;"><img src="' + basePath + '/tradewebpc/images/img_default3.png"  /></div>';

      $("#house").html(html);
    }
  });
}

function selecttime (currentSelectTime) {


 
  html = ''
	  $("#house").html('');
  currentPage = 0
  pageinfo["currentSelectTime"] = currentSelectTime;
  canloader=true
  
  mui('.droploader').pullRefresh().refresh(true);
  mui('.droploader').pullRefresh().pullupLoading()

  /*pageinfo["name"]="";
  pageinfo["area"]="";
  pageinfo["status"]="";
  pageinfo["stopstatus"]="";
  pageinfo["suspendstatus"]="";*/

}

function appendHtml (element, sources, callBack) {
  var lineTime = "2019-12-01";
  callBack && callBack(false)
  if (sources != null && sources.length > 0) {
    for (var i = 0; i < sources.length; i++) {// class="discontinue"
      var url1 = '';
      var jiaoyitype = ""
      var imgurl = "";
      var lihtml = "";
      if (sources[i].BUSINESS_TYPE == 10) {
        url1 = "commonDetail";
        imgurl = "img_common.jpg";
        jiaoyitype = sources[i].TRANS_TYPE2 == null || sources[i].TRANS_TYPE2 == undefined ? " " : sources[i].TRANS_TYPE2
        lihtml += '<li class="house-list_item"><span>保证金</span>' +
          '<span>：</span>' +
          '<span>' + (sources[i].EARNEST_MONEY == null || sources[i].EARNEST_MONEY == undefined ? " " : Number(sources[i].EARNEST_MONEY).toLocaleString()) + '元</span></li>' +
          '<li class="house-list_item">' +
          '<span>标的类型</span>' +
          '<span>：</span>' +
          '<span>' + (sources[i].TRANS_TYPE_NAME == null || sources[i].TRANS_TYPE_NAME == undefined ? " " : sources[i].TRANS_TYPE_NAME) + '</span></li>';
      } else {
        url1 = "houseDetail";
        imgurl = "img_fc.jpg";
        jiaoyitype = sources[i].TRANS_TYPE3 == null || sources[i].TRANS_TYPE3 == undefined ? " " : sources[i].TRANS_TYPE3
        lihtml += '  <div class="card-list-item">' +
          '    <div>用途:</div>' +
          '    <div>' + (sources[i].GOODS_USE == null || sources[i].GOODS_USE == undefined ? " " : sources[i].GOODS_USE) + '</div>' +
          '  </div>' +
          '  <div class="card-list-item">' +
          '    <div>面积:</div>' +
          '    <div>' + (sources[i].AREA_SIZE == null || sources[i].AREA_SIZE == undefined ? " " : sources[i].AREA_SIZE) + '㎡</div>' +
          '  </div>' +
          '  <div class="card-list-item">' +
          '    <div>区域:</div>' +
          '    <div>' + (sources[i].AREA == null || sources[i].AREA == undefined ? " " : sources[i].AREA) + '</div>' +
          '  </div>' +
          '  <div class="card-list-item">' +
          '    <div>场次:</div>' +
          '    <div>' + (sources[i].BATCHNO == null || sources[i].BATCHNO == undefined ? " " : sources[i].BATCHNO) + '</div>' +
          '  </div>';

      }

      if (sources[i].IS_STOP != null && sources[i].IS_STOP == 1) {
        html +=
          '  <div class="card-item">' +
          '<a href="' + basePath + '/wap/' + url1 + '?id=' + sources[i].ID + '&code=0015&goodId=' + sources[i].GOODID + '" class="house_a" target="_blank">' +
          '    <div class="card-banner">' +
          '      <img src="' + basePath + '/tradewebpc/images/' + imgurl + '" class="house_title_img" />' +
          '      <img src="' + basePath + '/webwap/images/tab5.png" alt="" class="banner-laber" />' +
          '    </div>' +
          '     <div class="card-title">' +
          '         <span></span>' +
          '     </div>' +
          '     <div class="card-list">' +
          '      <div class="card-list-item">' +
          '        <div>交易日期:</div>' +
          '        <div>';
        if (sources[i].BATCH_TYPE == '0' || sources[i].BATCH_TYPE == '1') {
          html += sources[i].BATCH_BEGIN_LIMIT_TIME == null || sources[i].BATCH_BEGIN_LIMIT_TIME == undefined ? "" : sources[i].BATCH_BEGIN_LIMIT_TIME;
        } else if (sources[i].BATCH_TYPE == '6') {
          html += sources[i].BEGIN_OFFER_TIME == null || sources[i].BEGIN_OFFER_TIME == undefined ? "" : sources[i].BEGIN_OFFER_TIME;
        } else {
          html += sources[i].AUCTION_BEGIN_TIME == null || sources[i].AUCTION_BEGIN_TIME == undefined ? "" : sources[i].AUCTION_BEGIN_TIME;
        }
        html += '</div></div>';
        html +=
            '      <div class="card-list-item">' +
            '        <div>起始价:</div>' +
            '        <div>' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元')  + '</div>' +
            '      </div>';
        html += lihtml
        html +=
          '      <div class="card-list-item">' +
          '        <div>交易方式:</div>' +
          '        <div>' + jiaoyitype + '</div>' +
          '      </div>' +
          '     </div>' +
          '  </a></div>';

      } else if (sources[i].IS_SUSPEND != null && sources[i].IS_SUSPEND == 1) {

        html +=
          '  <div class="card-item">' +
          ' <a href="' + basePath + '/wap/' + url1 + '?id=' + sources[i].ID + '&code=0015&goodId=' + sources[i].GOODID + '" class="house_a" target="_blank">' +
          '    <div class="card-banner">' +
          '      <img src="' + basePath + '/tradewebpc/images/' + imgurl + '" class="house_title_img" />' +
          '      <img src="' + basePath + '/webwap/images/tab4.png" alt="" class="banner-laber" />' +
          '    </div>' +
          '     <div class="card-title">' +
          '         <span>' + (sources[i].NAME == null || sources[i].NAME == undefined ? "&nbsp;  " : sources[i].NAME) + '</span>' +
          '     </div>' +
          '     <div class="card-list">' +
          '      <div class="card-list-item">' +
          '        <div>交易日期:</div>' +
          '        <div>';
        if (sources[i].BATCH_TYPE == '0' || sources[i].BATCH_TYPE == '1') {
          html += sources[i].BATCH_BEGIN_LIMIT_TIME == null || sources[i].BATCH_BEGIN_LIMIT_TIME == undefined ? "" : sources[i].BATCH_BEGIN_LIMIT_TIME;
        } else if (sources[i].BATCH_TYPE == '6') {
          html += sources[i].BEGIN_OFFER_TIME == null || sources[i].BEGIN_OFFER_TIME == undefined ? "" : sources[i].BEGIN_OFFER_TIME;
        } else {
          html += sources[i].AUCTION_BEGIN_TIME == null || sources[i].AUCTION_BEGIN_TIME == undefined ? "" : sources[i].AUCTION_BEGIN_TIME;
        }
        html += '</div></div>';
        html +=
            '      <div class="card-list-item">' +
            '        <div>起始价:</div>' +
            '        <div>' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元')  + '</div>' +
            '      </div>';
        html += lihtml
        
        html +=

          '      <div class="card-list-item">' +
          '        <div>交易方式:</div>' +
          '        <div>' + jiaoyitype + '</div>' +
          '      </div>' +
          '     </div>' +
          '  </a></div>';
      } else if (sources[i].STATUS != null && sources[i].STATUS == 3) {

        html +=
          '  <div class="card-item">' +
          ' <a href="' + basePath + '/wap/' + url1 + '?id=' + sources[i].ID + '&code=0015&goodId=' + sources[i].GOODID + '" class="house_a" target="_blank">' +
          '    <div class="card-banner">' +
          '      <img src="' + basePath + '/tradewebpc/images/' + imgurl + '" class="house_title_img" />' +
          '      <img src="' + basePath + '/webwap/images/tab1.png" alt="" class="banner-laber" />' +
          '    </div>' +
          '     <div class="card-title">' +
          '         <span>' + (sources[i].NAME == null || sources[i].NAME == undefined ? "&nbsp;  " : sources[i].NAME) + '</span>' +
          '     </div>' +
          '     <div class="card-list">' +
          '      <div class="card-list-item">' +
          '        <div>交易日期:</div>' +
          '        <div>';
        if (sources[i].BATCH_TYPE == '0' || sources[i].BATCH_TYPE == '1') {
          html += sources[i].BATCH_BEGIN_LIMIT_TIME == null || sources[i].BATCH_BEGIN_LIMIT_TIME == undefined ? "" : sources[i].BATCH_BEGIN_LIMIT_TIME;
        } else if (sources[i].BATCH_TYPE == '6') {
          html += sources[i].BEGIN_OFFER_TIME == null || sources[i].BEGIN_OFFER_TIME == undefined ? "" : sources[i].BEGIN_OFFER_TIME;
        } else {
          html += sources[i].AUCTION_BEGIN_TIME == null || sources[i].AUCTION_BEGIN_TIME == undefined ? "" : sources[i].AUCTION_BEGIN_TIME;
        }
        html += '</div></div>';
        html +=
            '      <div class="card-list-item">' +
            '        <div>起始价:</div>' +
            '        <div>' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元')  + '</div>' +
            '      </div>';
        html += lihtml
        html +=
          '      <div class="card-list-item">' +
          '        <div>交易方式:</div>' +
          '        <div>' + jiaoyitype + '</div>' +
          '      </div>' +
          '     </div>' +
          '   </a></div>';
      }
      else if (sources[i].STATUS != null && sources[i].STATUS == 4) {
        html +=
          '  <div class="card-item">' +
          ' <a href="' + basePath + '/wap/' + url1 + '?id=' + sources[i].ID + '&code=0015&goodId=' + sources[i].GOODID + '" class="house_a" target="_blank">' +
          '    <div class="card-banner">' +
          '      <img src="' + basePath + '/tradewebpc/images/' + imgurl + '" class="house_title_img" />' +
          '      <img src="' + basePath + '/webwap/images/tab1.png" alt="" class="banner-laber" />' +
          '    </div>' +
          '     <div class="card-title">' +
          '         <span>' + (sources[i].NAME == null || sources[i].NAME == undefined ? "&nbsp;  " : sources[i].NAME) + '</span>' +
          '     </div>' +
          '     <div class="card-list">' +
          '      <div class="card-list-item">' +
          '        <div>交易日期:</div>' +
          '       <div>';
        if (sources[i].BATCH_TYPE == '0' || sources[i].BATCH_TYPE == '1') {
          html += sources[i].BATCH_BEGIN_LIMIT_TIME == null || sources[i].BATCH_BEGIN_LIMIT_TIME == undefined ? "" : sources[i].BATCH_BEGIN_LIMIT_TIME;
        } else if (sources[i].BATCH_TYPE == '6') {
          html += sources[i].BEGIN_OFFER_TIME == null || sources[i].BEGIN_OFFER_TIME == undefined ? "" : sources[i].BEGIN_OFFER_TIME;
        } else {
          html += sources[i].AUCTION_BEGIN_TIME == null || sources[i].AUCTION_BEGIN_TIME == undefined ? "" : sources[i].AUCTION_BEGIN_TIME;
        }
        html += '</div></div>';
        html +=
            '      <div class="card-list-item">' +
            '        <div>起始价:</div>' +
            '        <div>' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元')  + '</div>' +
            '      </div>';
        html += lihtml
        html +=
          '      <div class="card-list-item">' +
          '        <div>交易方式:</div>' +
          '        <div>' + jiaoyitype + '</div>' +
          '      </div>' +
          '     </div>' +
          '   </a></div>';
      } else if (sources[i].STATUS != null && sources[i].STATUS == 5) {

        html +=
          '  <div class="card-item">' +
          ' <a href="' + basePath + '/wap/' + url1 + '?id=' + sources[i].ID + '&code=0015&goodId=' + sources[i].GOODID + '" class="house_a" target="_blank">' +
          '    <div class="card-banner">' +
          '      <img src="' + basePath + '/tradewebpc/images/' + imgurl + '" class="house_title_img" />' +
          '      <img src="' + basePath + '/webwap/images/tab2.png" alt="" class="banner-laber" />' +
          '    </div>' +
          '     <div class="card-title">' +
          '         <span>' + (sources[i].NAME == null || sources[i].NAME == undefined ? "&nbsp;  " : sources[i].NAME) + '</span>' +
          '     </div>' +
          '     <div class="card-list">' +
          '      <div class="card-list-item">' +
          '        <div>交易日期:</div>' +
          '        <div>';
        if (sources[i].BATCH_TYPE == '0' || sources[i].BATCH_TYPE == '1') {
          html += sources[i].BATCH_BEGIN_LIMIT_TIME == null || sources[i].BATCH_BEGIN_LIMIT_TIME == undefined ? "" : sources[i].BATCH_BEGIN_LIMIT_TIME;
        } else if (sources[i].BATCH_TYPE == '6') {
          html += sources[i].BEGIN_OFFER_TIME == null || sources[i].BEGIN_OFFER_TIME == undefined ? "" : sources[i].BEGIN_OFFER_TIME;
        } else {
          html += sources[i].AUCTION_BEGIN_TIME == null || sources[i].AUCTION_BEGIN_TIME == undefined ? "" : sources[i].AUCTION_BEGIN_TIME;
        }
        html += '</div></div>';
        html +=
            '      <div class="card-list-item">' +
            '        <div>成交价:</div>' +
            '        <div>'+ (sources[i].TRANS_PRICE == null || sources[i].TRANS_PRICE == undefined ? " " : Number(sources[i].TRANS_PRICE).toLocaleString()) + '元</div>' +
            '      </div>';
        html += lihtml
        html +=
          '      <div class="card-list-item">' +
          '        <div>交易方式:</div>' +
          '        <div>' + jiaoyitype + '</div>' +
          '      </div>' +
          '     </div>' +
          '  </a></div>';

      } else if (sources[i].STATUS != null && sources[i].STATUS == 6) {

        html +=
          '  <div class="card-item">' +
          ' <a href="' + basePath + '/wap/' + url1 + '?id=' + sources[i].ID + '&code=0015&goodId=' + sources[i].GOODID + '" class="house_a" target="_blank">' +
          '    <div class="card-banner">' +
          '      <img src="' + basePath + '/tradewebpc/images/' + imgurl + '" class="house_title_img" />' +
          '      <img src="' + basePath + '/webwap/images/tab3.png" alt="" class="banner-laber" />' +
          '    </div>' +
          '     <div class="card-title">' +
          '         <span>' + (sources[i].NAME == null || sources[i].NAME == undefined ? "&nbsp;  " : sources[i].NAME) + '</span>' +
          '     </div>' +
          '     <div class="card-list">' +
          '      <div class="card-list-item">' +
          '        <div>交易日期:</div>' +
          '        <div>';
        if (sources[i].BATCH_TYPE == '0' || sources[i].BATCH_TYPE == '1') {
          html += sources[i].BATCH_BEGIN_LIMIT_TIME == null || sources[i].BATCH_BEGIN_LIMIT_TIME == undefined ? "" : sources[i].BATCH_BEGIN_LIMIT_TIME;
        } else if (sources[i].BATCH_TYPE == '6') {
          html += sources[i].BEGIN_OFFER_TIME == null || sources[i].BEGIN_OFFER_TIME == undefined ? "" : sources[i].BEGIN_OFFER_TIME;
        } else {
          html += sources[i].AUCTION_BEGIN_TIME == null || sources[i].AUCTION_BEGIN_TIME == undefined ? "" : sources[i].AUCTION_BEGIN_TIME;
        }
        html += '</div></div>';
        html +=
            '      <div class="card-list-item">' +
            '        <div>起始价:</div>' +
            '        <div>' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元')  + '</div>' +
            '      </div>';
        html += lihtml
        html +=
          '      <div class="card-list-item">' +
          '        <div>交易方式:</div>' +
          '        <div>' + jiaoyitype + '</div>' +
          '      </div>' +
          '     </div>' +
          '  </a></div>';

      } else {
      }
    }
  }
  $(element).html(html);

}

function appendTatolHtml (element, sources) {
  var html = "<span>" + sources + "</span>";
  $(element).find('span').html(html);
}

function getAreas () {
 
  var areas = ""
  $.each($("#area").find(".base-color"), function () {
    if ($(this).attr("value") != "0") {

      areas = $(this).attr("value");
    } else {
      areas = "";
    }
  });
  return areas;
}
/*function getTypes(){
var types = "";
$.each($('#housetype input:checkbox:checked'),function(){
 types+=$(this).val()+",";
 });
return types.substring(0,types.length-1);
}*/
function getStatus () {
  var status = ""
  $.each($("#status").find(".base-color"), function () {
    if ($(this).val() != "0") {
      if ($(this).val() == '1') {
        status = "1";
        pageinfo["stopstatus"] = '1';
      } else if ($(this).val() == '2') {
        status = "2";
        pageinfo["suspendstatus"] = '1';
      } else if ($(this).val() == '4') {
        status = $(this).val() + ",3";
      } else {
        status = $(this).val();
      }
    }
  });
  return status;
}

function getStatusIsStop () {
  var stopstatus = ""
  $.each($("#status").find(".base-color"), function () {
    if ($(this).val() == '1') {

      pageinfo["stopstatus"] = '1';
      stopstatus = '1';
    } else if ($(this).val() == '2') {
      pageinfo["suspendstatus"] = '1';
    }

  });
  return stopstatus;
}

function getbusiness () {
  var status = ""
  $.each($("#business").find(".base-color"), function () {

    if ($(this).val() != '0') {
      status = $(this).val();
    } else {
      status = "2,3,8,10";
    }


  });
  return status;
}

function getStatusIsSupend () {
  var suspendstatus = ""
  $.each($("#status").find(".base-color"), function () {
    if ($(this).val() == '1') {
      pageinfo["stopstatus"] = '1';
    } else if ($(this).val() == '2') {
      pageinfo["suspendstatus"] = '1';
      suspendstatus = '1';
    }

  });
  return suspendstatus;
}