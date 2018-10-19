$(function () {
    lessonManageList();
    $(".album-add").click(function () {
        $(window).attr("location", "./album-add.html");
    });
});

function lessonManageList() {
    var uId = sessionStorage.getItem("uid");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/My/AlbumManageList",
        data: {
            uid: uId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var albumlist = res.data.albumlist;
            $(".manage-top>span").html("x" + data.wisdombean);
            if (albumlist.length == 0) {
                $(".noAlbum-content").show();
                $(".album-list").hide();
            } else {
                $(".noAlbum-content").hide();
                $(".album-list").show();
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
                    var aid = $(this).parent().attr("data-aid");
                    $(this).parent().find(".album-operate").show();
                    $(this).parent().siblings().find(".album-operate").hide();
                    if (flag) {
                        $(this).parent().find(".album-operate").show();
                        $(this).parent().siblings().find(".album-operate").hide();
                        flag = false;
                        // 专辑删除
                        $(".operate-del").click(function () {
                            albumDel(this, aid);
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
                $(".album-href").click(function(){
                    var $aid = $(this).parent().attr("data-aid");
                    $(window).attr("location","./album-detail.html?aid="+$aid);
                });
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 删除专辑
function albumDel(e, aId) {
    console.log(aId);
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
            var code = res.code;
            if (code == 1) {
                $(e).parent().find(".album-operate").hide();
                lessonManageList();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}