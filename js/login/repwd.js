$(function () {
    //清空value
    deleteVal("#delTel", "#repwdPhone")
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
        allClick();
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
                obj.removeClass("codeDisable");
                obj.html("获取验证码");
                countdown = 60;
                return;
            } else {
                flag = false;
                obj.addClass("codeDisable");
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
        allClick();
        var codeValue = $("#repwdCode").val();
        var telValue = $("#repwdPhone").val();
        if (telValue == "" || telValue == null) {
            flowerTips("请输入手机号~", 1);
        }else if (!/^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(19[9])|(17[0,1,3,5,6,7,8]))\d{8}$/.test(telValue)) {
            flowerTips("手机号码格式错误~", 1);
        }else{
            verifySmsInfo(telValue, codeValue);
        }
    });

    // 返回
    $("#repwdBack").click(function () {
        window.location.replace("./login.html");
    });
});


//验证验证码
function verifySmsInfo(tel, realcode) {
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/User/VerifySmsInfo",
        data: {
            phone: tel,
            code: realcode
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                userPhone(tel,realcode);
            } else {
                flowerTips("请输入正确的验证码~", 1);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}


//忘记密码第一步提交
function userPhone(tel,code) {
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
            } else if ($code == 1) {
                $(window).attr("location", "./repwd_next.html?tel=" + tel + "&code=" + code);
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}