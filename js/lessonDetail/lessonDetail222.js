$(function () {
    var url = window.location.href;
    var arr = url.split("&");
    var lessonId = arr[0].split("=")[1];
    var sortId = arr[1].split("=")[1]
    var uId = sessionStorage.getItem("uid"); //用户id
    //智慧社详情
    lessonDetail(uId, lessonId, sortId, 1, 0);
    // 返回
    $("#lessonDetailBack").click(function () {
        history.back(-1);
    });
});

// 智慧社详情
function lessonDetail(uId, lessonId, sortId, bannerSort, pageIndex) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/WisdomDetail",
        data: {
            uid: uId,
            courseid: lessonId,
            sort: sortId,
            bannersort: bannerSort
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var str1 = "";
            str1 += `
                <img src="${data.list.courseimg}"/>
                <div class="audio" data-ud="${uId}" data-lsId="${lessonId}">
                    <h1>${data.list.coursename}</h1>
                    <div class="lesson-tutor">
                        <ul onclick="lessonTutor('${data.isfollow}','${data.list.id}')">
                            <li>
                                <div class="head-imgBg">
                                    <img src="${data.list.headimg}"/>
                                </div>
                                ${data.list.identity == 2?`<div class="tutor-title visitor-title">游侠</div>`:
                                `<div class="tutor-title">导师</div>`
                                }
                            </li>
                            <li class="useName">${data.list.nickname}</li>
                        </ul>
                        ${data.isfollow == 1?`<div class="attention" onclik="noAttention('${uId}','${data.list.id}')">已关注</div>`:
                        `<div class="attention" onclik="onAttention('${uId}','${data.list.id}')">关注</div>`}
                    </div>
                    <div class="action-bar">
                        ${data.isscore == 1?`<ul><img src="../../images/138.png" /><span>${data.list.coursescore}</span><p>已评分</p></ul>`:
                        `<ul onclick="lessonAppraise()"><img src="../../images/138.png" /><span></span><p>可评分</p></ul>`}
                        <ul onclick="lessonShare()"><img src="../../images/139.png" /></ul>
                        <ul onclick="lessonMessage('${uId}','${lessonId}','${data.list.headimg}','${data.list.nickname}')"><img src="../../images/140.png" /><p>${data.list.commentsum}</p></ul>
                        <ul onclick="albumName('${data.list.albumid}')"><img src="../../images/141.png" /><p>所属专辑</p></ul>
                        <ul onclick="lessonText('${data.list.coursecontent}')"><img src="../../images/142.png" /><p>看文字</p></ul>
                        <ul onclick="lessonIntrouduct('${data.list.coursetxt}','${data.list.coursename}')"><img src="../../images/143.png" /><p>课程介绍</p></ul>
                        <ul onclick="lessonReport('${uId}', '${lessonId}')"><img src="../../images/144.png" /><p>举报</p></ul>
                    </div>
                    <div class="audio-content">
                        <audio id="lessonAudio" src="${data.list.coursevoice}"></audio>
                        <div class="progressBar">
                            <div class="progressReal"></div>
                            <i class="progressKey"></i>
                        </div>
                        <span class="successed">00:00</span>
                        <span class="unsuccessed" id="audioTime">${data.list.coursetime}</span>
                        <div class="progress-stop" id="progressBar"></div>
                    </div>
                </div>
                `;
            $("section").eq(pageIndex).html(str1);
            var banner = data.banner;
            var lastId = data.lastid;
            var nextId = data.nextid;
            // 滑动事件
            slidingEvent(uId, sortId, bannerSort, banner, lastId, nextId);
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
                flowerTips("关注导师成功 ", 1)
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
                flowerTips("已取消关注", 1)
                start();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 评分
function lessonAppraise() {
    $("#appraiseShade").css("display", "block");
    $.each($(".appraise-score>ul>li"), function (index, val) {
        var num = index + 1;
        var $class = "score-key" + num;
        $(this).removeClass($class);
        $(this).removeClass("checked");
    });
    //关闭
    $(".appraise-close").unbind('click').bind('click', function () {
        $("#appraiseShade").css("display", "none");
        $("#appraiseContent").css("display", "block");
        $("#appraiseResult").css("display", "none");
        start(); // 渲染页面
    });
}

// 评分
function changeAppraise(e, appraise) {
    var $uId = $(".audio").attr("data-ud");
    var $lessonId = $(".audio").attr("data-lsId");
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


//分享
function lessonShare() {
    $("#shareShade").show();
    $("#shareShade").click(function () {
        $("#shareShade").hide();
    });
}

//留言
function lessonMessage(uId, lessonId, headimg, nickname) {
    $("#messageShade").show();
    messageList(1, uId, lessonId, 1, headimg, nickname);
    // 关闭窗口
    $(".leave-message-close").click(function () {
        $("#messageShade").hide();
        $(".message-btn").show();
        $(".releaseContent").hide();
        $(".replayContent").hide();
    });
}
// 获取课程留言列表
function messageList(pageIndex, uId, lessonId, transferId, headimg, nickname) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/CommentList",
        data: {
            courseid: lessonId,
            page: pageIndex
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var $str = "";
            $(".leave-message-title>span").html(data.commentcount);
            $.each(data.list, function (index, val) {
                var replay = val.reply;
                $str += `   
                <li>
                    <div class="leave-content" data-id="${val.id}">
                        <div class="avatar-message"><img src="${val.userinfo.headimg}"/></div>
                        <span class="tourist-name">${val.userinfo.nickname}</span>
                        <span class="leave-message-time">${val.create_time}</span>
                        <p class="leave-message-detail">${val.content}</p>
                    </div>
                    ${replay == ""?"":`
                    <div class="reply-content">
                        <div class="avatar-message"><img src="${headimg}"/></div>
                        <span class="tourist-name">${nickname}</span>
                        <p class="reply-message-detail">${val.reply}</p>
                    </div>
                    `}
                </li>
                 `;
            });
            if (transferId == 1) {
                $("#msgContent>ul").html($str);
            } else if (transferId == 2) {
                $("#msgContent>ul").append($str);
            }
            // 发表留言
            $(".message-btn").click(function () {
                var tId = localStorage.getItem("commentid"); //导师id
                if (uId != tId) {
                    $(".releaseContent").show();
                    $(".message-btn").hide();
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
                    // 点击发布
                    $("#releaseBtn").unbind('click').bind('click', function () {
                        $text1 = $("#messageText1").val();
                        if ($text1 != "") {
                            console.log(1);
                            commentRelease(uId, lessonId, $text1); //发表课程留言
                        } else {
                            flowerTips("请先输入留言内容~", 1);
                        }
                    });
                } else {
                    flowerTips("导师不可以评论自己哦~", 1);
                }
            });
            // 回复
            $(".leave-content").click(function () {
                var pId = $(this).attr("data-id"); //评论列表的id(父id)
                var tId = localStorage.getItem("commentid"); //导师id
                if (uId == tId) {
                    $(".message-btn").hide();
                    $(".replayContent").show();
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
                    // 点击回复
                    $("#replayBtn").unbind('click').bind('click', function () {
                        var $text2 = $("#messageText2").val();
                        if ($text2 != "") {
                            console.log(2)
                            commentReply(pId, lessonId, $text2, uId); //回复留言
                        } else {
                            flowerTips("请先输入留言内容~", 1);
                        }
                    });
                } else {
                    flowerTips("只有导师可以回复哦~", 1);
                }
            });
            // 触底刷新
            var nDivHight = $("#msgContent").height();
            // console.log(nDivHight);
            $("#msgContent").unbind().bind("scroll", function () {
                var nScrollHight = $(this)[0].scrollHeight;
                var nScrollTop = $(this)[0].scrollTop;
                if (nScrollTop + nDivHight >= nScrollHight) {
                    var mPage = pageIndex;
                    mPage++;
                    // console.log(mPage);
                    messageList(mPage, uId, lessonId, 2, headimg, nickname);
                }
            });
            // 清除触底刷新
            if (data.list.length != 10 || data.list.length == 0) {
                $("#msgContent").unbind('scroll');
            }
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
            if (res.code == 1) {
                $(".message-btn").show();
                $(".releaseContent").hide();
                messageList(1, uId, lessonId, 1);
            }
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
            if (res.code == 1) {
                $(".message-btn").show();
                $(".replayContent").hide();
                messageList(1, uId, lessonId, 1);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

//所属专辑
function albumName(albumId) {
    $(window).attr("location", "./album-name.html?albumId=" + albumId);
}
// 看文字
function lessonText(coursecontent) {
    $("#textShade").show();
    $(".lesson-text-inner>span").html(coursecontent);
    // 关闭窗口
    $(".lesson-close").click(function () {
        $("#textShade").hide();
    });
}
// 课程介绍
function lessonIntrouduct(coursetxt, coursename) {
    $("#introductShade").show();
    $(".lesson-introduction-inner>h1").html(coursename);
    $(".lesson-introduction-inner>span").html(coursetxt);
    // 关闭窗口
    $(".lesson-close").click(function () {
        $("#introductShade").hide();
    });
}
// 课程举报
function lessonReport(uId, lessonId) {
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

// 点击导师
function lessonTutor(isfollow, followid) {
    tutorDetail(isfollow, followid);
    $("#tutorShade").show();
    // 关闭窗口
    $(".tutor-close").click(function () {
        $("#tutorShade").hide();
    });
}

// 导师详情
function tutorDetail(isfollow, followid) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/TutorDetail",
        data: {
            id: followid
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
                $("#followShow").unbind('click').bind('click', function () {
                    noAttention(userId, followid, isfollow);
                });
            } else if (isfollow == 0) {
                $("#followShow").html("关注");
                $("#followShow").unbind('click').bind('click', function () {
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
                if (textLen > 41) {
                    var num = introduction.substring(0, 41);
                    $("p.lesson-tutorInfor").html(num + "...");
                    //展开更多
                    $(".infor-read").click(function () {
                        $("p.lesson-tutorInfor").html(introduction);
                        $(".infor-read").hide();
                        $(".infor-close").show();
                    });
                    // 收起更多
                    $(".infor-close").click(function () {
                        $("p.lesson-tutorInfor").html(num + "...");
                        $(".infor-read").show();
                        $(".infor-close").hide();
                    });
                } else {
                    $("p.lesson-tutorInfor").html(introduction);
                    //展开更多
                    $(".infor-read").click(function () {
                        $("p.lesson-tutorInfor").html(introduction);
                        $(".infor-read").hide();
                        $(".infor-close").show();
                    });
                    // 收起更多
                    $(".infor-close").click(function () {
                        $("p.lesson-tutorInfor").html(introduction);
                        $(".infor-read").show();
                        $(".infor-close").hide();
                    });
                }
            }
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

// 监听滑动事件
function slidingEvent(uId, sortId, bannerSort, banner, lastId, nextId) {
    // 左右滑动切换课程
    var mySwiper = new Swiper('.swiper-container', {
        autoplay: false, //可选选项，自动滑动
        slidesPerView: 1,
        spaceBetween: 0, //slide之间的距离（单位px）
        observer: true,
        autoplayDisableOnInteraction: false,
        touchMoveStopPropagation: true,
        autoplay: 4000,
        // on: {
        //     touchEnd: function (e) {
        //         if (mySwiper.touches.diff > 0) {
        //             console.log("左滑");
        //         } else if (mySwiper.touches.diff < 0) {
        //             console.log("右滑");
        //             bannerSort++;
        //             lessonDetail(uId, nextId, sortId, bannerSort, 1);
        //             // if (banner == "") {
        //             //     mySwiper.addSlide(1, '<section class="swiper-slide lesson-audio"></section>'); //在index为1的位置插入一个slide
        //             //     lessonDetail(uId, nextId, sortId, bannerSort, 1);
        //             // } else {
        //             //     console.log("广告");
        //             // }
        //         }
        //     },
        // }
    });
}