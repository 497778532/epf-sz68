var html = ''
	var currentPage = 0;
$(function(){

});
 
//function getListJson(){
//	 Page({
//			num:params.total_page,					//页码数
//			startnum:params.currentPage,				//指定页码
//			elem:$('#page1'),		//指定的元素
//			callback:function(n){
//				params.currentPage=n;
//				$.post(basePath+"/web/noticelistJson",params,function(r){
//					if(r.code === 0){
//						appendHtml($(".result-list"),r.result.result);
//					}else{
//						$.Pop(r.msg,'alert',function(){});
//					}
//				});
//			}
//		});
//}    	 
mui.init({
	  pullRefresh: {
	    container: '.droploader',

	    down: {
	      callback: function () {

	        let that = this
	        html = ''
	        currentPage = 0
	        params["currentPage"] = currentPage

	        setTimeout(function () {
	          $.post(basePath + "/web/noticelistJson?", params, function (r) {
	            if (r.code == 0) {
	              if (!r.result.result.length) {
	                that.endPullupToRefresh(true);
	                appendHtml($("#house"), []);
	                return
	              }
	              appendHtml($(".result-list"), r.result.result, that.endPulldownToRefresh());      
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
	          $.post(basePath + "/web/noticelistJson?", params, function (r) {
	            if (r.code == 0) {
	              if (!r.result.result.length) {
	                that.endPullupToRefresh(true);
	                appendHtml($("#house"), []);
	                return
	              }
	              appendHtml($("#house"), r.result.result, that.endPullupToRefresh());        
	            }
	          });

	        }, 300)
	      }
	    }
	  }
	});
mui('body').on('tap','a',function(){document.location.href=this.href;});

function appendHtml (element, sources,callBack) {
	  if (sources != null) {
	    for (var i = 0; i < sources.length; i++) {
	      if (sources[i].BUSINESS_TYPE == 2 || sources[i].BUSINESS_TYPE == 3 || sources[i].BUSINESS_TYPE == 8) {
	        ur = "/wap/housenoticedetail?id=";
	        noname = sources[i].NAME == null || sources[i].NAME == undefined ? "" : sources[i].NAME;
	      } else {
	        ur = "/wap/tradingnoticedetail?id=";
	        noname = sources[i].NO == null || sources[i].NO == undefined ? "" : sources[i].NO;
	      }


	      html += '          <div class="result-item">' +
	        '                        <div class="result-publicity">' +
	        '                            <div ><a  href="' + basePath + ur + sources[i].ID + '" target="_blank">' + noname + '</a></div>' +

	        '                        </div>';
	      var tnos = sources[i].TRADINGS;
	      if (tnos != null && sources[i].BUSINESS_TYPE != 2 && sources[i].BUSINESS_TYPE != 3 && sources[i].BUSINESS_TYPE != 8) {
	        html += '<div class="result-leave">'
	        for (var j = 0, size = tnos.length; j < size; j++) {
	          if (tnos[j].BUSINESS_TYPE == 0) {
	            html += '<a class="nobotitle" href="' + basePath + '/wap/landDetail?id=' + tnos[j]['ID'] + '&code=0015&goodId=' + tnos[j]['GOODSID'] + '" target="_blank">【' + tnos[j]["NO"] + '】</a>';
	          } else {
	            html += '<a class="nobotitle" href="' + basePath + '/wap/commonDetail?id=' + tnos[j]['ID'] + '&code=0015&goodId=' + tnos[j]['GOODSID'] + '" target="_blank">【' + tnos[j]["NO"] + '】</a>';
	          }

	        }
	        html += '</div>'
	      }
	      html+='<div style="font-size:1.2rem;color:#999;text-align:right">' + (sources[i].NOTICE_DATE == null || sources[i].NOTICE_DATE == undefined ? "" : sources[i].NOTICE_DATE) + '</div>' 
	      html += '</div>'
	    }
	  }
	  callBack && callBack(false)
	  $(element).html(html);
	}   