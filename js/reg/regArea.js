$(function () {
    $("#cityIn").click(function () {
        $("#cityIn").addClass("city-on").siblings("#cityOut").removeClass("city-on");
        $("#cityText").show();
        $("#city-boxInter").hide();
    });
    $("#cityOut").click(function () {
        $("#cityOut").addClass("city-on").siblings("#cityIn").removeClass("city-on");
        $("#cityText").show();
        $("#city-boxInter").hide();
    });
    $("#search-text1").click(function () {
        $(".area-box1").hide();
        $(".area-box2").show();
        // $(window).attr("location", "./area_search.html");
    });

});