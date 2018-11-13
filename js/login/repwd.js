$(function () {
    //清空value
    deleteVal("#delTel","#repwdPhone")
    //输入手机号样式变化
    $("#repwdPhone").keyup(function () {
        if ($(this).val() != "") {
            $("#telInput").addClass("login-focus");
            $("#delTel").css("display", "block");
        } else {
            $("#telInput").removeClass("login-focus");
            $("#delTel").css("display", "none");
        }
    });
    //输入验证码样式变化
    $("#repwdCode").keyup(function () {
        if ($(this).val() != "") {
            $("#repwdInput").addClass("login-focus");
        } else {
            $("#repwdInput").removeClass("login-focus");
        }
    });
    /* 获取验证码 */
    var flag = true;
    $("#recodeBtn").click(function () {
        if (!flag) {
            return false;
        }
        if ($("#repwdPhone").val() == "" || $("#repwdPhone").val() == null) {
            flowerTips("请输入手机号~", 1);
            return false;
        } else if (!/^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(19[9])|(17[0,1,3,5,6,7,8]))\d{8}$/.test($("#repwdPhone").val())) {
            flowerTips("手机号码格式错误~", 1);
            return false;
        } else {
            var telNum = $("#repwdPhone").val();
            $.ajax({
                type: "POST",
                url: APP_URL + "/api/User/SendSmsInfo",
                data: {
                    type: "login",
                    phoneNumbers: telNum
                },
                dataType: "json",
                success: function (res) {
                    console.log(res);
                    if (res.code == 1) {
                        flowerTips("发送成功~", 1);
                        var realCode = res.data.code;
                        $("#returnCode").val(realCode);
                        setTime(obj);
                    } else {
                        flowerTips("发送失败~", 1);
                    }
                },
                error: function (err) {
                    console.log(err)
                }
            });
        }
        // 发送验证码倒计时
        var countdown = 60;
        var obj = $("#recodeBtn");

        function setTime(obj) {
            if (countdown == 0) {
                flag = true;
                obj.removeAttr("disabled");
                obj.css("background", "#53AA19");
                obj.html("获取验证码");
                countdown = 60;
                return;
            } else {
                flag = false;
                obj.css("background", "#B0B0B0");
                obj.html("重新发送(" + countdown + ")");
                countdown--;
            }
            setTimeout(function () {
                setTime(obj);
            }, 1000)
        }
    });

    // 下一步
    $("#repwdBtn1").click(function () {
        var codeValue = $("#repwdCode").val();
        var realCode = $("#returnCode").val();
        if ($("#repwdPhone").val() == "" || $("#repwdPhone").val() == null) {
            flowerTips("请输入手机号~", 1);
            return;
        }
        if (!/^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(19[9])|(17[0,1,3,5,6,7,8]))\d{8}$/.test($("#repwdPhone").val())) {
            flowerTips("手机号码格式错误~", 1);
            return;
        }
        if (codeValue == "" || codeValue != realCode) {
            flowerTips("验证码输入错误~", 1);
            return;
        }
        var tel = $("#repwdPhone").val();
        $.ajax({
            type: "POST",
            url: APP_URL + "/api/User/UserPhone",
            data: {
                phone: tel
            },
            dataType: "json",
            success: function (res) {
                console.log(res);
                var $code = res.code;
                if ($code == 0) {
                    flowerTips("账号未注册，请先注册~", 1);
                    window.setTimeout(function () {
                        $(window).attr("location", "../reg/reg.html");
                    }, 1500);
                } else {
                    $(window).attr("location", "./repwd_next.html");
                }
            },
            error: function (err) {
                console.log(err)
            }
        });

    });

    // 返回
    $("#repwdBack").click(function(){
        window.location.replace("./login.html");
    });
});