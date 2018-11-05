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
            flowerTips("请设置新密码~", 1);
        } else if (!/((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))(?!^.*[\u4E00-\u9FA5].*$)^\S{8,20}$/.test(newPassword)) {
            flowerTips("密码格式不正确~", 1);
        } else {
            if (againPassword == "" || againPassword == null) {
                flowerTips("请再次输入新密码~", 1);
            } else {
                if (newPassword != againPassword) {
                    flowerTips("两次输入密码一致~", 1);
                } else {
                    flowerTips("密码设置成功,请使用新密码登录~", 1);
                    window.setTimeout(function() {
                        $(window).attr("location", "./login.html");
                    }, 1500);
                    
                }
            }
        }
    });


});