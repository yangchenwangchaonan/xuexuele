$(function () {
    // 默认为国内城市
    $("#cityIn").click(function () {
        $("#cityIn").addClass("city-on").siblings("#cityOut").removeClass("city-on");
        $("#cityText").show();
        $("#city-boxInter").hide();
    });
    // 国际城市
    $("#cityOut").click(function () {
        $("#cityOut").addClass("city-on").siblings("#cityIn").removeClass("city-on");
        $("#cityText").hide();
        $("#city-boxInter").show();
    });
    //搜索
    $("#search-text1").click(function () {
        $(".area-box1").hide();
        $(".area-box2").show();
        $("#search-text2").focus();
    });

});