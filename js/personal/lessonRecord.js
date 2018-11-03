$(function () {
   audio ()
});



function audio () {
    var rec=Recorder();
    rec.open(function(){//打开麦克风授权获得相关资源
        $("#startRecord").click(function(){
           rec.start();//开始录音
           $("#startRecord").hide()
           $("#recordIng").show()
        })

        $("#recordIng").click(function(){
            rec.pause()//暂停录音
             $("#recordIng").hide()
             $("#stopRecord").show()
        })

        $("#stopRecord").click(function(){
            rec.resume()//恢复暂停录音
             $("#recordIng").show()
             $("#stopRecord").hide()
        })
    },function(msg){
        console.log("无法录音:"+msg);
    });


    $("#uploadAudio").click(function() {
        rec.stop(function(blob,duration){//到达指定条件停止录音，拿到blob对象想干嘛就干嘛：立即播放、上传
        console.log(blob,(duration/1000));
            rec.close();//释放录音资源
        },function(msg){
            alert("录音失败:"+msg);
        });
    });
}


   