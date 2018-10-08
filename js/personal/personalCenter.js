$(function () {
    //身份设置
    $(".setting").click(function () {
        $("#personalShade").css("display", "block");
        $("#roleSetting>p").click(function () {
            $(this).children().addClass("checked").parent().siblings().children().removeClass("checked");
        });
        $("#languageSetting").click(function () {
            $(".language-tips").css("display", "block");
            $(".language-tips").click(function () {
                $(".language-tips").css("display", "none");
            });
        });
        // 关闭窗口
        $(".personal-close").click(function () {
            $("#personalShade").css("display", "none");
        });
    });
    // 退出登录
    $(".login-out").click(function(){
        $(window).attr("location","../../signOut.html");
    });

});