$(function () {
    $(".upCover").change(function () {
        var files = $(".upCover")[0].files[0];
        upClover(files);
    });
});


function upClover(files) {
    var form = new FormData()
    form.append("picture", files)
    $.ajax({
        processData: false, //告诉jquery不要去处理发送的数据
        contentType: false, //告诉jquery不要去设置Content-Type请求头
        type: "POST",
        url: APP_URL + "/api/My/ImgUpload",
        data: form,
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                var url = res.data;
                $(".lesson-cover-content>img").attr("src", url);
                $(".submit-cancel").show();
                $(".upCover").hide();
                $(".lesson-cover-btn").html("确认上传");
                $(".lesson-cover-btn").click(function () {
                    sessionStorage.setItem("coverUrl",url);
                    history.back(-1);
                });
                $(".submit-cancel").click(function () {
                    $(".lesson-cover-content>img").attr("src", "");
                    $(".upCover").show();
                    $(".lesson-cover-btn").html("选择封面");
                });
            }

        },
        error: function (err) {
            console.log(err)
        }
    });
}