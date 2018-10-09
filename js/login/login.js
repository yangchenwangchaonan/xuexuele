$(function () {
    //输入手机号样式变化
    $("#phone").keyup(function () {
        if ($(this).val() != "") {
            $("#loginTel").addClass("login-focus");
            $("#delPhoto").css("display", "block");
        } else {
            $("#loginTel").removeClass("login-focus");
            $("#delPhoto").css("display", "none");
        }
    });
    //输入密码样式变化
    $("#password").keyup(function () {
        if ($(this).val() != "") {
            $("#loginPword").addClass("login-focus");
            $("#delPassword").css("display", "block");
        } else {
            $("#loginPword").removeClass("login-focus");
            $("#delPassword").css("display", "none");
        }
    });

    // 登录
    $(".login-btn").click(function () {
        if ($("#phone").val() == "" || $("#phone").val() == null) {
            alert("请输入手机号!");
        } else if (!/^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(19[9])|(17[0,1,3,5,6,7,8]))\d{8}$/.test($("#phone").val())) {
            alert("手机号码格式错误!");
        } else if ($("#password").val() == "" || $("#password").val() == null) {
            alert("请输入密码!");
        } else {
            $.ajax({
                type: 'POST',
                url: APP_URL + "/api/User/Login",
                data: {
                    phone: $("#phone").val(),
                    password: $("#password").val()
                },
                dataType: 'json',
                success: function (res) {
                    console.log(res);
                    if (res.code == 1) {
                        alert("登录成功");
                        $(window).attr("location", "../homePages/home.html");
                        localStorage.setItem('token', res.Token);
                    } else {
                        alert("未注册，请先注册~");
                    }
                },
                error: function (err) {
                    console.log(err)
                }
            });
        }
    });

});