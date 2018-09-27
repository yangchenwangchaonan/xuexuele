$(function () {
    $("#cityIn").click(function () {
        $("#cityIn").addClass("city-on").siblings("#cityOut").removeClass("city-on");
        $("#cityText").css("display", "block");
        $("#city-boxInter").css("display", "none");
    });
    $("#cityOut").click(function () {
        $("#cityOut").addClass("city-on").siblings("#cityIn").removeClass("city-on");
        $("#cityText").css("display", "none");
        $("#city-boxInter").css("display", "block");
    });
    $("#search-text1").click(function () {
        $(window).attr("location", "./area_search.html");
    });

});