$(function () {
    var url = window.location.href;
    var arr = url.split("=");
    var lessonId = arr[1];
    var uId = 1; //用户id
    //智慧社详情
    lessonDetail(uId, lessonId);

    //可评分
    $("#lessonAppraise").click(function () {
        $("#appraiseShade").css("display", "block");
        //关闭评分窗口
        $(".appraise-close").click(function () {
            $("#appraiseShade").css("display", "none");
        });
    });
    //分享好友
    $("#lessonShare").click(function () {
        $("#shareShade").css("display", "block");
        $("#shareShade").click(function () {
            $("#shareShade").css("display", "none");
        });
    });

    // 课程留言
    $("#lessonMessage").click(function () {
        $("#messageShade").css("display", "block");
        messageList();

        // 关闭窗口
        $(".leave-message-close").click(function () {
            $("#messageShade").css("display", "none");
        });
    });

    // 导师详情
    $(".lesson-tutor>ul").click(function () {
        $("#tutorShade").css("display", "block");


        // 关闭窗口
        $(".tutor-close").click(function () {
            $("#tutorShade").css("display", "none");
        });
    });

    // 所属专辑
    $("#albumName").click(function () {
        $(window).attr("location", "./album-name.html");
    });

    // 看文字
    $("#lessonText").click(function () {
        $("#textShade").css("display", "block");

        // 关闭窗口
        $(".lesson-close").click(function () {
            $("#textShade").css("display", "none");
        });
    });

    // 课程介绍
    $("#lessonIntrouduct").click(function () {
        $("#introductShade").css("display", "block");
        // 关闭窗口
        $(".lesson-close").click(function () {
            $("#introductShade").css("display", "none");
        });
    });

    // 课程举报
    $("#lessonReport").click(function () {
        $("#reportShade").css("display", "block");
        // 关闭窗口
        $(".report-btn").click(function () {
            $("#reportShade").css("display", "none");
        });
    });


});

// 智慧社详情
function lessonDetail(uId, lessonId) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/WisdomDetail",
        data: {
            uid: uId,
            courseid: lessonId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var lock = data.lock;
            var identity = data.list.identity;
            var wisdombean = data.list.wisdombean;
            if (lock == 1) {
                $(".lock-shade").css("display", "none");
            } else if (lock == 2) {
                $(".lock-shade").css("display", "block");
                $(".lock-shade").click(function () {
                    $(window).attr("location", "./unlock_series.html?uid=" + uId + "&lessonId=" + lessonId + "&wisdombean=" + wisdombean);
                });
            }
            if (identity == 2) {
                $(".tutor-title").addClass("visitor-title");
                $(".tutor-title").html("侠客");
            }
            $("#audio>h1").text(data.list.coursename);
            $("#headImg").attr("src", data.list.headimg);
            $(".useName").text(data.list.nickname);
            $("#lessonAppraise>span").text(data.list.coursescore);
            $("#lessonMessage>p").text(data.list.commentsum);
            $(".unsuccessed").text(data.list.coursetime);
            $("#lessonBackground").attr("src", data.list.courseimg);
            // 判断是否关注
            var followid = data.list.id;
            isAttention(uId, followid);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 评分
function changeAppraise(e, appraise) {
    $.each($(".appraise-score>ul>li"), function (index, val) {
        var num = index + 1;
        var $class = "score-key" + num;
        $(this).removeClass($class);
    });
    $(e).addClass(appraise);
}

// 是否被关注
function isAttention(uId, followid) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/Follow",
        data: {
            uid: uId,
            followid: followid
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var code = res.code;
            if (code == 1) {
                $(".attention").text("已关注");
                $(".attention").click(function () {
                    noAttention(uId, followid)
                });
            } else {
                $(".attention").text("关注");
                $(".attention").click(function () {
                    onAttention(uId, followid)
                });
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}
//点击关注
function onAttention(uId, followid) {
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/Wisdom/FollowSpot",
        data: {
            uid: uId,
            followid: followid
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            $(".attention").html("关注");
            window.location.reload();
        },
        error: function (err) {
            console.log(err);
        }
    });
}
//点击取消关注
function noAttention(uId, followid) {
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/Wisdom/FollowNot",
        data: {
            uid: uId,
            followid: followid
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            $(".attention").html("已关注");
            window.location.reload();
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 获取课程留言列表
function messageList() {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/CommentList",
        data: {
            courseid: 1,
            page: 1
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var $str = "";
            $(".leave-message-title>span").html(data.length);
            $.each(data, function (index, val) {
                var replay = val.reply;
                $str += `
                <li>
                    <div class="leave-content">
                        <div class="avatar-message"></div>
                        <span class="tourist-name">${val.uid}</span>
                        <span class="leave-message-time">${val.create_time}</span>
                        <p class="leave-message-detail">${val.content}</p>
                    </div>
                 `;
                if (replay != "") {
                    $str += `
                    <div class="reply-content">
                        <div class="avatar-message"></div>
                        <span class="tourist-name">${val.userinfo.nickname}</span>
                        <p class="reply-message-detail">${val.reply}</p>
                    </div>
				</li>
                    `;
                } else {
                    $str += `
                </li>
                    `;
                }
            });
            $(".message-content").append($str);
        },
        error: function (err) {
            console.log(err);
        }
    });
}