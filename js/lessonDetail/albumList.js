$(function () {
    var uId = sessionStorage.getItem("uid");
    var url = window.location.href;
    var arr = url.split("=");
    var albumId = arr[1];
    albumCourseList(albumId, uId)

});

function albumCourseList(albumId, uId) {
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
            $(".album-top>img").attr("src", data.albumimg);
            $(".album-text").html(data.albumname);
            $(".album-detail").html(data.albumcontent);
            var str = "";
            $.each(data.courselist, function (index, val) {
                str += `
                    <div class="lesson-title">
                        <div class="list-num">5</div>
                        <div class="lesson-list-detail">
                            <div class="lesson-list-title">
                                <div class="lesson-list-name">课程名称</div>
                                <div class="lesson-play">播放</div>
                            </div>
                            <div class="lesson-list-tab">
                                <ul>
                                    <li><img src="../../images/161.png" /><span>10</span></li>
                                    <li><img src="../../images/162.png" /><span>08:22</span></li>
                                    <li><img src="../../images/163.png" /><span>20</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
}