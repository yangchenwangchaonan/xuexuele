$(function () {
    deleteVal("#telClear","#reg-phone")
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
        allClick();
        if (!flag) {
            return false;
        }
        if ($("#reg-phone").val() == "" || $("#reg-phone").val() == null) {
            // alert("请输入手机号!");
            flowerTips("请输入手机号~", 1);
            return false;
        } else if (!/^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(19[9])|(17[0,1,3,5,6,7,8]))\d{8}$/.test($("#reg-phone").val())) {
            flowerTips("手机号码格式错误~", 1);
            // alert("手机号码格式错误!");
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
                        flowerTips("发送成功~", 1);
                        // alert(res.data.code);
                        var realCode = res.data.code;
                        $("#realCode").val(realCode);
                        setTime(obj);
                    }else{
                        flowerTips("发送失败~", 1);
                        // alert("发送失败~");
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
        allClick();
        var codeValue = $("#reg-code").val();
        var realCode = $("#realCode").val();
        if ($("#reg-phone").val() == "" || $("#reg-phone").val() == null) {
            flowerTips("请输入手机号~", 1);
        } else if (!/^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(19[9])|(17[0,1,3,5,6,7,8]))\d{8}$/.test($("#reg-phone").val())) {
            flowerTips("手机号码格式错误~", 1);
        } else if (codeValue==""||codeValue != realCode) {
            flowerTips("验证码输入错误~", 1);
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
        allClick();
        var newPassword = $("#newPassword").val();
        var againPassword = $("#againPassword").val();
        if (newPassword == "" || newPassword == null) {
            flowerTips("请设置新密码~", 1);
        } else if (!/((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))(?!^.*[\u4E00-\u9FA5].*$)^\S{8,20}$/.test(newPassword)) {
            flowerTips("密码格式不正确~", 1);
        } else {
            if (againPassword == "" || againPassword == null) {
                flowerTips("请再次输入新密码~", 1);
            } else {
                if (newPassword != againPassword) {
                    flowerTips("两次输入密码不一致~", 1);
                } else {
                    var $newPassword = $("#newPassword").val();
                    var $againPassword = $("#againPassword").val();
                    localStorage.setItem("newPassword", $newPassword);
                    localStorage.setItem("againPassword", $againPassword);
                    flowerTips("密码设置成功~", 1);
                    window.setTimeout(function() {
                        $(window).attr("location", "./reg_end.html");
                    }, 1500);
                }
            }
        }
    });

    // 返回
    // 第一步
    $("#regBackFirst").click(function(){
        window. location.replace("../login/login.html");
    });
    // 第二步
    $("#regBackNext").click(function(){
        window. location.replace("./reg.html");
    });

});