$(function () {
    var url = window.location.href;
    var courseId = url.split("=")[1];
    courseDetail(courseId); //课程信息
    courseMessage(1, courseId, 0); //留言信息
    // 课程信息
    $("#lessonInfor").click(function () {
        allClick();
        $(this).addClass("lesson-tabs-checked");
        $(this).siblings(".lesson-tabs").removeClass("lesson-tabs-checked");
        // courseDetail(courseId);
        $(".lesson-tabs-list").show();
        $(".message-list-content").hide();
    });
    // 留言信息
    $("#lessonMessage").click(function () {
        allClick();
        $(this).addClass("lesson-tabs-checked");
        $(this).siblings(".lesson-tabs").removeClass("lesson-tabs-checked");
        // courseMessage(courseId);
        $(".lesson-tabs-list").hide();
        $(".message-list-content").show();
    });

    // 返回
    $("#courseDetailBack").click(function () {
        history.back(-1);
    });
});

// 课程详情
function courseDetail(courseId) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/My/CourseDetail",
        data: {
            courseid: courseId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            $("#lessonAudio").attr("src", data.coursevoice); //音频路径
            $("#audioTime").html(data.coursetime); //音频时长
            $("#lessonName").html(data.coursename); //课程名字
            $("#lessonScore").html(data.coursescore); //课程评分
            $("#lessonPrice").html(data.wisdombean); //课程价格
            $("#lessonOutline").html(data.coursetxt); //课程简介
            if($("#lessonOutline>.textImg")){
                console.log();
                $.each($("#lessonOutline .img-cancel"), function () { 
                     $(this).remove();
                });
            }
            $("#getBeans").html(data.buysum); //获得智慧豆数
            $("#scoreDetail1").html("x" + data.scores[0].sum);
            $("#scoreDetail2").html("x" + data.scores[1].sum);
            $("#scoreDetail3").html("x" + data.scores[2].sum);
            $("#scoreDetail4").html("x" + data.scores[3].sum);
        },
        error: function (err) {
            console.log(err)
        }
    });
}

// 课程留言详情
function courseMessage(pageIndex, courseId, type) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/CommentList",
        data: {
            courseid: courseId,
            page: pageIndex
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            if (pageIndex == 1 && data.list.length == 0) {
                $(".noMessage").show();
            }
            var str = "";
            $.each(data.list, function (index, val) {
                str += `
                    <li>
                        <div class="leave-content" data-cmid="${val.id}" data-cid="${val.courseid}">
                            <div class="avatar-message"><img src="${val.userinfo.headimg}"/></div>
                            <span class="tourist-name">${val.userinfo.nickname}</span>
                            <span class="leave-message-time">${val.create_time}</span>
                            <p class="leave-message-detail">${val.content}</p>
                            ${val.reply == ""?`
                            <div class="message-reply">回复</div>
                            `:""}
                        </div>
                    </li>
                  `;
            });
            if (type == 0) {
                $(".message-list").html(str);
            } else {
                $(".message-list").append(str);
            }
            $(".message-reply").unbind("click").bind("click", function () {
                allClick();
                var $name = $(this).parent().find(".tourist-name").html();
                var commentId = $(this).parent().attr("data-cmid");
                var courseId = $(this).parent().attr("data-cid");
                replyMessage(this, $name, commentId, courseId)
            });
            // 触底刷新
            var nDivHight = $(".message-list-content").height();
            $(".message-list-content").unbind('scroll').bind('scroll', function () {
                // console.log(pageIndex);
                var nScrollHight = $(this)[0].scrollHeight;
                var nScrollTop = $(this)[0].scrollTop;
                if (nScrollTop + nDivHight >= nScrollHight) {
                    var mPage = pageIndex;
                    mPage++;
                    courseMessage(mPage, courseId);
                }
            });
            // 清除触底刷新
            if (data.list.length != 10 || data.list.length == 0) {
                $(".message-list-content").unbind('scroll');
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}

// 回复留言
function replyMessage(e, name, commentId, courseId) {
    $(e).hide();
    $(".replayInner").show();
    $("#messageReply").attr("placeholder", "回复:" + name);
    $("#messageReply").focus();
    $("#replayBtn").click(function () {
        allClick();
        var text = $("#messageReply").val();
        $(".replayInner").hide();
        if (text == "") {
            flowerTips("回复内容不能为空~", 1);
            $(e).show(); //回复按钮
            return;
        }
        reply(commentId, courseId, text);
    });
    // 失去焦点隐藏文本框
    // $("#messageReply").blur(function () {
    //     $(".replayInner").hide();
    // });
}

// 回复
function reply(commentId, courseId, text) {
    console.log(courseId);
    var uId = localStorage.getItem("uid");
    var token = localStorage.getItem("token");
    console.log(text);
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/Wisdom/CommentReply",
        data: {
            commentid: commentId,
            uid: uId,
            token: token,
            courseid: courseId,
            content: text
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                flowerTips("回复成功~", 1);
                courseMessage(1, courseId, 0);
            } else if (res.code == 10000) {
                repeatLogin();
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}