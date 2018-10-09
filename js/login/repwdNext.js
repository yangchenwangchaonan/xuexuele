$(function () {
    $("#repwdBtn2").click(function () {
        //输入新密码后样式变化
        $("#rewpdPassword1").keyup(function () {
            if ($(this).val() != "") {
                $("#reInput1").addClass("login-focus");
                $("#delNew").css("display", "block");
            } else {
                $("#reInput1").removeClass("login-focus");
                $("#delNew").css("display", "none");
            }
        });
        //再次输入新密码样式变化
        $("#rewpdPassword2").keyup(function () {
            if ($(this).val() != "") {
                $("#reInput2").addClass("login-focus");
                $("#delAgain").css("display", "block");
            } else {
                $("#reInput2").removeClass("login-focus");
                $("#delAgain").css("display", "none");
            }
        });


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
                    alert("密码设置成功,请使用新密码登录~");
                    $(window).attr("location", "./login.html");
                }
            }
        }
    });


});