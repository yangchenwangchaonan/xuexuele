// 获取uid、lessonid
var url = window.location.href;
var arr = url.split("&");
var lessonId = arr[0].split("=")[1];
var sortId = arr[1].split("=")[1]
var countSum = 0;
// swiper
var mySwiper = new Swiper('.swiper-container', {
    threshold : 100,
    on: {
        slideChangeTransitionEnd: function (event) {
            console.log(mySwiper.activeIndex);
            countSum++;
            console.log(countSum);
            if (mySwiper.activeIndex == 2) {
                //插入下一节课程
                var nextId = $('section.swiper-slide').eq(mySwiper.activeIndex).attr('data-nextid');
                if (nextId != "") {
                    getPrevNextData(nextId, countSum);
                    mySwiper.removeSlide(0); //移除第一个
                } else {
                    alert("已经是课程的最后了~");
                }
            } else if (mySwiper.activeIndex == 0) {
                //插入上一节课程
                var lastId = $('section.swiper-slide').eq(mySwiper.activeIndex).attr('data-lastid');
                if (lastId != "") {
                    getPrevNextData(lastId, countSum, 'last');
                    mySwiper.removeSlide(2); //移除最后一个
                } else {
                    alert("已经是课程的最前了~");
                }
            }
        },
    },
});

$(function () {
    // 返回
    $("#lessonDetailBack").click(function () {
        history.back(-1);
    });
    //智慧社详情
    lessonDetail(lessonId, 1)
});

// 智慧社详情
function lessonDetail(lessonId, countSum, follow) {
    var uId = sessionStorage.getItem("uid"); //用户id
    // 获取当前页数据
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/WisdomDetail",
        data: {
            uid: uId,
            courseid: lessonId,
            sort: sortId,
            bannersort: countSum
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var str = "";
            str += `
            <section class="swiper-slide lesson-audio" data-lastid="${data.lastid}" data-courseid="${lessonId}" data-nextid="${data.nextid}" data-count="${countSum}">
                <img src="${data.list.courseimg}"/>
                <div class="audio">
                    <h1>${data.list.coursename}</h1>
                    <div class="lesson-tutor">
                        <ul>
                            <li>
                                <div class="head-imgBg">
                                    <img src="${data.list.headimg}"/>
                                </div>
                                ${data.list.identity == 2?`<div class="tutor-title visitor-title">游侠</div>`:
                                `<div class="tutor-title">导师</div>`
                                }
                            </li>
                            <li class="useName">${data.list.nickname}</li>
                        </ul>
                        <div class="attention" data-isfollow="${data.isfollow}" data-followid="${data.list.id}">${data.isfollow == 1?'已关注':'关注'}</div>
                    </div>
                    <div class="action-bar">
                        ${data.isscore == 1?`<ul class="scoreList"  data-isscore="${data.isscore}"><img src="../../images/138.png" /><span>${data.list.coursescore}</span><p>已评分</p></ul>`:
                        `<ul class="appraiseList"><img src="../../images/138.png" /><span></span><p>可评分</p></ul>`}
                        <ul class="shareList"><img src="../../images/139.png" /></ul>
                        <ul class="msgList"><img src="../../images/140.png" /><p>${data.list.commentsum}</p></ul>
                        <ul class="amList"><img src="../../images/141.png" /><p>所属专辑</p></ul>
                        <ul class="courseTextList"><img src="../../images/142.png" /><p>看文字</p></ul>
                        <ul class="courseDetailList"><img src="../../images/143.png" /><p>课程介绍</p></ul>
                        <ul class="reportList"><img src="../../images/144.png" /><p>举报</p></ul>
                    </div>
                    <div class="audio-content">
                        <audio class="lessonAudio" src="${data.list.coursevoice}"></audio>
                        <div class="progressBar">
                            <div class="progressReal"></div>
                            <i class="progressKey"></i>
                        </div>
                        <span class="successed">00:00</span>
                        <span class="unsuccessed">${data.list.coursetime}</span>
                        <div class="progress-bar progress-stop"></div>
                    </div>
                </div>
            </section>
            `;
            $('div.swiper-wrapper').html(str); //当前页
            getPrevNextData(data.lastid, countSum, "last"); //上一页
            getPrevNextData(data.nextid, countSum); //下一页
            allEvent(); //所有事件
        },
        error: function (err) {
            console.log(err);
        }
    });
}

