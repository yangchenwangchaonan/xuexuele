$(function () {
    // 充值记录
    $(".recharge-cost").click(function () {
        $(window).attr("location", "./recharge-reword.html");
    });
    // 充值
    $(".recharge-true").click(function () {
        $(window).attr("location", "./recharge.html");
    });
    // 课酬提现
    $(".recharge-false").click(function () {
        $(window).attr("location", "./recharge-withdraw.html");
    });

});