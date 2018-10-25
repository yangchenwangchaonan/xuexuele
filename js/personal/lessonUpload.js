$(function () {
    var url = window.location.href;
    var arr = url.split("&");
    var voiceUrl = arr[0].split("=")[1];
    var albumId = arr[1].split("=")[1]
    // console.log(voiceUrl);
    $("#lessonAudio").attr("src", voiceUrl);
    $("#addLessonName").hide(); //课程名称
    $("#addLessonIntroduct").hide(); //课程介绍
    $("#addLessonCover").hide(); //课程封面
    $("#addLessonText").hide(); //课程文字
    $("#adLessonBeans").hide(); //课程所需智慧豆
    // 设置课程名称
    $("#addCourseName").click(function () {
        $("#addCourseContent").hide();
        $("#addLessonName").show();
        $("#addNameContent").keyup(function (e) {
            var code = e.charCode || e.keyCode;
            if (code == 13) {
                var courseName = $.trim($("#addNameContent").val());
                $("#addCourseContent").show();
                $("#addLessonName").hide();
                if (courseName != "") {
                    $("#addCourseName").html(courseName);
                }
            }
        });
        // 返回
        $("#courseNameBack").click(function () {
            $("#addCourseContent").show();
            $("#addLessonName").hide();
        });
    });
    // 设置课程简介
    $("#addCourseIntroduct").click(function () {
        $("#addCourseContent").hide();
        $("#addLessonIntroduct").show();
        $("#addLessonItrContent").keyup(function (e) {
            var code = e.charCode || e.keyCode;
            if (code == 13) {
                var coursetext = $.trim($("#addLessonItrContent").val());
                $("#addCourseContent").show();
                $("#addLessonIntroduct").hide();
                if (coursetext != "") {
                    $("#addCourseIntroduct").html("已输入");
                }
            }
        });
        // 返回
        $("#courseItrBack").click(function () {
            $("#addCourseContent").show();
            $("#addLessonIntroduct").hide();
        });
    });
    // 上传封面
    $("#addCourseCover").click(function () {
        $("#addCourseContent").hide();
        $("#addLessonCover").show();
        courseUpload();
        // 返回
        $("#courseCoverBack").click(function () {
            $("#addCourseContent").show();
            $("#addLessonCover").hide();
        });
    });
    // 课程文字
    $("#addCourseText").click(function () {
        $("#addCourseContent").hide();
        $("#addLessonText").show();
        $("#addLessonTextContent").keyup(function (e) {
            var code = e.charCode || e.keyCode;
            if (code == 13) {
                var courseContent = $.trim($("#addLessonTextContent").val());
                $("#addCourseContent").show();
                $("#addLessonText").hide();
                console.log(courseContent);
                if (courseContent != "") {
                    $("#addCourseText").html("已输入");
                }
            }
        });
        // 返回
        $("#courseTextBack").click(function () {
            $("#addCourseContent").show();
            $("#addLessonText").hide();
        });
    });
    //课程价格 智慧豆数
    $("#addCourseBeans").click(function () {
        $("#addCourseContent").hide();
        $("#adLessonBeans").show();
        // 勾选免费
        $(".free-container").click(function () {
            if ($("#freeChecked").hasClass("free-select-checked")) {
                $("#freeChecked").removeClass("free-select-checked");
            } else {
                $("#freeChecked").addClass("free-select-checked");
            }
        });
        $("#beans-input").on("input", function () {
            $("#freeChecked").removeClass("free-select-checked");
        });
        // 确定
        $("#beansBtn").click(function () {
            var beans = $("#beans-input").val();
        });

    });

    // 新增课程
    $("#addCouse").click(function () {
        addCourse(albumId, voiceUrl);
    });

});



// 上传封面
function courseUpload() {
    // 上传图片
    $(".upCover").change(function () {
        var files = $(".upCover")[0].files[0];
        upClover(files);
    });
    // 确认上传
    $("#addLessonBtn").click(function () {
        alert("上传成功~");
        $("#addCourseContent").show();
        $("#addLessonCover").hide();
        $("#addCourseCover").html("已上传");
    });
    // 确认上传x
    $(".submit-cancel").click(function () {
        $(".lesson-cover-content>img").attr("src", "");
        $(".upCover").val("");
        $(".submit-cancel").hide();
        $(".upCover").show();
        $(".lesson-cover-btn").html("选择封面");
    });
}

// 上传封面
function upClover(files) {
    var form = new FormData()
    form.append("picture", files)
    $.ajax({
        processData: false, //告诉jquery不要去处理发送的数据
        contentType: false, //告诉jquery不要去设置Content-Type请求头
        type: "POST",
        url: APP_URL + "/api/My/ImgUpload",
        data: form,
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                var url = res.data;
                $(".lesson-cover-content>img").attr("src", url);
                $(".submit-cancel").show();
                $(".upCover").hide();
                $(".lesson-cover-btn").html("确认上传");
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}

// 新增课程
function addCourse(albumId, voiceUrl) {

    // 获取音频时长
    $("#lessonAudio").on("loadedmetadata", function () {
        // console.log(audio.duration);  //音频时长
        var lessonTime = transTime(this.duration);
    });
}


// 转换音频时长显示
function transTime(time) {
    var duration = parseInt(time);
    var minute = parseInt(duration / 60);
    var sec = duration % 60 + '';
    var isM0 = ':';
    if (minute == 0) {
        minute = '00';
    } else if (minute < 10) {
        minute = '0' + minute;
    }
    if (sec.length == 1) {
        sec = '0' + sec;
    }
    return minute + isM0 + sec
}