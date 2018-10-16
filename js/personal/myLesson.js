$(function () {
    lessonList();
    $(".table-lesson").click(function () {
        $(window).attr("location", "../lessonDetail/lesson-detail.html");
    });
});

function lessonList() {
    var uId = sessionStorage.getItem("uid");
    $.ajax({
        type: "method",
        url: APP_URL + "/api/My/AlbumList",
        data: {
            uid: uId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
        }
    });
}