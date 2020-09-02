let result = {}
var tabs = {};
$(document).ready(function () {

  getListJson();
  setHouseList(1);
  tabs.land()
  tabs.house()
  tabs.make()
  //弹出登录窗口 
  isOpenLoginPop();
  /**************end******zhusb 2019-03-08**********************/
})


tabs.land = function () {
  $(".land-tab").on("click", "li", function () {
    var index = $(this).index();
    var active = $(this).parents(".land-tab").data("active");
    $(this).addClass(active).siblings("li").removeClass(active);
    getCommonListJson(index)
  })
}
tabs.make = function () {
  $(".make-tab").on("click", "li", function () {
    var index = $(this).index();
    switch (index) {
      case 0:
        setHouseList(1);
        break;

      case 1:
        setHouseList(0);
        break;
      case 2:
        setHouseList(2);
        break;
      case 3:
        setHouseList(3);
        break;
    }
  })
}
tabs.house = function () {
  $(".house-tab").on("click", "li", function () {
    var index = $(this).index();
    var active = $(this).parents(".house-tab").data("active");
    $(this).addClass(active).siblings("li").removeClass(active);

    switch (index) {
      case 0:
        houseappendHtml($("#house"), result.allTargets.targets)
        break;

      case 1:
        houseappendHtml($("#house"), result.gpTargets.targets)
        break;
      case 2:
        houseappendHtml($("#house"), result.pmTargets.targets)
        break;
      case 3:
        houseappendHtml($("#house"), result.louyuTargetlist.targets)
        break;
    }



  })
}
function isOpenLoginPop () {
  var loginPop = getUrlParam("loginPop")
  if (loginPop != null && loginPop != "" && loginPop.indexOf("1") == 0 && (sessionID == null || sessionID == '')) {
    $('.popup').show();
    $('.enter_case').show();
    logina.style.backgroundColor = "#fff";
    CA.style.backgroundColor = "#e8e8e8";
    $("#captchaHeader").attr('src', '/tiaim/captcha.jpg?t=' + new Date().getTime())
    txt_login.style.display = "block";
    txt_CA.style.display = "none";
  }

}

/**
 * 获取URL路径中的参数
 * @param k
 * @returns
 */
function getUrlParam (k) {
  var regExp = new RegExp('([?]|&)' + k + '=([^&]*)(&|$)');
  var result = window.location.href.match(regExp);
  if (result) {
    return decodeURIComponent(result[2].replace(/%/g, '%25'));
  } else {
    return null;
  }
}
function getListJson () {
  $.post(basePath + "/web/index/landresult?", {}, function (r) {
    if (r.code == 0) {
      result = r
      if (r.landTargets != null) {
        landresultHtml($("#tradingland"), r.landTargets.targets);
      }


      if (r.allTargets != null) {
        houseappendHtml($("#house"), r.allTargets.targets)
      }
      //      if (r.allTargets != null) {
      //        houseappendHtml($("#allhousegpid"), r.allTargets.targets)
      //      }
      //      if (r.gpTargets != null) {
      //        houseappendHtml($("#housegpid"), r.gpTargets.targets)
      //      }
      //      if (r.pmTargets != null) {
      //        houseappendHtml($("#housepmid"), r.pmTargets.targets)
      //      }
      //      if (r.louyuTargetlist != null) {
      //        commonHtml($("#louyu"), r.louyuTargetlist.targets)
      //      }

    } else {

    }
  });
}



function landresultHtml (element, sources) {
  $(element).html('');
  var html = "";
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
  } else {
    html += '<div class="noData">暂无数据</div>'

  }

  $(element).html(html);


}






function getCommonListJson (index) {
  var type = ""
  var columntype = '';

  if (index == 1) {
    type = "0,1";
    columntype = 1;
  } else if (index == 2) {
    type = "4,5,6,7";
    columntype = 2;
  } else if (index == 3) {
    type = "11"
    columntype = 3;
  } else if (index == 4) {
    type = "9"
    columntype = 4;
  } else {
    landresultHtml($("#tradingland"), result.landTargets.targets)
    return
  }
  $.post(basePath + "/web/index/commonresult?", { type: type, columntype: columntype }, function (r) {
    if (r.code == 0) {
      if (r.landTargets != null) {
        landresultHtml($("#tradingland"), r.landTargets.targets);
      }
    } else {
      $.Pop(r.msg, 'alert', function () { });
    }
  });
}

