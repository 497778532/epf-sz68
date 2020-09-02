var targetstatus = '';
var select_time = '';
var pageinfo = {}
var pagesize = '';
var html = '';
var currentPage = 0
var dropload = null;

$(function () {



  var choiceColor = $("#area>div");
  choiceColor.on("click", function () {

    var $this = $(this);
    if ($this.text()) {
      $('#area-display').text($this.text())
    }
    $('.shadow').removeClass('active')
    $this.addClass("shadow-active").siblings().removeClass("shadow-active");
    search();
    //    var $this = $(this);
    //    if ($this.attr("class") != "unclick") {
    //      choiceColor.removeClass("base-color");
    //      $this.addClass("base-color");
    //      search();
    //    }
  })
  var choiceColor1 = $("#status>div");
  choiceColor1.on("click", function () {
    var $this = $(this);
    if ($this.text()) {
      $('#state-display').text($this.text())
    }
    $('.shadow').removeClass('active')
    $this.addClass("shadow-active").siblings().removeClass("shadow-active");
    search();
  })
  var choiceColor2 = $("#business>div");
  choiceColor2.on("click", function () {
    var $this = $(this);
    if ($this.text()) {
      $('#exchange-display').text($this.text())
    }
    $('.shadow').removeClass('active')
    $this.addClass("shadow-active").siblings().removeClass("shadow-active");
    search();
  })
});

function search () {
  params["name"] = $("#search_name").val();
  params.currentPage = 1;
  params["area"] = getAreas();
  params["status"] = getStatus();

  params["type"] = getbusiness();
  params["stopstatus"] = getStatusIsStop();
  params["suspendstatus"] = getStatusIsSupend();


  html = ''
  $('#land').html("")
  currentPage = 0
  mui('.droploader').pullRefresh().refresh(true);
  mui('.droploader').pullRefresh().pullupLoading()
  /*housepage.type=getTypes(selectcode);
  if(housepage.type==""||housepage.type==null){
    housepage.type="2,3,8";
  }
  housepage.status=getStatus();*/
  /*getListJson('001502','page2');*/

}
function qfw (number) {

  var num = number + "";
  num = num.replace(new RegExp(",", "g"), "");
  // 正负号处理
  var symble = "";
  if (/^([-+]).*$/.test(num)) {
    symble = num.replace(/^([-+]).*$/, "$1");
    num = num.replace(/^([-+])(.*)$/, "$2");
  }
  if (/^[0-9]+(\.[0-9]+)?$/.test(num)) {
    var num = num.replace(new RegExp("^[0]+", "g"), "");
    if (/^\./.test(num)) {
      num = "0" + num;
    }
    var decimal = num.replace(/^[0-9]+(\.[0-9]+)?$/, "$1");
    var integer = num.replace(/^([0-9]+)(\.[0-9]+)?$/, "$1");
    var re = /(\d+)(\d{3})/;
    while (re.test(integer)) {
      integer = integer.replace(re, "$1,$2");
    }
    return symble + integer + decimal;
  } else {
    return number;
  }
};
function getListJson (callback) {
  pageinfo["pageSize"] = 5
  pageinfo["currentPage"] = 1
  //pageinfo.type=getTypes(selectcode);
	/*if(pageinfo.type==""||pageinfo.type==null){
		pageinfo.type="2,3,8";
	}*/
  //pageinfo.status=getStatus();
  /*getListJson('001502','page2');*/
  $.post(basePath + "/web/getTargetJson?", pageinfo, function (r) {
    if (r.code == 0) {
      appendHtml($("#land"), r.result.targets);
    }
  });
}

function selecttime (currentSelectTime) {

  html = ''
  currentPage = 0
  params["currentSelectTime"] = currentSelectTime;
  $('#land').html("")
  mui('.droploader').pullRefresh().refresh(true);
  mui('.droploader').pullRefresh().pullupLoading()
	/*pageinfo["name"]="";
	pageinfo["area"]="";
	pageinfo["status"]="";
	pageinfo["stopstatus"]="";
	pageinfo["suspendstatus"]="";*/
  //  getListJson();
}
function selectArea (ele) {
  if ($(ele).hasClass('active')) {
    $(ele).removeClass('active')
    return
  }
  $(ele).addClass('active').siblings('.shadow').removeClass('active')
}
function tradingselecttime (currentSelectTime) {
  targetstatus = pageinfo["status"];
  select_time = pageinfo["currentSelectTime"];
  currentpage = pageinfo.currentPage;
  pagesize = pageinfo.pageSize;
  pageinfo["currentSelectTime"] = currentSelectTime;
  pageinfo["status"] = "3,4";
  pageinfo.currentPage = 1;
  pageinfo.pageSize = -1;
  $.post(basePath + "/web/getTargetJson?", pageinfo, function (r) {
    if (r.code == 0) {
      appendTradingHtml($("#tradingland"), r.result.targets);
      pageinfo["status"] = targetstatus;
      pageinfo["currentSelectTime"] = select_time;
      pageinfo.currentPage = currentpage;
      pageinfo.pageSize = pagesize;
    } else {
      $.Pop(r.msg, 'alert', function () { });
      pageinfo["status"] = targetstatus;
      pageinfo["currentSelectTime"] = select_time;
      pageinfo.currentPage = currentpage;
      pageinfo.pageSize = pagesize;
    }
  });
}

