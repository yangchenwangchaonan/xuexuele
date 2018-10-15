$(function () {
    var uId = sessionStorage.getItem("uid");
    var url = window.location.href;
    var arr = url.split("=");
    var albumId = arr[1];
    albumCourseList(albumId,uId)

});

function albumCourseList(albumId,uId) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/AlbumCourseList",
        data: {
            albumid: albumId,
            uid: uId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            $(".album-top>img").attr("src",data.albumimg);
            $(".album-text").html(data.albumname);
            $(".album-detail").html(data.albumcontent);
        },
        error: function (err) {
            console.log(err);
        }
    });
}