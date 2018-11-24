$(function () {
    start();
    var url = window.location.href;
    var num = url.split("?").length - 1;
    if (num == 0) {
        // 确认新增
        $("#addAlbumBtn").click(function () {
            $("#addAlbumBtn").html("确认新增");
            newAlbum();
        });
    } else if (num == 1) {
        var aid = url.split("=")[1];
        $("#addAlbumBtn").html("确认编辑");
        albunmDetail(aid); //专辑详情
        // 编辑专辑
        $("#addAlbumBtn").click(function () {
            changeAlbum(aid); //编辑专辑
        });
    }

    // 返回
    $("#addAlbumBack").click(function(){
        history.back(-1);
    });

});

// 进入页面
function start() {
    $("#albumAdd").show();
    $("#albumCover").hide();
    $("#albumName").hide();
    $("#albumIntroduct").hide();
    $(".inputEnd").hide();
    // 上传封面
    $("#upLoad").click(function () {
        // $(".lesson-cover-content>img").attr("src", "");
        $("#albumAdd").hide();
        $("#albumCover").show();
        upLoad();
        // 返回
        $(".albumCover-back").click(function () {
            $(".upCover").show();
            $("#albumAdd").show();
            $("#albumCover").hide();
            $("#upLoad").html("请上传");
        });
    });
    // 输入专辑名称
    $("#enterName").click(function () {
        $("#albumAdd").hide();
        $("#albumName").show();
        $("#nameContent").focus(function () {
            $(".editCompleted").show();
            $(".editCompleted").click(function () {
                var albumName = $.trim($("#nameContent").val());
                $(".editCompleted").hide();
                $("#albumAdd").show();
                $("#albumName").hide();
                if (albumName != "") {
                    $("#enterName").html(albumName);
                }
            });
        });
        // 返回
        $(".albumName-back").click(function () {
            $("#albumAdd").show();
            $("#albumName").hide();
            $(".editCompleted").hide();
            // $("#enterName").html("请输入专辑名称");
        });
    });
    // 输入专辑内容
    $("#enterPresent").click(function () {
        $("#albumAdd").hide();
        $("#albumIntroduct").show();
        $("#introductContent").focus(function () {
            $(".editCompleted").show();
            $(".editCompleted").click(function () {
                var albumIntroduct = $.trim($("#introductContent").val());
                $(".editCompleted").hide();
                $("#albumAdd").show();
                $("#albumIntroduct").hide();
                if (albumIntroduct != "") {
                    $("#enterPresent").html("已编辑");
                }
            });
        });
        //返回
        $(".albumIntroduct-back").click(function () {
            $("#albumAdd").show();
            $("#albumIntroduct").hide();
            $(".editCompleted").hide();
            // $("#enterPresent").html("请输入专辑简介");
        });
    });
}

// 专辑详情
function albunmDetail(id) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/My/AlbumDetail",
        data: {
            albumid: id
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                $("#upLoad").html("已上传");
                $("#enterName").html(res.data.albumname);
                $("#enterPresent").html("已编辑");
                $(".lesson-cover-content>img").attr("src", res.data.albumimg);
                $("#nameContent").val(res.data.albumname);
                $("#introductContent").val(res.data.albumcontent);
                $(".submit-cancel").show();
                $(".upCover").hide();
                $(".lesson-cover-btn").html("确认上传");
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}


function upLoad() {
    // 上传图片
    $(".upCover").change(function () {
        var files = $(".upCover")[0].files[0];
        upClover(files);
    });
    // 确认上传
    $(".lesson-cover-btn").click(function () {
        // flowerTips("上传成功~", 1);
        $("#albumAdd").show();
        $("#albumCover").hide();
        $("#upLoad").html("已上传");
    });
    // 确认上传x
    $(".submit-cancel").click(function () {
        $(".lesson-cover-content").html("<img/>");
        $(".upCover").val("");
        $(".submit-cancel").hide();
        $(".upCover").show();
        $(".lesson-cover-btn").html("选择封面");
    });
}

// 上传封面
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
            } else {
                flowerTips(res.msg, 1);
                // alert(res.msg);
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
// 新增专辑
function newAlbum() {
    var coverUrl = $(".lesson-cover-content>img").attr("src");
    var albumName = $("#nameContent").val();
    var albumPresent = $("#introductContent").val();
    var uId = sessionStorage.getItem("uid");
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/My/AlbumAdd",
        data: {
            uid: uId,
            albumimg: coverUrl,
            albumname: albumName,
            albumcontent: albumPresent
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var msg = res.msg;
            var code = res.code;
            if (code == 1) {
                flowerTips("新增成功~", 1);
                window.setTimeout(() => {
                    $(window).attr("location", "./album-manage.html");
                }, 1000);
            } else if (code == 0) {
                flowerTips(msg, 1);
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}

// 编辑专辑
function changeAlbum(id) {
    var coverUrl = $(".lesson-cover-content>img").attr("src");
    var albumName = $("#nameContent").val();
    var albumPresent = $("#introductContent").val();
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/My/AlbumEdit",
        data: {
            _method: 'PUT',
            id: id,
            albumimg: coverUrl,
            albumname: albumName,
            albumcontent: albumPresent
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var msg = res.msg;
            var code = res.code;
            if (code == 1) {
                flowerTips("编辑成功~", 1);
                window.setTimeout(() => {
                    $(window).attr("location", "./album-manage.html");
                }, 1000);
            } else {
                flowerTips(msg, 1);
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}