function commonHtml (element, sources) {
  $(element).html("");
  var html = "";
  if (sources != null != null && sources.length > 0) {

    for (var i = 0, k = sources.length; i < k; i++) {
      if (sources[i].IS_STOP != null && sources[i].IS_STOP == 1) {
        html += '<li class="house_item">' +
          '<a href="' + basePath + '/wap/commonDetail?id=' + sources[i].ID + '&code=0015&goodId=' + sources[i].GOODID + '" target="_blank">' +
          '            <div class="house_item_img_hover"></div>' +
          '            <div class="house_item_img">' +
          '                <img src="' + basePath + '/tradewebpc/images/img_common.jpg" alt="">' +
          '                <img src="' + basePath + '/tradewebpc/images/bq5.png" alt="">' +
          '            </div>' +
          '            <div>' +
          '               <h3>申请截止日期：' + (sources[i].END_APPLY_TIME == null || sources[i].END_APPLY_TIME == undefined ? " &nbsp; " : sources[i].END_APPLY_TIME) + '</h3>' +
          '                <ul class="house_item_ul">' +
          '                    <li>' +
          '                        <span class="leftspan">标的名称</span>' +
          '                        <span>：</span>' +
          '<span class="rightspan">' + (sources[i].NO == null || sources[i].NO == undefined ? " &nbsp; " : sources[i].NO) + '</span></li>' +
          '                    <li>' +
          '                        <span class="leftspan">交易日期</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].AUCTION_BEGIN_TIME == null || sources[i].AUCTION_BEGIN_TIME == undefined ? "   &nbsp;    " : sources[i].AUCTION_BEGIN_TIME) + '</span>' +
          '                    </li>' +
          '                    <li>' +
          '                        <span class="leftspan">起始价</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元') + '</span>' +
          '                    </li>' +
          '                    <li>' +
          '                        <span class="leftspan">保证金</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].EARNEST_MONEY == null || sources[i].EARNEST_MONEY == undefined ? " &nbsp; " : Number(sources[i].EARNEST_MONEY).toLocaleString()) + '元</span>' +
          '                    </li>' +

          '                    <li>' +
          '                        <span class="leftspan">标的类型</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].TRANS_TYPE_NAME == null || sources[i].TRANS_TYPE_NAME == undefined ? " " : sources[i].TRANS_TYPE_NAME) + '</span>' +
          '                    </li>' +
          '                    <li>' +
          '                        <span class="leftspan">交易方式</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].TRANS_TYPE2 == null || sources[i].TRANS_TYPE2 == undefined ? "&nbsp;  " : sources[i].TRANS_TYPE2) + '</span>' +
          '                    </li>' +
          '                </ul>' +
          '            </div>' +
          '        </a>' +
          '    </li>';


      } else if (sources[i].IS_SUSPEND != null && sources[i].IS_SUSPEND == 1) {
        html += '<li class="house_item">' +
          '<a href="' + basePath + '/wap/commonDetail?id=' + sources[i].ID + '&code=0015&goodId=' + sources[i].GOODID + '" target="_blank">' +
          '            <div class="house_item_img_hover"></div>' +
          '            <div class="house_item_img">' +
          '                <img src="' + basePath + '/tradewebpc/images/img_common.jpg" alt="">' +
          '                <img src="' + basePath + '/tradewebpc/images/bq4.png" alt="">' +
          '            </div>' +
          '            <div>' +
          '              <h3>申请截止日期：' + (sources[i].END_APPLY_TIME == null || sources[i].END_APPLY_TIME == undefined ? " &nbsp; " : sources[i].END_APPLY_TIME) + '</h3>' +
          '                <ul class="house_item_ul">' +
          '                    <li>' +
          '                        <span class="leftspan">标的名称</span>' +
          '                        <span>：</span>' +
          '<span class="rightspan">' + (sources[i].NO == null || sources[i].NO == undefined ? " &nbsp; " : sources[i].NO) + '</span></li>' +
          '                    <li>' +
          '                        <span class="leftspan">交易日期</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].AUCTION_BEGIN_TIME == null || sources[i].AUCTION_BEGIN_TIME == undefined ? "   &nbsp;    " : sources[i].AUCTION_BEGIN_TIME) + '</span>' +
          '                    </li>' +
          '                    <li>' +
          '                        <span class="leftspan">起始价</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元') + '</span>' +
          '                    </li>' +
          '                    <li>' +
          '                        <span class="leftspan">保证金</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].EARNEST_MONEY == null || sources[i].EARNEST_MONEY == undefined ? " &nbsp; " : Number(sources[i].EARNEST_MONEY).toLocaleString()) + '元</span>' +
          '                    </li>' +

          '                    <li>' +
          '                        <span class="leftspan">标的类型</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].TRANS_TYPE_NAME == null || sources[i].TRANS_TYPE_NAME == undefined ? " " : sources[i].TRANS_TYPE_NAME) + '</span>' +
          '                    </li>' +
          '                    <li>' +
          '                        <span class="leftspan">交易方式</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].TRANS_TYPE2 == null || sources[i].TRANS_TYPE2 == undefined ? "&nbsp;  " : sources[i].TRANS_TYPE2) + '</span>' +
          '                    </li>' +
          '                </ul>' +
          '            </div>' +
          '        </a>' +
          '    </li>';
      } else if (sources[i].STATUS != null && sources[i].STATUS == 3) {
        html += '<li class="house_item">' +
          '<a href="' + basePath + '/wap/commonDetail?id=' + sources[i].ID + '&code=0015&goodId=' + sources[i].GOODID + '" target="_blank">' +
          '            <div class="house_item_img_hover"></div>' +
          '            <div class="house_item_img">' +
          '                <img src="' + basePath + '/tradewebpc/images/img_common.jpg" alt="">' +
          '                <img src="' + basePath + '/tradewebpc/images/bq1.png" alt="">' +
          '            </div>' +
          '            <div>' +
          '               <h3>申请截止日期：' + (sources[i].END_APPLY_TIME == null || sources[i].END_APPLY_TIME == undefined ? " &nbsp; " : sources[i].END_APPLY_TIME) + '</h3>' +
          '                <ul class="house_item_ul">' +
          '                    <li>' +
          '                        <span class="leftspan">标的名称</span>' +
          '                        <span>：</span>' +
          '<span class="rightspan">' + (sources[i].NO == null || sources[i].NO == undefined ? " &nbsp; " : sources[i].NO) + '</span></li>' +
          '                    <li>' +
          '                        <span class="leftspan">交易日期</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].AUCTION_BEGIN_TIME == null || sources[i].AUCTION_BEGIN_TIME == undefined ? "   &nbsp;    " : sources[i].AUCTION_BEGIN_TIME) + '</span>' +
          '                    </li>' +
          '                    <li>' +
          '                        <span class="leftspan">起始价</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元') + '</span>' +
          '                    </li>' +
          '                    <li>' +
          '                        <span class="leftspan">保证金</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].EARNEST_MONEY == null || sources[i].EARNEST_MONEY == undefined ? " &nbsp; " : Number(sources[i].EARNEST_MONEY).toLocaleString()) + '元</span>' +
          '                    </li>' +

          '                    <li>' +
          '                        <span class="leftspan">标的类型</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].TRANS_TYPE_NAME == null || sources[i].TRANS_TYPE_NAME == undefined ? " " : sources[i].TRANS_TYPE_NAME) + '</span>' +
          '                    </li>' +
          '                    <li>' +
          '                        <span class="leftspan">交易方式</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].TRANS_TYPE2 == null || sources[i].TRANS_TYPE2 == undefined ? "&nbsp;  " : sources[i].TRANS_TYPE2) + '</span>' +
          '                    </li>' +
          '                </ul>' +
          '            </div>' +
          '        </a>' +
          '    </li>';
      } else if (sources[i].STATUS != null && sources[i].STATUS == 4) {
        html += '<li class="house_item">' +
          '<a href="' + basePath + '/wap/commonDetail?id=' + sources[i].ID + '&code=0015&goodId=' + sources[i].GOODID + '" target="_blank">' +
          '            <div class="house_item_img_hover"></div>' +
          '            <div class="house_item_img">' +
          '                <img src="' + basePath + '/tradewebpc/images/img_common.jpg" alt="">' +
          '                <img src="' + basePath + '/tradewebpc/images/bq1.png" alt="">' +
          '            </div>' +
          '            <div>' +
          '               <h3>申请截止日期：' + (sources[i].END_APPLY_TIME == null || sources[i].END_APPLY_TIME == undefined ? " &nbsp; " : sources[i].END_APPLY_TIME) + '</h3>' +
          '                <ul class="house_item_ul">' +
          '                    <li>' +
          '                        <span class="leftspan">标的名称</span>' +
          '                        <span>：</span>' +
          '<span class="rightspan">' + (sources[i].NO == null || sources[i].NO == undefined ? " &nbsp; " : sources[i].NO) + '</span></li>' +
          '                    <li>' +
          '                        <span class="leftspan">交易日期</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].AUCTION_BEGIN_TIME == null || sources[i].AUCTION_BEGIN_TIME == undefined ? "   &nbsp;    " : sources[i].AUCTION_BEGIN_TIME) + '</span>' +
          '                    </li>' +
          '                    <li>' +
          '                        <span class="leftspan">起始价</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元') + '</span>' +
          '                    </li>' +
          '                    <li>' +
          '                        <span class="leftspan">保证金</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].EARNEST_MONEY == null || sources[i].EARNEST_MONEY == undefined ? " &nbsp; " : Number(sources[i].EARNEST_MONEY).toLocaleString()) + '元</span>' +
          '                    </li>' +

          '                    <li>' +
          '                        <span class="leftspan">标的类型</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].TRANS_TYPE_NAME == null || sources[i].TRANS_TYPE_NAME == undefined ? " " : sources[i].TRANS_TYPE_NAME) + '</span>' +
          '                    </li>' +
          '                    <li>' +
          '                        <span class="leftspan">交易方式</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].TRANS_TYPE2 == null || sources[i].TRANS_TYPE2 == undefined ? "&nbsp;  " : sources[i].TRANS_TYPE2) + '</span>' +
          '                    </li>' +
          '                </ul>' +
          '            </div>' +
          '        </a>' +
          '    </li>';
      } else if (sources[i].STATUS != null && sources[i].STATUS == 5) {
        html += '<li class="house_item">' +
          '<a href="' + basePath + '/wap/commonDetail?id=' + sources[i].ID + '&code=0015&goodId=' + sources[i].GOODID + '" target="_blank">' +
          '            <div class="house_item_img_hover"></div>' +
          '            <div class="house_item_img">' +
          '                <img src="' + basePath + '/tradewebpc/images/img_common.jpg" alt="">' +
          '                <img src="' + basePath + '/tradewebpc/images/bq2.png" alt="">' +
          '            </div>' +
          '            <div>' +
          '               <h3>申请截止日期：' + (sources[i].END_APPLY_TIME == null || sources[i].END_APPLY_TIME == undefined ? " &nbsp; " : sources[i].END_APPLY_TIME) + '</h3>' +
          '                <ul class="house_item_ul">' +
          '                    <li>' +
          '                        <span class="leftspan">标的名称</span>' +
          '                        <span>：</span>' +
          '<span class="rightspan">' + (sources[i].NO == null || sources[i].NO == undefined ? " &nbsp; " : sources[i].NO) + '</span></li>' +
          '                    <li>' +
          '                        <span class="leftspan">交易日期</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].AUCTION_BEGIN_TIME == null || sources[i].AUCTION_BEGIN_TIME == undefined ? "   &nbsp;    " : sources[i].AUCTION_BEGIN_TIME) + '</span>' +
          '                    </li>' +
          '                    <li>' +
          '                        <span class="leftspan">起始价</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元') + '</span>' +
          '                    </li>' +
          '                    <li>' +
          '                        <span class="leftspan">保证金</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].EARNEST_MONEY == null || sources[i].EARNEST_MONEY == undefined ? " &nbsp; " : Number(sources[i].EARNEST_MONEY).toLocaleString()) + '元</span>' +
          '                    </li>' +

          '                    <li>' +
          '                        <span class="leftspan">标的类型</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].TRANS_TYPE_NAME == null || sources[i].TRANS_TYPE_NAME == undefined ? " " : sources[i].TRANS_TYPE_NAME) + '</span>' +
          '                    </li>' +
          '                    <li>' +
          '                        <span class="leftspan">交易方式</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].TRANS_TYPE2 == null || sources[i].TRANS_TYPE2 == undefined ? "&nbsp;  " : sources[i].TRANS_TYPE2) + '</span>' +
          '                    </li>' +
          '                </ul>' +
          '            </div>' +
          '        </a>' +
          '    </li>';
      } else if (sources[i].STATUS != null && sources[i].STATUS == 6) {
        html += '<li class="house_item">' +
          '<a href="' + basePath + '/wap/commonDetail?id=' + sources[i].ID + '&code=0015&goodId=' + sources[i].GOODID + '" target="_blank">' +
          '            <div class="house_item_img_hover"></div>' +
          '            <div class="house_item_img">' +
          '                <img src="' + basePath + '/tradewebpc/images/img_common.jpg" alt="">' +
          '                <img src="' + basePath + '/tradewebpc/images/bq3.png" alt="">' +
          '            </div>' +
          '            <div>' +
          '               <h3>申请截止日期：' + (sources[i].END_APPLY_TIME == null || sources[i].END_APPLY_TIME == undefined ? " &nbsp; " : sources[i].END_APPLY_TIME) + '</h3>' +
          '                <ul class="house_item_ul">' +
          '                    <li>' +
          '                        <span class="leftspan">标的名称</span>' +
          '                        <span>：</span>' +
          '<span class="rightspan">' + (sources[i].NO == null || sources[i].NO == undefined ? " &nbsp; " : sources[i].NO) + '</span></li>' +
          '                    <li>' +
          '                        <span class="leftspan">交易日期</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].AUCTION_BEGIN_TIME == null || sources[i].AUCTION_BEGIN_TIME == undefined ? "   &nbsp;    " : sources[i].AUCTION_BEGIN_TIME) + '</span>' +
          '                    </li>' +
          '                    <li>' +
          '                        <span class="leftspan">起始价</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元') + '</span>' +
          '                    </li>' +
          '                    <li>' +
          '                        <span class="leftspan">保证金</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].EARNEST_MONEY == null || sources[i].EARNEST_MONEY == undefined ? " &nbsp; " : Number(sources[i].EARNEST_MONEY).toLocaleString()) + '元</span>' +
          '                    </li>' +

          '                    <li>' +
          '                        <span class="leftspan">标的类型</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].TRANS_TYPE_NAME == null || sources[i].TRANS_TYPE_NAME == undefined ? " " : sources[i].TRANS_TYPE_NAME) + '</span>' +
          '                    </li>' +
          '                    <li>' +
          '                        <span class="leftspan">交易方式</span>' +
          '                        <span>：</span>' +
          '                        <span class="rightspan">' + (sources[i].TRANS_TYPE2 == null || sources[i].TRANS_TYPE2 == undefined ? "&nbsp;  " : sources[i].TRANS_TYPE2) + '</span>' +
          '                    </li>' +
          '                </ul>' +
          '            </div>' +
          '        </a>' +
          '    </li>';
      }

    }


  } else {
    html += '<div style="text-align: center;"><img src="' + basePath + '/tradewebpc/images/img_default3.png"  /></div>';
  }
  $(element).html(html);
}

