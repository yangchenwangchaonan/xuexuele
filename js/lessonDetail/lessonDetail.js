$(function () {
    var url = window.location.href;
    var arr = url.split("=");
    var lessonId = arr[1];
    //智慧社详情
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/WisdomDetail",
        data: {
            uid: 1,
            courseid: lessonId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var lock = data.lock;
            var identity = data.list.identity;
            if (lock == 2) {
                var str1 = `
                    <div class="locked-shade"></div>
                `;
                $(".action-bar").append(str1);
                $("#progressBar").addClass("progress-locked");
            }
            if (identity == 2) {
                $(".tutor-title").addClass("visitor-title");
                $(".tutor-title").html("侠客");
            }
            $("#headImg").attr("src", data.list.headimg);
            $(".useName").text(data.list.nickname);
            $("#lessonAppraise>span").text(data.list.coursescore);
            $("#lessonShare>p").text("23.5w");
            $("#lessonMessage>p").text(data.list.commentsum);
            $(".unsuccessed").text(data.list.coursetime);

            // 判断是否关注
            var followid = data.list.id;
            isAttention(followid);
        },
        error: function (err) {
            console.log(err);
        }
    });



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
    $(".lesson-tutor").click(function () {
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
function isAttention(followid) {
    alert(followid)
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/Follow",
        data: {
            uid: 1,
            followid: followid
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var code = res.data.code;
            if (code == 1) {
                $(".attention").html("已关注");
            } else if (code == 2) {
                $(".attention").html("未关注");
            }
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
                <li class="leave-message-content">
						<div class="avatar-message"></div>
						<div class="tourist-name">${val.uid}</div>
						<div class="leave-message-time">${val.create_time}</div>
						<p class="leave-message-detail">${val.content}</p>
                 `;
                if (replay != "") {
                    $str += `
                    <div class="reply-message-content">
							<div class="avatar-message"></div>
							<div class="tourist-name">${val.userinfo.nickname}</div>
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