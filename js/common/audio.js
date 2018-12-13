$(function () {
    var audio = $('#lessonAudio').get(0);
    var bgAudio = $("#levelBackground").get(0); //关卡背景音乐
    // console.log(bgAudio);
    $('#progressBar').click(function () {
        //改变暂停/播放icon
        if (audio.paused) {
            audio.play();
            if (bgAudio) {
                bgAudio.pause();
            }
            $('#progressBar').removeClass('progress-stop').addClass('progress-start');
        } else {
            audio.pause();
            if (bgAudio) {
                bgAudio.play();
            }
            $('#progressBar').removeClass('progress-start').addClass('progress-stop');
        }
    });
    

    // 获取音频时长
    $("#lessonAudio").on("loadedmetadata", function () {
        // console.log(audio.duration);  //音频时长
        $("#audioTime").text(transTime(this.duration));
        //点击进度
        progressRealClick(this.duration)
    });

    // 监听音频播放时间
    audio.addEventListener('timeupdate', updateProgress, false);
    // 播放完成
    audio.addEventListener('ended', audioEnded, false);
});

// 转换音频时长显示
function transTime(time) {
    var duration = parseInt(time);
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
    return minute + isM0 + sec
}

//更新进度条
function updateProgress() {
    var audio = $("#lessonAudio")[0]; //js获取的方式
    var value = Math.round((Math.floor(audio.currentTime) / Math.floor(audio.duration)) * 100, 0);
    // console.log(value);
    $('.progressReal').css('width', value * 0.976 + '%');
    $('.successed').html(transTime(audio.currentTime));
}

//播放完成
function audioEnded() {
    window.setTimeout(() => {
        var audio = $("#lessonAudio")[0];
        audio.currentTime = 0;
        audio.pause();
        $('#progressBar').removeClass('progress-start').addClass('progress-stop');
    }, 5000);
}


//点击加载进度
function progressRealClick(time) {
    // console.log(time)
    $(".progressBar").click(function (e) {
        // console.log((time*(e.pageX - $(this).offset().left)/$(this).width()/time)*100)
        var b = (time * (e.pageX - $(this).offset().left) / $(this).width())
        console.log(b)
        var a = (time * (e.pageX - $(this).offset().left) / $(this).width() / time * 100)
        $('.progressReal').css('width', a + '%');
        $('#lessonAudio')[0].currentTime = b
    })
}