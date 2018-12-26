$(function () {
    var url = window.location.href;
    var num = url.split("=").length - 1;
    if (num == 1) {
        // 修改课程
        $("#album-add-title").html("-修改课程-");
        var courseId = url.split("=")[1];
        courseDetail(courseId);
        $("#addCouse").html("确定修改");
    } else if (num == 2) {
        // 新增课程
        $("#album-add-title").html("-新增课程-");
        var arr = url.split("&");
        var voiceUrl = arr[0].split("=")[1];
        var albumId = arr[1].split("=")[1];
        Rendering(voiceUrl, albumId); //新增时渲染页面
        $("#addCouse").html("上传课程");
        $("#addCouse").click(function () {
            allClick();
            addCourse(albumId);
        });
    }
    // 返回
    $("#albumAddBack").click(function () {
        history.back(-1);
    });

});

// 课程详情
function courseDetail(cId) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/My/CourseDetail",
        data: {
            courseid: cId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            if (res.code == 1) {
                $("#audioTime").html(data.coursetime); // 课程时长
                // 课程名称
                $("#addNameContent").val(data.coursename)
                $("#addCourseName").html(data.coursename);
                // 课程简介
                contentEditor.txt.html(data.coursetxt);
                $("#addCourseIntroduct").html("已输入");
                // 课程封面
                $(".lesson-cover-content>img").attr("src", data.courseimg);
                $("#addCourseCover").html("已上传");
                // 课程文字
                textEditor.txt.html(data.coursecontent);
                $("#addCourseText").html("已输入");
                // 智慧豆 
                if (data.free == 1) {
                    $("#beans-input").val("0");
                    $("#addCourseBeans").html("免费");
                } else if (data.free == 2) {
                    $("#beans-input").val(data.wisdombean);
                    $("#addCourseBeans").html(data.wisdombean + "智慧豆");
                }
                $(".submit-cancel").show();
                $(".upCover").hide();
                $(".lesson-cover-btn").html("确认上传");
                //修改时渲染页面
                var voiceUrl = data.coursevoice;
                var albumId = data.albumid;
                Rendering(voiceUrl, albumId);
                $("#addCouse").click(function () {
                    allClick();
                    changeCourse(cId, albumId);
                });
            } else {
                flowerTips(res.msg, 1);
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}

// 开始
function Rendering(voiceUrl) {
    $("#lessonAudio").attr("src", voiceUrl); //音频地址
    $("#addLessonName").hide(); //课程名称
    $("#addLessonIntroduct").hide(); //课程介绍
    $("#addLessonCover").hide(); //课程封面
    $("#addLessonText").hide(); //课程文字
    $("#adLessonBeans").hide(); //课程所需智慧豆
    // 设置课程名称
    $("#addCourseName").click(function () {
        allClick();
        $("#addCourseContent").hide();
        $("#addLessonName").show();
        $("#addNameContent").focus(function () {
            $(".editCompleted").show();
            $(".editCompleted").click(function () {
                allClick();
                var courseName = $.trim($("#addNameContent").val());
                $(".editCompleted").hide();
                $("#addCourseContent").show();
                $("#addLessonName").hide();
                if (courseName != "") {
                    $("#addCourseName").html(courseName);
                }
            });
        });
        // 返回
        $("#courseNameBack").click(function () {
            allClick();
            $(".editCompleted").hide();
            $("#addCourseContent").show();
            $("#addLessonName").hide();
        });
    });
    // 设置课程简介
    $("#addCourseIntroduct").click(function () {
        var startInner = contentEditor.txt.html(); //进入编辑器获取一次内容
        allClick();
        $("#addCourseContent").hide();
        $("#addLessonIntroduct").show();
        $(".editOver").click(function () {
            allClick();
            var coursetext = contentEditor.txt.html(); //获取编辑器的内容
            contentEditor.txt.html(coursetext);
            $(".editBtn").hide();
            $("#addCourseContent").show();
            $("#addLessonIntroduct").hide();
            if (coursetext != "<p><br></p>") {
                $("#addCourseIntroduct").html("已输入");
            }
        });
        // 返回
        $("#courseItrBack").click(function () {
            allClick();
            contentEditor.txt.html(startInner);
            $(".editBtn").hide();
            $("#addCourseContent").show();
            $("#addLessonIntroduct").hide();
        });
    });
    // 上传封面
    $("#addCourseCover").click(function () {
        allClick();
        var upImg = $(".lesson-cover-content>img").attr("src");
        if (upImg) {
            $("#addCourseContent").hide();
            $("#addLessonCover").show();
            $(".submit-cancel").show();
            $(".upCover").hide();
            $("#addLessonBtn").html("确定上传");
            courseUpload();
            // 返回
            $("#courseCoverBack").click(function () {
                allClick();
                $("#addCourseContent").show();
                $("#addLessonCover").hide();
                var textShow = $(".lesson-cover-content>img").attr("src");
                if (textShow) {
                    $("#addCourseCover").html("已上传");
                } else {
                    $("#addCourseCover").html("请上传课程封面");
                }
            });
        } else {
            $("#regVavatar-shade").show();
            // 返回
            $(".avatar_btn").click(function () {
                $("#regVavatar-shade").hide();
            });
        }

    });
    // 课程文字
    $("#addCourseText").click(function () {
        var startText = textEditor.txt.html(); //进入编辑器获取一次内容
        allClick();
        $("#addCourseContent").hide();
        $("#addLessonText").show();
        $(".editOver").click(function () {
            allClick();
            var textContent = textEditor.txt.html();
            textEditor.txt.html(textContent);
            $(".editBtn").hide();
            $("#addCourseContent").show();
            $("#addLessonText").hide();
            if (textContent != "<p><br></p>") {
                $("#addCourseText").html("已输入");
            }
        });
        // 返回
        $("#courseTextBack").click(function () {
            allClick();
            textEditor.txt.html(startText);
            $(".editBtn").hide();
            $("#addCourseContent").show();
            $("#addLessonText").hide();
        });
    });
    //课程价格 智慧豆数
    $("#addCourseBeans").click(function () {
        allClick();
        $("#addCourseContent").hide();
        $("#adLessonBeans").show();
        // 勾选免费
        $(".free-container").click(function () {
            allClick();
            if ($("#freeChecked").hasClass("free-select-checked")) {
                $("#freeChecked").removeClass("free-select-checked");
            } else {
                $("#freeChecked").addClass("free-select-checked");
                $("#beans-input").val("0");
            }
        });
        $("#beans-input").on("input", function () {
            $("#freeChecked").removeClass("free-select-checked");
        });
        // 确定
        $("#beansBtn").click(function () {
            allClick();
            PlatreWardbeans();
            // 弹出框
            $(".beans-shade").show();
            window.setTimeout(() => {
                $(".beans-shade").hide();
                $("#addCourseContent").show();
                $("#adLessonBeans").hide();
                var beans = $("#beans-input").val();
                if ($("#freeChecked").hasClass("free-select-checked")) {
                    $("#addCourseBeans").html("免费");
                } else {
                    $("#addCourseBeans").html(beans + "智慧豆");
                }
            }, 2000); //延迟2s隐藏
        });
        // 返回
        $("#beanBack").click(function () {
            allClick();
            $("#addCourseContent").show();
            $("#adLessonBeans").hide();
        });
    });

}

// 拍照、相册
function getImg(e) {
    $(e).change(function () {
        var files = $(e)[0].files[0];
        var form = new FormData();
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
                    $("#regVavatar-shade").hide();
                    var url = res.data;
                    // console.log(url);
                    $(".lesson-cover-content>img").attr("src", url);
                    $("#addCourseCover").html("已上传");
                } else {
                    flowerTips(res.msg, 1);
                }
            },
            error: function (err) {
                console.log(err)
            }
        });
    });
}


