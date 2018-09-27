$(function () {
    //原住人数
    people();


    // 网络不给力
    $(".internet-tips").css("display", "none");
    //体力值
    $("#stamina-tab").click(function () {
        $("#stamina-shade").css("display", "block");
        $("#stamina-shade").click(function () {
            $("#stamina-shade").css("display", "none");
        });
    });
    //站内信
    $("#maildrop-tab").click(function () {
        $(window).attr("location", "./letter.html");
        /* 关闭窗口 */
        $(".signed-close").click(function () {
            $("#maildrop-tab").css("display", "none");
        });
    });

    //签到
    $("#signed-tab").click(function () {
        $("#recording-shade").css("display", "block");
        $(".home-recording").click(function () {
            $("#recording-shade").css("display", "none");
        });
    });
    //百宝箱
    $("#treasureBox-tab").click(function () {
        $(window).attr("location", "./treasureBox.html");
    });

    //闯关
    var $levelSuccessed = $(".level span");
    $levelSuccessed.click(function () {
        $("#levelShade").css("display", "block");
        $("#levelFirst").click(function () {
            $(window).attr("location", "./level_content_img.html");
        });
        // 退出关卡
        $(".level_btn").click(function () {
            $("#levelShade").css("display", "none");
        });
    });
});


//原住人数
function people() {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserResident",
        dataType: "json",
        success: function (res) {
            console.log(res);
            var num = res.data;
            $("#sum").html(num);
        },
        error: function (err) {
            console.log(err)
        }
    });
}