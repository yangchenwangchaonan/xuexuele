$(function () {
    var url = window.location.href;
});

// 获取公众号接口权限
function WxConfig() {
    $.ajax({
        type: "method",
        url: APP_URL + "/api/My/WxConfig",
        data: "data",
        dataType: "dataType",
        success: function (res) {

        }
    });
}