// 上传封面
function courseUpload() {
    // 上传图片
    $(".upCover").change(function () {
        var files = $(".upCover")[0].files[0];
        upClover(files);
    });
    // 确认上传
    $("#addLessonBtn").unbind().bind("click", function () {
        allClick();
        // alert("上传成功~");
        $("#addCourseContent").show();
        $("#addLessonCover").hide();
        $("#addCourseCover").html("已上传");
    });
    // 确认上传x
    $(".submit-cancel").unbind().bind("click", function () {
        allClick();
        $(".lesson-cover-content").html("<img/>");
        $(".upCover,#importFile,#importPhoto").val("");
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
function addCourse(aId) {
    var voiceUrl = $("#lessonAudio").attr("src"); //获取音频路径
    var lessonTime = $("#audioTime").html(); // 获取音频时长
    var lessonName = $("#addNameContent").val(); // 课程名称
    var lessonIntroduct = contentEditor.txt.html(); //课程简介
    var lessonCover = $(".lesson-cover-content>img").attr("src"); //课程封面
    var lessonText = textEditor.txt.html(); //课程文字
    var IsFree; //课程是否免费
    if ($("#freeChecked").hasClass("free-select-checked")) {
        IsFree = 1;
    } else if (!$("#freeChecked").hasClass("free-select-checked")) {
        IsFree = 2;
    }
    var lessonBeans = $("#beans-input").val(); //课程智慧豆数
    // console.log(lessonBeans);
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/My/CourseAdd",
        data: {
            albumid: aId,
            coursevoice: voiceUrl,
            coursetime: lessonTime,
            coursename: lessonName,
            coursetxt: lessonIntroduct,
            courseimg: lessonCover,
            coursecontent: lessonText,
            free: IsFree,
            wisdombean: lessonBeans
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                flowerTips("新增成功~", 1);
                window.setTimeout(() => {
                    $(window).attr("location", "./album-detail.html?aid=" + aId);
                }, 1000);
            } else {
                flowerTips(res.msg, 1);
            }
        },
        error: function (err) {
            console.log(err)
        }
    });

}

