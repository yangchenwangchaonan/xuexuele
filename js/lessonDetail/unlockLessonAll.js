$(function () {
    // 获取uId，lessonId
    var uId = sessionStorage.getItem("uid");
    var url = window.location.href;
    var arr1 = url.split("=");
    var albumId = arr1[1];
    UnlockAllCourseDetail(albumId, uId);
    // 返回
    $("#unlockLessonAllBack").click(function(){
        history.back(-1);
    });
});

// 获取专辑未解锁课程列表
function UnlockAllCourseDetail(albumId, uId) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/UnlockAllCourseDetail",
        data: {
            albumid: albumId,
            uid: uId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var needBeans = data.totalwisdombean;
            $(".series-top>span").html("x" + needBeans);
            $(".series-name").html(data.albumname);
            var str = "";
            $.each(data.courselist, function (index, val) {
                str += `
                    <div class="lesson-title series-inner">
                        <div class="list-num series-num">${index+1}</div>
                        <div class="lesson-list-detail serise-list">
                            <div class="serise-list">
                                <div class="serise-title">${val.coursename}</div>
                                <div class="serise-beans"><img src="../../images/172.png" /><span>x${val.wisdombean}</span></div>
                            </div>
                        </div>
                    </div>
                 `;
            });
            $(".series-title-list").html(str);
            var hasBeans = data.userwisdombean;
            $(".series-hasbeans>span").html("剩余智慧豆数:" + hasBeans);
            //解锁
            if (hasBeans < needBeans) {
                var str2 = "";
                str2 += `<div class="nobeans-btn">智慧豆不足,立即充值</div>`;
                $(".series-hasbeans").prepend(str2);
            } else if (hasBeans >= needBeans) {
                var str1 = "";
                str1 += `<div class="hasbeans-btn" id="lockNow">立即解锁</div>`;
                $(".series-hasbeans").prepend(str1);
                //立即加入
                $("#lockNow").click(function () {
                    $(".unlock-shade").show();
                    WisdomUnlockAll(albumId, uId);
                });
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 解锁全部未解锁课程
function WisdomUnlockAll(albumId, uId) {
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/Wisdom/WisdomUnlockAll",
        data: {
            uid: uId,
            albumid: albumId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                $(".unlock-btn").click(function () {
                    $(window).attr("location", "./album-name.html?albumId=" + albumId);
                });
            } else {
                alert(res.msg);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}