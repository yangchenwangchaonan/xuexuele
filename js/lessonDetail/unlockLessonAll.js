$(function () {
    // 获取lessonId
    var url = window.location.href;
    console.log(url);
    var albumId = url.split("&")[0].split("=")[1];
    var sorId = url.split("&")[1].split("=")[1];
    console.log(albumId, sorId);
    UnlockAllCourseDetail(albumId, sorId);
    // 返回
    $("#unlockLessonAllBack").click(function () {
        history.back(-1);
    });
});

// 获取专辑未解锁课程列表
function UnlockAllCourseDetail(albumId, sorId) {
    var uId = localStorage.getItem("uid");
    var token = localStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/UnlockAllCourseDetail",
        data: {
            albumid: albumId,
            uid: uId,
            token: token
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
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
                        WisdomUnlockAll(albumId, sorId);
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

// 解锁全部未解锁课程
function WisdomUnlockAll(albumId, sorId) {
    var uId = localStorage.getItem("uid");
    var token = localStorage.getItem("token");
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/Wisdom/WisdomUnlockAll",
        data: {
            uid: uId,
            token: token,
            albumid: albumId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                $(".unlock-btn").click(function () {
                    $(".unlock-shade").hide();
                    window.setTimeout(function() {
                        $(window).attr("location", "./album-name.html?albumId=" + albumId + "&sorId=" + sorId);
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