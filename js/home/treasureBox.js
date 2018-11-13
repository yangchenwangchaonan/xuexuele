$(function () {
    var uId = sessionStorage.getItem("uid");
    treasureBoxList(1, uId); //默认特殊奖励列表
    // 特殊奖励
    $("#specialReward").unbind().bind("click", function () {
        $(".nogift").hide();
        $(".treasureBox-wrapper").html("");
        $(this).addClass("treasureBoxSpecial2").siblings().removeClass("treasureBoxOrdinary2");
        treasureBoxList(1, uId); 
    });
    // 推荐奖励
    $("#ordinaryReward").unbind().bind("click", function () {
        $(".nogift").hide();
        $(".treasureBox-wrapper").html("");
        $(this).addClass("treasureBoxOrdinary2").siblings().removeClass("treasureBoxSpecial2");
        userBoxCourse(1, uId);
    });
});

// 特殊奖励
function treasureBoxList(page, uId) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserBaobox",
        data: {
            uid: uId,
            page: page
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            // 无礼物
            // console.log(data.length);
            if (page == 1 && data.length == 0) {
                $(".nogift").show();
                $("#endding").hide();
            }
            // 有礼物
            var str1 = "";
            $.each(data, function (index, val) {
                // console.log(val.type);
                str1 += `
                ${val.type==1?`
                <div class="treasureBox-gift treasureBox-gift1" data-id=${val.id}>
                    <div class="articleGift"></div>
                    <li><span>${val.gatename}</span></li>
                    <p>${val.heading}</p>
                </div>
                `:`
                <div class="treasureBox-gift treasureBox-gift2" data-id=${val.id}>
                    <div class="musicGift"></div>
                    <li><span>${val.gatename}</span></li>
                    <p>${val.heading}</p>
                </div>
                `}
                `;
            });
            if(page==1){
                $(".treasureBox-wrapper").html(str1);
            }else {
                $(".treasureBox-wrapper").append(str1);
            }
            
            // 触底刷新
            var nDivHight = $(".treasureBox-wrapper").height();
            $(".treasureBox-wrapper").unbind('scroll').bind('scroll', function () {
                // console.log(page);
                var nScrollHight = $(this)[0].scrollHeight;
                var nScrollTop = $(this)[0].scrollTop;
                if (nScrollTop + nDivHight >= nScrollHight) {
                    var sPage = page;
                    sPage++;
                    // console.log("mPage:" + mPage);
                    treasureBoxList(sPage, uId);
                }
            });
            //没有更多
            if (page != 1 && (data.length != 10 || data.length == 0)) {
                $(".treasureBox-wrapper").append("<p class='endding'>-没有更多奖励了-</p>");
                $(".treasureBox-wrapper").unbind('scroll');
            }

            // 文章
            $(".treasureBox-gift1").click(function () {
                var $id1 = $(this).attr("data-id");
                $(window).attr("location", "./treasureBox_detail.html?id=" + $id1);
            });
            // 音频
            $(".treasureBox-gift2").click(function () {
                var $id2 = $(this).attr("data-id");
                $(window).attr("location", "./treasureBox_audio.html?id=" + $id2);
            });
        },
        error: function (err) {
            console.log(err)
        }
    });
}

// 推荐奖励-->课程
function userBoxCourse(boxPage, uId) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserBaoboxCourse",
        data: {
            uid: uId,
            page: boxPage
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            // 无礼物
            if (boxPage == 1 && data.length == 0) {
                $(".nogift").show();
                $("#endding").hide();
            }
            // 有礼物
            var str2 = "";
            $.each(data, function (index, val) {
                str2 += `
                <div class="treasureBox-gift treasureBox-gift2" data-id=${val.id}>
                    <div class="musicGift"></div>
                    <li><span>${val.gatename}</span></li>
                    <p>${val.coursename}</p>
                </div>
                `;
            });
            $(".treasureBox-wrapper").html(str2);
            // 课程音频
            $(".treasureBox-gift2").click(function () {
                var $id2 = $(this).attr("data-id");
                $(window).attr("location", "./treasureBox_audio.html?id=" + $id2 + "&page=1");
            });
            // 触底刷新
            var nDivHight = $(".treasureBox-wrapper").height();
            $(".treasureBox-wrapper").unbind('scroll').bind('scroll', function () {
                // console.log(page);
                var nScrollHight = $(this)[0].scrollHeight;
                var nScrollTop = $(this)[0].scrollTop;
                if (nScrollTop + nDivHight >= nScrollHight) {
                    var rPage = page;
                    rPage++;
                    // console.log("mPage:" + mPage);
                    userBoxCourse(rPage, uId);
                }
            });
            //没有更多
            if (boxPage != 1 && (data.length == 0 || data.length != 10)) {
                $(".treasureBox-wrapper").append("<p class='endding'>-没有更多奖励了-</p>");
                $(".treasureBox-wrapper").unbind('scroll');
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}