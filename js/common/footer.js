$(function () {
    $(".menu").click(function () {
        $(this).addClass("menu1").parednts().siblings().children().removeClass("menu1");
    });
});