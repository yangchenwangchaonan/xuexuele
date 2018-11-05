$(function () {
   audio ()
});



function audio (time) {
    //获得实例
   var rec=Recorder({onProcess:function(a,level,time){
        var duration = parseInt(time/1000);
        var minute = parseInt(duration /60);
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
        if ($(".recordtime").html()=="00:04") {
            rec.stop(function(blob,duration){
            console.log(blob,(duration/1000),time);
            rec.close();//释放录音资源
            VoiceUpload(blob)
            console.log(URL.createObjectURL(blob))
            },function(msg){
                alert("录音失败:"+msg);
            });
        }
        $(".recordtime").html(minute + isM0 + sec)
        return minute + isM0 + sec
    }});

    //打开麦克风授权获得相关资源
    rec.open(function(){
        $("#startRecord").click(function(){
           rec.start();//开始录音
           $("#startRecord").hide()
           $("#recordIng").show()
        })

    },function(msg){
       alert("无法录音:"+msg);
    }); 

    // 暂停录音
    $("#recordIng").click(function(){
        rec.pause()
         $("#recordIng").hide()
         $("#stopRecord").show()
    })

    //恢复暂停录音
     $("#stopRecord").click(function(){
        rec.resume()
         $("#recordIng").show()
         $("#stopRecord").hide()
    })
    //到达指定条件停止录音，拿到blob对象想干嘛就干嘛：立即播放、上传
    $("#uploadAudio").click(function() {
        rec.stop(function(blob,duration){
            console.log(blob,(duration/1000));
            rec.close();//释放录音资源
            VoiceUpload(blob)
            console.log(URL.createObjectURL(blob))
        },function(msg){
            alert("录音失败:"+msg);
        });
    });
}

//上传
function VoiceUpload(type) {
    var formdata= new FormData();
    formdata.append("voicefile",type)
     $.ajax({
        processData: false,
        contentType: false,
        type: "POST",
        url: APP_URL + "/api/My/VoiceUpload",
        data: formdata,
        dataType: "json",
        success: function (res) {
            console.log(res)
        },
        error:function (err) {

        }
    });
}