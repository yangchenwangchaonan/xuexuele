$(function () {
   audio ()
});



function audio (time) {
    //获得实例
    var rec=Recorder();
    //打开麦克风授权获得相关资源
    rec.open(function(){
        $("#startRecord").click(function(){
           rec.start();//开始录音
           $("#startRecord").hide()
           $("#recordIng").show()
            x(0,0,0)
        })

    },function(msg){
       alert("无法录音:"+msg);
    }); 
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


//暂停录音
function stop(time) {
     var rec=Recorder();
    $("#recordIng").click(function(){
        rec.pause()
         $("#recordIng").hide()
         $("#stopRecord").show()
        clearInterval(time)
    })
}
//恢复暂停录音
function loadingRecord(m,s){
    var rec=Recorder();
    $("#stopRecord").click(function(){
        rec.resume()
         $("#recordIng").show()
         $("#stopRecord").hide()
         x (2,m,s)
    })
}

 //定时器
function x (a,m,s) {
     var time=setInterval(function() {
            s++
            if (s >= 60) {
                s = 0;
                m = m + 1; //分钟
            }
            str = toDub(m) + ":" + toDub(s);
            $(".recordtime").html(str)
            loadingRecord(m,s)
        },1000)
        stop(time)
        //补0操作
        function toDub(n) {
            if (n < 10) {
                return "0" + n;
            } else {
                return "" + n;
            }
        } 
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