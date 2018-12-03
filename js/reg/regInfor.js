$(function () {
    // 返回
    $("#regEndBack").click(function () {
        window.location.replace("./reg_next.html");
    })
    /* *********选择身份********** */
    $("#identity>p").click(function () {
        allClick();
        $(this).children().addClass("checked").parent().siblings().children().removeClass("checked");
    });
    /************上传头像*********/
    $("#reg-avatar").click(function () {
        allClick();
        $("#regVavatar-shade").show();
        getFiles(); //监听获取到的照片
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
    $("#reg-gender").click(function () {
        allClick();
        $("#regGender-shade").show();
        /* 确定 */
        $(".gender_btn1").click(function () {
            allClick();
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
    $("#reg-constellation").click(function () {
        allClick();
        $("#regConstellation-shade").show();
        //确定
        $(".constellation_btn1").click(function () {
            allClick();
            var $text = $(".constellation_table").find("p.constellation_text").text();
            if ($text) {
                $("#regConstellation-shade").hide();
                $("#reg-constellation").text($text);
                // localStorage.getItem("constellation", $text);
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
    $("#reg-area").click(function () {
        allClick();
        $(".area-body").show();
        $(".area-box1").show();
        $(".area-box2").hide();
        $(".index-container").hide();
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
            $(".area-body").hide();
            $(".index-container").show();
            $("#reg-area").html($city);
        });
        //关闭
        $("#areaClose").click(function () {
            allClick();
            $(".area-body").hide();
            $(".index-container").show();
            $("#reg-area").html("点击选择");
        });
    });


    /*提交注册*/
    $("#reg-end").click(function () {
        allClick();
        var $Identity = $("#identity p>i.checked").length;
        var $avartar = $("#uploadImg").attr("src");
        var $nickname = $("#nickName").val();
        var $regGender = $("#reg-gender").html();
        var $regBirthday = $("#reg-birthday>input").val();
        var $regConstellation = $("#reg-constellation").html();
        var $regArea = $("#reg-area").html();
        // 身份
        console.log($Identity);
        if ($Identity == 0) {
            flowerTips("请选择身份~", 1);
            return;
        }
        var $id = $("div#identity>p.p1>i").hasClass("checked");
        if ($id) {
            $id = 2;
        } else {
            $id = 1;
        }
        // 头像
        if ($avartar == undefined || $avartar == "") {
            flowerTips("请选择一个霸气的头像~", 1);
            return;
        }
        // 昵称
        if ($nickname == "") {
            flowerTips("给自己起一个响亮的名字吧~", 1);
            return;
        }
        // 性别
        if ($regGender == "点击选择") {
            flowerTips("请选择性别~", 1);
            return;
        }
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
        // 生日、星座、地区
        if ($regBirthday == "" || $regConstellation == "点击选择" || $regArea == "点击选择") {
            flowerTips("请完善个人信息~", 1);
            return;
        }
        var $tel = localStorage.getItem("tel");
        var $code = localStorage.getItem("code");
        var $password = localStorage.getItem("newPassword");
        var $repassword = localStorage.getItem("againPassword");
        var uid = sessionStorage.getItem("uId");
        if (uid) {
            var recommenduId = uid;
        } else {
            var recommenduId = "";
        }
        console.log(recommenduId);
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
                city: $regArea,
                recommenduid: recommenduId
            },
            dataType: "json",
            success: function (res) {
                console.log(res);
                var code = res.code;
                var msg = res.msg;
                if (code == 1) {
                    login($tel, $password);
                    // alert("注册成功~");
                    flowerTips("注册成功~", 1);
                } else {
                    flowerTips(msg, 1);
                    // alert(msg);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    });
});

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
            allClick();
            $('#img-path').cropper('reset', {
                width: 300,
                height: 300
            });
        });
        //确定
        $('div.img-cut-btn2').click(function () {
            allClick();
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
                        $('img#uploadImg').attr('src', url);
                        $("#reg-avatar>span").html("已上传");
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        });
    }
}


// 登录
function login(tel, password) {
    $.ajax({
        type: 'POST',
        url: APP_URL + "/api/User/Login",
        data: {
            phone: tel,
            password: password
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
                $(window).attr("location", "../homePages/home.html");
                localStorage.setItem("token", res.data.token);
                // console.log(localStorage.getItem("uid"),localStorage.getItem("token"));
            } else {
                // alert(msg);
                flowerTips(msg, 1);
                window.setTimeout(function () {
                    $(window).attr("location", "../reg/reg.html");
                }, 1500);
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}