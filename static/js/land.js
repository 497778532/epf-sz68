var naturalObj = {};

// 点击选择显示
naturalObj.screenMore = function(){
    var distance = $(".screen-list2").offset().top;
    var distance2 = $(".dateline").offset().top;
    $(".area-shadow").css("top",distance);
    $(".state-shadow").css("top",distance);
    $(".exchange-shadow").css("top",distance2);
    // 区域
    $(".screen-area").click(function(){
        var _reveal = $(this).data("show");
        $(_reveal).toggle();
        $(this).find("div").toggleClass("triangledownfills2");
        $(".screen-state").find("div").removeClass("triangledownfills2");
        $(".screen-exchange").find("div").removeClass("triangledownfills2");
        $(".state-shadow").hide();
        $(".exchange-shadow").hide();
    })
    $(".area-shadow-item>div").click(function(){
        $(this).addClass("shadow-active").siblings("div").removeClass("shadow-active");
        var indexText = $(this).text();
        $(".screen-area>span").text(indexText);
        $(this).parents(".area-shadow").hide();
        $(".screen-area>div").removeClass("triangledownfills2")
    })

    // 状态选择
    $(".screen-state").click(function(){
        var _reveal = $(this).data("show");
        $(_reveal).toggle();
        $(this).find("div").toggleClass("triangledownfills2");
        $(".screen-area").find("div").removeClass("triangledownfills2");
        $(".screen-exchange").find("div").removeClass("triangledownfills2");
        $(".area-shadow").hide();
        $(".exchange-shadow").hide();
    })
    $(".state-shadow-item>div").click(function(){
        $(this).addClass("shadow-active").siblings("div").removeClass("shadow-active");
        var indexText = $(this).text();
        $(".screen-state>span").text(indexText);
        $(this).parents(".state-shadow").hide();
        $(".screen-state>div").removeClass("triangledownfills2")
    })

    // 交易方式选择
    $(".screen-exchange").click(function(){
        var _reveal = $(this).data("show");
        $(_reveal).toggle();
        $(this).find("div").toggleClass("triangledownfills2");
        $(".screen-area").find("div").removeClass("triangledownfills2");
        $(".screen-state").find("div").removeClass("triangledownfills2");
        $(".area-shadow").hide();
        $(".state-shadow").hide();
    })
    $(".exchange-shadow-item>div").click(function(){
        $(this).addClass("shadow-active").siblings("div").removeClass("shadow-active");
        var indexText = $(this).text();
        $(".screen-exchange>span").text(indexText);
        $(this).parents(".exchange-shadow").hide();
        $(".screen-exchange>div").removeClass("triangledownfills2")
    })
}

$(document).ready(function(){
    naturalObj.screenMore()
})