function appendTradingHtml (element, sources) {
  $(element).html("");
  var html = "";
  var lineTime = "2019-12-01"
  if (sources != null && sources.length > 0) {
    for (var i = 0; i < sources.length; i++) {
      var url1 = '';
      var listimg = "";
      var imgstr = "";
      var rt = "";
      if (new Date(lineTime.replace(/-/g, "/")) <= new Date(sources[i].AUCTION_BEGIN_TIME.replace(/-/g, "/"))) {
        rt = dateFormat(new Date(sources[i].AUCTION_BEGIN_TIME.replace(/-/g, "/")), "yyyyMM") + "/";
      } else {
        rt = "";
      }
      if (sources[i].BUSINESS_TYPE == 0) {
        url1 = 'landDetail';
        listimg = "img_td3.jpg";
      } else {
        url1 = 'commonDetail';
        listimg = "img_common.jpg";
      }

      if (sources[i].HAS_720MAP != null && sources[i].HAS_720MAP == 1) {
        imgstr = '<a  href="' + basePath + '/wap/' + url1 + '?id=' + sources[i].ID + '&code=0015&goodId=' + sources[i].GOODID + '" class="house_a class="to-map"" target="_blank">' +
          '<img src="http://720.szhome.com/ltc/' + rt + 'images/' + sources[i].NOMAP + '.jpg"  class="house_title_img" onerror="this.src=\'' + basePath + '/tradewebpc/images/' + listimg + '\'"/>' +
          '</a><a class="to-map"  href="http://720.szhome.com/ltc/' + rt + sources[i].NOMAP + '.html" target="_blank">' +
          '<img src="' + basePath + '/tradewebpc/images/720_1.png" class="house_title_img_rotate" /></a>';


      } else {
        imgstr = '<a   href="' + basePath + '/wap/' + url1 + '?id=' + sources[i].ID + '&code=0015&goodId=' + sources[i].GOODID + '" class="house_a" target="_blank">' +
          '<img src="' + basePath + '/tradewebpc/images/' + listimg + '" class="house_title_img" /></a>';
      }

      html += '<div class="swiper-slide">' +
        '<div class="land_hover_border"></div>' +
        '<div class="land_img_case">' + imgstr +
        '<img src="' + basePath + '/tradewebpc/images/bq1.png" alt="" class="land_title_img_label"> </div>' +
        '<a href="' + basePath + '/wap/' + url1 + '?id=' + sources[i].ID + '&code=0015&goodId=' + sources[i].GOODID + '" class="land_a" target="_blank"><div class="land_data" >' +
        '<span>：</span>' +
        '<span>' + (sources[i].END_APPLY_TIME == null || sources[i].END_APPLY_TIME == undefined ? " &nbsp; " : sources[i].END_APPLY_TIME) + '</span></div>' +
        ' <div class="land-list">' +
        '<ul class="land-list_ul">' +
        '<li class="land-list_item">' +
        '<span>宗地号</span>' +
        '<span>：</span>' +
        '<span>' + (sources[i].NO == null || sources[i].NO == undefined ? "&nbsp;  " : sources[i].NO) + '</span></li>' +
        '<li class="land-list_item">' +
        '<span>交易日期</span>' +
        '<span>：</span>' +
        '<span>' + (sources[i].AUCTION_BEGIN_TIME == null || sources[i].AUCTION_BEGIN_TIME == undefined ? "  &nbsp;   " : sources[i].AUCTION_BEGIN_TIME) + '</span></li>' +
        '<li class="land-list_item">' +
        '<span>起始价</span>' +
        '<span>：</span>' +
        '<span>' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元') + '</span></li>' +
        '<li class="land-list_item">';
      if (sources[i].BUSINESS_TYPE == 0) {
        html += '<span>土地用途</span>' +
          '<span>：</span>' +
          '<span>' + (sources[i].GOODS_USE == null || sources[i].GOODS_USE == undefined ? " &nbsp; " : sources[i].GOODS_USE) + '</span></li>' +
          '<li class="land-list_item">' +
          '<span>面积</span>' +
          '<span>：</span>' +
          '<span>' + (sources[i].GOODS_SIZE == null || sources[i].GOODS_SIZE == undefined ? " &nbsp; " : qfw(sources[i].GOODS_SIZE)) + '㎡</span></li>';

      } else {
        html += '<span>保证金</span>' +
          '<span>：</span>' +
          '<span>' + (sources[i].EARNEST_MONEY == null || sources[i].EARNEST_MONEY == undefined ? " &nbsp; " : Number(sources[i].EARNEST_MONEY).toLocaleString()) + '元</span></li>' +
          '<li class="land-list_item">' +
          '<span>标的类型</span>' +
          '<span>：</span>' +
          '<span>' + (sources[i].TRANS_TYPE_NAME == null || sources[i].TRANS_TYPE_NAME == undefined ? " " : sources[i].TRANS_TYPE_NAME) + '</span></li>';
      }
      html += '<li class="land-list_item">' +
        '<span>交易方式</span>' +
        '<span>：</span>' +
        '<span>' + (sources[i].TRANS_TYPE2 == null || sources[i].TRANS_TYPE2 == undefined ? " &nbsp; " : sources[i].TRANS_TYPE2) + '</span></li>' +
        '</ul></div>' +
        '<div class="magnitude">' + (i + 1) + '</div>' +
        '</a></div>';
    }
    $(element).html(html);
    //当数据小于5条的时候，卡片切换需要作特殊处理
    if (sources.length < 5) {
      //去掉元素上面因 loadSwiper 添加的 style样式
      $(element).attr({ "style": "" });
      //让图片居中显示，不添加是居左展示
      $(element).find(".swiper-slide").css("margin", "0 auto");
      $(".retry").find(".swiper-pagination-current").html("1");
      $(".retry").find(".swiper-pagination-total").html(sources.length);

      //loadSwiper();
    } else {
      //loadSwiper();
    }
  } else {
    html += '<div style="text-align: center;margin:0 auto;"><img src="' + basePath + '/tradewebpc/images/img_default3.png"  /></div>';

    $(element).html(html);
    $(".retry").find(".swiper-pagination-current").html("0");
    $(".retry").find(".swiper-pagination-total").html("0");
    //去掉元素上面因 loadSwiper 添加的 style样式，不然无数据的图片展示不出来
    $(element).attr({ "style": "" });
  }

}

