$(function() {
    //身份设置
    $(".setting").click(function() {
        $("#personalShade").css("display", "block");
        $("#roleSetting>p").click(function() {
            $(this).children().addClass("checked").parent().siblings().children().removeClass("checked");
        });
        $("#languageSetting").click(function() {
            $(".language-tips").css("display", "block");
            $(".language-tips").click(function() {
                $(".language-tips").css("display", "none");
            });
        });
        // 关闭窗口
        $(".personal-close").click(function() {
            if ($(".p1>i").attr("class") == "checked") {
                Setup(2)
            } else {
                Setup(1)
            }
        });
    });
    // 退出登录
    $(".login-out").click(function() {
        $(window).attr("location", "../../signOut.html");
    });

});


// 选择身份
function Setup(num) {
    console.log(num)
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/My/Setup",
        data: {
            uid: 1,
            identity: num,
        },
        dataType: "json",
        success: function(res) {
            console.log(res);
            $("#personalShade").css("display", "none");
        },
        error: function(err) {
            console.log(err);
        }
    });
}