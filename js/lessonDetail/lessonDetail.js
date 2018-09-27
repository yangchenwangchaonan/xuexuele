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
            $(".useName").text(data.list.nickname);
            $("#lessonAppraise>span").text(data.list.coursescore);
            $("#lessonShare>p").text("23.5w");
            $("#lessonMessage>p").text(data.list.commentsum);
            $(".unsuccessed").text(data.list.coursetime);
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

        // 关闭窗口leave-message-close
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