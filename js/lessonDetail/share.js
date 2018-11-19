$(function () {
    WxConfig(); //获取接口权限
});

// 获取公众号接口权限
function WxConfig() {
    var url = window.location.href.split("#")[0];
    // console.log(url);
    var courseId = url.split("&")[0].split("=")[1];
    // console.log(courseId);
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
                        'onMenuShareAppMessage'
                    ]
                });

                wx.ready(function () {
                    console.log("ready");
                    //分享给朋友
                    wx.onMenuShareAppMessage({
                        title: '课程分享',
                        desc: '一起加入学学乐，快乐学习吧！',
                        link: 'https://m.xuexuele.huimor.com/html/lessonDetail/lesson-share.html?courseId='+courseId,
                        imgUrl: 'https://m.xuexuele.huimor.com/images/83.png', // 分享图标
                    }, function (res) {
                        //这里是回调函数
                        console.log(res);
                    });

                    //分享到朋友圈
                    wx.onMenuShareTimeline({
                        title: '课程分享', // 分享标题
                        link: 'https://m.xuexuele.huimor.com/html/lessonDetail/lesson-share.html?courseId='+courseId,
                        imgUrl: 'https://m.xuexuele.huimor.com/images/83.png', // 分享图标
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