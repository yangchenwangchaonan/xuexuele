$(function () {
    var url = window.location.href;
    var aId = url.split("=")[1];
    albumDetail(aId); //专辑详情
    //录音
    $(".lesson-recording1").click(function () {
        allClick();
        $(this).addClass("lesson-recording2").siblings().removeClass("lesson-upload2");
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isiOS) {
            alert("该机型不支持录音功能");
        } else {
            $(window).attr("location", "./lesson-recording.html?aid=" + aId);
        }
    });
    // 上传
    $(".lesson-upload1").click(function () {
        allClick();
        $(this).addClass("lesson-upload2").siblings().removeClass("lesson-recording2");
    });
    // 上传音频
    $(".lesson-record").change(function () {
        var files = $(".lesson-record")[0].files[0];
        // console.log(files);
        uploadAudio(files, aId);
    });

    // 返回
    $("#albumDetailBack").click(function () {
        $(window).attr("location", "./album-manage.html");
    });

});

// 专辑详情
function albumDetail(id) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/My/AlbumDetail",
        data: {
            albumid: id
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            $(".album-top>img").attr("src", data.albumimg);
            $(".album-text").text(data.albumname);
            $(".album-detail").text(data.albumcontent);
            if (data.courselist.length == 0) {
                $(".noLesson-content").show();
                $("#addLesson2").hide();
                $(".lesson-title-list").html("");
            } else {
                var str = "";
                $.each(data.courselist, function (index, val) {
                    str += `
                     <div class="lesson-title" data-cId="${val.id}" data-aid="${val.albumid}">
                        <div class="list-num">${index+1}</div>
                        <div class="lesson-list-detail">
                            <div class="lessonDetail">
                                <div class="lesson-list-title">
                                    <div class="lesson-list-name">${val.coursename}</div>
                                </div>
                                <div class="lesson-list-tab">
                                    <ul>
                                        <li><img src="../../images/161.png" /><span>${val.coursescore}</span></li>
                                        <li><img src="../../images/162.png" /><span>${val.coursetime}</span></li>
                                        <li><img src="../../images/163.png" /><span>${val.commentsum}</span></li>
                                    </ul>
                                </div>
                            </div>    
                            <div class="lesson-operate">操作</div>
                            <div class="lessonOperate-option">
                                <div class="operate-del"><img src="../../images/227.png" />删除</div>
                                <div class="operate-edit"><img src="../../images/228.png" />编辑</div>
                            </div>
                        </div>
                     </div>
                     `;
                });
                $(".lesson-title-list").html(str);
            }
            // 新增课程
            $("#addLesson1,#noLesson,#addLesson2").click(function () {
                allClick();
                $(".lesson-shade").show();
                //关闭
                $(".lesson-add-close").click(function () {
                    allClick();
                    $(".lesson-shade").hide();
                    $(".lesson-recording1").removeClass("lesson-recording2");
                    $(".lesson-upload1").removeClass("lesson-upload2");
                });
            });
            // 操作
            var flag = true;
            $(".lesson-operate").click(function () {
                allClick();
                var cId = $(this).parents(".lesson-title").attr("data-cId");
                var aId = $(this).parents(".lesson-title").attr("data-aId");
                $(this).parents(".lesson-title").find(".lessonOperate-option").show();
                $(this).parents(".lesson-title").siblings().find(".lessonOperate-option").hide();
                if (flag) {
                    $(this).parents(".lesson-title").find(".lessonOperate-option").show();
                    $(this).parents(".lesson-title").siblings().find(".lessonOperate-option").hide();
                    flag = false;
                    // 课程删除
                    $(".operate-del").click(function () {
                        allClick();
                        $(this).parents(".lessonOperate-option").hide();
                        courseDel(cId, aId);
                    });
                    // 课程编辑
                    $(".operate-edit").click(function () {
                        $(window).attr("location", "./addLesson-detail.html?cId=" + cId);
                    });
                } else {
                    $(this).parents(".lesson-title").find(".lessonOperate-option").hide();
                    flag = true;
                }
            });

            // 课程详情
            $(".lessonDetail").click(function () {
                allClick();
                var cId = $(this).parents(".lesson-title").attr("data-cId");
                $(window).attr("location", "./course-detail.html?cId=" + cId);
            });
        },
        error: function (err) {
            console.log(err)
        }
    });
}

// 上传音频
function uploadAudio(files, aId) {
    console.log(files);
    var ext=files.name.lastIndexOf('.');
    var name=files.name.substring(ext, files.name.length).toUpperCase();
    console.log(name);
    if (name == '.PNG' || name == '.JPG' || name == '.JPEG' || name == '.GIF'){
        flowerTips("请上传正确的音频格式~", 2);
        return;
    }
    var formdata = new FormData()
    formdata.append("voicefile", files)
    $.ajax({
        processData: false, //告诉jquery不要去处理发送的数据
        contentType: false, //告诉jquery不要去设置Content-Type请求头
        type: "POST",
        url: APP_URL + "/api/My/VoiceUpload",
        data: formdata,
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                var voiceUrl = res.data;
                // console.log(voiceUrl);
                $(window).attr("location", "./addLesson-detail.html?voiceUrl=" + voiceUrl + "&aid=" + aId);
            } else {
                flowerTips(res.msg, 1);
                // alert(res.msg);
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}

// 删除课程
function courseDel(cId, aId) {
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/My/CourseDelete",
        data: {
            _method: "DELETE",
            courseid: cId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                $("#delTips").show();
                window.setTimeout(() => {
                    $("#delTips").hide();
                    albumDetail(aId)
                }, 2000); //延迟2s隐藏
            } else {
                flowerTips("未删除成功~", 1);
                // alert("未删除成功~");
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}