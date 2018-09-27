$(function () {
    /* 百宝箱列表*/
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserBaobox",
        data: {
            uid: 1,
            page: 1
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var str1 = "";
            var str2 = "";
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
                    $(".treasureBox-wrapper").append(str2);
                }
            });
            // 点击跳转
            var $treasureboxGift1 = $(".treasureBox-gift1");
            var $treasureboxGift2 = $(".treasureBox-gift2");
            $treasureboxGift1.click(function () {
                var $id = $(this).attr("data-id");
                $(window).attr("location", "./treasureBox_detail.html?id="+$id);
            });
            $treasureboxGift2.click(function () {
                var $id = $(this).attr("data-id");
                $(window).attr("location", "./treasureBox_audio.html?id="+$id);
            });
        },
        error: function (err) {
            console.log(err)
        }
    });
});