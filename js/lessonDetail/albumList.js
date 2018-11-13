$(function () {
    var uId = sessionStorage.getItem("uid");
    var url = window.location.href;
    var arr = url.split("=");
    var albumId = arr[1];
    albumCourseList(albumId, uId);

    // 返回
    $("#albumListBack").click(function () {
        history.back(-1);
    });

});
// 专辑列表
function albumCourseList(albumId, uId) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/AlbumCourseList",
        data: {
            albumid: albumId,
            uid: uId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            $(".album-top>img").attr("src", data.albumimg);
            $(".album-text").html(data.albumname);
            $(".album-detail").html(data.albumcontent);
            var str = "";
            $(".noLesson-content").hide();
            $.each(data.courselist, function (index, val) {
                var lock = val.islock;
                str += `
                        <div class="lesson-title">
                            <div class="list-num">${index+1}</div>
                            <div class="lesson-list-detail">
                                <div class="lesson-list-title">
                                    <div class="lesson-list-name" data-cid="${val.id}">${val.coursename}</div>
                        `;
                if (lock == 1) {
                    str += `
                            <div class="lesson-play" title="${val.coursevoice}" data-cid="${val.id}"><span>播放</span><audio src="${val.coursevoice}" preload="load"></audio></div>
                        `;
                } else if (lock == 0) {
                    str += `
                            <div class="lesson-locked" data-cid="${val.id}"><img src="../../images/165.png" /><span>锁定<span/><audio src="${val.coursevoice}" preload="load"></audio></div>
                        `;
                }
                str += `
                                </div>
                                <div class="lesson-list-tab">
                                    <ul>
                                        <li><img src="../../images/161.png" /><span>${val.coursescore}</span></li>
                                        <li><img src="../../images/162.png" /><span>${val.coursetime}</span></li>
                                        <li><img src="../../images/163.png" /><span>${val.commentsum}</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `;
            });
            $(".lesson-title-list").html(str);

            // 改变暂停/播放icon
            $(".lesson-play").click(function () {
                var audio = $(this).children("audio")[0];
                // console.log($(this).children("audio"))
                if (audio.paused) {
                    audio.play();
                    $(this).addClass("lesson-playing");
                    $(this).prepend('<img src="../../images/164.png"/>');
                    $(this).children("span").html("播放中");
                    // 兄弟元素
                    $(this).parents(".lesson-title").siblings().find(".lesson-play").removeClass("lesson-playing");
                    $(this).parents(".lesson-title").siblings().find(".lesson-play>span").html("播放");
                    $(this).parents(".lesson-title").siblings().find(".lesson-play>img").remove("");
                    // $(this).parents(".lesson-title").siblings().find(".lesson-play>audio").attr("paused", true);
                    var audio2 = $(this).parents(".lesson-title").siblings().find(".lesson-play>audio");
                    for (var i = 0; i < audio2.length; i++) {
                        audio2[i].pause();
                    }
                } else {
                    audio.pause();
                    $(this).removeClass("lesson-playing");
                    $(this).children("img").remove("");
                    $(this).children("span").html("播放");
                }
            });

            // 点击锁定
            $(".lesson-locked").click(function () {
                var courseId = $(this).attr("data-cid");
                $(window).attr("location", "./unlock_one.html?courseid=" + courseId);
            });

            // 判断是否有未解锁的课程
            var unlockNum = $(".lesson-locked").length;
            var $str = "";
            if (unlockNum != 0) {
                $str = `<div class="album-add" id="lockBtn">解锁全部未解锁课程</div>`;
                $(".album-box").append($str);
                // 点击解锁全部
                $("#lockBtn").click(function () {
                    $(window).attr("location", "./unlock_all.html?albumId=" + albumId);
                });
            }

            // 课程详情
            $(".lesson-list-name,.lesson-list-tab").click(function(){
                var lessonId = $(".lesson-list-name").attr("data-cid");
                window.location.replace("./lesson-detail.html?cid="+lessonId+"&sid=5");
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
}


function lockAll(uid, aid) {
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/Wisdom/WisdomUnlockAll",
        data: {
            uid: uid,
            albumid: aid
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                albumCourseList(aid, uid);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}