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
        document.querySelector('#phone').scrollIntoView(true);
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
        document.querySelector('#password').scrollIntoView(true);
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
                        // sessionStorage.setItem("birthday", data.birthday); //生日
                        // sessionStorage.setItem("verified", data.certificationstate); //实名
                        // sessionStorage.setItem("city", data.city); //所在城市
                        // sessionStorage.setItem("constellation", data.constellation); //星座
                        // sessionStorage.setItem("creditscore", data.creditscore); //信用值
                        // sessionStorage.setItem("headImg", data.headimg); //头像
                        // sessionStorage.setItem("identity", data.identity); //身份
                        // sessionStorage.setItem("moneybag", data.moneybag); //用户钱包余额
                        // sessionStorage.setItem("nickname", data.nickname); //昵称
                        // sessionStorage.setItem("pk", data.pk); //pk值
                        // sessionStorage.setItem("sex", data.sex); //性别
                        // sessionStorage.setItem("wisdombean", data.wisdombean) //智慧豆
                        // alert("登录成功");
                        $(window).attr("location", "../homePages/home.html");
                        localStorage.setItem('token', res.data.token);
                        // console.log(localStorage.getItem("uid"),localStorage.getItem("token"));
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