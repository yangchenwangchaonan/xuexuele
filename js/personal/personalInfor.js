$(function () {
    // 返回上一页
    $(".personal-goback").click(function () {
        $(window).attr("location", "./personal-center.html");
    })
    $(".submit-tips").hide(); //tips隐藏
    personalInfor(); //获取个人信息

    /************上传头像*********/
    $(".head-pic").click(function () {
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
    $("#perGender").click(function () {
        $("#regGender-shade").show();
        /* 确定 */
        $(".gender_btn1").click(function () {
            var $text = $("#gender_list").find("p.gender_text").text();
            if ($text) {
                $("#regGender-shade").hide();
                $("#perGender>input").val($text);
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
    $("#perConstellation").click(function () {
        $("#regConstellation-shade").show();
        //确定
        $(".constellation_btn1").click(function () {
            var $text = $(".constellation_table").find("p.constellation_text").text();
            if ($text) {
                $("#regConstellation-shade").hide();
                $("#perConstellation>input").val($text);
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
    $("#perArea").click(function () {
        $(".personal-area").show();
        $(".area-box1").show();
        $(".area-box2").hide();
        $(".personal-container").hide();
        $(".cityper").removeClass("cityChecked");

        //选择城市
        $(".cityper").click(function () {
            // console.log($(this).attr("name"));
            $(this).addClass("cityChecked").siblings().removeClass("cityChecked");
            $("#cityname").text($(this).text());
            var $num = $(this).parent("div").attr("num");
            var $index = $(".indexBar>a:contains(" + $num + ")");
            $index.css("color", "#3FBF09").siblings().css("color", "#666666");
            // $(".touchcity").hide()
            var $city = $("#cityname").text();
            $(".personal-area").hide();
            $(".personal-container").show();
            $("#perArea>input").val($city);
        });
        //关闭
        $("#areaClose").click(function () {
            $(".personal-area").hide();
            $(".personal-container").show();
        });
    });

    // 个人简介
    $("#personal-introduct").click(function () {
        $("body").addClass("present-body");
        $(".personal-container").hide();
        $(".personal-introduct").show();
        //内容监控
        $(".present-detail").keyup(function (e) {
            var code = e.charCode || e.keyCode;
            if (code == 13) {
                $(".personal-container").show();
                $(".personal-introduct").hide();
                $("#personal-introduct>input").val("已填写");
            }
        });
    });

    // 返回
    $(".personal-changeback").click(function () {
        $("body").removeClass("present-body");
        $(".personal-container").show();
        $(".personal-introduct").hide();
    });

    /*提交修改*/
    $("#perSubmit").click(function () {
        var $avartar = $("#perImg>img").attr("src");
        var $nickname = $("#perNickname>input").val();
        var $perGender = $("#perGender>input").val();
        var $perBirthday = $("#reg-birthday>input").val();
        var $perConstellation = $("#perConstellation>input").val();
        var $perArea = $("#perArea>input").val();
        var $perIntroduct = $(".present-detail").val();
        // 头像
        if ($avartar == undefined) {
            infor("请上传一个霸气的头像~", 1);
            return;
        }
        // 昵称
        if ($nickname == "") {
            infor("给自己起一个响亮的名字吧~", 1);
            return;
        }
        // 性别
        if ($perGender == "") {
            infor("请选择性别~", 1);
            return;
        }
        var $perId = 0;
        if ($perGender == "男") {
            $perId = 1;
        } else if ($perGender == "女") {
            $perId = 2;
        } else if ($perGender == "保密") {
            $perId = 3;
        } else if ($perGender == "双性") {
            $perId = 4;
        }
        // 生日、星座、地区
        if ($perBirthday == "" || $perConstellation == "" || $perArea == "") {
            infor("请完善个人信息~", 1);
            return;
        }
        //个人简介
        if ($perIntroduct == "") {
            infor("请填写个人简介~", 1);
            return;
        }
        var uId = sessionStorage.getItem("uid");
        $.ajax({
            type: "POST",
            url: APP_URL + "/api/My/Preservation",
            data: {
                uid: uId,
                headimg: $avartar,
                nickname: $nickname,
                sex: $perId,
                birthday: $perBirthday,
                constellation: $perConstellation,
                city: $perArea,
                introduction: $perIntroduct
            },
            dataType: "json",
            success: function (res) {
                console.log(res);
                var code = res.code;
                var msg = res.msg;
                if (code == 1) {
                    infor("修改成功~", 1);
                } else {
                    infor(msg, 1);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    });

});

//本人信息 
function personalInfor() {
    var uid = sessionStorage.getItem("uid");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/My/UserInfo",
        data: {
            uid: uid
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data[0];
            // 头像
            $("#perImg>img").attr("src", data.headimg);
            var imgUrl = $("#perImg>img").attr("src");
            if (imgUrl != undefined && imgUrl != "") {
                $("#perImgText").val("已上传");
            }
            $("#perNickname>input").val(data.nickname); // 昵称
            // 性别
            var sexId = data.sex;
            var sexText = "";
            if (sexId == 1) {
                sexText = "男";
            } else if (sexId == 2) {
                sexText = "女";
            } else if (sexId == 3) {
                sexText = "保密";
            } else if (sexId == 4) {
                sexText = "双性";
            }
            $("#perGender>input").val(sexText); // 性别
            $("#reg-birthday>input").val(data.birthday); // 生日
            $("#perConstellation>input").val(data.constellation); //星座
            $("#perArea>input").val(data.city); //城市
            // 个人简介
            var text = data.introduction;
            if (text != "" && text != null) {
                $(".present-detail").val(text);
                $("#personal-introduct>input").val("已填写");
            } else {
                $(".present-detail").val("");
                $("#personal-introduct>input").val("请填写");
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}




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
                aspectRatio: 1 / 1,
                autoCropArea: .9,
                viewMode: 1,
                crop: function (e) {
                    console.log(e);
                }
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
                    $('#img-path').attr('src', "");
                    $(".img1").removeClass("img1-photo");
                    $(".img2").removeClass("img2-picture");
                    if (typeof (url) != undefined) {
                        $('#perImg>img').attr('src', url);
                        var imgUrl = $("#perImg>img").attr("src");
                        if (imgUrl != undefined && imgUrl != "") {
                            $("#perImgText").text("已上传");
                        }
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


//修改信息弹窗
function infor(a, b) {
    $(".submit-tips").html(a);
    var y = b * 1000;
    $(".submit-tips").show();
    window.setTimeout(() => {
        $(".submit-tips").hide();
    }, y);
}