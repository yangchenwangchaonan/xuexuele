$(function () {
    var url = window.location.href;
    var aId = url.split("=")[1];
    albumDetail(aId)
});

// 专辑详情
function albumDetail(id) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/My/AlbumDetail",
        data: {
            albumid: id
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            $(".album-top>img").attr("src", data.albumimg);
            $(".album-text").text(data.albumname);
            $(".album-detail").text(data.albumcontent);
            if (data.courselist.length == 0) {
                $(".noLesson-content").show();
                $("#addLesson2").hide();
            } else {
                $(".noLesson-content").hide();
                $("#addLesson2").show();
                var str = "";
                $.each(data.courselist, function (index, val) {
                    str += `
                     <div class="lesson-title">
                        <div class="list-num">${index+1}</div>
                        <div class="lesson-list-detail">
                            <div class="lesson-list-title">
                                <div class="lesson-list-name">${val.coursename}</div>
                            </div>
                            <div class="lesson-operate">操作</div>
                            <div class="lesson-list-tab">
                                <ul>
                                    <li><img src="../../images/161.png" /><span>${val.coursescore}</span></li>
                                    <li><img src="../../images/162.png" /><span>${val.coursetime}</span></li>
                                    <li><img src="../../images/163.png" /><span>${val.commentsum}</span></li>
                                </ul>
                            </div>
                        </div>
                        </div>
                    </div>
                     `;
                });
                $(".lesson-title-list").html(str);
            }
            $("#addLesson1,#noLesson,#addLesson2").click(function () {
                $(".lesson-shade").show();
                //关闭
                $(".lesson-add-close").click(function () {
                    $(".lesson-shade").hide();
                });
            });
        },
        error: function (err) {
            console.log(err)
        }
    });
}