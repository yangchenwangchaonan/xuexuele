$(function(){
    lessonManageList ()
    $(".album-add").click(function(){
        $(window).attr("location","./lesson-add.html");
    });
});

function lessonManageList (){
    var uId = sessionStorage.getItem("uid");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/My/AlbumManageList",
        data: {
            uid:1
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            $(".manage-top>span").html("x"+data.wisdombean);
        },
        error: function (err) {
            console.log(err);
        }
    });
}