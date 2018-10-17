$(function() {
    //个人中心信息
    UserInfo()
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
        sessionStorage.clear()
    });

});


// 选择身份
function Setup(num) {
    var uid=sessionStorage.getItem("uid")
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/My/Setup",
        data: {
            uid: uid,
            identity:num,
        },
        dataType: "json",
        success: function(res) {
            UserInfo()
            $("#personalShade").css("display", "none");
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function UserInfo() {
    var uid = sessionStorage.getItem("uid")
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/My/UserInfo",
        data: {
            uid:uid,
        },
        dataType: "json",
        success: function(res) {
            console.log(res);
            var data = res.data[0]
            $(".img").attr("src",data.headimg);
            $(".tutor-title").html(data.identity==1?"导师":"侠客");
            $(".useName").html(data.nickname);
            $(".no-certified").html(data.certificationstate==1?"未认证":"已认证");
            $("#wealth-value1").html(data.wisdombean);
            $("#wealth-value2").html(data.pk);
            $("#wealth-value3").html(data.creditscore);
            if (data.identity==2) {
                $(".p1>i").addClass('checked')
            }else{
                $(".p2>i").addClass('checked')
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
}