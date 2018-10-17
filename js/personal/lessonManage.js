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
            uid: 1
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var albumlist = res.data.albumlist;
            $(".manage-top>span").html("x" + data.wisdombean);
            var str = "";
            $.each(albumlist, function (index, val) { 
                 str += `
                    <div class="album-manage">
                        <img src="${val.albumimg}" />
                        <h1>${val.albumname}</h1>
                        <p>课程数量：${val.coursenum}</p>
                        <i id="manage-btn">操作</i>
                    </div>
                 `;
            });
            $(".album-list").html(str);
        },
        error: function (err) {
            console.log(err);
        }
    });
}