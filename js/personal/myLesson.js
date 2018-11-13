$(function () {
    lessonList();
});

function lessonList() {
    var uId = sessionStorage.getItem("uid");
    $.ajax({
        type: "get",
        url: APP_URL + "/api/My/AlbumList",
        data: {
            uid: uId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
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
                            <div class="lesson-name2">${val.albumname}</div>
                            <div class="lesson-lock"><img src="../../images/222.png" />${val.unlocknum}</div>
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
        },
        error: function (err) {
            console.log(err);
        }
    });
}