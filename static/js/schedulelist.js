var currentPage =0;
var html ='';

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
	          $.post(basePath + "/web/schedulelistJson?", params, function (r) {
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
	      contentrefresh: '<div class="loader"></div>正在加载...',
	      auto: true,
	      callback: function () {	
	        let that = this
	        currentPage++
	        params["currentPage"] = currentPage
	        setTimeout(function () {
	          $.post(basePath + "/web/schedulelistJson?", params, function (r) {
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
function resetsearch(){
	$("#land_no").val("");
	$("input[name='land_area']").prop("checked",false);
	pageinfo.currentPage = 1;
	search();
}
function search(){
	var str="";
	 $("input[name='land_area']:checked").each(function (index, item) {
	        
	        if ($("input[name='land_area']:checked").length-1==index) {
	            str += $(this).val();
	        } else {
	            str += $(this).val() + ",";
	        }  
	    });
	  mui('.droploader').pullRefresh().refresh(true);
	 params["land_no"] = $("#land_no").val();
	 params["land_area"] =str;
	 currentPage = 0;
	 html=''
	  mui('.droploader').pullRefresh().pullupLoading()
	
}
function appendHtml(element,sources,callback){

	if(sources!=null){
		for(var i=0;i<sources.length;i++){			
			html+='  <div class="schedule-item">' +
			'                    <div class="schedule-item-fist">'+(sources[i].seeFloorTime==null||sources[i].seeFloorTime==undefined?"":sources[i].seeFloorTime)+'</div>'+
			'                    <div class="bonn">'+
			'                        <span>标的物：</span>';
	 	 if(sources[i].seeFloorTime==null||sources[i].seeFloorTime==undefined||new Date(Date.parse(sources[i].seeFloorTime.replace(/-/g,"/"))) >new Date()){
		 html+='<span><a class="make_itema" href="'+(sources[i].targetLink==null||sources[i].targetLink==undefined?"":sources[i].targetLink)+'" target="_blank">';
			
        }else{
		 html+='<span><a class="make_itema2" href="'+(sources[i].targetLink==null||sources[i].targetLink==undefined?"":sources[i].targetLink)+'" target="_blank">';
		
		}
	 	 html+=(sources[i].targetName==null||sources[i].targetName==undefined?"":sources[i].targetName)+'</a>'+
			'                        </span>'+
			'                    </div>'+
			'                    <div class="bonn">'+
			'                        <span>集合地点：</span>'+
			'                        <span>'+(sources[i].area==null||sources[i].area==undefined?"":sources[i].area) + (sources[i].address==null||sources[i].address==undefined?"":sources[i].address)+'</span>'+
			'                    </div>'+
			'                    <div class="bonn">'+
			'                        <span>交易时间：</span>'+
			'                        <span>'+(sources[i].saleTime==null||sources[i].saleTime==undefined?"":sources[i].saleTime)+'</span>'+
			'                    </div>'+
			'                    <div class="bonn">'+
			'                        <span>钥匙：</span>'+
			'                        <span>'+(sources[i].haveKey==null||sources[i].haveKey==undefined?"":sources[i].haveKey)+'</span>'+
			'                    </div>'+
			'                    <div class="bonn">'+
			'                        <span>联系人：</span>'+
			'                        <span>'+(sources[i].contacts==null||sources[i].contacts==undefined?"":sources[i].contacts)+'</span>'+
			'                    </div>'+	
			'                    <div class="bonn">'+
			'                        <span>联系电话：</span>'+
			'                        <span>'+(sources[i].tel==null||sources[i].tel==undefined?"":sources[i].tel)+'</span>'+
			'                    </div>'+
			'                </div>';
//			html+='<li class="schedule_right_content_item">'+
//				'<div class="right_content_item_title" >'+
//			'<span>'+(sources[i].seeFloorTime==null||sources[i].seeFloorTime==undefined?"":sources[i].seeFloorTime)+'</span></div>'+
//	    	'<div class="right_content_make" style="margin-left: -13px;"><div class="make_item">'+
//			'<span class="make_item_fitstspan" style="text-align: left;margin-left: 15px;width: 56px;">标的物</span><span>：</span>';

//			
//			
//			
//			html+=(sources[i].targetName==null||sources[i].targetName==undefined?"":sources[i].targetName)+'</a></div>'+
//	    	'<div class="make_item">'+
//			'<span class="make_item_fitstspan">集合地点</span><span>：</span><span>'+
//			(sources[i].area==null||sources[i].area==undefined?"":sources[i].area) + (sources[i].address==null||sources[i].address==undefined?"":sources[i].address)+'</span></div>'+
//	        '<div class="make_item right_content_make_last"><div><span class="make_item_fitstspan">交易时间</span><span>：</span><span>'+
//	        (sources[i].saleTime==null||sources[i].saleTime==undefined?"":sources[i].saleTime)+'</span></div>'+
//	        '<div><span>钥匙：</span><span>'+
//	        (sources[i].haveKey==null||sources[i].haveKey==undefined?"":sources[i].haveKey)+'</span></div>'+
//	        '<div><span>联系人：</span><span>'+
//	        (sources[i].contacts==null||sources[i].contacts==undefined?"":sources[i].contacts)+'</span></div>'+
//	        '<div><span>联系电话：</span><span>'+
//	        (sources[i].tel==null||sources[i].tel==undefined?"":sources[i].tel)+'</span></div>'+
//	        '</div></div></li>';
		} 
}  
	callback&&callback(false)
	$(element).html(html);
}     