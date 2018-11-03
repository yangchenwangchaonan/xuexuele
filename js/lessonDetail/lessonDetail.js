$(function () {
    start();
    //分享好友
    $("#lessonShare").click(function () {
        $("#shareShade").show();
        $("#shareShade").click(function () {
            $("#shareShade").hide();
        });
    });

});

function start() {
    var url = window.location.href;
    var arr = url.split("=");
    var lessonId = arr[1];
    var uId = sessionStorage.getItem("uid"); //用户id
    $("#audio").attr("data-ud", uId);
    $("#audio").attr("data-lsId", lessonId);
    //智慧社详情
    lessonDetail(uId, lessonId);
}

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
            var albumId = data.list.albumid;
            var identity = data.list.identity;
            var wisdombean = data.list.wisdombean;
            $("#lessonBackground").attr("src", data.list.courseimg); //课程背景
            $("#audio>h1").text(data.list.coursename); //课程名称
            $("#headImg").attr("src", data.list.headimg); //头像
            $(".useName").text(data.list.nickname); //姓名
            // 判断身份
            if (identity == 2) {
                $(".tutor-title").addClass("visitor-title");
                $(".tutor-title").html("侠客");
            }
            //导师id
            localStorage.setItem("commentid", data.list.id);

            // 判断是否关注
            var isfollow = data.isfollow;
            var followid = data.list.id;
            if (isfollow == 1) {
                $(".attention").html("已关注");
                $(".attention").click(function () {
                    noAttention(uId, followid, isfollow);
                });
            } else if (isfollow == 0) {
                $(".attention").html("关注");
                $(".attention").click(function () {
                    onAttention(uId, followid, isfollow);
                });
            }
            // 判断课程是否解锁
            if (lock == 1) {
                $(".lock-shade").css("display", "none");
            } else if (lock == 2) {
                $(".lock-shade").css("display", "block");
                $("#progressBarLock>span").html("x" + wisdombean);
                $("#progressBarLock").click(function () {
                    $(window).attr("location", "./unlock_some.html?lessonId=" + lessonId);
                });
            }
            // 判断是否可评分
            var $score = data.isscore;
            if ($score == 1) {
                var scoreNum = data.list.coursescore;
                $("#lessonAppraise>span").text(scoreNum);
                $("#lessonAppraise>p").text("已评分");
            } else if ($score == 0) {
                $("#lessonAppraise>p").text("可评分");
                $("#lessonAppraise").click(function () {
                    $("#appraiseShade").css("display", "block");
                    $.each($(".appraise-score>ul>li"), function (index, val) {
                        var num = index + 1;
                        var $class = "score-key" + num;
                        $(this).removeClass($class);
                        $(this).removeClass("checked");
                    });
                    //关闭
                    $(".appraise-close").click(function () {
                        $("#appraiseShade").css("display", "none");
                        $("#appraiseContent").css("display", "block");
                        $("#appraiseResult").css("display", "none");
                        // 渲染页面
                        start();
                    });
                });
            }

            $("#lessonMessage>p").text(data.list.commentsum); //留言
            $("#lessonAudio").attr("src", data.list.coursevoice); //获取音频
            $(".unsuccessed").text(data.list.coursetime); //音频时长

            // 导师详情
            tutorDetail(isfollow, followid);
            $(".lesson-tutor>ul").click(function () {
                $("#tutorShade").show();
                // 关闭窗口
                $(".tutor-close").click(function () {
                    $("#tutorShade").hide();
                    // start();
                });
            });
            // 课程留言
            $("#lessonMessage").click(function () {
                $("#messageShade").show();
                messageList(uId, lessonId);
                // 关闭窗口
                $(".leave-message-close").click(function () {
                    $("#messageShade").hide();
                    $(".message-btn").show();
                    $("#messageText1,#messageText2").hide();
                    $(".release-message").hide();
                });
            });
            // 所属专辑
            $("#albumName").click(function () {
                $(window).attr("location", "./album-name.html?albumId=" + albumId);
            });
            // 看文字
            var coursecontent = data.list.coursecontent;
            $("#lessonText").click(function () {
                $("#textShade").show();
                $(".lesson-text-inner>span").html(coursecontent);
                // 关闭窗口
                $(".lesson-close").click(function () {
                    $("#textShade").hide();
                });
            });

            // 课程介绍
            var coursetxt = data.list.coursetxt;
            var coursename = data.list.coursename;
            $("#lessonIntrouduct").click(function () {
                $("#introductShade").show();
                $(".lesson-introduction-inner>h1").html(coursename);
                $(".lesson-introduction-inner>span").html(coursetxt);
                // 关闭窗口
                $(".lesson-close").click(function () {
                    $("#introductShade").hide();
                });
            });

            // 课程举报
            $("#lessonReport").click(function () {
                $(".report-tab>ul>li>.report-option").removeClass("report-option1");
                $("#reportShade").show();
                $(".report-tab>ul>li").click(function () {
                    $(this).children().addClass("report-option1");
                    $(this).siblings().children().removeClass("report-option1");
                    var num = $(this).children().attr("data-num");
                    regular(uId, lessonId, num);
                });
                // 关闭窗口
                $(".report-btn").click(function () {
                    $("#reportShade").hide();
                });
            });

        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 评分
