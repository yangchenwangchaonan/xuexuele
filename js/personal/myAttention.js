$(function () {
    var uId = sessionStorage.getItem("uid");
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
                    <div class="attention-nosign attention-signed">已关注</div>
                </li>
                 `;
                $(".attention-list").append(str);
                // 查看导师详情
                $(".followig").click(function () {
                    $(window).attr("location", "attention-detail.html");
                });
                //关注
                var followId = val.followid;
                var $followList = $(".attention-signed");
                $followList.click(function(){
                    followNot(uId,followId);
                });
            });
        }
    });
}


// 取消关注
function followNot(uId,followId) {
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
            window.location.reload();
        },
        error: function (err) {
            console.log(err);
        }
    });
}