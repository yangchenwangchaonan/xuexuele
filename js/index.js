$(function () {
    progressBar();
    
});

//进度条
function progressBar() {
    $(".index-process-bar").css("width", "0.0px");
    $(".index-process-bar>i").css("left", "0.0px");
    var speed = 20; //进度条的速度

    bar = setInterval(function () {
        nowWidth = parseInt($(".index-process-bar").width());
        if (nowWidth <= 242) {
            var barWidth = (nowWidth + 0.5);
            $(".index-process-bar").css("width", barWidth + "px");
            $(".index-process-bar>i").css("left", barWidth - 10 + "px");
            var totla = parseInt($(".index-process-wrapper").width())
            var ss = parseInt(barWidth / totla * 100);
            if (parseInt(barWidth / totla * 100) > 10) {
                $(".index-process-bar>h1").text(ss + "%");
            }
            if (parseInt($(".index-process-bar>h1").text()) == 100) {
                console.log("加载完成");
                $(window).attr("location", "./html/homePages/home.html");
                // window.location.href = './html/reg/reg_end.html';
            }
        } else {
            clearInterval(bar);
        }
    }, speed);
};