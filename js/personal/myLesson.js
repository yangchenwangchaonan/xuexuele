$(function () {
    lessonList();
    // 返回
    $("#myLessonBack").click(function () {
        $(window).attr("location", "./personal-center.html");
    });
});

function lessonList() {
    var uId = localStorage.getItem("uid");
    var token = localStorage.getItem("token");
    $.ajax({
        type: "get",
        url: APP_URL + "/api/My/AlbumList",
        data: {
            uid: uId,
            token: token
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                var data = res.data;
                if (data.length == 0) {
                    $(".no-lessons").show();
                    $(".mylessons-content").hide();
                } else {
                    var str = "";
                    $.each(data, function (index, val) {
                        str += `
                     <li data-aId="${val.id}">
                        <div class="table-lesson">
                            <img src="${val.albumimg}" />
                            <div class="mylesson-shade">
                                <div class="lesson-name2">${val.albumname}</div>
                                <div class="lesson-lock"><img src="../../images/222.png" />${val.unlocknum}</div>
                            </div>
                        </div>
                     </li>
                     `;
                    });
                    $(".mylesson-list").html(str);
                    $(".mylesson-list>li").click(function () {
                        var albumId = $(this).attr("data-aId");
                        // alert(lessonId);
                        $(window).attr("location", "../lessonDetail/album-name.html?albumId=" + albumId);
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