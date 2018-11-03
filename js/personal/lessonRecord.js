$(function () {
   audio ()
});



function audio (time) {
    var rec=Recorder();
    rec.open(function(){//打开麦克风授权获得相关资源
        $("#startRecord").click(function(){
           rec.start();//开始录音
           $("#startRecord").hide()
           $("#recordIng").show()
            x(0,0,0)
        })

    },function(msg){
       alert("无法录音:"+msg);
    }); 
    $("#uploadAudio").click(function() {
        rec.stop(function(blob,duration){//到达指定条件停止录音，拿到blob对象想干嘛就干嘛：立即播放、上传
        console.log(blob,(duration/1000));
            rec.close();//释放录音资源
            console.log(blob.type)
            VoiceUpload(blob)
            console.log(URL.createObjectURL(blob))
        },function(msg){
            alert("录音失败:"+msg);
        });
    });
}

function stop(time) {
     var rec=Recorder();
    $("#recordIng").click(function(){
        rec.pause()//暂停录音
         $("#recordIng").hide()
         $("#stopRecord").show()
        clearInterval(time)
    })
}

function loadingRecord(m,s){
    var rec=Recorder();
    $("#stopRecord").click(function(){
        rec.resume()//恢复暂停录音
         $("#recordIng").show()
         $("#stopRecord").hide()
         x (2,m,s)
    })
}


function uploadAudio(time) {
      var rec=Recorder();
    
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