$(function () {
    var userId = 1;
    /* 获取站内信 */
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
                    <div class="letter-inner" data-id="${val.id}"|>
                        <div class="letter-del">
                            <img src="../../images/69.png" class="del-key" />
                        </div>
                        <li data-read="${val.is_read}"><span>${val.heading}</span></li>
                        <span>${val.create_time}</span>
                        <p>${val.content}</p>
                    </div>
                    `;
                });
                $(".letter-wrapper").append($str);
                var $isRead = $(".letter-wrapper li");
                $.each($isRead, function (index, val) {
                    var $list = $(this).attr("data-read");
                    if ($list == 1) {
                        $(this).addClass("readList");
                    }
                });
            }
            /* 查看站内信详情 */
            $("div.letter-inner").click(function () {
                var letterId = $(this).attr("data-id");
                $(window).attr("location", "./letter-infor.html?id=" + letterId + "&uid=" + userId);
            });
        },
        error: function (err) {
            console.log(err);
        }
    });








});