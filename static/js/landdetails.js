$(document).ready(function () {
	isCollection();
	isQualifications();
	isOffer();
	var galleryThumbs = new Swiper('.my-bot', {

	      navigation: {
	          nextEl: '.swp1',
	          prevEl: '.swp12',
	        }

	});
})




//我要收藏验证
function isCollection(){
	if(sessionID==""){
		$('.please11').css('display','none');
		$('.please1').css('display','block');
		return ;
	}
	var Id =targetId;
	var urlString =basePath+ "/web/myLandBidding";
	
	$.ajax({
		url: urlString,
		type: "GET",
		data: {
			"targetId": Id,
			"userId": userId,
			"bidderId":refId,
			"sessionID":sessionID,
			"displayName":displayName
		},
		dataType: "json", //指定服务器返回的数据类型
		success: function(r) {
			if(r.code == 0) {
				if(r.resultJson.state == "1"){//已收藏
					$('.please1').css('display','none');
					$('.please11').css('display','block');	
				}else{//我要收藏
					$('.please11').css('display','none');
					$('.please1').css('display','block');
				}
			}else{//我要收藏
				$('.please11').css('display','none');
				$('.please1').css('display','block');
			}
			
		}
	});
	/*var explain='门户收藏'+targetNo;//收藏说明  先写死的
	var urlStr =basePath+ "/web/myCollection";
	$.ajax({
		url: urlStr,
		type: "GET",
		data: {
			"targetId": Id,
			"userId": userId,
			"explain":explain,
			"sessionID":sessionID
		},
		dataType: "json", //指定服务器返回的数据类型
		success: function(r) {
			if(r.code == 0) {
				if(r.resultJson!=null&&r.resultJson.state==2){//收藏成功
					$('.please1').css('display','none');
					$('.please11').css('display','block');
				}else{
					$('.please11').css('display','none');
					$('.please1').css('display','block');
				}
			}
			
		}
	});*/
}

//我要申请竞价验证
function isQualifications(){
	if(sessionID==""){
		$('.please22').css('display','none');
		$('.please2').css('display','block');
		$('.please33').css('display','none');
		$('.please3').css('display','block');
		return ;
	}
	var Id =targetId;
	var urlStr =basePath+ "/web/getBiddingQualification";
	$.ajax({
		url: urlStr,
		type: "GET",
		data: {
			"targetId": Id,
			"uid": userId
		},
		dataType: "json", //指定服务器返回的数据类型
		success: function(r) {
			if(r.code == 0) {
				if(r.result!=null&&r.result.id!=null){
					$('.please2').css('display','none');
					$('.please22').css('display','block');
					isOffer();
				}else{
					$('.please22').css('display','none');
					$('.please2').css('display','block');
					$('.please33').css('display','none');
					$('.please3').css('display','none');
				}
			}
			
		}
	});
}

//我要报价验证
function isOffer(){
	if(sessionID==""){
		$('.please33').css('display','none');
		$('.please3').css('display','block');
		return ;
	}
	if(transType==0||transType==3||transType==4){
		var Id =targetId;
		var urlStr =basePath+ "/web/getBiddingCount";
		$.ajax({
			url: urlStr,
			type: "GET",
			data: {
				"targetId": Id,
				"uid": userId
			},
			dataType: "json", //指定服务器返回的数据类型
			success: function(r) {
				if(r.code == 0) {
					if(r.result!=null&&r.result>0){//收藏成功
						$('.please3').css('display','none');
						$('.please33').css('display','block');
					}else{
						$('.please33').css('display','none');
						$('.please3').css('display','block');
					}
				}
				
			}
		});
	}else{
		$('.please33').css('display','none');
		$('.please3').css('display','none');
	}
	
	
	
	
}
var firlst=true;
function resultnoticedetail(id){
	if(!firlst){
		firlst=!firlst;
		return false;
		
	}
	var urlStr =basePath+ "/web/resultdetailbytargetId";
	$.ajax({
		url: urlStr,
		type: "POST",
		data: {
			"targetId": id
		},
		dataType: "json", //指定服务器返回的数据类型
		success: function(r) {
	
			if(r.code == 0) {
				resulthtml($("#results"),r.notice,r.fileExtName)
			}
			
		}
	});
}


function resulthtml(element,data,res){
	$(element).empty();
	var htmlStr="";
	htmlStr += '<div class="result-title">';
	
	htmlStr+=data.DTL_REF_NO==null?"":data.DTL_REF_NO;
	if(data.DTL_COUNT!=null && data.DTL_COUNT > 1){
		htmlStr+="等"+data.DTL_COUNT+"宗";
	}
  	
	htmlStr+='宗地出让结果</div><div class="result-data"><span>发布日期:';
	htmlStr+=data.CREATE_DATE+'</span>';
	htmlStr+=res
	htmlStr+='</div>';
	$(element).append(htmlStr);
	
	
}

