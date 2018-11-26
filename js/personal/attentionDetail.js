$(function () {
    // 获取当前页面路径
    var url = window.location.href;
    var arr = url.split("=");
    var followId = arr[1];
    attentionDetail(followId);

    //返回
    $("#attentionDetailBack").click(function(){
        $(window).attr("location","./my-attention.html");
    });
});

// 关注详情
function attentionDetail(fId) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/My/FollowDetail",
        data: {
            followid: fId,
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            $(".head-bg>img").attr("src", data.headimg);
            $(".attention-tutor-avatar>p").html(data.nickname);
            var introduction = data.introduction;
            console.log(introduction);
            // 导师简介
            if (introduction == "" || introduction == null || introduction == undefined) {
                $(".follow-tutorInfor").html("暂无简介");
            } else {
                $(".follow-read").show();
                $(".follow-close").hide();
                var textLen = introduction.length;
                if (textLen > 41) {
                    var num = data.introduction.substring(0, 41);
                    $("p.follow-tutorInfor").html(num + "...");
                    // 展开更多
                    $(".follow-read").click(function () {
                        allClick();
                        $("p.follow-tutorInfor").html(introduction);
                        $(".follow-read").hide();
                        $(".follow-close").show();
                    });
                    // 收起更多
                    $(".follow-close").click(function () {
                        allClick();
                        $("p.follow-tutorInfor").html(num + "...");
                        $(".follow-read").show();
                        $(".follow-close").hide();
                    });
                } else {
                    $("p.follow-tutorInfor").html(introduction);
                    // // 展开更多
                    // $(".follow-read").click(function () {
                    //     $("p.follow-tutorInfor").html(introduction);
                    //     $(".follow-read").hide();
                    //     $(".follow-close").show();
                    // });
                    // // 收起更多
                    // $(".follow-close").click(function () {
                    //     $("p.follow-tutorInfor").html(introduction);
                    //     $(".follow-read").show();
                    //     $(".follow-close").hide();
                    // });
                }
            }
            // 专辑列表
            var str = "";
            var albumlist = data.albumlist;
            $.each(albumlist, function (index, val) {
                str += `
                    <li data-id="${val.id}">
                        <div class="attention-album-name"><img src="${val.albumimg}"></div>
                        <p>${val.albumname}</p>
                    </li>
                 `;
            });
            $(".attention-album-list").html(str);
            $(".attention-album-list>li").click(function () {
                allClick();
                var albumId = $(this).attr("data-id");
                $(window).attr("location", "../lessonDetail/album-name.html?albumId=" + albumId);
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
}