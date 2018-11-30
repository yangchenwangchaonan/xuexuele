$(function () {
    attentionList();

    // 返回
    $("#myAttentionBack").click(function () {
        $(window).attr("location", "./personal-center.html");
    });
});

// 关注列表
function attentionList() {
    var uId = localStorage.getItem("uid");
    var token = localStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/My/FollowList",
        data: {
            uid: uId,
            token: token
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                var data = res.data;
                var str = "";
                if (data == "") {
                    $(".attention-list").html("")
                }
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
                        <div class="attention-nosign attention-signed" onclick="followNot(${val.followid})">已关注</div>
                    </li>
                     `;
                        $(".attention-list").html(str);
                        // 查看导师详情
                        $(".followig").click(function () {
                            allClick();
                            var followid = $(this).attr("data-fid");
                            $(window).attr("location", "attention-detail.html?fid=" + followid);
                        });
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


// 取消关注
function followNot(followId) {
    allClick();
    var uId = localStorage.getItem("uid");
    var token = localStorage.getItem("token");
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/Wisdom/FollowNot",
        data: {
            uid: uId,
            token: token,
            followid: followId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                attentionList();
            } else if (res.code == 10000) {
                repeatLogin();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}