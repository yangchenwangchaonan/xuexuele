$(function () {
    //个人中心信息
    UserInfo()
    Close()
    //身份设置
    $(".setting").click(function () {
        allClick();
        $("#personalShade").show();
        $("#roleSetting>p").click(function () {
            allClick();
            $(this).children().addClass("checked").parent().siblings().children().removeClass("checked");
        });
        $("#languageSetting").click(function () {
            allClick();
            $(".language-tips").show();
            window.setTimeout(function () {
                $(".language-tips").hide();
            }, 1000);
        });
    });
    // 退出登录
    $(".login-out").click(function () {
        allClick();
        $(window).attr("location", "../login/login.html");
        sessionStorage.clear();
        localStorage.clear();
    });
    // 分享
    $(".personal-leave").click(function () {
        allClick();
        $("#shareTips").show();
        $("#shareTips").click(function () {
            allClick();
            $(this).hide();
        });
    });


});
// 关闭窗口
function Close() {
    $(".personal-close").click(function () {
        allClick();
        if ($(".p1>i").attr("class") == "checked") {
            Setup(2)
        } else {
            Setup(1)
        }
    });
}

// 选择身份
function Setup(num) {
    var uid = localStorage.getItem("uid");
    var token = localStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/My/Setup",
        data: {
            uid: uid,
            token: token,
            identity: num
        },
        dataType: "json",
        success: function (res) {
            if (res.code == 1) {
                UserInfo();
                $("#personalShade").hide();
            } else if (res.code == 10000) {
                repeatLogin();
            }

        },
        error: function (err) {
            console.log(err);
        }
    });
}

function UserInfo() {
    var uid = localStorage.getItem("uid");
    var token = localStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/My/UserInfo",
        data: {
            uid: uid,
            token: token
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                var data = res.data[0]
                $(".img").attr("src", data.headimg);
                $(".tutor-title").html(data.identity == 1 ? "导师" : "侠客");
                $(".tutor-title").addClass(data.identity == 1 ? "" : "ranger-title");
                $(".tutor-title").removeClass(data.identity == 1 ? "ranger-title" : "");
                $(".useName").html(data.nickname);
                $(".no-certified").html(data.certificationstate == 1 ? "未认证" : data.certificationstate == 2 ? "已认证" : data.certificationstate == 3 ? "审核中" : data.certificationstate == 4 ? "驳回" : '');
                $("#wealth-value1").html(data.wisdombean);
                $("#wealth-value2").html(data.pk);
                $("#wealth-value3").html(data.creditscore);
                if(data.certificationstate == 2){
                    $(".no-certified").addClass("certified");
                }
                if (data.identity == 2) {
                    $(".p1>i").addClass('checked')
                } else {
                    $(".p2>i").addClass('checked')
                }
                var url = $(".no-certified").text()
                $(".personal-infor-history").click(function () {
                    allClick();
                    if (url == "未认证" || url == "驳回") {
                        $(window).attr("location", "../personalCenter/verified.html");
                    } else if (url == "审核中") {
                        $(window).attr("location", "../personalCenter/infor-submitting.html");
                    }
                })
            } else if (res.code == 10000) {
                repeatLogin();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}