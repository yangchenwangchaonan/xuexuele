$(function () {
    var userId = 1;
    userLetter(userId);
});

/* 获取站内信 */
function userLetter(userId) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserMessage",
        data: {
            uid: userId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            if (data.length == 0) {
                $(".noletter").css("display", "block");
            } else {
                var $str = "";
                $.each(data, function (index, val) {
                    $str += `
                    <div class="letter-detail">
                        <div class="letter-inner" data-id="${val.id}">
                            <li data-read="${val.is_read}"><span>${val.heading}</span></li>
                            <span>${val.create_time}</span>
                            <p>${val.content}</p>
                        </div>
                        <div class="letter-del">
                            <img src="../../images/69.png" class="del-key" />
                        </div>
                    </div>
                    `;
                });
                $(".letter-wrapper").append($str);
                var $isRead = $(".letter-inner>li");
                $.each($isRead, function (index, val) {
                    var $list = $(this).attr("data-read");
                    if ($list == 1) {
                        $(this).addClass("readList");
                    }
                });
            }
            /* 查看站内信详情 */
            $("div.letter-detail").click(function () {
                var letterId = $(this).children("div.letter-inner").attr("data-id");
                $(window).attr("location", "./letter-infor.html?id=" + letterId + "&uid=" + userId);
            });

            // 删除站内信
           
            

        },
        error: function (err) {
            console.log(err);
        }
    });
}