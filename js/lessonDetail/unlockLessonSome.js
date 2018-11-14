$(function () {
    // 获取uId，lessonId
    var uId = sessionStorage.getItem("uid");
    var url = window.location.href;
    var arr1 = url.split("=");
    var lessonId = arr1[1];
    UnlockCourseDetail(uId, lessonId);
    // 返回
    $("#unlockLessonSomeBack").click(function(){
        history.back(-1);
    });
});

//单一解锁专辑课程列表详情
function UnlockCourseDetail(uId, lessonId) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/UnlockCourseDetail",
        data: {
            courseid: lessonId,
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
            } else if (hasBeans >= needBeans) {
                var str1 = "";
                str1 += `<div class="hasbeans-btn" id="lockNow">立即解锁</div>`;
                $(".series-hasbeans").prepend(str1);
                //立即加入
                $("#lockNow").click(function () {
                    $(".unlock-shade").show();
                    WisdomUnlock(uId, lessonId);
                });
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 课程解锁 (单个解锁)
function WisdomUnlock(uId, lessonId) {
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/Wisdom/WisdomUnlock",
        data: {
            uid: uId,
            courseid: lessonId,
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                $(".unlock-btn").click(function () {
                    $(window).attr("location", "./lesson-detail.html?lessonId=" + lessonId);
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