function appendHtml (element, sources, callBack) {

  var lineTime = "2019-12-01";
  if (sources != null && sources.length > 0) {
    for (var i = 0; i < sources.length; i++) {// class="discontinue"
      var url1 = '';
      var listimg = "";
      var imgstr = "";
      var rt = "";
      if (sources[i].AUCTION_BEGIN_TIME != null && new Date(lineTime.replace(/-/g, "/")) <= new Date(sources[i].AUCTION_BEGIN_TIME.replace(/-/g, "/"))) {
        rt = dateFormat(new Date(sources[i].AUCTION_BEGIN_TIME.replace(/-/g, "/")), "yyyyMM") + "/";
      } else {
        rt = "";
      }
      if (sources[i].BUSINESS_TYPE == 0) {
        url1 = 'landDetail';
        listimg = "img_td3.jpg";
      } else {
        url1 = 'commonDetail';
        listimg = "img_common.jpg";
      }
      // '<a href="' + basePath + '/wap/' + url1 + '?id=' + sources[i].ID + '&code=0015&goodId=' + sources[i].GOODID + '" class="house_a" target="_blank">' +
      if (sources[i].HAS_720MAP != null && sources[i].HAS_720MAP == 1) {
        imgstr = '<img src="http://720.szhome.com/ltc/' + rt + 'images/' + sources[i].NOMAP + '.jpg"  class="house_title_img" onerror="this.src=\'' + basePath + '/tradewebpc/images/' + listimg + '\'"/>' +
          '<object><span  class="to-map" href="http://720.szhome.com/ltc/' + rt + sources[i].NOMAP + '.html" target="_blank">' +
          '<img src="' + basePath + '/tradewebpc/images/720_1.png" class="house_title_img_rotate" /></span></object>';


      } else {
        imgstr = '<img src="' + basePath + '/tradewebpc/images/' + listimg + '" class="house_title_img" />';
      }
      if (sources[i].IS_STOP != null && sources[i].IS_STOP == 1) {
        html +=
          '      <a class="card-item" href="' + basePath + '/wap/' + url1 + '?id=' + sources[i].ID + '&code=0015&goodId=' + sources[i].GOODID + '">' +
          '            <div class="card-banner">' + imgstr +
          '              <img src="' + basePath + '/webwap/images/tab5.png" alt="" class="banner-laber">' +
          '            </div>' +
          '            <div class="card-title">' +
          '              <span>交易日期:</span>' +
          '              <span>' + (sources[i].AUCTION_BEGIN_TIME == null || sources[i].AUCTION_BEGIN_TIME == undefined ? "   &nbsp;  " : sources[i].AUCTION_BEGIN_TIME) + '</span>' +
          '            </div>' +
          '            <div class="card-list">' +
          '              <div class="card-list-item">' +
          '                <div>宗地号:</div>' +
          '                <div>' + (sources[i].NO == null || sources[i].NO == undefined ? "&nbsp;  " : sources[i].NO) + '</div>' +
          '              </div>';

        if (sources[i].BUSINESS_TYPE == 0) {
          html += '<div class="card-list-item">' +
            '<div>土地位置:</div>' +
            '<div>' + (sources[i].ADDRESS == null || sources[i].ADDRESS == undefined ? " &nbsp; " : sources[i].ADDRESS) + '</div></div>';

        } else {
          html += '<div class="card-list-item">' +
            '<div>区域:</div>' +
            '<div>' + (sources[i].AREA == null || sources[i].AREA == undefined ? " " : sources[i].AREA) + '</div></div>';

        }
        html += '<div class="card-list-item">' +
          '            <div>起始价:</div>' +
          '             <div>' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元') + '</div>' +
          '       </div>';

        if (sources[i].BUSINESS_TYPE == 0) {
          html += '<div class="card-list-item">' +
            '<div>土地用途</div>' +
            '<div>' + (sources[i].GOODS_USE == null || sources[i].GOODS_USE == undefined ? " &nbsp; " : sources[i].GOODS_USE) + '</div></div>' +
            '<div class="card-list-item">' +
            '<div>土地面积</div>' +
            '<div>' + (sources[i].GOODS_SIZE == null || sources[i].GOODS_SIZE == undefined ? " &nbsp; " : qfw(sources[i].GOODS_SIZE)) + '㎡</div></div>';
        } else {
          html +=
            '<div class="card-list-item">' +
            '<div>保证金</div>' +
            '<div>' + (sources[i].EARNEST_MONEY == null || sources[i].EARNEST_MONEY == undefined ? " &nbsp; " : Number(sources[i].EARNEST_MONEY).toLocaleString()) + '元</div></div>' +
            '<div class="card-list-item">' +
            '<div>标的类型</div>' +
            '<div>' + (sources[i].TRANS_TYPE_NAME == null || sources[i].TRANS_TYPE_NAME == undefined ? " " : sources[i].TRANS_TYPE_NAME) + '</div></div>';
        }


        html += '<div class="card-list-item">' +
          '                <div>交易方式:</div>' +
          '                <div>' + (sources[i].TRANS_TYPE2 == null || sources[i].TRANS_TYPE2 == undefined ? " &nbsp; " : sources[i].TRANS_TYPE2) + '</div>' +
          '              </div>' +
          '            </div>' +
          '          </a>';

      } else if (sources[i].IS_SUSPEND != null && sources[i].IS_SUSPEND == 1) {
        html +=
          '      <a class="card-item" href="' + basePath + '/wap/' + url1 + '?id=' + sources[i].ID + '&code=0015&goodId=' + sources[i].GOODID + '">' +
          '            <div class="card-banner">' + imgstr +
          '              <img src="' + basePath + '/webwap/images/tab4.png" alt="" class="banner-laber">' +
          '            </div>' +
          '            <div class="card-title">' +
          '              <span>交易日期:</span>' +
          '              <span>' + (sources[i].AUCTION_BEGIN_TIME == null || sources[i].AUCTION_BEGIN_TIME == undefined ? "   &nbsp;  " : sources[i].AUCTION_BEGIN_TIME) + '</span>' +
          '            </div>' +
          '            <div class="card-list">' +
          '              <div class="card-list-item">' +
          '                <div>宗地号:</div>' +
          '                <div>' + (sources[i].NO == null || sources[i].NO == undefined ? "&nbsp;  " : sources[i].NO) + '</div>' +
          '              </div>';

        if (sources[i].BUSINESS_TYPE == 0) {
          html += '<div class="card-list-item">' +
            '<div>土地位置:</div>' +
            '<div>' + (sources[i].ADDRESS == null || sources[i].ADDRESS == undefined ? " &nbsp; " : sources[i].ADDRESS) + '</div></div>';

        } else {
          html += '<div class="card-list-item">' +
            '<div>区域:</div>' +
            '<div>' + (sources[i].AREA == null || sources[i].AREA == undefined ? " " : sources[i].AREA) + '</div></div>';

        }
        html += '<div class="card-list-item">' +
          '            <div>起始价:</div>' +
          '             <div>' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元') + '</div>' +
          '       </div>';

        if (sources[i].BUSINESS_TYPE == 0) {
          html += '<div class="card-list-item">' +
            '<div>土地用途</div>' +
            '<div>' + (sources[i].GOODS_USE == null || sources[i].GOODS_USE == undefined ? " &nbsp; " : sources[i].GOODS_USE) + '</div></div>' +
            '<div class="card-list-item">' +
            '<div>土地面积</div>' +
            '<div>' + (sources[i].GOODS_SIZE == null || sources[i].GOODS_SIZE == undefined ? " &nbsp; " : qfw(sources[i].GOODS_SIZE)) + '㎡</div></div>';
        } else {
          html +=
            '<div class="card-list-item">' +
            '<div>保证金</div>' +
            '<div>' + (sources[i].EARNEST_MONEY == null || sources[i].EARNEST_MONEY == undefined ? " &nbsp; " : Number(sources[i].EARNEST_MONEY).toLocaleString()) + '元</div></div>' +
            '<div class="card-list-item">' +
            '<div>标的类型</div>' +
            '<div>' + (sources[i].TRANS_TYPE_NAME == null || sources[i].TRANS_TYPE_NAME == undefined ? " " : sources[i].TRANS_TYPE_NAME) + '</div></div>';
        }


        html += '<div class="card-list-item">' +
          '                <div>交易方式:</div>' +
          '                <div>' + (sources[i].TRANS_TYPE2 == null || sources[i].TRANS_TYPE2 == undefined ? " &nbsp; " : sources[i].TRANS_TYPE2) + '</div>' +
          '              </div>' +
          '            </div>' +
          '          </a>';
      } else if (sources[i].STATUS != null && sources[i].STATUS == 3) {
        html +=
          '      <a class="card-item" href="' + basePath + '/wap/' + url1 + '?id=' + sources[i].ID + '&code=0015&goodId=' + sources[i].GOODID + '">' +
          '            <div class="card-banner">' + imgstr +
          '              <img src="' + basePath + '/webwap/images/tab1.png" alt="" class="banner-laber">' +
          '            </div>' +
          '            <div class="card-title">' +
          '              <span>交易日期:</span>' +
          '              <span>' + (sources[i].AUCTION_BEGIN_TIME == null || sources[i].AUCTION_BEGIN_TIME == undefined ? "   &nbsp;  " : sources[i].AUCTION_BEGIN_TIME) + '</span>' +
          '            </div>' +
          '            <div class="card-list">' +
          '              <div class="card-list-item">' +
          '                <div>宗地号:</div>' +
          '                <div>' + (sources[i].NO == null || sources[i].NO == undefined ? "&nbsp;  " : sources[i].NO) + '</div>' +
          '              </div>';

        if (sources[i].BUSINESS_TYPE == 0) {
          html += '<div class="card-list-item">' +
            '<div>土地位置:</div>' +
            '<div>' + (sources[i].ADDRESS == null || sources[i].ADDRESS == undefined ? " &nbsp; " : sources[i].ADDRESS) + '</div></div>';

        } else {
          html += '<div class="card-list-item">' +
            '<div>区域:</div>' +
            '<div>' + (sources[i].AREA == null || sources[i].AREA == undefined ? " " : sources[i].AREA) + '</div></div>';

        }
        html += '<div class="card-list-item">' +
          '            <div>起始价:</div>' +
          '             <div>' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元') + '</div>' +
          '       </div>';

        if (sources[i].BUSINESS_TYPE == 0) {
          html += '<div class="card-list-item">' +
            '<div>土地用途</div>' +
            '<div>' + (sources[i].GOODS_USE == null || sources[i].GOODS_USE == undefined ? " &nbsp; " : sources[i].GOODS_USE) + '</div></div>' +
            '<div class="card-list-item">' +
            '<div>土地面积</div>' +
            '<div>' + (sources[i].GOODS_SIZE == null || sources[i].GOODS_SIZE == undefined ? " &nbsp; " : qfw(sources[i].GOODS_SIZE)) + '㎡</div></div>';
        } else {
          html +=
            '<div class="card-list-item">' +
            '<div>保证金</div>' +
            '<div>' + (sources[i].EARNEST_MONEY == null || sources[i].EARNEST_MONEY == undefined ? " &nbsp; " : Number(sources[i].EARNEST_MONEY).toLocaleString()) + '元</div></div>' +
            '<div class="card-list-item">' +
            '<div>标的类型</div>' +
            '<div>' + (sources[i].TRANS_TYPE_NAME == null || sources[i].TRANS_TYPE_NAME == undefined ? " " : sources[i].TRANS_TYPE_NAME) + '</div></div>';
        }


        html += '<div class="card-list-item">' +
          '                <div>交易方式:</div>' +
          '                <div>' + (sources[i].TRANS_TYPE2 == null || sources[i].TRANS_TYPE2 == undefined ? " &nbsp; " : sources[i].TRANS_TYPE2) + '</div>' +
          '              </div>' +
          '            </div>' +
          '          </a>';
      }
      else if (sources[i].STATUS != null && sources[i].STATUS == 4) {
        html +=
          '      <a class="card-item" href="' + basePath + '/wap/' + url1 + '?id=' + sources[i].ID + '&code=0015&goodId=' + sources[i].GOODID + '">' +
          '            <div class="card-banner">' + imgstr +
          '              <img src="' + basePath + '/webwap/images/tab1.png" alt="" class="banner-laber">' +
          '            </div>' +
          '            <div class="card-title">' +
          '              <span>交易日期:</span>' +
          '              <span>' + (sources[i].AUCTION_BEGIN_TIME == null || sources[i].AUCTION_BEGIN_TIME == undefined ? "   &nbsp;  " : sources[i].AUCTION_BEGIN_TIME) + '</span>' +
          '            </div>' +
          '            <div class="card-list">' +
          '              <div class="card-list-item">' +
          '                <div>宗地号:</div>' +
          '                <div>' + (sources[i].NO == null || sources[i].NO == undefined ? "&nbsp;  " : sources[i].NO) + '</div>' +
          '              </div>';

        if (sources[i].BUSINESS_TYPE == 0) {
          html += '<div class="card-list-item">' +
            '<div>土地位置:</div>' +
            '<div>' + (sources[i].ADDRESS == null || sources[i].ADDRESS == undefined ? " &nbsp; " : sources[i].ADDRESS) + '</div></div>';

        } else {
          html += '<div class="card-list-item">' +
            '<div>区域:</div>' +
            '<div>' + (sources[i].AREA == null || sources[i].AREA == undefined ? " " : sources[i].AREA) + '</div></div>';

        }
        html += '<div class="card-list-item">' +
          '            <div>起始价:</div>' +
          '             <div>' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元') + '</div>' +
          '       </div>';

        if (sources[i].BUSINESS_TYPE == 0) {
          html += '<div class="card-list-item">' +
            '<div>土地用途</div>' +
            '<div>' + (sources[i].GOODS_USE == null || sources[i].GOODS_USE == undefined ? " &nbsp; " : sources[i].GOODS_USE) + '</div></div>' +
            '<div class="card-list-item">' +
            '<div>土地面积</div>' +
            '<div>' + (sources[i].GOODS_SIZE == null || sources[i].GOODS_SIZE == undefined ? " &nbsp; " : qfw(sources[i].GOODS_SIZE)) + '㎡</div></div>';
        } else {
          html +=
            '<div class="card-list-item">' +
            '<div>保证金</div>' +
            '<div>' + (sources[i].EARNEST_MONEY == null || sources[i].EARNEST_MONEY == undefined ? " &nbsp; " : Number(sources[i].EARNEST_MONEY).toLocaleString()) + '元</div></div>' +
            '<div class="card-list-item">' +
            '<div>标的类型</div>' +
            '<div>' + (sources[i].TRANS_TYPE_NAME == null || sources[i].TRANS_TYPE_NAME == undefined ? " " : sources[i].TRANS_TYPE_NAME) + '</div></div>';
        }


        html += '<div class="card-list-item">' +
          '                <div>交易方式:</div>' +
          '                <div>' + (sources[i].TRANS_TYPE2 == null || sources[i].TRANS_TYPE2 == undefined ? " &nbsp; " : sources[i].TRANS_TYPE2) + '</div>' +
          '              </div>' +
          '            </div>' +
          '          </div>';
      } else if (sources[i].STATUS != null && sources[i].STATUS == 5) {
        html +=
          '      <a class="card-item" href="' + basePath + '/wap/' + url1 + '?id=' + sources[i].ID + '&code=0015&goodId=' + sources[i].GOODID + '">' +
          '            <div class="card-banner">' + imgstr +
          '              <img src="' + basePath + '/webwap/images/tab2.png" alt="" class="banner-laber">' +
          '            </div>' +
          '            <div class="card-title">' +
          '              <span>交易日期:</span>' +
          '              <span>' + (sources[i].AUCTION_BEGIN_TIME == null || sources[i].AUCTION_BEGIN_TIME == undefined ? "   &nbsp;  " : sources[i].AUCTION_BEGIN_TIME) + '</span>' +
          '            </div>' +
          '            <div class="card-list">' +
          '              <div class="card-list-item">' +
          '                <div>宗地号:</div>' +
          '                <div>' + (sources[i].NO == null || sources[i].NO == undefined ? "&nbsp;  " : sources[i].NO) + '</div>' +
          '              </div>';

        if (sources[i].BUSINESS_TYPE == 0) {
          html += '<div class="card-list-item">' +
            '<div>土地位置:</div>' +
            '<div>' + (sources[i].ADDRESS == null || sources[i].ADDRESS == undefined ? " &nbsp; " : sources[i].ADDRESS) + '</div></div>';

        } else {
          html += '<div class="card-list-item">' +
            '<div>区域:</div>' +
            '<div>' + (sources[i].AREA == null || sources[i].AREA == undefined ? " " : sources[i].AREA) + '</div></div>';

        }
        html += '<div class="card-list-item">' +
          '            <div>起始价:</div>' +
          '             <div>' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元') + '</div>' +
          '       </div>';

        if (sources[i].BUSINESS_TYPE == 0) {
          html += '<div class="card-list-item">' +
            '<div>土地用途</div>' +
            '<div>' + (sources[i].GOODS_USE == null || sources[i].GOODS_USE == undefined ? " &nbsp; " : sources[i].GOODS_USE) + '</div></div>' +
            '<div class="card-list-item">' +
            '<div>土地面积</div>' +
            '<div>' + (sources[i].GOODS_SIZE == null || sources[i].GOODS_SIZE == undefined ? " &nbsp; " : qfw(sources[i].GOODS_SIZE)) + '㎡</div></div>';
        } else {
          html +=
            '<div class="card-list-item">' +
            '<div>保证金</div>' +
            '<div>' + (sources[i].EARNEST_MONEY == null || sources[i].EARNEST_MONEY == undefined ? " &nbsp; " : Number(sources[i].EARNEST_MONEY).toLocaleString()) + '元</div></div>' +
            '<div class="card-list-item">' +
            '<div>标的类型</div>' +
            '<div>' + (sources[i].TRANS_TYPE_NAME == null || sources[i].TRANS_TYPE_NAME == undefined ? " " : sources[i].TRANS_TYPE_NAME) + '</div></div>';
        }


        html += '<div class="card-list-item">' +
          '                <div>交易方式:</div>' +
          '                <div>' + (sources[i].TRANS_TYPE2 == null || sources[i].TRANS_TYPE2 == undefined ? " &nbsp; " : sources[i].TRANS_TYPE2) + '</div>' +
          '              </div>' +
          '            </div>' +
          '            </div>' +
          '          </a>';
      } else if (sources[i].STATUS != null && sources[i].STATUS == 6) {
        html +=
          '      <a class="card-item" href="' + basePath + '/wap/' + url1 + '?id=' + sources[i].ID + '&code=0015&goodId=' + sources[i].GOODID + '">' +
          '            <div class="card-banner">' + imgstr +
          '              <img src="' + basePath + '/webwap/images/tab3.png" alt="" class="banner-laber">' +
          '            </div>' +
          '            <div class="card-title">' +
          '              <span>交易日期:</span>' +
          '              <span>' + (sources[i].AUCTION_BEGIN_TIME == null || sources[i].AUCTION_BEGIN_TIME == undefined ? "   &nbsp;  " : sources[i].AUCTION_BEGIN_TIME) + '</span>' +
          '            </div>' +
          '            <div class="card-list">' +
          '              <div class="card-list-item">' +
          '                <div>宗地号:</div>' +
          '                <div>' + (sources[i].NO == null || sources[i].NO == undefined ? "&nbsp;  " : sources[i].NO) + '</div>' +
          '              </div>';

        if (sources[i].BUSINESS_TYPE == 0) {
          html += '<div class="card-list-item">' +
            '<div>土地位置:</div>' +
            '<div>' + (sources[i].ADDRESS == null || sources[i].ADDRESS == undefined ? " &nbsp; " : sources[i].ADDRESS) + '</div></div>';

        } else {
          html += '<div class="card-list-item">' +
            '<div>区域:</div>' +
            '<div>' + (sources[i].AREA == null || sources[i].AREA == undefined ? " " : sources[i].AREA) + '</div></div>';

        }
        html += '<div class="card-list-item">' +
          '            <div>起始价:</div>' +
          '             <div>' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元') + '</div>' +
          '       </div>';

        if (sources[i].BUSINESS_TYPE == 0) {
          html += '<div class="card-list-item">' +
            '<div>土地用途</div>' +
            '<div>' + (sources[i].GOODS_USE == null || sources[i].GOODS_USE == undefined ? " &nbsp; " : sources[i].GOODS_USE) + '</div></div>' +
            '<div class="card-list-item">' +
            '<div>土地面积</div>' +
            '<div>' + (sources[i].GOODS_SIZE == null || sources[i].GOODS_SIZE == undefined ? " &nbsp; " : qfw(sources[i].GOODS_SIZE)) + '㎡</div></div>';
        } else {
          html +=
            '<div class="card-list-item">' +
            '<div>保证金</div>' +
            '<div>' + (sources[i].EARNEST_MONEY == null || sources[i].EARNEST_MONEY == undefined ? " &nbsp; " : Number(sources[i].EARNEST_MONEY).toLocaleString()) + '元</div></div>' +
            '<div class="card-list-item">' +
            '<div>标的类型</div>' +
            '<div>' + (sources[i].TRANS_TYPE_NAME == null || sources[i].TRANS_TYPE_NAME == undefined ? " " : sources[i].TRANS_TYPE_NAME) + '</div></div>';
        }


        html += '<div class="card-list-item">' +
          '                <div>交易方式:</div>' +
          '                <div>' + (sources[i].TRANS_TYPE2 == null || sources[i].TRANS_TYPE2 == undefined ? " &nbsp; " : sources[i].TRANS_TYPE2) + '</div>' +
          '              </div>' +
          '            </div>' +
          '          </a>';
      } else {
      }
    }
  }
  callBack && callBack(false)
  $(element).html(html);
  
  
  $('.to-map').unbind('tap')

  
  $('.to-map').bind('tap', function() {
	  window.open($(this).attr('href'))
  })
}


