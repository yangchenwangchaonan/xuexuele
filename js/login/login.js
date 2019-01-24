$(function () {
    var url = window.location.href;
    var num = url.indexOf("=");
    // console.log(url.indexOf("="));
    if (num != -1) {
        var uid = url.split("=")[1];
        sessionStorage.setItem("uId", uid);
    }
    //清空value
    deleteVal("#delPhoto", "#phone")
    deleteVal("#delPassword", "#password")
    //输入手机号样式变化
    $("#phone").keyup(function () {
        // document.querySelector('#phone').scrollIntoView(true);
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
        // document.querySelector('#password').scrollIntoView(true);
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
        allClick();
        if ($("#phone").val() == "" || $("#phone").val() == null) {
            flowerTips("请输入手机号~", 1);
        } else if (!/^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(19[9])|(17[0,1,3,5,6,7,8]))\d{8}$/.test($("#phone").val())) {
            flowerTips("手机号码格式错误~", 1);
        } else if ($("#password").val() == "" || $("#password").val() == null) {
            flowerTips("请输入密码~", 1);
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
                    var data = res.data;
                    var msg = res.msg;
                    if (res.code == 1) {
                        localStorage.setItem("uid", data.UserId); //用户id
                        $(window).attr("location", "../homePages/home.html?type=1");
                        localStorage.setItem('token', res.data.token);
                    } else {
                        flowerTips(msg, 1);
                    }
                },
                error: function (err) {
                    console.log(err)
                }
            });
        }
    });

});