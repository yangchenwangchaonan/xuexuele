$(function () {
    lessonManageList();
    $(".album-add").click(function () {
        $(window).attr("location", "./album-add.html");
    });
    // 返回
    $("#albumManageBack").click(function () {
        window.location.replace("./personal-center.html");
    });
});

function lessonManageList() {
    var uId = localStorage.getItem("uid");
    var token = localStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/My/AlbumManageList",
        data: {
            uid: uId,
            token: token
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                var data = res.data;
                var albumlist = res.data.albumlist;
                $(".manage-top>span").html("x" + data.wisdombean);
                if (albumlist.length == 0) {
                    $(".noAlbum-content").show();
                    $(".album-list").hide();
                    $(".album-list").html("");
                } else {
                    var str = "";
                    $.each(albumlist, function (index, val) {
                        str += `
                    <div class="album-manage" data-aid="${val.id}">
                        <div class="album-href">
                            <img src="${val.albumimg}" />
                            <h1>${val.albumname}</h1>
                            <p>课程数量：${val.coursenum}</p>
                        </div>
                        <i class="manage-btn">操作</i>
                        <div class="album-operate">
                            <div class="operate-del"><img src="../../images/227.png" />删除</div>
                            <div class="operate-edit"><img src="../../images/228.png" />编辑</div>
                        </div>
                    </div>
                     `;
                    });
                    $(".album-list").html(str);
                    // 专辑操作
                    var flag = true;
                    $(".manage-btn").click(function () {
                        allClick();
                        var aid = $(this).parent().attr("data-aid");
                        $(this).parent().find(".album-operate").show();
                        $(this).parent().siblings().find(".album-operate").hide();
                        if (flag) {
                            $(this).parent().find(".album-operate").show();
                            $(this).parent().siblings().find(".album-operate").hide();
                            flag = false;
                            // 专辑删除
                            $(".operate-del").click(function () {
                                allClick();
                                $(this).parent(".album-operate").hide();
                                albumDel(aid);
                            });
                            // 专辑编辑
                            $(".operate-edit").click(function () {
                                $(window).attr("location", "./album-add.html?aid=" + aid);
                            });
                        } else {
                            $(this).parent().find(".album-operate").hide();
                            flag = true;
                        }
                    });
                    // 专辑详情
                    $(".album-href").click(function () {
                        allClick();
                        var $aid = $(this).parent().attr("data-aid");
                        $(window).attr("location", "./album-detail.html?aid=" + $aid);
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

// 删除专辑
function albumDel(aId) {
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/My/AlbumDelete",
        data: {
            _method: "DELETE",
            id: aId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                $("#delTips2").show();
                window.setTimeout(() => {
                    $("#delTips2").hide();
                    lessonManageList();
                }, 2000); //延迟2s隐藏
            } else {
                $("#delTips1>.tip-text").html(res.msg);
                $("#delTips1").show();
                $("#closeBn").click(function () {
                    allClick();
                    $("#delTips1").hide();
                });
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}