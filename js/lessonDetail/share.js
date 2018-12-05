$(function () {
    var url = window.location.href.split("#")[0];
    var courseId = url.split("&")[0].split("=")[1];
    // console.log(courseId);
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/WisdomDetailShare",
        data: {
            courseid: courseId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                var courseName = res.data.coursename;
                var courseContent = res.data.coursetxt;
                WxConfig(url, courseId, courseName, courseContent); //获取接口权限
            }
        }
    });
});

// 获取公众号接口权限
function WxConfig(url, courseId, courseName, courseContent) {
    var uid = localStorage.getItem("uid");
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/My/WxConfig",
        data: {
            url: url
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                var data = res.data;
                var appId = data.appId;
                var nonceStr = data.nonceStr;
                var signature = data.signature;
                var timestamp = data.timestamp;
                wx.config({
                    debug: false,
                    appId: appId,
                    timestamp: timestamp,
                    nonceStr: nonceStr,
                    signature: signature,
                    jsApiList: [
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareQZone'
                    ]
                });

                wx.ready(function () {
                    console.log("ready");
                    //分享给朋友
                    wx.onMenuShareAppMessage({
                        title: '学学乐课程:' + courseName,
                        desc: courseContent,
                        link: 'https://m.xuexuele.huimor.com/html/lessonDetail/lesson-share.html?courseId=' + courseId + "&uid=" + uid,
                        imgUrl: 'https://m.xuexuele.huimor.com/images/04.png', // 分享图标
                    }, function (res) {
                        //这里是回调函数
                        console.log(res);
                    });

                    //分享到朋友圈
                    wx.onMenuShareTimeline({
                        title: '学学乐课程:' + courseName, // 分享标题
                        link: 'https://m.xuexuele.huimor.com/html/lessonDetail/lesson-share.html?courseId=' + courseId + "&uid=" + uid,
                        imgUrl: 'https://m.xuexuele.huimor.com/images/04.png', // 分享图标
                    }, function (res) {
                        console.log(res);
                    });
                    // 分享到QQ
                    wx.onMenuShareQQ({
                        title: '学学乐课程:' + courseName, // 分享标题
                        desc: courseContent, // 分享描述
                        link: 'https://m.xuexuele.huimor.com/html/lessonDetail/lesson-share.html?courseId=' + courseId + "&uid=" + uid, // 分享链接
                        imgUrl: 'https://m.xuexuele.huimor.com/images/04.png', // 分享图标
                    }, function (res) {
                        console.log(res);
                    });
                    // 分享到QQ空间
                    wx.onMenuShareQZone({
                        title: '学学乐课程:' + courseName, // 分享标题
                        link: 'https://m.xuexuele.huimor.com/html/lessonDetail/lesson-share.html?courseId=' + courseId + "&uid=" + uid,
                        imgUrl: 'https://m.xuexuele.huimor.com/images/04.png', // 分享图标
                    }, function (res) {
                        console.log(res);
                    });
                });
                wx.error(function (res) {});
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}