// 修改课程
function changeCourse(cId, aId) {
    console.log(aId);
    var voiceUrl = $("#lessonAudio").attr("src"); //获取音频路径
    var lessonTime = $("#audioTime").html(); // 获取音频时长
    var lessonName = $("#addNameContent").val(); // 课程名称
    var lessonIntroduct = contentEditor.txt.html(); //课程简介
    var lessonCover = $(".lesson-cover-content>img").attr("src"); //课程封面
    var lessonText = textEditor.txt.html(); //课程文字
    var IsFree; //课程是否免费
    if ($("#freeChecked").hasClass("free-select-checked")) {
        IsFree = 1;
    } else if (!$("#freeChecked").hasClass("free-select-checked")) {
        IsFree = 2;
    }
    var lessonBeans = $("#beans-input").val(); //课程智慧豆数
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/My/CourseEdit",
        data: {
            courseid: cId,
            coursevoice: voiceUrl,
            coursetime: lessonTime,
            coursename: lessonName,
            coursetxt: lessonIntroduct,
            courseimg: lessonCover,
            coursecontent: lessonText,
            free: IsFree,
            wisdombean: lessonBeans
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                flowerTips("修改成功~", 1);
                window.setTimeout(() => {
                    $(window).attr("location", "./album-detail.html?aid=" + aId);
                }, 1000);
            } else {
                flowerTips(res.msg, 1);
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}

// 打赏 
function PlatreWardbeans() {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/PlatreWardbeans",
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                $(".beans-tips>.tip-text>span").text(res.data.platrewardbeans + "%");
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}

//课程文字、课程简介 上传图片
function upIMG(e,type) {
    var files = $(e)[0].files[0];
    console.log(files);
    var imgFile = new FormData()
    imgFile.append("picture", files)
    $.ajax({
        processData: false, //告诉jquery不要去处理发送的数据
        contentType: false, //告诉jquery不要去设置Content-Type请求头
        type: "POST",
        url: APP_URL + "/api/My/ImgUpload",
        data: imgFile,
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                var url = res.data;
                var imgurl = `
                        <img src="${url}" style="width:100%;" draggable="true"/>
                `;
                if(type==1){
                    contentEditor.txt.append(imgurl);
                }else if(type==2){
                    textEditor.txt.append(imgurl);
                }
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}