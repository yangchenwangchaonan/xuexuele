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
            if (data.length == 0) {
                $(".no-attention").show();
            } else {
                $(".no-attention").hide();
                $.each(data, function (index, val) {
                    str += `
                     <li>
                        <div class="followig" data-fid="${val.followid}">
                            <div class="attention-img"><img src="${val.headimg}"/></div>
                            <p>${val.nickname}</p>
                        </div>
                        <div class="attention-nosign attention-signed">已关注</div>
                    </li>
                     `;
                    $(".attention-list").html(str);
                    // 查看导师详情
                    $(".followig").click(function () {
                        var followid = $(this).attr("data-fid");
                        $(window).attr("location", "attention-detail.html?fid="+followid);
                    });
                    //关注
                    var followId = val.followid;
                    var $followList = $(".attention-signed");
                    $followList.click(function () {
                        followNot(uId, followId);
                    });
                });
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}


// 取消关注
function followNot(uId, followId) {
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