function appendTatolHtml (element, sources) {
  $(element).html("");
  var html = "<span>" + sources + "</span>";
  $(element).html(html);
}

function getAreas () {

  let value = $("#area").find(".shadow-active").attr("value")

  return value
  //  var areas = ""
  //
  //  $.each($("#area").find(".base-color"), function () {
  //
  //    if ($(this).attr("value") != "0") {
  //      areas += $(this).attr("value");
  //    }
  //  });
  //  return areas;
}
/*function getTypes(){
var types = "";
	$.each($('#housetype input:checkbox:checked'),function(){
		types+=$(this).val()+",";
    });
return types.substring(0,types.length-1);
}*/
function getStatus () {
  let value = $("#status").find(".shadow-active").attr("value")
  if (value === "1") {
    params["stopstatus"] = "1"
  }
  if (value === "2") {
    params["suspendstatus"] = "1"
  }
  return value
  //  var status = ""
  //  $.each($("#status").find(".base-color"), function () {
  //    if ($(this).val() != "0") {
  //      if ($(this).val() == '1') {
  //        status = "1";
  //        pageinfo["stopstatus"] = '1';
  //      } else if ($(this).val() == '2') {
  //        status = "2";
  //        pageinfo["suspendstatus"] = '1';
  //      } else if ($(this).val() == '4') {
  //        status += $(this).val() + ",3,";
  //      } else {
  //        status += $(this).val() + ",";
  //      }
  //    }
  //
  //  });
  //  return status;
}


