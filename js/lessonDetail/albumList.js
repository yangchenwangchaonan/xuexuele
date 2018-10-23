$(function () {
    var uId = sessionStorage.getItem("uid");
    var url = window.location.href;
    var arr = url.split("=");
    var albumId = arr[1];
    albumCourseList(albumId, uId);
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
                                    <div class="lesson-list-name">${val.coursename}</div>
                        `;
                if (lock == 1) {
                    str += `
                            <div class="lesson-play" data-cid="${val.id}"><img src="" />播放</div>
                        `;
                } else if (lock == 0) {
                    str += `
                            <div class="lesson-locked" data-cid="${val.id}"><img src="../../images/165.png" />锁定</div>
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

            // 点击锁定
            $(".lesson-locked").click(function(){
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