$(function () {
    // 获取lessonId
    var url = window.location.href;
    var lessonId = url.split("=")[1];
    UnlockCourseDetail(lessonId);
    // 返回
    $("#unlockLessonOneBack").click(function () {
        history.back(-1);
    });
});

//单一解锁专辑课程列表详情
function UnlockCourseDetail(lessonId) {
    var uId = localStorage.getItem("uid");
    var token = localStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/UnlockCourseDetail",
        data: {
            courseid: lessonId,
            uid: uId,
            token: token
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                var data = res.data;
                var needBeans = data.totalwisdombean;
                var albumId = data.albumid;
                $(".series-top>span").html("x" + needBeans);
                $(".series-name").html(data.albumname);
                var str = "";
                str += `
                    <div class="lesson-title series-inner">
                        <div class="list-num series-num">1</div>
                        <div class="lesson-list-detail serise-list">
                            <div class="serise-list">
                                <div class="serise-title">${data.courselist.coursename}</div>
                                <div class="serise-beans"><img src="../../images/172.png" /><span>x${data.courselist.wisdombean}</span></div>
                            </div>
                        </div>
                    </div>
                `;
                $(".series-title-list").html(str);
                var hasBeans = data.userwisdombean;
                $(".series-hasbeans>span").html("剩余智慧豆数:" + hasBeans);
                //解锁
                if (hasBeans < needBeans) {
                    var str2 = "";
                    str2 += `<div class="nobeans-btn">智慧豆不足,立即充值</div>`;
                    $(".series-hasbeans").prepend(str2);
                    $(".nobeans-btn").click(function(){
                        $(window).attr("location","../purse/recharge.html");
                    });
                } else if (hasBeans >= needBeans) {
                    var str1 = "";
                    str1 += `<div class="hasbeans-btn" id="lockNow">立即解锁</div>`;
                    $(".series-hasbeans").prepend(str1);
                    //立即加入
                    $("#lockNow").click(function () {
                        allClick();
                        $(".unlock-shade").show();
                        WisdomUnlock(lessonId, albumId);
                    });
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

// 课程解锁 (单个解锁)
function WisdomUnlock(lessonId, albumId) {
    var uId = localStorage.getItem("uid");
    var token = localStorage.getItem("token");
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/Wisdom/WisdomUnlock",
        data: {
            uid: uId,
            token: token,
            courseid: lessonId,
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                $(".unlock-btn").click(function () {
                    $(".unlock-shade").hide();
                    window.setTimeout(function() {
                        $(window).attr("location", "./album-name.html?albumId=" + albumId);
                    }, 500);
                    
                });
            } else if (res.code == 10000) {
                repeatLogin();
            } else {
                alert(res.msg);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}