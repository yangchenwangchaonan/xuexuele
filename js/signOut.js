$(function () {
    starFlicker();
    var url = window.location.href;
    var uid = url.split("&")[0].split("=")[1];
    $(".share-result-btn").click(function () {
        $(window).attr("location", "./html/login/login.html?uid=" + uid);
    });
});