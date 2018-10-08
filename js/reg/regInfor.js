$(function () {
    /* *********选择身份********** */
    $("#identity>p").click(function () {
        $(this).children().addClass("checked").parent().siblings().children().removeClass("checked");
    });
    /************上传头像*********/
    $("#reg-avatar").click(function () {
        $("#regVavatar-shade").css("display", "block");
        $(".img1").click(function () {
            $(this).addClass("img1-photo").parent().siblings().children(".img2").removeClass("img2-picture");
            $("#imgPhoto").trigger("click");
        });
        $(".img2").click(function () {
            $(this).addClass("img2-picture").parent().siblings().children(".img1").removeClass("img1-photo");
            $("#imgPhoto").trigger("click");
        });
        /* 关闭窗口 */
        $(".avatar_btn").click(function () {
            $("#regVavatar-shade").css("display", "none");
            $(".img1").removeClass("img1-photo");
            $(".img2").removeClass("img2-picture");
        });
    });
    //选中头像
    var header_path_base = localStorage.getItem("header_path_base");
    if (typeof (header_path_base) != undefined) {
        $('img#uploadImg').attr('src', header_path_base);
    }


    /* **************选择性别*************** */
    $("#reg-gender").click(function () {
        $("#regGender-shade").css("display", "block");
        /* 确定 */
        $(".gender_btn1").click(function () {
            var $text = $("#gender_list").find("p.gender_text").text();
            if ($text) {
                $("#regGender-shade").css("display", "none");
                $("#reg-gender").text($text);
                localStorage.getItem("gender", $text);
            } else {
                $(".gender_btn1").attr("disabled", true);
            }
        });
        /* 关闭窗口 */
        $(".gender_btn2").click(function () {
            $.each($("#gender_list img"), function (index, val) {
                var cunt = 43 + index;
                var eachIMG = "../../images/" + cunt + "-1.png"
                $(this).attr("src", eachIMG);
                $(this).siblings().removeClass("gender_text");
            });
            $("#regGender-shade").css("display", "none");
        });
    });


    /* **********星座选择*********** */
    $("#reg-constellation").click(function () {
        $("#regConstellation-shade").css("display", "block");
        //确定
        $(".constellation_btn1").click(function () {
            var $text = $(".constellation_table").find("p.constellation_text").text();
            if ($text) {
                $("#regConstellation-shade").css("display", "none");
                $("#reg-constellation").text($text);
                localStorage.getItem("constellation", $text);
            } else {
                $(".constellation_btn1").attr("disabled", true);
            }
        });
        // 关闭
        $(".constellation_btn2").click(function () {
            $("#regConstellation-shade").css("display", "none");
            $.each($(".constellation_table img"), function (index, val) {
                var num = 48 + index;
                var eachIMG = "../../images/" + num + "-1.png"
                $(this).attr("src", eachIMG);
                $(this).siblings().removeClass("constellation_text");
            });
        });
    });

    /* ******地区选择******** */
    $("#reg-area").click(function () {
        $(window).attr("location", "./reg-area.html");
    });
    // 地区选中
    var $url = decodeURI(window.location.href);
    console.log($url);
    if ($url.indexOf("=") != -1) {
        var $cityVal = $url.substr($url.indexOf("=") + 1);
        console.log($cityVal);
        if ($cityVal != "") {
            $("#reg-area").html($cityVal);
        } else {
            $("#reg-area").html("点击选择");
        }
    }

    // 从地区跳转回来后


    /*提交注册*/
    $("#reg-end").click(function () {
        var $Identity = $("#identity p>i.checked").length;
        var $avartar = $("#uploadImg").length;
        var $nickname = $("#nickName").val();
        var $regGender = $("#reg-gender>input").val();
        var $regBirthday = $("#reg-birthday").html();
        var $regConstellation = $("#reg-constellation>input").val();
        var $regArea = $("#reg-area").html();
        console.log($avartar);
        if ($Identity == 0) {
            $(".identity-tip").css("display", "block");
            $(".identity-tip").click(function () {
                $(".identity-tip").css("display", "none");
            });
        } else {
            if ($avartar == 0) {
                $(".avatar-tip").css("display", "block");
                $(".avatar-tip").click(function () {
                    $(".avatar-tip").css("display", "none");
                });
            } else {
                if ($nickname == "") {
                    $(".nickname-tip").css("display", "block");
                    $(".nickname-tip").click(function () {
                        $(".nickname-tip").css("display", "none");
                    });
                } else {
                    if ($regGender == "点击选择") {
                        $(".gender-tip").css("display", "block");
                        $(".gender-tip").click(function () {
                            $(".gender-tip").css("display", "none");
                        });
                    } else {
                        if ($regBirthday == "点击选择" || $regConstellation == "点击选择" || $regArea == "点击选择") {
                            $(".other-tip").css("display", "block");
                            $(".other-tip").click(function () {
                                $(".other-tip").css("display", "none");
                            });
                        } else {
                            // var $tel = sessionStorage.getItem("tel");
                            // var $code = sessionStorage.getItem("code");
                            // var $password = sessionStorage.getItem("newPassword");
                            // var $repassword = sessionStorage.getItem("againPassword");
                            // $.ajax({
                            //     type: "POST",
                            //     url: APP_URL + "/api/User/UserRegisterInfo",
                            //     data: {
                            //         phone:
                            //         SmsCode:
                            //         password:
                            //         repassword:
                            //         identity:
                            //         headimg:
                            //         nickname:
                            //         sex:
                            //         birthday:
                            //         constellation:
                            //         city:
                            //     },
                            //     dataType: "json",
                            //     success: function (res) {
                            //         console.log(res);
                            //     },error: function (err) {
                            //         console.log(err);
                            //     }
                            // });
                        }
                    }
                }
            }
        }
    });
});


/* 改变性别 */
function changeGender(e, genderImag) {
    $.each($("#gender_list img"), function (index, val) {
        var cunt = 43 + index;
        var eachIMG = "../../images/" + cunt + "-1.png"
        $(this).attr("src", eachIMG);
        $(this).siblings().removeClass("gender_text");
    });
    $(e).attr('src', '../../images/' + genderImag);
    $(e).siblings().addClass("gender_text");
}

/* 改变星座图片 */
function changeImage(e, imgName) {
    $.each($(".constellation_table img"), function (index, val) {
        var num = 48 + index;
        var eachIMG = "../../images/" + num + "-1.png"
        $(this).attr("src", eachIMG);
        $(this).siblings().removeClass("constellation_text");
    });
    $(e).attr('src', '../../images/' + imgName);
    $(e).siblings().addClass("constellation_text");
}


//获取相册 或拍照
function getPhoto(node) {
    var imgURL = "";
    try {
        var file = null;
        if (node.files && node.files[0]) {
            file = node.files[0];
        } else if (node.files && node.files.item(0)) {
            file = node.files.item(0);
        }
        //Firefox 因安全性问题已无法直接通过input[file].value 获取完整的文件路径
        try {
            imgURL = file.getAsDataURL();
        } catch (e) {
            imgRUL = window.URL.createObjectURL(file);
        }
    } catch (e) {
        if (node.files && node.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                imgURL = e.target.result;
            };
            reader.readAsDataURL(node.files[0]);
        }
    }

    var image = new Image();
    image.src = imgRUL;
    image.onload = function () {
        var base64 = getBase64Image(image);
        localStorage.setItem("header_path_base", '');
        localStorage.setItem("img_path_base", base64);
        window.location.href = './cert_avatar.html';
    }
}
//获取图片base64位
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
    var dataURL = canvas.toDataURL("image/" + ext);
    return dataURL;
}