function changeAppraise(e, appraise) {
    var $uId = $("#audio").attr("data-ud");
    var $lessonId = $("#audio").attr("data-lsId");
    $.each($(".appraise-score>ul>li"), function (index, val) {
        var num = index + 1;
        var $class = "score-key" + num;
        $(this).removeClass($class);
    });
    $(e).addClass(appraise);
    var score;
    if ($(e).index() == 0) {
        score = 3;
    } else if ($(e).index() == 1) {
        score = 5;
    } else if ($(e).index() == 2) {
        score = 7;
    } else if ($(e).index() == 3) {
        score = 10;
    }
    $(".appraise-confirm").click(function () {
        // alert(score);
        var beans = $(".beanInput").val();
        if (beans == "") {
            beans = 0;
        }
        //提交评分
        $.ajax({
            type: "POST",
            url: APP_URL + "/api/Wisdom/ScoreDo",
            data: {
                uid: $uId,
                courseid: $lessonId,
                coursescore: score,
                wisdombean: beans
            },
            dataType: "json",
            success: function (res) {
                console.log(res);
                if (res.code == 1) {
                    var $score = res.data.average;
                    $("#appraiseContent").css("display", "none");
                    $("#appraiseResult").css("display", "block");
                    $("#scoreRes").text(score + "分");
                    $("#lessonAppraise>span").attr("data-score", $score);
                    scoreSum($uId, $lessonId);
                    beanSum($lessonId);
                } else {
                    alert(res.msg);
                    // flowerTips(res.msg, 1)
                }

            },
            error: function (err) {
                console.log(err);
            }
        });
    });
}
// 课程总打赏智慧豆数量
function beanSum($lessonId) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/ScoreWisdombeanSum",
        data: {
            courseid: $lessonId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            $("#beanSum").text("x" + res.data);
        },
        error: function (err) {
            console.log(err);
        }
    });
}
//各级评分数量
function scoreSum($uId, $lessonId) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/ScoreList",
        data: {
            uid: $uId,
            courseid: $lessonId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var list = $(".score-detail>li");
            $.each(res.data, function (index, val) {
                $.each(list, function (i, v) {
                    if (i == index) {
                        $(this).children("span").text(":" + val.sum);
                    }
                });
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 导师详情
function tutorDetail(isfollow, followid) {
    var toturId = localStorage.getItem("commentid");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/TutorDetail",
        data: {
            id: toturId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var userId = sessionStorage.getItem("uid");
            var introduction = data.introduction
            $("#headBg").attr("src", data.headimg);
            $(".tutor-avatar>p").html(data.nickname);
            //判断是否关注
            if (isfollow == 1) {
                $("#followShow").html("已关注");
                $("#followShow").click(function () {
                    noAttention(userId, followid, isfollow);
                });
            } else if (isfollow == 0) {
                $("#followShow").html("关注");
                $("#followShow").click(function () {
                    onAttention(userId, followid, isfollow);
                });
            }
            // 导师简介
            if (introduction == "" || introduction == null || introduction == undefined) {
                $("p.lesson-tutorInfor").html("暂无简介");
            } else {
                $(".infor-read").show();
                $(".infor-close").hide();
                var textLen = introduction.length;
                if (textLen > 43) {
                    var num = introduction.substring(0, 43);
                    $("p.lesson-tutorInfor").html(num + "...");
                } else {
                    $("p.lesson-tutorInfor").html(introduction);
                }
            }
            $(".infor-read").click(function () {
                $("p.lesson-tutorInfor").html(introduction);
                $(".infor-read").hide();
                $(".infor-close").show();
            });
            $(".infor-close").click(function () {
                $("p.lesson-tutorInfor").html(num + "...");
                $(".infor-read").show();
                $(".infor-close").hide();
            });
            //专辑列表
            var str = "";
            var albumlist = data.albumlist;
            $.each(albumlist, function (index, val) {
                str += `
                    <li data-id="${val.id}">
                        <div class="album-name"><img src="${val.albumimg}"/></div>
                        <p>${val.albumname}</p>
                    </li>
                `;
            });
            $("#albumList").html(str);
            $("#albumList>li").click(function () {
                var albumId = $(this).attr("data-id");
                $(window).attr("location", "./album-name.html?albumId=" + albumId);
            });
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
            if (res.code == 1) {
                start();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}
//取消关注
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
            if (res.code == 1) {
                start();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 获取课程留言列表
function messageList(uId, lessonId) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/CommentList",
        data: {
            courseid: lessonId,
            page: 1
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var $str = "";
            $(".leave-message-title>span").html(data.length);
            var tImg = $("#headImg").attr("src");
            var tnickName = $("#nickName").html();
            $.each(data, function (index, val) {
                var replay = val.reply;
                $str += `
                <li>
                    <div class="leave-content" data-id="${val.id}">
                        <div class="avatar-message"><img src="${val.userinfo.headimg}"/></div>
                        <span class="tourist-name">${val.userinfo.nickname}</span>
                        <span class="leave-message-time">${val.create_time}</span>
                        <p class="leave-message-detail">${val.content}</p>
                    </div>
                 `;
                if (replay != "") {
                    $str += `
                    <div class="reply-content">
                        <div class="avatar-message"><img src="${tImg}"/></div>
                        <span class="tourist-name">${tnickName}</span>
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
            $(".message-content").html($str);
            $(".message-btn").click(function () {
                var tId = localStorage.getItem("commentid"); //导师id
                if (uId == tId) {
                    flowerTips("导师不可以评论自己哦~", 1);
                    return;
                }
                $(".message-btn").hide();
                $("#messageText1").show();
                $(".release-message").show();
                $("#messageText1").focus();
                /*字数限制*/
                $("#messageText1").on("input propertychange", function () {
                    var $this = $(this),
                        _val = $this.val(),
                        count = "";
                    if (_val.length > 100) {
                        $this.val(_val.substring(0, 100));
                    }
                });
                $(".release-message").click(function () {
                    $text1 = $("#messageText1").val();
                    if ($text1 == "") {
                        flowerTips("请先输入留言内容~", 1);
                    } else {
                        commentRelease(uId, lessonId, $text1); //发表课程留言
                    }
                });
            });
            $(".leave-content").click(function () {
                var pId = $(this).attr("data-id"); //评论列表的id(父id)
                var tId = localStorage.getItem("commentid"); //导师id
                if (uId != tId) {
                    flowerTips("只有导师可以回复哦~", 1);
                    return;
                }
                $(".message-btn").hide();
                $("#messageText2").show();
                $(".release-message").show();
                $("#messageText2").focus();
                /*字数限制*/
                $("#messageText2").on("input propertychange", function () {
                    var $this = $(this),
                        _val = $this.val(),
                        count = "";
                    if (_val.length > 100) {
                        $this.val(_val.substring(0, 100));
                    }
                });
                $(".release-message").click(function () {
                    var $text2 = $("#messageText2").val();
                    if ($text2 == "") {
                        flowerTips("请先输入留言内容~", 1);
                    } else {
                        commentReply(pId, lessonId, $text2, uId); //回复留言
                    }
                });
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
}


// 发布课程留言
function commentRelease(uId, lessonId, $text) {
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/Wisdom/CommentRelease",
        data: {
            uid: uId,
            courseid: lessonId,
            content: $text
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            $(".message-btn").show();
            $("#messageText1").hide();
            $(".release-message").hide();
            messageList(uId, lessonId);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 回复留言
function commentReply(pId, lessonId, $text, uId) {
    console.log(pId);
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/Wisdom/CommentReply",
        data: {
            commentid: pId,
            uid: uId,
            courseid: lessonId,
            content: $text
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            $(".message-btn").show();
            $("#messageText2").hide();
            $(".release-message").hide();
            messageList(uId, lessonId);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 举报
function regular(uId, lessonId, num) {
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/Wisdom/Regular",
        data: {
            uid: uId,
            courseid: lessonId,
            classify: num
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                flowerTips("已举报~", 1);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}