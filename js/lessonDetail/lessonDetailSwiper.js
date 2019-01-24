// 获取lessonid
var url = window.location.href;
var arr = url.split("&");
var lessonId = arr[0].split("=")[1];
var sortId = arr[1].split("=")[1]
var countSum = 1;
// swiper
var mySwiper = new Swiper('.swiper-container', {
    threshold: 10, //拖动的临界值（单位为px），如果触摸距离小于该值滑块不会被拖动。
    on: {
        slideChangeTransitionEnd: function (event) {
            // console.log(mySwiper.activeIndex); //滑动时的索引
            // console.log(mySwiper.slides.length); // 总滑块数
            // var slideLength = mySwiper.slides.length - 1;
            countSum++;
            if ($(".swiper-wrapper>.swiper-slide-active").hasClass("lessonAd")) {
                countSum--;
            }
            // 滑动页面后播放暂停
            var audioSwiper = $(".swiper-slide-active").siblings().find("audio");
            var audioButton = $(".swiper-slide-active").siblings().find(".progress-bar");
            // console.log(audioButton);
            audioButton.removeClass("progress-start").addClass("progress-stop");
            for (var i = 0; i < audioSwiper.length; i++) {
                audioSwiper[i].pause();
            }
            // 滑动到当前页前后插入页面
            var lessonLength = $(".swiper-wrapper>.lesson-audio").length; //课程滑块总数
            var adINdex = $(".swiper-wrapper>.lessonAd").length; //广告滑块总数
            var totalLength = (lessonLength + adINdex) - 1; //滑块总数-1
            var lessonFlag = $(".swiper-wrapper>.swiper-slide-active").hasClass("lesson-audio"); //当前滑块是否是课程页面
            var nextFlag = $(".swiper-wrapper>.swiper-slide-active").nextAll().hasClass("lesson-audio"); //后面是否有课程滑动块
            var prevFlag = $(".swiper-wrapper>.swiper-slide-active").prevAll().hasClass("lesson-audio"); //前面是否有课程滑动块
            var firstChildren = $(".swiper-wrapper").children("section").first().hasClass("swiper-slide"); //判断第一个是否有滑动块
            var lastChildren = $(".swiper-wrapper").children("section").last().hasClass("swiper-slide"); //判断最后一个是否有滑动块
            if (((mySwiper.activeIndex == totalLength) && lessonFlag) || ((mySwiper.activeIndex == (totalLength - 1)) && !nextFlag)) {
                //插入下一节课程 
                var nextId = $('.swiper-wrapper>.swiper-slide-active').attr('data-nextid');
                if (nextId != "") {
                    getPrevNextData(nextId, countSum);
                    if (firstChildren) {
                        mySwiper.removeSlide(0); //移除第一个
                    } else {
                        $(".swiper-wrapper").children("section").first().remove(); //移除第一个section
                    }
                    // if($(".swiper-wrapper>.swiper-slide").eq(0).attr("data-banner") != ""){
                    //     mySwiper.removeSlide(0); //移除第一个
                    // }
                }
            } else if (((mySwiper.activeIndex == 0) && lessonFlag) || ((mySwiper.activeIndex == 1) && !prevFlag)) {
                //插入上一节课程
                var lastId = $('section.swiper-slide').eq(mySwiper.activeIndex).attr('data-lastid');
                if (lastId != "") {
                    getPrevNextData(lastId, countSum, 'last');
                    // if($(".swiper-wrapper>.swiper-slide").eq(lessonLength-1).attr("data-banner") != ""){
                    //     mySwiper.removeSlide(totalLength); //移除广告
                    // }
                    if (lastChildren) {
                        mySwiper.removeSlide(totalLength); //移除最后一个
                    } else {
                        $(".swiper-wrapper").children("section").last().remove(); //移除最后一个section
                    }
                }
            }
        },
    },
});


$(function () {
    // 返回
    $("#lessonDetailBack").click(function () {
        history.go(-1);
    });
    //智慧社详情
    lessonDetail(lessonId, 1);
});

