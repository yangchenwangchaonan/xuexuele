$(function () {
    //输入手机号样式变化
    $("#reg-phone").keyup(function () {
        if ($(this).val() != "") {
            $("#inputTel").addClass("login-focus");
            $("#telClear").css("display", "block");
        } else {
            $("#inputTel").removeClass("login-focus");
            $("#telClear").css("display", "none");
        }
    });
    //输入验证码样式变化
    $("#reg-code").keyup(function () {
        if ($(this).val() != "") {
            $("#inputCode").addClass("login-focus");
        } else {
            $("#inputCode").removeClass("login-focus");
        }
    });
    /* 获取验证码 */
    var flag = true;
    $("#codeBtn").click(function () {
        if (!flag) {
            return false;
        }
        if ($("#reg-phone").val() == "" || $("#reg-phone").val() == null) {
            alert("请输入手机号!");
            return false;
        } else if (!/^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(19[9])|(17[0,1,3,5,6,7,8]))\d{8}$/.test($("#reg-phone").val())) {
            alert("手机号码格式错误!");
            return false;
        } else {
            var telNum = $("#reg-phone").val();
            $.ajax({
                type: "POST",
                url: APP_URL + "/api/User/SendSmsInfo",
                data: {
                    type: "res",
                    phoneNumbers: telNum
                },
                dataType: "json",
                success: function (res) {
                    console.log(res);
                    if (res.code == 1) {
                        alert("发送成功~");
                        var realCode = res.data.code;
                        $("#realCode").val(realCode);
                        setTime(obj);
                    }else{
                        alert("发送失败~");
                    }

                },
                error: function (err) {
                    console.log(err)
                }
            });
        }
        // 发送验证码倒计时
        var countdown = 60;
        var obj = $("#codeBtn");

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
    /* ******************注册第一步******************* */
    $("#red-first").click(function () {
        var codeValue = $("#reg-code").val();
        var realCode = $("#realCode").val();
        if ($("#reg-phone").val() == "" || $("#reg-phone").val() == null) {
            alert("请输入手机号!");
        } else if (!/^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(19[9])|(17[0,1,3,5,6,7,8]))\d{8}$/.test($("#reg-phone").val())) {
            alert("手机号码格式错误!");
        } else if (codeValue != realCode) {
            alert("验证码输入错误!");
        } else {
            var tel = $("#reg-phone").val();
            localStorage.setItem("tel", tel);
            localStorage.setItem("code", realCode);
            $(window).attr("location", "./reg_next.html");
        }
    });

    /* *****************注册第二步********************* */
    /* 设置密码 */
    $("#reg-next").click(function () {
        var newPassword = $("#newPassword").val();
        var againPassword = $("#againPassword").val();
        if (newPassword == "" || newPassword == null) {
            alert("请设置新密码~");
        } else if (!/((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))(?!^.*[\u4E00-\u9FA5].*$)^\S{8,20}$/.test(newPassword)) {
            alert("密码格式不正确~");
        } else {
            if (againPassword == "" || againPassword == null) {
                alert("请再次输入新密码~");
            } else {
                if (newPassword != againPassword) {
                    alert("两次输入密码不正确~");
                } else {
                    var $newPassword = $("#newPassword").val();
                    var $againPassword = $("#againPassword").val();
                    localStorage.setItem("newPassword", $newPassword);
                    localStorage.setItem("againPassword", $againPassword);
                    alert("密码设置成功");
                    $(window).attr("location", "./reg_end.html");
                }
            }
        }
    });

});