//获取上一页和下一页数据
function getPrevNextData(id, countSum, type) {
    console.log(id,countSum)
    var uId = sessionStorage.getItem("uid"); //用户id
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/WisdomDetail",
        data: {
            uid: uId,
            courseid: id,
            sort: sortId,
            bannersort: countSum
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var str1 = "";
            str1 += `
            <section class="swiper-slide lesson-audio" data-lastid="${data.lastid}" data-courseid="${id}" data-nextid="${data.nextid}" data-count="${countSum}">
                <img src="${data.list.courseimg}"/>
                <div class="audio">
                    <h1>${data.list.coursename}</h1>
                    <div class="lesson-tutor">
                        <ul>
                            <li>
                                <div class="head-imgBg">
                                    <img src="${data.list.headimg}"/>
                                </div>
                                ${data.list.identity == 2?`<div class="tutor-title visitor-title">游侠</div>`:
                                `<div class="tutor-title">导师</div>`
                                }
                            </li>
                            <li class="useName">${data.list.nickname}</li>
                        </ul>
                        <div class="attention" data-isfollow="${data.isfollow}" data-followid="${data.list.id}">${data.isfollow == 1?'已关注':'关注'}</div>
                    </div>
                    <div class="action-bar">
                        ${data.isscore == 1?`<ul class="scoreList"  data-isscore="${data.isscore}"><img src="../../images/138.png" /><span>${data.list.coursescore}</span><p>已评分</p></ul>`:
                        `<ul class="appraiseList"><img src="../../images/138.png" /><span></span><p>可评分</p></ul>`}
                        <ul class="shareList"><img src="../../images/139.png" /></ul>
                        <ul class="msgList"><img src="../../images/140.png" /><p>${data.list.commentsum}</p></ul>
                        <ul class="amList"><img src="../../images/141.png" /><p>所属专辑</p></ul>
                        <ul class="courseTextList"><img src="../../images/142.png" /><p>看文字</p></ul>
                        <ul class="courseDetailList"><img src="../../images/143.png" /><p>课程介绍</p></ul>
                        <ul class="reportList"><img src="../../images/144.png" /><p>举报</p></ul>
                    </div>
                    <div class="audio-content">
                        <audio class="lessonAudio" src="${data.list.coursevoice}"></audio>
                        <div class="progressBar">
                            <div class="progressReal"></div>
                            <i class="progressKey"></i>
                        </div>
                        <span class="successed">00:00</span>
                        <span class="unsuccessed">${data.list.coursetime}</span>
                        <div class="progress-bar progress-stop"></div>
                    </div>
                </div>
            </section>
            `;
            if (type == 'last') {
                mySwiper.prependSlide(str1); //前面插入
            } else {
                mySwiper.appendSlide(str1); //后面插入
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function allEvent() {

    // 关注
    $(document).unbind().on('click', 'div.attention', function () {
        console.log($(this))
        var isfollow = $(this).attr("data-isfollow"); //是否关注
        var followid = $(this).attr("data-followid");
        var courseId = $(this).parents("section").attr("data-courseid");
        var countSum = $(this).parents("section").attr("data-count");
        // console.log(isfollow, followid,courseId,countSum,sortId);
        console.log(courseId);
        if (isfollow == 1) {
            noAttention(followid, courseId, countSum); //取消关注
        } else {
            onAttention(followid, courseId, countSum); //点击关注
        }
    })


    // var isfollow = data.isfollow;
    // var followid = data.list.id;
    // if (isfollow == 1) {
    //     $(".attention").html("已关注");
    //     $(".attention").unbind('click').on('click','', function () {
    //         noAttention(uId, followid, isfollow);
    //     });
    // } else if (isfollow == 0) {
    //     $(".attention").html("关注");
    //     $(".attention").unbind('click').bind('click', function () {
    //         onAttention(uId, followid, isfollow);
    //     });
    // }

}

//点击关注
function onAttention(followid, courseId, countSum) {
    var uId = sessionStorage.getItem("uid"); //用户id
    console.log(courseId);
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/Wisdom/FollowSpot",
        data: {
            uid: uId,
            followid: followid
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                flowerTips("关注导师成功 ", 1)
                lessonDetail(courseId, countSum, "点击关注");
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}
//取消关注
function noAttention(followid, courseId, countSum) {
    var uId = sessionStorage.getItem("uid"); //用户id
    console.log(courseId);
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/Wisdom/FollowNot",
        data: {
            uid: uId,
            followid: followid
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                flowerTips("已取消关注", 1);
                lessonDetail(courseId, countSum, "点击关注");
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}