function houseappendHtml (element, sources) {
  $(element).html("");
  var html = "";

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
          '        <div>' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元') + '</div>' +
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
          '        <div>' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元') + '</div>' +
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
          '        <div>' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元') + '</div>' +
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
          '        <div>' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元') + '</div>' +
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
          '        <div>' + (sources[i].TRANS_PRICE == null || sources[i].TRANS_PRICE == undefined ? " " : Number(sources[i].TRANS_PRICE).toLocaleString()) + '元</div>' +
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
          '        <div>' + (sources[i].BEGIN_PRICE == null || sources[i].BEGIN_PRICE == undefined || sources[i].BEGIN_PRICE == 0 ? " &nbsp; " : Number(sources[i].BEGIN_PRICE).toLocaleString() + '元') + '</div>' +
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
  } else {
    html += '<div class="noData">暂无数据</div>'
  }




  $(element).html(html);
}
function loadSwiper (swipercontainer, btnleft, btnright, retry) {

  //     	var size = $("#land-swiper").val();
  var size = 5;
  var certifySwiper = new Swiper(swipercontainer, {
    watchSlidesProgress: true,
    autoHeight: true,
    spaceBetween: 0,
    slidesPerView: '4.5',
    centeredSlides: true,
    loop: true,
    observer: true,
    observerParents: true,
    loopedSlides: size,
    navigation: {
      prevEl: btnleft,
      nextEl: btnright,
    },
    pagination: {
      el: retry,
      type: 'fraction',
    },
    //pagination: {
    //     el: '.swiper-pagination2',
    //     clickable: true,
    // },
    on: {
      progress: function (progress) {
        for (i = 0; i < this.slides.length; i++) {
          var slide = this.slides.eq(i);
          var slideProgress = this.slides[i].progress;
          modify = 1;
          if (Math.abs(slideProgress) > 1) {
            modify = (Math.abs(slideProgress) - 1) * - -16;
          }
          translate = slideProgress * modify * 1 + 'px';
          scale = 1 - Math.abs(slideProgress) / (size * 2 - 2);
          zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
          slide.transform('translateX(' + translate + ') scale(' + scale + ')');
          slide.css('zIndex', zIndex);
          slide.css('opacity', 1);
          if (Math.abs(slideProgress) > 5) {
            slide.css('opacity', 0);
          }
        }
      },
      setTransition: function (transition) {
        for (var i = 0; i < this.slides.length; i++) {
          var slide = this.slides.eq(i)
          slide.transition(transition);
        }

      }
    }

  })

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
function setCurrentHouseTab (index) {
  if (index === 0) {
    $("#li_newhouse").addClass("active");
    $("#li_canapply").removeClass("active");
    $("#li_hothouse").removeClass("active");
    $("#li_viewhouse").removeClass("active");
    $("#viewMore").attr("href", supplyUrl + "/web/seachList.jsp");
  } else if (index === 1) {
    $("#li_newhouse").removeClass("active");
    $("#li_canapply").addClass("active");
    $("#li_hothouse").removeClass("active");
    $("#li_viewhouse").removeClass("active");
    $("#viewMore").attr("href", supplyUrl + "/web/seachList.jsp?publish_type=2");
  } else if (index === 2) {
    $("#li_newhouse").removeClass("active");
    $("#li_canapply").removeClass("active");
    $("#li_hothouse").addClass("active");
    $("#li_viewhouse").removeClass("active");
    $("#viewMore").attr("href", supplyUrl + "/web/seachList.jsp");
  } else if (index === 3) {
    $("#li_newhouse").removeClass("active");
    $("#li_canapply").removeClass("active");
    $("#li_hothouse").removeClass("active");
    $("#li_viewhouse").addClass("active");
    $("#viewMore").attr("href", supplyUrl + "/web/seachList.jsp?viewHoudeModel=1");
  }
}
function setHouseList (type) {
  $.post(basePath + "/web/index/dcyyf", { tableType: type }, function (res) {
    if (res.code == 0) {
      var result = JSON.parse(res.result);
      if (result.status == 1) {
        setsupplyhtml(result.data, type)
      }
    } else {
      $("#houselist").html('<div style="text-align: center;"><img src="' + basePath + '/tradewebpc/images/img_default3.png"  /></div>');
    }
  });
}
function setsupplyhtml (sourse, type) {
  var html = "";
  if (sourse.length > 0) {
    for (var i = 0; i < sourse.length; i++) {
      if (i < 4) {
        html +=
          '       <div class="card-item">' +
          '                <a class="house-a"  href="' + supplyUrl + '/homeDetailSeoServlet?id=' +
          (sourse[i].hsrprj_id == null || sourse[i].hsrprj_id == undefined ? "" : sourse[i].hsrprj_id) + '" title="' +
          (sourse[i].name == null || sourse[i].name == undefined ? "" : sourse[i].name) + '" target="_blank">' +
          '                  <div class="card-banner">' +
          '                    <img src="' + (sourse[i].file_path == null || sourse[i].file_path == undefined ? "" : sourse[i].file_path) + '" onerror="this.src=\'' + supplyUrl + '/web/images/default.png\';this.onerror=null">' +
          '                    <img src="' + basePath + '/webwap/images/720icon.png" alt="" class="banner-rotate">' +
          '                  </div>' +
          '                  <div class="card-caption">' + (sourse[i].name == null || sourse[i].name == undefined ? "" : sourse[i].name) + '</div>' +
          '                  <div class="card-describe">' +
          '                    <div>' +
          '                      <span>' + (sourse[i].canton_name == null || sourse[i].canton_name == undefined ? "" : sourse[i].canton_name) + '</span>' +
          '                      <span>' + (sourse[i].innovation_area == null || sourse[i].innovation_area == undefined ? "" : sourse[i].innovation_area) + '㎡</span>' +
          '                    </div>' +
          '                    <div>' +
          '                      <span>' + (sourse[i].main_purpose == null || sourse[i].main_purpose == undefined ? "" : sourse[i].main_purpose) + '</span>' +
          '                    </div>' +
          '                  </div>' +
          '                </a>' +
          '      </div>';
      }

    }
  } else {
    html += '<div style="text-align: center;"><img src="' + basePath + '/tradewebpc/images/img_default3.png"  /></div>';
  }
  $("#new").html(html);
  $(".cyyfList li i").css('background', 'url(' + supplyUrl + '/images/cyyf-spri-2018.png?v=2019052101) no-repeat');
  $(".cyyfList li i").css('background-position', ' -200px -331px');
}