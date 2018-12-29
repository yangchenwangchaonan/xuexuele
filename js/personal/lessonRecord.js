$(function () {
    // 获取专辑id
    var url = window.location.href;
    var aId = url.split("=")[1];
    console.log(aId);
    audio(aId);

// 返回
    $("#audioRecordBack").click(function(){
        $(window).attr("location","./album-detail.html?aid="+aId);
    });
});



function audio(aId) {
    //获得实例
    var rec = Recorder({
        onProcess: function (a,b,time) {
            var duration = parseInt(time / 1000);
            var minute = parseInt(duration / 60);
            var sec = duration % 60 + '';
            var isM0 = ':';
            if (minute == 0) {
                minute = '00';
            } else if (minute < 10) {
                minute = '0' + minute;
            }
            if (sec.length == 1) {
                sec = '0' + sec;
            }
            if ($(".recordtime").html() == "30:00") {
                     rec.pause()
                    flowerTips("录音不能超过30分钟哦~", 2);
                    $("#recordIng").hide();
                    $("#stopRecord").show();
            }
            $(".recordtime").html(minute + isM0 + sec);
            // 录音进度条
            var $width = parseInt($(".progressBar").css("width"));
            // console.log($width);
            $(".progressReal").css("width",(time/(30*60*1000))*$width);
            $("#voiceOver").html(minute + isM0 + sec);
        }
    });

    //打开麦克风授权获得相关资源
    rec.open(function () {
        $("#startRecord").click(function () {
            rec.start(); //开始录音
            $("#startRecord").hide()
            $("#recordIng").show()
        })

    }, function (msg) {
        alert("无法录音:" + msg);
        // flowerTips("无法录音:" + msg, 2);
        // $(window).attr("location","./album-detail.html?id="+aId);
    });

    // 暂停录音
    $("#recordIng").click(function () {
        rec.pause()
        $("#recordIng").hide()
        $("#stopRecord").show()
    })

    //恢复暂停录音
    $("#stopRecord").click(function () {
        if($(".recordtime").html() != "30:00"){
            rec.resume();
            $("#recordIng").show()
            $("#stopRecord").hide()
        }
        
    })
    //到达指定条件停止录音，拿到blob对象想干嘛就干嘛：立即播放、上传
    $("#uploadAudio").click(function () {
        rec.stop(function (blob, duration) {
            console.log(blob, (duration / 1000));
            rec.close(); //释放录音资源
            VoiceUpload(blob,aId)
            console.log(URL.createObjectURL(blob))
        }, function (msg) {
            alert("录音失败:" + msg);
        });
    });
}


//上传
function VoiceUpload(type,aId) {
    var formdata = new FormData();
    formdata.append("voicefile", type);
    $.ajax({
        processData: false,
        contentType: false,
        type: "POST",
        url: APP_URL + "/api/My/VoiceUpload",
        data: formdata,
        dataType: "json",
        success: function (res) {
            console.log(res)
            if(res.code ==1){
                var voiceUrl = res.data;
                $(window).attr("location", "./addLesson-detail.html?voiceUrl=" + voiceUrl + "&aid=" + aId);
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}