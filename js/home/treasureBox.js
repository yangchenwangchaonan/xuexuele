$(function () {
    treasureBoxList(); //百宝箱列表
    // 特殊奖励
    $("#specialReward").click(function(){
        $(this).addClass("treasureBoxSpecial2").siblings().removeClass("treasureBoxOrdinary2");
        treasureBoxList(); //百宝箱列表
    });
    // 推荐奖励
    $("#ordinaryReward").click(function(){
        $(this).addClass("treasureBoxOrdinary2").siblings().removeClass("treasureBoxSpecial2");
        treasureBoxList(); //百宝箱列表
    });
});

// 百宝箱列表
function treasureBoxList() {
    var uId = sessionStorage.getItem("uid");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserBaobox",
        data: {
            uid: uId,
            page: 1
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var str1 = "";
            var str2 = "";
            // 无礼物
            if (data.length == 0) {
                $(".nogift").show();
                $("#endding").hide();
            }
            // 有礼物
            $.each(data, function (index, val) {
                var type = val.type;
                if (type == 1) {
                    str1 += `
                    <div class="treasureBox-gift treasureBox-gift1" data-id=${val.id}>
                        <div class="articleGift"></div>
                        <li><span>${val.gatename}</span></li>
                        <p>${val.heading}</p>
                    </div>
                    `;
                    $(".treasureBox-wrapper").append(str1);
                } else if (type == 2) {
                    str2 += `
                    <div class="treasureBox-gift treasureBox-gift2" data-id=${val.id}>
                        <div class="musicGift"></div>
                        <li><span>${val.gatename}</span></li>
                        <p>${val.heading}</p>
                    </div>
                    `;
                    $(".treasureBox-wrapper").html(str2);
                }
            });
            // 点击跳转
            var $treasureboxGift1 = $(".treasureBox-gift1");
            var $treasureboxGift2 = $(".treasureBox-gift2");
            $treasureboxGift1.click(function () {
                var $id = $(this).attr("data-id");
                $(window).attr("location", "./treasureBox_detail.html?id=" + $id);
            });
            $treasureboxGift2.click(function () {
                var $id = $(this).attr("data-id");
                $(window).attr("location", "./treasureBox_audio.html?id=" + $id);
            });
        },
        error: function (err) {
            console.log(err)
        }
    });
}