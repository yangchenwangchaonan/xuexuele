$(function () {

    /* **********************************************登录******************************************** */
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
                        $(window).attr("location", "../personalCenter/personal-center.html");
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
    /* ********************************************忘记密码*********************************************** */
    $("#repwdBtn1").click(function () {
        if ($("#repwdPhone").val() == "" || $("#repwdPhone").val() == null) {
            alert("请输入手机号!");
        } else if (!/^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(19[9])|(17[0,1,3,5,6,7,8]))\d{8}$/.test($("#repwdPhone").val())) {
            alert("手机号码格式错误!");
        } else if ($("#repwdCode").val() == "" || $("#repwdCode").val() == null) {
            alert("请输入验证码!");
        } else if (!/^\d{6}$/.test($("#repwdCode").val())) {
            alert("验证码不正确!");
        } else {
            $(window).attr("location", "repwd_next.html")
        }
    });

    /* *************************************************设置新密码************************************************* */
    $("#repwdBtn2").click(function () {
        var newPassword = $("#rewpdPassword1").val();
        var againPassword = $("#rewpdPassword2").val();
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
                    alert("密码设置成功");
                    $(window).attr("location", "../personalCenter/personal-center.html");
                }
            }
        }
    });

});