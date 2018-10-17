$(function () {
    // 获取uId，lessonId，wisdombean
    var url = window.location.href;
    var arr1 = url.split("?");
    var arr3 = arr1[1].split("&");
    var uId = arr3[0].substr(arr3[0].indexOf("=") + 1);
    var lessonId = arr3[1].substr(arr3[1].indexOf("=") + 1);
    // var wisdombean = arr3[2].substr(arr3[2].indexOf("=") + 1);
    WisdomDetailList(uId, lessonId);
});

//解锁专辑课程列表详情
function WisdomDetailList(uId, lessonId) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/WisdomDetailList",
        data: {
            uid: uId,
            courseid: lessonId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var needBeans = data.sum;
            $(".series-top>span").html("x" + needBeans);
            $(".series-name").html(data.albumname.albumname);
            var str = "";
            $.each(data.list, function (index, val) {
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
            $(".series-title-list").prepend(str);
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
                    WisdomUnlock(uId, lessonId, needBeans);
                });
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 课程解锁 
function WisdomUnlock(uId, lessonId, needBeans) {
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/Wisdom/WisdomUnlock",
        data: {
            uid: uId,
            courseid: lessonId,
            wisdombean: needBeans
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