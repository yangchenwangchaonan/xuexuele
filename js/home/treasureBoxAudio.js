$(function () {
    // 获取百宝箱列表id
    var url = window.location.href;
    var num = url.indexOf("&");
    // console.log(num);
    if (num != -1) {
        var arr1 = url.split("&");
        var arr2 = arr1[0].split("=");
        var recommendId = arr2[1];
        // console.log(arr2);
        recommendAudio(recommendId);
    } else {
        var arr3 = url.split("=");
        var specialId = arr3[1];
        specialAudio(specialId);
    }

    // 返回
    $("#treasureBoxAudioBack").click(function(){
        // window.location.replace("./treasureBox.html");
        // $(window).attr("location","./treasureBox.html");
        history.back(-1);
    });
});

// 特殊奖励的音频
function specialAudio(listId) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserBaoboxDetail",
        data: {
            id: listId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            $("#treasureBoxAudioBg").attr("src", data[0].img);
            $("#lessonName").html(data[0].heading);
            $("#lessonAudio").attr("src", data[0].voice);
        },
        error: function (err) {
            console.log(err)
        }
    });
}

// 推荐奖励的音频
function recommendAudio(listId) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserBaoboxCourseDetail",
        data: {
            id: listId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                var data = res.data;
                $("#treasureBoxAudioBg").attr("src", data.courseimg);
                $("#lessonName").html(data.coursename);
                $("#lessonAudio").attr("src", data.coursevoice);
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}