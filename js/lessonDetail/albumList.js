$(function () {




});

function albumCourseList() {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/AlbumCourseList",
        data: {
            albumid: 1,
            uid: 1
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
        },
        error: function (err) {
            console.log(err);
        }
    });
}