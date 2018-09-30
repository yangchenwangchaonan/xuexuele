$(function () {
    // 获取uId，lessonId，wisdombean
    var url = window.location.href;
    var arr1 = url.split("?");
    var arr3 = arr1[1].split("&");
    var uId = arr3[0].substr(arr3[0].indexOf("=") + 1);
    var lessonId = arr3[1].substr(arr3[1].indexOf("=") + 1);
    var wisdombean = arr3[2].substr(arr3[2].indexOf("=") + 1);
    WisdomDetailList(uId, lessonId, wisdombean)
    // WisdomUnlock(uId, lessonId, wisdombean);
});

//解锁专辑课程列表详情
function WisdomDetailList(uId, lessonId, wisdombean) {
    console.log(uId)
    console.log(lessonId)
    console.log(wisdombean)
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/Wisdom/WisdomDetailList",
        data: {
            uid: 1,
            courseid: 1
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
        }
    });
}



// 课程解锁 
function WisdomUnlock(uId, lessonId, wisdombean) {
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/Wisdom/WisdomUnlock",
        data: {
            uid: uId,
            courseid: lessonId,
            wisdombean: wisdombean
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
        },
        error: function (err) {
            console.log(err);
        }
    });
}