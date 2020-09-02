var commonObj = {};
// 导航点击展开
commonObj.navigationMore = function () {
    var toggle = true;
    
    $(".navigationMore").click(function () {
        var thisImg = $(this).attr("src1");
        var changImg = $(this).attr("src2");
        $(".hideNavigation").toggle();
        $(".content-core").toggle();
        if (toggle) {
            $(this).attr("src", changImg)
            toggle = false;
        }else{
            $(this).attr("src", thisImg);
            toggle = true;
        }
    })
}

// 切换页面和样式
commonObj.cut = function(){
    $(".jsTab").on("click","li",function(){
        var index = $(this).index();
        var active = $(this).parents(".jsTab").data("active");
        var model = $(this).parents(".jsTab").data("model");
        $(this).addClass(active).siblings("li").removeClass(active);
        $(model).eq(index).show().siblings("div").hide();
    })
}
$(document).ready(function () {
    commonObj.navigationMore()
    commonObj.cut();
})