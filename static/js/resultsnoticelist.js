var currentPage=0
var html=''
$(function(){
	
	 });
mui.init({
	  pullRefresh: {
	    container: '.droploader',

	    down: {
	      callback: function () {

	        let that = this
	        html = ''
	            currentPage = 1
	        params["currentPage"] = currentPage

	        setTimeout(function () {
	          $.post(basePath + "/web/resultsnoticelistJson?", params, function (r) {
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
	          $.post(basePath + "/web/resultsnoticelistJson?", params, function (r) {
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
//function getListJson(){
//	
//	 Page({
//			num:params.total_page,					//页码数
//			startnum:params.currentPage,				//指定页码
//			elem:$('#page1'),		//指定的元素
//			callback:function(n){
//				params.currentPage=n;
//				$.post(basePath+"/web/resultsnoticelistJson",params,function(r){
//					if(r.code === 0){
//						appendHtml($(".result-list"),r.result.result);
//					}else{
//						
//					}
//				});
//			}
//		});
//}    	 
     
function appendHtml(element,sources,callback){


	if(sources!=null){
		for(var i=0;i<sources.length;i++){
			  html+='                <div class="result-item">' +
				    '                   <a class="clearfix"  href="' + basePath + '/wap/resultsnoticedetail?id=' + sources[i].ID + '&targetId=' + sources[i].TARGET_ID + '" target="_blank">' +
				    '                        <div class="result-publicity">' +
				    '                            <div >'+(sources[i].NAME == null || sources[i].NAME == undefined ? '' : sources[i].NAME)+'</div>' +
				    '                            <div >' + (sources[i].PUBLISH_TIME == null || sources[i].PUBLISH_TIME == undefined ? "" : sources[i].PUBLISH_TIME) +
				    '                            </div>' +
				    '                        </div>' +
				    '                    </a>' +
				    '                </div>';
					}
				 
			
	}
	callback && callback(false)
	  $(element).html(html);
}     