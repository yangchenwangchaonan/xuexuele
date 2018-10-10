$(function () {
    // 返回上一页
    $(".reg-back").click(function () {
        $(window).attr("location", "./reg_next.html");
    })
    /* *********选择身份********** */
    $("#identity>p").click(function () {
        $(this).children().addClass("checked").parent().siblings().children().removeClass("checked");
    });
    /************上传头像*********/
    $("#reg-avatar").click(function () {
        $("#regVavatar-shade").show();
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
            $("#regVavatar-shade").hide();
            $(".img1").removeClass("img1-photo");
            $(".img2").removeClass("img2-picture");
        });
    });


    /* **************选择性别*************** */
    $("#reg-gender").click(function () {
        $("#regGender-shade").show();
        /* 确定 */
        $(".gender_btn1").click(function () {
            var $text = $("#gender_list").find("p.gender_text").text();
            if ($text) {
                $("#regGender-shade").hide();
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
            $("#regGender-shade").hide();
        });
    });


    /* **********星座选择*********** */
    $("#reg-constellation").click(function () {
        $("#regConstellation-shade").show();
        //确定
        $(".constellation_btn1").click(function () {
            var $text = $(".constellation_table").find("p.constellation_text").text();
            if ($text) {
                $("#regConstellation-shade").hide();
                $("#reg-constellation").text($text);
                localStorage.getItem("constellation", $text);
            } else {
                $(".constellation_btn1").attr("disabled", true);
            }
        });
        // 关闭
        $(".constellation_btn2").click(function () {
            $("#regConstellation-shade").hide();
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
        $(".area-body").show();
        $(".index-container").hide();
        //关闭
        $("#areaClose").click(function () {
            $(".area-body").hide();
            $(".index-container").show();
            // 模糊搜索


            // 地区选中
            var $cityVal = localStorage.getItem("city");
            if ($cityVal == "" && $cityVal == null && $cityVal == undefined) {
                $("#reg-area").html("点击选择");
            } else {
                $("#reg-area").html($cityVal);
            }
        });

    });




    /*提交注册*/
    $("#reg-end").click(function () {
        var $Identity = $("#identity p>i.checked").length;
        var $avartar = $("#uploadImg").attr("src");
        var $nickname = $("#nickName").val();
        var $regGender = $("#reg-gender").html();
        console.log($regGender)
        var $regBirthday = $("#reg-birthday>input").val();
        console.log($regBirthday)
        var $regConstellation = $("#reg-constellation").html();
        var $regArea = $("#reg-area").html();
        if ($Identity == 0) {
            $(".identity-tip").show();
            $(".identity-tip").click(function () {
                $(".identity-tip").hide();
            });
        } else {
            var $id = $("div#identity>p.p1>i").hasClass("checked");
            if ($id) {
                $id = 1;
            } else {
                $id = 2;
            }
            if ($avartar == "") {
                $(".avatar-tip").show();
                $(".avatar-tip").click(function () {
                    $(".avatar-tip").hide();
                });
            } else {
                if ($nickname == "") {
                    $(".nickname-tip").show();
                    $(".nickname-tip").click(function () {
                        $(".nickname-tip").hide();
                    });
                } else {
                    if ($regGender == "点击选择") {
                        $(".gender-tip").show();
                        $(".gender-tip").click(function () {
                            $(".gender-tip").hide();
                        });
                    } else {
                        var $regId = 0;
                        if ($regGender == "男") {
                            $regId = 1;
                        } else if ($regGender == "女") {
                            $regId = 2;
                        } else if ($regGender == "保密") {
                            $regId = 3;
                        } else if ($regGender == "双性") {
                            $regId = 4;
                        }
                        console.log($regId)
                        if ($regBirthday == "" || $regConstellation == "点击选择" || $regArea == "点击选择") {
                            $(".other-tip").show();
                            $(".other-tip").click(function () {
                                $(".other-tip").hide();
                            });
                        } else {
                            var $tel = localStorage.getItem("tel");
                            var $code = localStorage.getItem("code");
                            var $password = localStorage.getItem("newPassword");
                            var $repassword = localStorage.getItem("againPassword");
                            $.ajax({
                                type: "POST",
                                url: APP_URL + "/api/User/UserRegisterInfo",
                                data: {
                                    phone: $tel,
                                    SmsCode: $code,
                                    password: $password,
                                    repassword: $repassword,
                                    identity: $id,
                                    headimg: $avartar,
                                    nickname: $nickname,
                                    sex: $regId,
                                    birthday: $regBirthday,
                                    constellation: $regConstellation,
                                    city: $regArea
                                },
                                dataType: "json",
                                success: function (res) {
                                    console.log(res);
                                    var code = res.code;
                                    var msg = res.msg;
                                    if (code == 1) {
                                        alert("注册成功~");
                                        $(window).attr("location", "../homePages/home.html");
                                    } else {
                                        alert(msg);
                                    }
                                },
                                error: function (err) {
                                    console.log(err);
                                }
                            });
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
    $(".cropper-shade").show();
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
            imgURL = window.URL.createObjectURL(file);
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
    image.src = imgURL;
    image.onload = function () {
        var base64 = getBase64Image(image);
        if (typeof (base64) !== 'undefined') {
            $('#img-path').attr('src', base64);
            $('#img-path').cropper({
                aspectRatio: 16 / 9,
                viewMode: 1,
                // crop: function (e) {
                //     //console.log(e);
                // }
            });
        }
        //取消
        $('div.img-cut-btn1').click(function () {
            $('#img-path').cropper('reset');
        });
        //确定
        $('div.img-cut-btn2').click(function () {
            var cas = $('#img-path').cropper('getCroppedCanvas');
            var base64url = cas.toDataURL('image/jpeg');
            $.ajax({
                type: "POST",
                url: APP_URL + "/api/My/HeadPortrait",
                data: {
                    fileUpload: base64url
                },
                dataType: "json",
                success: function (res) {
                    console.log(res);
                    var url = res.data.url;
                    $(".cropper-shade").hide();
                    $(".reg-shade").hide();
                    if (typeof (url) != undefined) {
                        $('img#uploadImg').attr('src', url);
                    }
                }
            });
        });
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