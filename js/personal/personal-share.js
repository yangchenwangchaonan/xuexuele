$(function () {
    WxConfig(); //获取接口权限
});

// 获取公众号接口权限
function WxConfig() {
    var url = window.location.href.split("#")[0];
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
                        title: '学学乐',
                        desc: '一起闯关，共同学习',
                        link: 'https://m.xuexuele.huimor.com/signOut.html?uid=' + uid,
                        imgUrl: 'https://m.xuexuele.huimor.com/images/04.png', // 分享图标
                    }, function (res) {
                        //这里是回调函数
                        console.log(res);
                    });

                    //分享到朋友圈
                    wx.onMenuShareTimeline({
                        title: ' 学学乐', // 分享标题
                        link: 'https://m.xuexuele.huimor.com/signOut.html?uid='+ uid,
                        imgUrl: 'https://m.xuexuele.huimor.com/images/04.png', // 分享图标
                    }, function (res) {
                        console.log(res);
                    });
                    // 分享到QQ
                    wx.onMenuShareQQ({
                        title: ' 学学乐', // 分享标题
                        desc: '一起闯关，共同学习', // 分享描述
                        link: 'https://m.xuexuele.huimor.com/signOut.html?uid='+ uid, // 分享链接
                        imgUrl: 'https://m.xuexuele.huimor.com/images/04.png', // 分享图标
                    }, function (res) {
                        console.log(res);
                    });
                    // 分享到QQ空间
                    wx.onMenuShareQZone({
                        title: ' 学学乐', // 分享标题
                        link: 'https://m.xuexuele.huimor.com/signOut.html?uid='+ uid,
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