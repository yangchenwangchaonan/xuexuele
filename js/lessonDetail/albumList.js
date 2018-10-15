$(function () {
    var uId = sessionStorage.getItem("uid");
    var url = window.location.href;
    var arr = url.split("=");
    var albumId = arr[1];
    albumCourseList(albumId, uId)

});



// 专辑列表
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
                var lock = val.islock;
                str += `
                    <div class="lesson-title">
                        <div class="list-num">${index}</div>
                        <div class="lesson-list-detail">
                            <div class="lesson-list-title">
                                <div class="lesson-list-name">${val.coursename}</div>
                    `;
                if (lock == 1) {
                    str += `
                        <div class="lesson-play"><img src="" />播放</div>
                    `;
                }else if (lock == 0){
                    str += `
                        <div class="lesson-play lesson-locked"><img src="../../images/165.png" />锁定</div>
                    `;
                }
                str += `
                            </div>
                            <div class="lesson-list-tab">
                                <ul>
                                    <li><img src="../../images/161.png" /><span>${val.coursescore}</span></li>
                                    <li><img src="../../images/162.png" /><span>${val.coursetime}</span></li>
                                    <li><img src="../../images/163.png" /><span>${val.commentsum}</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
            });
            $(".lesson-title-list").html(str);

            // 点击解锁
            $("#lockBtn").click(function(){
                $(window).attr("location","./unlock_frame.html");
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
}