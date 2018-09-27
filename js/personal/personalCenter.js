$(function () {
    //实名认证
    $(".no-certified").click(function () {
        $(window).attr("location", "./verified.html");
    });
    // 个人设置
    $(".setting").click(function () {
        $(window).attr("location", "./personal-infor.html");
    });

    //身份设置
    $(".head-bg").click(function () {
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
    // 我的百宝箱
    $("#myTreasurebox").click(function () {
        $(window).attr("location", "../homePages/treasureBox.html");
    });
    // 我的关注
    $("#myAttention").click(function () {
        $(window).attr("location", "./my-attention.html");
    });
    // 我的课程
    $("#myLesson").click(function () {
        $(window).attr("location", "./my-lessons.html");
    });

    // 课程管理
    $("#lessonManage").click(function () {
        $(window).attr("location", "./lessons-manage.html");
    });
    // 退出登录
    $(".login-out").click(function(){
        $(window).attr("location","../../signOut.html");
    });

});