function getbusiness () {
  let value = $("#business").find(".shadow-active").attr("value")
  return value
}

function getStatusIsStop () {
  var stopstatus = ""
  $.each($("#status").find(".base-color"), function () {
    if ($(this).val() != "") {
      if ($(this).val() == '1') {
        pageinfo["stopstatus"] = '1';
        stopstatus = '1';
      }
    }

  });
  return stopstatus;
}


function getStatusIsSupend () {
  var suspendstatus = ""
  $.each($("#status").find(".base-color"), function () {
    if ($(this).val() != "") {
      if ($(this).val() == '1') {
        pageinfo["stopstatus"] = '1';
      } else if ($(this).val() == '2') {
        pageinfo["suspendstatus"] = '1';
        suspendstatus = '1';
      }
    }

  });
  return suspendstatus;
}



mui.init({
  pullRefresh: {
    container: '.droploader',
    down: {
      callback: function () {
        let that = this
        params["currentPage"] = 1
        html = ''
        setTimeout(function () {
          $.post(basePath + "/web/getTargetJson?", params, function (r) {
            if (r.code == 0) {
              if (!r.result.targets.length) {
                that.endPulldownToRefresh(true);
                appendHtml($("#land"), []);
                return
              }
              appendHtml($("#land"), r.result.targets, that.endPulldownToRefresh());
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
        params["currentPage"] = currentPage
        setTimeout(function () {
          $.post(basePath + "/web/getTargetJson?", params, function (r) {
            if (r.code == 0) {
              if (!r.result.targets.length) {
                that.endPullupToRefresh(true);
                appendHtml($("#land"), []);
                return
              }
              appendHtml($("#land"), r.result.targets, that.endPullupToRefresh());
            } else {
              that.endPullupToRefresh()
            }
          });
        }, 300)
      }
    }
  }
});
mui('body').on('tap', 'a', function () { document.location.href = this.href; });


