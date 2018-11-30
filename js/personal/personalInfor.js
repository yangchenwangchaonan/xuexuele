$(function () {
    // 返回上一页
    $(".personal-goback").click(function () {
        $(window).attr("location", "./personal-center.html");
    })
    $(".submit-tips").hide(); //tips隐藏
    personalInfor(); //获取个人信息

    /************上传头像*********/
    $(".head-pic").click(function () {
        allClick();
        $("#regVavatar-shade").show();
        getFiles();
        $(".img1").click(function () {
            allClick();
            $(this).addClass("img1-photo").parent().siblings().children(".img2").removeClass("img2-picture");
            $("#imgPhoto").trigger("click");
        });
        $(".img2").click(function () {
            allClick();
            $(this).addClass("img2-picture").parent().siblings().children(".img1").removeClass("img1-photo");
            $("#imgPhoto").trigger("click");
        });
        /* 关闭窗口 */
        $(".avatar_btn").click(function () {
            allClick();
            $("#regVavatar-shade").hide();
            $(".img1").removeClass("img1-photo");
            $(".img2").removeClass("img2-picture");
        });
    });

    /* **************选择性别*************** */
    $("#perGender").click(function () {
        allClick();
        $("#regGender-shade").show();
        /* 确定 */
        $(".gender_btn1").click(function () {
            allClick();
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
            allClick();
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
        allClick();
        $("#regConstellation-shade").show();
        //确定
        $(".constellation_btn1").click(function () {
            allClick();
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
            allClick();
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
        allClick();
        $(".personal-area").show();
        $(".area-box1").show();
        $(".area-box2").hide();
        $(".personal-container").hide();
        $(".cityper").removeClass("cityChecked");

        //选择城市
        $(".cityper").click(function () {
            allClick();
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
            allClick();
            $(".personal-area").hide();
            $(".personal-container").show();
        });
    });

    // 个人简介
    $("#personal-introduct").click(function () {
        allClick();
        $("body").addClass("present-body");
        $(".personal-container").hide();
        $(".personal-introduct").show();
        //内容监控
        $(".present-detail").focus(function () {
            $(".perEditCompleted").show();
            $(".perEditCompleted").click(function () {
                var coursetext = $.trim($(".present-detail").val());
                $(".perEditCompleted").hide();
                $(".personal-container").show();
                $(".personal-introduct").hide();
                if (coursetext != "") {
                    $("#personal-introduct>input").val("已填写");
                } else {
                    $("#personal-introduct>input").val("未填写");
                }
            });
        });
    });

    // 返回
    $(".personal-changeback").click(function () {
        allClick();
        $("body").removeClass("present-body");
        $(".personal-container").show();
        $(".personal-introduct").hide();
    });

    /*提交修改*/
    $("#perSubmit").click(function () {
        allClick();
        var $avartar = $("#perImg>img").attr("src");
        var $nickname = $("#perNickname>input").val();
        var $perGender = $("#perGender>input").val();
        var $perBirthday = $("#reg-birthday>input").val();
        var $perConstellation = $("#perConstellation>input").val();
        var $perArea = $("#perArea>input").val();
        var $perIntroduct = $(".present-detail").val();
        // 头像
        if ($avartar == undefined) {
            lemonTips("请上传一个霸气的头像~", 1);
            return;
        }
        // 昵称
        if ($nickname == "") {
            lemonTips("给自己起一个响亮的名字吧~", 1);
            return;
        }
        // 性别
        if ($perGender == "") {
            lemonTips("请选择性别~", 1);
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
            lemonTips("请完善个人信息~", 1);
            return;
        }
        //个人简介
        if ($perIntroduct == "") {
            lemonTips("请填写个人简介~", 1);
            return;
        }
        var uId = localStorage.getItem("uid");
        var token = localStorage.getItem("token");
        $.ajax({
            type: "POST",
            url: APP_URL + "/api/My/Preservation",
            data: {
                uid: uId,
                token: token,
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
                    lemonTips("修改成功~", 1);
                } else if(res.code==10000){
                    repeatLogin();
                }else {
                    lemonTips(msg, 1);
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
    var uid = localStorage.getItem("uid");
    var token = localStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/My/UserInfo",
        data: {
            uid: uid,
            token: token
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
    allClick();
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
    allClick();
    $.each($(".constellation_table img"), function (index, val) {
        var num = 48 + index;
        var eachIMG = "../../images/" + num + "-1.png"
        $(this).attr("src", eachIMG);
        $(this).siblings().removeClass("constellation_text");
    });
    $(e).attr('src', '../../images/' + imgName);
    $(e).siblings().addClass("constellation_text");
}
//监听拍照/上传图片操作
function getFiles() {
    var importFile = document.getElementById('importFile'); //获取选择图片的input元素
    importFile.addEventListener('change', readFile, false); //监听input

    var importPhoto = document.getElementById('importPhoto'); //获取选择相机的input元素
    importPhoto.addEventListener('change', readFile, false); //监听input
}

//获取上传的图片预览
function readFile() {
    var file = this.files[0]; //获取file对象
    //判断file的类型是不是图片类型。
    if (!/image\/\w+/.test(file.type)) {
        alert("请上传一张图片~");
        return false;
    }

    var reader = new FileReader(); //声明一个FileReader实例
    reader.readAsDataURL(file); //调用readAsDataURL方法来读取选中的图像文件
    //最后在onload事件中，获取到成功读取的文件内容，并以插入一个img节点的方式显示选中的图片
    reader.onload = function (e) {
        // console.log(this.result);
        // $('#img-path').attr('src', this.result);
        $('#img-path').cropper({
            aspectRatio: 300 / 300,
            viewMode: 1,
            crop: function (e) {
                // console.log(e);
            }
        });

        $(".cropper-shade").show();
        //重构
        $('#img-path').cropper('replace', this.result, true);
        //取消
        $('div.img-cut-btn1').click(function () {
            $('#img-path').cropper('reset', {
                width: 300,
                height: 300
            });
        });
        //确定
        $('div.img-cut-btn2').click(function () {
            var val = $('#img-path').cropper('getCroppedCanvas', {
                width: 600,
                height: 600,
                minWidth: 300,
                minHeight: 300,
                maxWidth: 800,
                maxHeight: 800,
                fillColor: '#ffffff',
                imageSmoothingQuality: 'high'
            });
            $.ajax({
                type: "POST",
                url: APP_URL + "/api/My/HeadPortrait",
                data: {
                    fileUpload: val.toDataURL('image/jpeg')
                },
                dataType: "json",
                success: function (res) {
                    console.log(res);
                    var url = res.data.url;
                    $(".cropper-shade").hide();
                    $(".reg-shade").hide();
                    $(".img1").removeClass("img1-photo");
                    $(".img2").removeClass("img2-picture");
                    if (typeof (url) != undefined) {
                        $('#perImg>img').attr('src', url);
                        var imgUrl = $("#perImg>img").attr("src");
                        if (imgUrl != undefined && imgUrl != "") {
                            $("#perImgText").text("已上传");
                        }
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        });
    }
}

// //修改信息弹窗
// function infor(a, b) {
//     $(".submit-tips").html(a);
//     var y = b * 1000;
//     $(".submit-tips").show();
//     window.setTimeout(() => {
//         $(".submit-tips").hide();
//     }, y);
// }