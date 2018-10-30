$(function () {
    // 当前页面的url
    var NowUrl = window.location.href;
    // 返回
    $(".lesson-record-back").click(function () {
        history.back(-1);
    });
    wxConfig(NowUrl);

});

// 获取公众号基本信息
function wxConfig(url) {
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/My/WxConfig",
        data: {
            url: url
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            if (res.code == 1) {
                // 公众号
                wx.config({
                    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.appId, // 必填，公众号的唯一标识
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串
                    signature: data.signature, // 必填，签名
                    jsApiList: ["startRecord", "stopRecord", "onVoiceRecordEnd", "playVoice", "pauseVoice", "stopVoice", "onVoicePlayEnd", "uploadVoice"] // 必填，需要使用的JS接口列表
                });

                var localId; //返回音频的本地ID
                var serverId; //返回音频的服务器端ID
                var startTime, endTime, minTime = 2; //录音计时,小于指定秒数(minTime = 10)则设置用户未录音
                //按下开始录音
                $("#startRecord").on("touchstart", function () {
                    $("#startRecord").hide();
                    $("#recordIng").show();
                    wx.startRecord(); //开始录音
                })

                // 停止录音
                $("#recordIng").on("touchend", function () {
                    $("#startRecord").show();
                    $("#recordIng").hide();
                    wx.stopRecord({
                        success: function (res) {
                            localId = res.localId;
                            console.log(localId);
                        }
                    });
                    endTime = new Date().getTime();
                    console.log((endTime - startTime) / 1000);
                    if ((endTime - startTime) / 1000 < minTime) {
                        localId = '';
                        alert('录音少于' + minTime + '秒，录音失败，请重新录音');
                    }
                });


                //上传语音接口
                $("#uploadAudio").on('click', function () {
                    if (!localId) {
                        alert('您还未录音，请录音后再保存');
                        return;
                    }
                    // alert('上传语音,测试，并未提交保存');
                    // return;

                    //上传语音接口
                    wx.uploadVoice({
                        //需要上传的音频的本地ID，由 stopRecord 或 onVoiceRecordEnd 接口获得
                        localId: localId,
                        //默认为1，显示进度提示
                        isShowProgressTips: 1,
                        success: function (res) {
                            //返回音频的服务器端ID
                            serverId = res.serverId;
                        }
                    });
                });
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}