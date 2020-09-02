	var html=""
var currentPage=0
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
	        page["currentPage"] = currentPage

	        setTimeout(function () {
	          $.post(basePath + "/webpc/publishinfoslistJson?", page, function (r) {
	            if (r.code == 0) {
	              	let result=JSON.parse(r.result)
		              if (!result.length) {
		            	     that.endPulldownToRefresh(true);
	                appendHtml($("#house"), []);
	                return
	              }
	              appendHtml($("#house"), result, that.endPulldownToRefresh());      
	            }
	          });

	        }, 300)
	      }
	    },
	    up: {
	      contentrefresh: '<div class="loader"></div>正在加载...',
	      auto: true,
	      callback: function () {	
	        let that = this
	        currentPage++
	        page["currentPage"] = currentPage
	        setTimeout(function () {
	          $.post(basePath + "/webpc/publishinfoslistJson?", page, function (r) {
	            if (r.code == 0) {
	            	let result=JSON.parse(r.result)
	              if (!result.length) {
	                that.endPullupToRefresh(true);
	                appendHtml($("#house"), []);
	                return
	              }
	              appendHtml($("#house"),result, that.endPullupToRefresh());        
	            }
	          });

	        }, 300)
	      }
	    }
	  }
	});
mui('body').on('tap','a',function(){document.location.href=this.href;});
//function getListJson(){
//	 Page({
//			num:page.total_page,
//			pageSize:10,//页码数
//			startnum:page.currentPage,				//指定页码
//			elem:$('#page1'),		//指定的元素
//			callback:function(n){
//				var html="";
//				var htmltr="";
//				if(page.code=="0017"){
//					html='<span>首页</span> <span>></span><span>中心动态</span>';
//					htmltr='<span>中心动态</span>';
//				}else if(page.code=="0029"){
//					html='<span>首页</span> <span>></span><span>政策法规</span>';
//					htmltr='<span>政策法规</span>';
//				}else{
//					html='<span>首页</span> <span>></span><span>交易指南</span>';
//					htmltr='<span>交易指南</span>';
//				}
//				$(".location_right").html(html);
//				$(".right_content_title").html(html);
//				page.currentPage=n;
//				$.post(basePath+"/webpc/publishinfoslistJson",page,function(r){
//					if(r.code === 0){
//						appendHtml($(".result-list"),JSON.parse(r.result));
//					}else{
//						$.Pop(r.msg,'alert',function(){});
//					}
//				});
//			}
//		});
//}    	 
     
function appendHtml(element,sources,callback){
		for(var i=0;i<sources.length;i++){
  html+='                <div class="result-item" >' +
	    '                   <a href="'+basePath+'/wap/infodetails?id='+sources[i].id+'&code='+code+'" target="_blank" >' +
	    '                        <div class="result-publicity">' +
	    '                            <div >';
	  if (sources[i].title != null && sources[i].title != undefined) {
	    html += sources[i].title;
	  }
	  html += '</div>' +
	    '                            <div>' +
	    (sources[i].pubTime == null || sources[i].pubTime == undefined ? "" : sources[i].pubTime) +
	    '                            </div>' +
	    '                        </div>' +
	    '                        <div class="result-leave">' +
	    '                        </div>' +
	    '                    </a>' +
	    '                </div>';
		}
	
	
// 	$(element).html("");
// 	if(page.code=="0017"){
// 		var html='<div class="right_content_title">'+
//		'<span>中心动态</span>'+
//		'</div>'+
//		'<ul class="right_content_ul">';
//	}else if(page.code=="0029"){
//		var html='<div class="right_content_title">'+
//		'<span>政策法规</span>'+
//		'</div>'+
//		'<ul class="right_content_ul">';
//	}else{
//		var html='<div class="right_content_title">'+
//		'<span>交易指南</span>'+
//		'</div>'+
//		'<ul class="right_content_ul">';
//	}
//	if(sources!=null){
//		for(var i=0;i<sources.length;i++){
//			html+='<li class="right_content_item"><div class="right_content_item1 clearfix">'+
//			'<a class="clearfix" href="'+basePath+'/webpc/infodetails?id='+sources[i].id+'&code='+code+'" target="_blank" >'
//			+'<div class="garden"></div><div class="listItem">'+
//	    	'<span class="item-left">';
//			if(sources[i].title!=null&&sources[i].title!=undefined){
//				html+=sources[i].title;
//			}
//	    	html+='</span>'+
//	        '<span class="item-right">'+
//	        (sources[i].pubTime==null||sources[i].pubTime==undefined?"":sources[i].pubTime)+
//	        '</span></div>'+
//	        '</a></div></li>';
//		} 
//}
//	html+='</ul>';
//	$(element).html(html);
		callback && callback(false)
		  $(element).html(html);
}     