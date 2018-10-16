$(function () {
    attentionDetail();
});

// 关注详情
function attentionDetail() {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/My/FollowDetail",
        data: {
            followid: 1,
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            $(".head-bg>img").attr("src",data.headimg);
            $(".attention-tutor-avatar>p").html(data.nickname);
            var introduction = data.introduction;
            // 导师简介
            if (introduction == "" || introduction == null || introduction == undefined) {
                $(".follow-tutorInfor").html("暂无简介");
            } else {
                $(".follow-read").show();
                $(".follow-close").hide();
                var textLen = introduction.length;
                if (textLen > 43) {
                    var num = data.introduction.substring(0, 43);
                    $("p.follow-tutorInfor").html(num + "...");
                } else {
                    $("p.follow-tutorInforr").html(introduction);
                }
            }
            $(".follow-read").click(function () {
                $("p.follow-tutorInfor").html(introduction);
                $(".follow-read").hide();
                $(".follow-close").show();
            });
            $(".follow-close").click(function () {
                $("p.follow-tutorInfor").html(num + "...");
                $(".follow-read").show();
                $(".follow-close").hide();
            });
            // 专辑列表
            var str = "";
            var albumlist = data.albumlist;
            $.each(albumlist, function (index, val) {
                str += `
                    <li>
                        <div class="attention-album-name"><img src="${val.albumimg}"></div>
                        <p>${val.albumname}</p>
                    </li>
                 `;
            });
            $(".attention-album-list").html(str);
        },
        error: function (err) {
            console.log(err);
        }
    });
}