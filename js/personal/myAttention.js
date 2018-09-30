$(function () {
    var uId = 1;
    attentionList(uId);
});

// 关注列表
function attentionList(uId) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/My/FollowList",
        data: {
            uid: uId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var str = "";
            $.each(data, function (index, val) {
                str += `
                 <li>
                    <div class="followig">
                        <div class="attention-img"><img src="../../images/others.jpg"/></div>
                        <p>${val.nickname}</p>
                    </div>
                    <div class="attention-nosign"></div>
                </li>
                 `;
                $(".attention-list").append(str);
                // 查看导师详情
                $(".followig").click(function () {
                    $(window).attr("location", "attention-detail.html");
                });
                //判断是否被关注
                var followId = val.followid;
                $.ajax({
                    type: "GET",
                    url: APP_URL + "/api/Wisdom/Follow",
                    data: {
                        uid: uId,
                        followid: followId
                    },
                    dataType: "json",
                    success: function (res) {
                        console.log(res);
                        var code = res.code;
                        if (code == 1) {
                            $(".attention-nosign").eq(index).addClass("attention-signed");
                            $(".attention-nosign").eq(index).text("已关注");
                            $(".attention-nosign").eq(index).click(function () {
                                // 取消关注
                                $.ajax({
                                    type: "POST",
                                    url: APP_URL + "/api/Wisdom/FollowNot",
                                    data: {
                                        uid: uId,
                                        followid: followId
                                    },
                                    dataType: "json",
                                    success: function (res) {
                                        console.log(res);
                                        $(this).html("关注");
                                        window.location.reload();
                                    },
                                    error: function (err) {
                                        console.log(err);
                                    }
                                });
                            });
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });

            });

        }
    });
}
