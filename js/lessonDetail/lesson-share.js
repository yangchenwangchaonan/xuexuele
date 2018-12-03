$(function () {
    var url = window.location.href;
    var courseId = url.split("&")[0].split("=")[1];
    var uid = url.split("&")[1].split("=")[1];
    wisdomDetailShare(courseId,uid);
});

function wisdomDetailShare(courseId,uid) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/WisdomDetailShare",
        data: {
            courseid: courseId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            if (res.code == 1) {
                $("#courseName").html(data.coursename); //课程名称
                $("#imgBg").attr("src", data.courseimg); //课程图片
                $(".head-imgBg>img").attr("src", data.headimg); //导师头像
                $("#toturConfirm").addClass(data.identity == 1 ? "" : "visitor-title");
                $("#toturConfirm").html(data.identity == 1 ? "导师" : "游侠"); //导师身份
                $(".useName").html(data.nickname); //导师姓名
                $("#lessonAudio").attr("src", data.coursevoice); //课程音频
                $(".share-result").click(function () {
                    $(window).attr("location", "../login/login.html?uid=" + uid);
                });
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}