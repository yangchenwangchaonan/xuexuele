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
                     <li data-cId="${val.id}">
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
                    var lessonId = $(this).attr("data-cId");
                    alert(lessonId);
                    $(window).attr("location", "../lessonDetail/lesson-detail.html?lessonId=" + lessonId);
                });
            }

        },
        error: function (err) {
            console.log(err);
        }
    });
}