// 智慧社详情
function lessonDetail(lessonId, countSum, diff, isfollow) {
    var uId = localStorage.getItem("uid"); //用户id
    var token = localStorage.getItem("token");
    // 获取当前页数据
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/WisdomDetail",
        data: {
            uid: uId,
            token: token,
            courseid: lessonId,
            sort: sortId,
            bannersort: countSum
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                var data = res.data;
                var str = "";
                str += `
            <section class="swiper-slide lesson-audio ${diff==0?"swiper-slide-active":''}" data-banner="${data.banner}" data-lastid="${data.lastid}" data-courseid="${lessonId}" data-nextid="${data.nextid}" data-count="${countSum}">
                <img src="${data.list.courseimg}"/>
                <div class="audio">
                    <h1>${data.list.coursename}</h1>
                    <div class="lesson-tutor">
                        <ul class="tutorDetail" data-isf="${data.isfollow}" data-fid="${data.list.id}">
                            <li>
                                <div class="head-imgBg" data-tid="${data.list.id}">
                                    <img src="${data.list.headimg}"/>
                                </div>
                                ${data.list.identity == 2?`<div class="tutor-title visitor-title">游侠</div>`:
                                `<div class="tutor-title">导师</div>`
                                }
                            </li>
                            <li class="useName">${data.list.nickname}</li>
                        </ul>
                        ${data.list.id==uId?'':
                        `<div class="attention" data-isfollow="${data.isfollow}" data-followid="${data.list.id}">${data.isfollow == 1?'已关注':'关注'}</div>`
                        }       
                    </div>
                    <div class="action-bar">
                        ${data.isscore == 1?`<ul class="scoreList"  data-isscore="${data.isscore}"><img src="../../images/138.png" /><span>${data.list.coursescore}</span><p>已评分</p></ul>`:
                        `<ul class="scoreList" data-isscore="${data.isscore}"><img src="../../images/138.png" /><span></span><p>可评分</p></ul>`}
                        <ul class="shareList"><img src="../../images/139.png" /><p>${data.list.sharesum}</p></ul>
                        <ul class="msgList"><img src="../../images/140.png" /><p>${data.list.commentsum}</p></ul>
                        <ul class="amList" data-aid="${data.list.albumid}"><img src="../../images/141.png" /><p>所属专辑</p></ul>
                        <ul class="courseTextList" data-content='${data.list.coursecontent}'>
                            <img src="../../images/142.png" /><p>看文字</p>
                        </ul>
                        ${data.lock==1?`
                        <ul class="courseDetailList" data-text='${data.list.coursetxt}' data-name='${data.list.coursename}' >
                            <img src="../../images/143.png" /><p>课程介绍</p>
                        </ul>
                        <ul class="reportList"><img src="../../images/144.png" /><p>举报</p></ul>
                        `:''}
                    </div>
                    <div class="audio-content">
                        <audio class="lessonAudio" preload="auto" src="${data.list.coursevoice}"></audio>
                        <div class="progressBar">
                            <div class="progressReal"></div>
                            <i class="progressKey"></i>
                        </div>
                        <span class="successed">00:00</span>
                        <span class="unsuccessed">${data.list.coursetime}</span>
                        ${data.lock==1?`<div class="progress-bar progress-stop"></div>`:""}
                    </div>
                </div>
                ${data.lock==1?"":`
                <div class="locked-shade"></div>
                <div class="lock-shade">
                    <div class="progress-locked" data-cid="${data.list.courseid}" data-sid="${sortId}"><span>x${data.list.wisdombean}</span></div>
                </div>
                `}
            </section>
            ${((diff==0&&data.banner!="")||data.banner=="")?'':`
            <section class="swiper-slide lessonAd">
                <img src="${data.banner.image}"/>
                <h1>${data.banner.heading}</h1>
                <div class="adAudio-content">
                    <audio class="lessonAdAudio" preload="auto" src="${data.banner.content}"></audio>
                    <div class="progressBar progressAdBar">
                        <div class="progressReal progressAdReal"></div>
                        <i class="progressKey"></i>
                    </div>
                    <span class="successed adOverTime">00:00</span>
                    <span class="unsuccessed adAudioTime"></span>
                    <div class="progress-stop adBar"></div>
                </div>
            </section>
            `}
            `;
                if (diff == 0) {
                    $('div.swiper-wrapper>section').eq(mySwiper.activeIndex).html(str); //当前页
                    // $('div.swiper-wrapper>section').eq(mySwiper.activeIndex+1).addClass("swiper-slide-active");
                    var activeFollowid = $('div.swiper-wrapper>section').eq(mySwiper.activeIndex).find('.attention').attr("data-followid");
                    var siblingPages = $('div.swiper-wrapper>section').eq(mySwiper.activeIndex).siblings(".lesson-audio").find(".attention");
                    if (isfollow == 0) {
                        for (var i = 0; i < siblingPages.length; i++) {
                            var sibFollowidNo = $(siblingPages[i]).attr("data-followid");
                            if (sibFollowidNo == activeFollowid) {
                                $(siblingPages[i]).attr("data-isfollow", "0");
                                $(siblingPages[i]).siblings("ul.tutorDetail").attr("data-isf", "0");
                                $(siblingPages[i]).html("关注");
                            }
                        }
                    } else if (isfollow == 1) {
                        for (var j = 0; j < siblingPages.length; j++) {
                            var sibFollowidOn = $(siblingPages[j]).attr("data-followid");
                            if (sibFollowidOn == activeFollowid) {
                                $(siblingPages[j]).attr("data-isfollow", "1");
                                $(siblingPages[j]).siblings("ul.tutorDetail").attr("data-isf", "1")
                                $(siblingPages[j]).html("已关注");
                            }
                        }
                    }
                } else {
                    // console.log(data.lastid, lessonId, data.nextid);
                    $('div.swiper-wrapper').html(str); //当前页
                    if (data.lastid != "") {
                        getPrevNextData(data.lastid, countSum, "last"); //上一页
                    } else {
                        mySwiper.prependSlide("<section><section/>"); //前面插入
                    }
                    if (data.nextid != "") {
                        getPrevNextData(data.nextid, countSum); //下一页
                    } else {
                        mySwiper.appendSlide("<section><section/>"); //后面插入
                    }
                }
                tutorDetailList(data.isfollow, data.list.id, lessonId, countSum); //导师详情
                allEvent(); //所有事件
            } else if (res.code == 10000) {
                repeatLogin()
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

//获取上一页和下一页数据
function getPrevNextData(id, countSum, type) {
    // console.log(id);
    var uId = localStorage.getItem("uid"); //用户id
    var token = localStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/WisdomDetail",
        data: {
            uid: uId,
            token: token,
            courseid: id,
            sort: sortId,
            bannersort: countSum
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                var data = res.data;
                var str1 = "";
                str1 += `
                    <section class="swiper-slide lesson-audio" data-banner="${data.banner}" data-lastid="${data.lastid}" data-courseid="${id}" data-nextid="${data.nextid}" data-count="${countSum}">
                        <img src="${data.list.courseimg}"/>
                        <div class="audio">
                            <h1>${data.list.coursename}</h1>
                            <div class="lesson-tutor">
                                <ul class="tutorDetail" data-isf="${data.isfollow}" data-fid="${data.list.id}">
                                    <li>
                                        <div class="head-imgBg" data-tid="${data.list.id}">
                                            <img src="${data.list.headimg}"/>
                                        </div>
                                        ${data.list.identity == 2?`<div class="tutor-title visitor-title">游侠</div>`:
                                        `<div class="tutor-title">导师</div>`
                                        }
                                    </li>
                                    <li class="useName">${data.list.nickname}</li>
                                </ul>
                                ${data.list.id==uId?'':
                                `<div class="attention" data-isfollow="${data.isfollow}" data-followid="${data.list.id}">${data.isfollow == 1?'已关注':'关注'}</div>`
                                }
                            </div>
                            <div class="action-bar">
                                ${data.isscore == 1?`<ul class="scoreList"  data-isscore="${data.isscore}"><img src="../../images/138.png" /><span>${data.list.coursescore}</span><p>已评分</p></ul>`:
                                `<ul class="scoreList" data-isscore="${data.isscore}"><img src="../../images/138.png" /><span></span><p>可评分</p></ul>`}
                                <ul class="shareList"><img src="../../images/139.png" /><p>${data.list.sharesum}</p></ul>
                                <ul class="msgList"><img src="../../images/140.png" /><p>${data.list.commentsum}</p></ul>
                                <ul class="amList" data-aid="${data.list.albumid}"><img src="../../images/141.png" /><p>所属专辑</p></ul>
                                <ul class="courseTextList" data-content='${data.list.coursecontent}'>
                                    <img src="../../images/142.png" /><p>看文字</p>
                                </ul>
                                ${data.lock==1?`
                                <ul class="courseDetailList" data-name="${data.list.coursename}" data-text='${data.list.coursetxt}'><img src="../../images/143.png" /><p>课程介绍</p></ul>
                                <ul class="reportList"><img src="../../images/144.png" /><p>举报</p></ul>
                                `:""}
                            </div>
                            <div class="audio-content">
                                <audio class="lessonAudio" 	preload="auto" src="${data.list.coursevoice}"></audio>
                                <div class="progressBar">
                                    <div class="progressReal"></div>
                                    <i class="progressKey"></i>
                                </div>
                                <span class="successed">00:00</span>
                                <span class="unsuccessed">${data.list.coursetime}</span>
                                ${data.lock==1?`<div class="progress-bar progress-stop"></div>`:""}
                            </div>
                        </div>
                        ${data.lock==1?"":`
                        <div class="locked-shade"></div>
                        <div class="lock-shade">
                            <div class="progress-locked" data-cid="${data.list.courseid}" data-sid="${sortId}"><span>X${data.list.wisdombean}</span></div>
                        </div>
                        `}
                    </section>
                    ${data.banner==""?'':`
                    <section class="swiper-slide lessonAd">
                        <img  src="${data.banner.image}"/>
                        <h1>${data.banner.heading}</h1>
                        <div class="adAudio-content">
                            <audio class="lessonAdAudio" preload="auto" src="${data.banner.content}"></audio>
                            <div class="progressBar progressAdBar">
                                <div class="progressReal progressAdReal"></div>
                                <i class="progressKey"></i>
                            </div>
                            <span class="successed adOverTime">00:00</span>
                            <span class="unsuccessed adAudioTime"></span>
                            <div class="progress-stop adBar"></div>
                        </div>
                    </section>
                    `}
                    `;
                if (type == 'last') {
                    mySwiper.prependSlide(str1); //前面插入
                } else {
                    mySwiper.appendSlide(str1); //后面插入
                }
                // 解锁
                $(document).on("click", "div.progress-locked", function () {
                    var lessonId = $(this).attr("data-cid");
                    var sortId = $(this).attr("data-sid");
                    $(window).attr("location", "./unlock_some.html?lessonId=" + lessonId + "&sortId=" + sortId);
                });
            } else if (res.code == 10000) {
                repeatLogin();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

//所有事件 
function allEvent() {
    $("body").unbind().on("click", ".attention", function () {
        allClick();
        var isfollow = $(this).attr("data-isfollow"); //是否关注
        var followid = $(this).attr("data-followid");
        var courseId = $(this).parents("section").attr("data-courseid");
        var countSum = $(this).parents("section").attr("data-count");
        if (isfollow == 1) {
            noAttention(followid, courseId, countSum, isfollow); //取消关注
        } else if (isfollow == 0) {
            onAttention(followid, courseId, countSum, isfollow); //点击关注
        }
    });

    //评分
    $(document).unbind().on('click', 'ul.scoreList', function () {
        allClick();
        var isScore = $(this).attr("data-isscore");
        var countSum = $(this).parents("section").attr("data-count");
        var courseId = $(this).parents("section").attr("data-courseid");
        // alert(isScore);
        if (isScore == 0) {
            $("#appraiseShade").show();
            $.each($(".appraise-score>ul>li"), function (index, val) {
                var num = index + 1;
                var $class = "score-key" + num;
                $(this).removeClass($class);
                $(this).removeClass("checked");
                // $(".score-key11").addClass("score-key1");
                // $(".score-key11").addClass("checked");
            });
            //关闭
            $(".appraise-close").unbind('click').bind('click', function () {
                allClick();
                $("#appraiseShade").hide();
                $("#appraiseContent").show();
                $("#appraiseResult").hide();
                lessonDetail(courseId, countSum, 0); // 渲染页面
            });
        }
    });
    // 分享
    $(document).on('click', 'ul.shareList', function () {
        allClick();
        $("#shareShade").show();
        $("#shareShade").click(function () {
            allClick();
            $("#shareShade").hide();
        });
    });
    // 留言
    $(document).on('click', 'ul.msgList', function () {
        allClick();
        $("#messageShade").show();
        var countSum = $(this).parents("section").attr("data-count");
        var headimg = $(this).parents("section").find("div.head-imgBg>img").attr("src");
        var nickname = $(this).parents("section").find("li.useName").html();
        var courseId = $(this).parents("section").attr("data-courseid");
        // console.log(courseId);
        var tId = $(this).parents("section").find("div.head-imgBg").attr("data-tid");
        // console.log(headimg, nickname);
        messageList(1, courseId, 1, headimg, nickname, tId);
        // 关闭窗口
        $(".leave-message-close").click(function () {
            allClick();
            lessonDetail(courseId, countSum, 0); // 渲染页面
            $("#messageShade").hide();
            $(".message-btn").show();
            $(".releaseContent").hide();
            $(".replayContent").hide();
        });
    });
    // 所属专辑
    $(document).on('click', 'ul.amList', function () {
        allClick();
        var albumId = $(this).attr("data-aid");
        // console.log(albumId);
        $(window).attr("location", "./album-name.html?albumId=" + albumId);
    });
    // 看文字
    $(document).on('click', 'ul.courseTextList', function () {
        allClick();
        var courseContent = $(this).attr("data-content");
        $(".lesson-text-inner").html(courseContent);
        $(".lesson-text-inner").find("img").parent("p").addClass("imgP");
        if ($(".lesson-text-inner").find(".textImg")) {
            $.each($(".lesson-text-inner").find(".img-cancel"), function () {
                $(this).remove();
            });
        }
        $("#textShade").show();
        // 关闭窗口
        $(".lesson-close").click(function () {
            allClick();
            $("#textShade").hide();
        });
    });
    // 课程介绍
    $(document).on('click', 'ul.courseDetailList', function () {
        allClick();
        var coursename = $(this).attr("data-name");
        var coursetxt = $(this).attr("data-text");
        $(".lesson-introduction-inner>h1").html(coursename);
        $(".lesson-introduction-inner>.lesson-intr").html(coursetxt);
        $(".lesson-introduction-inner").find("img").parent("p").addClass("imgP");
        if ($(".lesson-introduction-inner>.lesson-intr").find(".textImg")) {
            $.each($(".lesson-introduction-inner>.lesson-intr").find(".img-cancel"), function () {
                $(this).remove();
            });
        }
        $("#introductShade").show();
        // 关闭窗口
        $(".lesson-close").click(function () {
            allClick();
            $("#introductShade").hide();
        });
    });
    // 课程举报
    $(document).on('click', 'ul.reportList', function () {
        allClick();
        var courseId = $(this).parents("section").attr("data-courseid");
        $(".report-tab>ul>li>.report-option").removeClass("report-option1");
        $("#reportShade").show();
        $(".report-tab>ul>li").click(function () {
            $(this).children().addClass("report-option1");
            $(this).siblings().children().removeClass("report-option1");
            var num = $(this).children().attr("data-num");
            regular(courseId, num);
        });
        // 关闭窗口
        $(".report-btn").click(function () {
            allClick();
            $("#reportShade").hide();
        });
    });
    // 点击导师
    $(document).on('click', 'ul.tutorDetail', function () {
        allClick();
        var isfollow = $(this).attr("data-isf");
        console.log(isfollow);
        var followid = $(this).attr("data-fid");
        var courseId = $(this).parents("section").attr("data-courseid");
        var countSum = $(this).parents("section").attr("data-count");
        tutorDetailList(isfollow, followid, courseId, countSum);
        $("#tutorShade").show();
        // 关闭窗口
        $(".tutor-close").click(function () {
            allClick();
            $("#tutorShade").hide();
        });
    });
    // 音频播放
    $(document).on('click', 'div.progress-bar', function () {
        allClick();
        var courseId = $(this).parents("section").attr("data-courseid");
        // console.log(courseId);
        var audio = $(this).parent("div.audio-content").find(".lessonAudio")[0];
        var audioTime = $(this).siblings(".unsuccessed");
        var progressBar = $(this).siblings(".progressBar")
        var progressReal = $(this).siblings(".progressBar").find(".progressReal");
        //改变暂停/播放icon
        // console.log(audio.paused);
        if (audio.paused) {
            audio.play();
            courseStudy(courseId); //统计播放量
            $(this).removeClass('progress-stop').addClass('progress-start');
        } else {
            audio.pause();
            $(this).removeClass('progress-start').addClass('progress-stop');
        }
        // 获取音频时长
        // audioTime.text(transTime(audio.duration));
        //点击进度
        $(progressBar).click(function (e) {
            var time = audio.duration;
            // console.log(e.pageX);
            // console.log((time*(e.pageX - $(this).offset().left)/$(this).width()/time)*100)
            var b = (time * (e.pageX - $(this).offset().left) / $(this).width())
            // console.log(b)
            var a = (time * (e.pageX - $(this).offset().left) / $(this).width() / time * 100)
            $(progressReal).css('width', a + '%');
            audio.currentTime = b;
        })

        // 监听音频播放时间
        audio.addEventListener('timeupdate', updateProgress, false);
        // 播放完成
        audio.addEventListener('ended', audioEnded, false);
    });
    // 广告播放
    $("body").on("click", "div.adBar", function () {
        var audio = $(this).parents(".lessonAd").find(".lessonAdAudio")[0];
        var adAudioTime = $(this).parents(".lessonAd").find(".adAudioTime");
        var progressAdBar = $(this).parents('.lessonAd').find(".progressAdBar");
        var progressAdReal = $(this).parents('.lessonAd').find(".progressAdBar>.progressAdReal");
        $(this).on("click", function () {
            allClick();
            //改变暂停/播放icon
            if (audio.paused) {
                audio.play();
                $(this).removeClass('progress-stop').addClass('progress-start');
            } else if (!audio.paused) {
                audio.pause();
                $(this).removeClass('progress-start').addClass('progress-stop');
            }
            $(this).parents(".lessonAd").find(".lessonAdAudio").on("loadedmetadata", function () {
                adAudioTime.text(transTime(this.duration));
            });
            // adAudioTime.text(transTime(audio.duration)); //音频时长
            //点击进度
            $(progressAdBar).click(function (e) {
                var time = audio.duration;
                var b = (time * (e.pageX - $(this).offset().left) / $(this).width());
                var a = (time * (e.pageX - $(this).offset().left) / $(this).width() / time * 100);
                $(progressAdReal).css('width', a + '%');
                audio.currentTime = b;
            });
            // 监听音频播放时间
            audio.addEventListener('timeupdate', updateProgress, false);
            // 播放完成
            audio.addEventListener('ended', audioEnded, false);
        });
    });
}

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
function updateProgress(event) {
    var audio = event.target;
    var progressReal = $(audio).siblings(".progressBar").find(".progressReal");
    var successProgress = $(audio).siblings(".successed");
    var value = Math.round((Math.floor(audio.currentTime) / Math.floor(audio.duration)) * 100, 0);
    progressReal.css('width', (value * 0.975) + '%');
    successProgress.html(transTime(audio.currentTime));
}
//播放完成
function audioEnded(event) {
    // console.log(event);
    var audio = event.target;
    var progressBar = $(audio).siblings(".progress-bar");
    window.setTimeout(() => {
        audio.currentTime = 0;
        audio.pause();
        progressBar.removeClass('progress-start').addClass('progress-stop');
    }, 5000);
}

// 导师详情
function tutorDetailList(isfollow, followid, courseId, countSum) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/TutorDetail",
        data: {
            id: followid
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var introduction = data.introduction;
            $("#headBg").attr("src", data.headimg);
            $(".tutor-avatar>p").html(data.nickname);
            //判断是否关注
            if (isfollow == 1) {
                $("#followShow").html("已关注");
                $("#followShow").unbind('click').bind('click', function () {
                    allClick();
                    noAttention(followid, courseId, countSum);
                });
            } else {
                $("#followShow").html("关注");
                $("#followShow").unbind('click').bind('click', function () {
                    allClick();
                    onAttention(followid, courseId, countSum);
                });
            }
            // 导师简介
            if (introduction == "" || introduction == null || introduction == undefined) {
                $("p.lesson-tutorInfor").html("暂无简介");
            } else {
                $(".infor-read").show();
                $(".infor-close").hide();
                var textLen = introduction.length;
                if (textLen > 41) {
                    var num = introduction.substring(0, 41);
                    $("p.lesson-tutorInfor").html(num + "...");
                    //展开更多
                    $(".infor-read").click(function () {
                        $("p.lesson-tutorInfor").html(introduction);
                        $(".infor-read").hide();
                        $(".infor-close").show();
                    });
                    // 收起更多
                    $(".infor-close").click(function () {
                        $("p.lesson-tutorInfor").html(num + "...");
                        $(".infor-read").show();
                        $(".infor-close").hide();
                    });
                } else {
                    $("p.lesson-tutorInfor").html(introduction);
                    //展开更多
                    // $(".infor-read").click(function () {
                    //     $("p.lesson-tutorInfor").html(introduction);
                    //     $(".infor-read").hide();
                    //     $(".infor-close").show();
                    // });
                    // // 收起更多
                    // $(".infor-close").click(function () {
                    //     $("p.lesson-tutorInfor").html(introduction);
                    //     $(".infor-read").show();
                    //     $(".infor-close").hide();
                    // });
                }
            }
            //专辑列表
            var str = "";
            var albumlist = data.albumlist;
            $.each(albumlist, function (index, val) {
                str += `
                    <li data-id="${val.id}">
                        <div class="album-name"><img src="${val.albumimg}"/></div>
                        <p>${val.albumname}</p>
                    </li>
                `;
            });
            $("#albumList").html(str);
            $("#albumList>li").click(function () {
                var albumId = $(this).attr("data-id");
                $(window).attr("location", "./album-name.html?albumId=" + albumId);
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
}


//点击关注
function onAttention(followid, courseId, countSum) {
    var uId = localStorage.getItem("uid"); //用户id
    var token = localStorage.getItem("token");
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/Wisdom/FollowSpot",
        data: {
            uid: uId,
            token: token,
            followid: followid
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                flowerTips("关注导师成功 ", 1)
                $("#followShow").html("已关注");
                lessonDetail(courseId, countSum, 0, 1); //更新智慧社详情
            } else if (res.code == 10000) {
                repeatLogin();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}
//取消关注
function noAttention(followid, courseId, countSum) {
    var uId = localStorage.getItem("uid"); //用户id
    var token = localStorage.getItem("token");
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/Wisdom/FollowNot",
        data: {
            uid: uId,
            token: token,
            followid: followid
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                flowerTips("已取消关注", 1);
                $("#followShow").html("关注");
                lessonDetail(courseId, countSum, 0, 0); //更新智慧社详情
            } else if (res.code == 10000) {
                repeatLogin();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 评分
function changeAppraise(e, appraise) {
    allClick();
    var uId = localStorage.getItem("uid"); //用户id
    var token = localStorage.getItem("token");
    var $lessonId = $("section.swiper-slide-active").attr("data-courseid");
    // console.log($lessonId);
    $.each($(".appraise-score>ul>li"), function (index, val) {
        var num = index + 1;
        var $class = "score-key" + num;
        $(this).removeClass($class);
    });
    $(e).addClass(appraise);
    var score;
    if ($(e).index() == 0) {
        score = 3;
    } else if ($(e).index() == 1) {
        score = 5;
    } else if ($(e).index() == 2) {
        score = 7;
    } else if ($(e).index() == 3) {
        score = 10;
    }
    $(".appraise-confirm").unbind().bind("click", function () {
        allClick();
        var beans = $(".beanInput").val();
        if (beans == "") {
            beans = 0;
        }
        //提交评分
        $.ajax({
            type: "POST",
            url: APP_URL + "/api/Wisdom/ScoreDo",
            data: {
                uid: uId,
                token: token,
                courseid: $lessonId,
                coursescore: score,
                wisdombean: beans
            },
            dataType: "json",
            success: function (res) {
                console.log(res);
                if (res.code == 1) {
                    var $score = res.data.average;
                    $("#appraiseContent").css("display", "none");
                    $("#appraiseResult").css("display", "block");
                    $("#scoreRes").text(score + "分");
                    $("#lessonAppraise>span").attr("data-score", $score);
                    scoreSum($lessonId);
                    beanSum($lessonId);
                } else if (res.code == 10000) {
                    repeatLogin();
                } else {
                    alert(res.msg);
                    // flowerTips(res.msg, 1)
                }

            },
            error: function (err) {
                console.log(err);
            }
        });
    });
}
// 课程总打赏智慧豆数量
function beanSum($lessonId) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/ScoreWisdombeanSum",
        data: {
            courseid: $lessonId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            $("#beanSum").text("x" + res.data);
        },
        error: function (err) {
            console.log(err);
        }
    });
}
//各级评分数量
function scoreSum($lessonId) {
    var uId = localStorage.getItem("uid"); //用户id
    var token = localStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/ScoreList",
        data: {
            uid: uId,
            token: token,
            courseid: $lessonId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                var list = $(".score-detail>li");
                $.each(res.data, function (index, val) {
                    $.each(list, function (i, v) {
                        if (i == index) {
                            $(this).children("span").text(":" + val.sum);
                        }
                    });
                });
            } else if (res.code == 10000) {
                repeatLogin();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 获取课程留言列表
function messageList(pageIndex, lessonId, transferId, headimg, nickname, tId) {
    // console.log(tId);
    var uId = localStorage.getItem("uid"); //用户id
    var token = localStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/CommentList",
        data: {
            courseid: lessonId,
            page: pageIndex
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                var data = res.data;
                var $str = "";
                $(".leave-message-title>span").html(data.commentcount);
                $.each(data.list, function (index, val) {
                    var replay = val.reply;
                    $str += `   
                <li>
                    <div class="leave-content" data-id="${val.id}">
                        <div class="avatar-message"><img src="${val.userinfo.headimg}"/></div>
                        <span class="tourist-name">${val.userinfo.nickname}</span>
                        <span class="leave-message-time">${val.create_time}</span>
                        <p class="leave-message-detail">${val.content}</p>
                    </div>
                    ${replay == ""?"":`
                    <div class="reply-content">
                        <div class="avatar-message">
                        <img src="${headimg}"/>
                        <div class="tutorTitle">导师</div>
                        </div>
                        <span class="tourist-name">${nickname}</span>
                        <p class="reply-message-detail">${val.reply}</p>
                    </div>
                    `}
                </li>
                 `;
                });
                if (transferId == 1) {
                    $("#msgContent>ul").html($str);
                } else if (transferId == 2) {
                    $("#msgContent>ul").append($str);
                }
                // 发表留言
                $(".message-btn").click(function () {
                    allClick();
                    if (uId != tId) {
                        $(".releaseContent").show();
                        $(".message-btn").hide();
                        $("#messageText1").focus();
                        /*字数限制*/
                        $("#messageText1").on("input propertychange", function () {
                            var $this = $(this),
                                _val = $this.val(),
                                count = "";
                            if (_val.length > 100) {
                                $this.val(_val.substring(0, 100));
                            }
                        });
                        // 点击发布
                        $("#releaseBtn").unbind('click').bind('click', function () {
                            allClick();
                            $text1 = $("#messageText1").val();
                            if ($text1 != "") {
                                commentRelease(lessonId, $text1, headimg, nickname, tId); //发表课程留言
                            } else {
                                flowerTips("请先输入留言内容~", 1);
                            }
                        });
                    } else {
                        flowerTips("导师不可以评论自己哦~", 1);
                    }
                });
                // 回复
                $(".leave-content").click(function () {
                    allClick();
                    var pId = $(this).attr("data-id"); //评论列表的id(父id)
                    // var tId = localStorage.getItem("commentid"); //导师id
                    if (uId == tId) {
                        $(".message-btn").hide();
                        $(".replayContent").show();
                        $("#messageText2").focus();
                        /*字数限制*/
                        $("#messageText2").on("input propertychange", function () {
                            var $this = $(this),
                                _val = $this.val(),
                                count = "";
                            if (_val.length > 100) {
                                $this.val(_val.substring(0, 100));
                            }
                        });
                        // 点击回复
                        $("#replayBtn").unbind('click').bind('click', function () {
                            allClick();
                            var $text2 = $("#messageText2").val();
                            if ($text2 != "") {
                                commentReply(pId, lessonId, $text2, headimg, nickname, tId); //回复留言
                            } else {
                                flowerTips("请先输入留言内容~", 1);
                            }
                        });
                    } else {
                        flowerTips("只有导师可以回复哦~", 1);
                    }
                });
                // 触底刷新
                var nDivHight = $("#msgContent").height();
                // console.log(nDivHight);
                $("#msgContent").unbind().bind("scroll", function () {
                    var nScrollHight = $(this)[0].scrollHeight;
                    var nScrollTop = $(this)[0].scrollTop;
                    if (nScrollTop + nDivHight >= nScrollHight) {
                        var mPage = pageIndex;
                        mPage++;
                        // console.log(mPage);
                        messageList(mPage, lessonId, 2, headimg, nickname, tId);
                    }
                });
                // 清除触底刷新
                if (data.list.length != 10 || data.list.length == 0) {
                    $("#msgContent").unbind('scroll');
                }
            } else if (res.code == 10000) {
                repeatLogin();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}
// 发布课程留言
function commentRelease(lessonId, $text, headimg, nickname, tId) {
    var uId = localStorage.getItem("uid"); //用户id
    var token = localStorage.getItem("token");
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/Wisdom/CommentRelease",
        data: {
            uid: uId,
            token: token,
            courseid: lessonId,
            content: $text
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                $(".message-btn").show();
                $(".releaseContent").hide();
                messageList(1, lessonId, 1, headimg, nickname, tId);
            } else if (res.code == 10000) {
                repeatLogin();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 回复留言
function commentReply(pId, lessonId, $text, headimg, nickname, tId) {
    console.log(pId);
    var uId = localStorage.getItem("uid"); //用户id
    var token = localStorage.getItem("token");
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/Wisdom/CommentReply",
        data: {
            commentid: pId,
            uid: uId,
            token: token,
            courseid: lessonId,
            content: $text
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                $(".message-btn").show();
                $(".replayContent").hide();
                messageList(1, lessonId, 1, headimg, nickname, tId);
            } else if (res.code == 10000) {
                repeatLogin();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 举报
function regular(lessonId, num) {
    allClick();
    var uId = localStorage.getItem("uid"); //用户id
    var token = localStorage.getItem("token");
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/Wisdom/Regular",
        data: {
            uid: uId,
            token: token,
            courseid: lessonId,
            classify: num
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                flowerTips("已举报~", 1);
                $("#reportShade").hide();
            } else if (res.code == 10000) {
                repeatLogin();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 播放次数统计
function courseStudy(courseId) {
    var uId = localStorage.getItem("uid"); //用户id
    var token = localStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/CourseStudy",
        data: {
            uid: uId,
            token: token,
            courseid: courseId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 10000) {
                repeatLogin();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}