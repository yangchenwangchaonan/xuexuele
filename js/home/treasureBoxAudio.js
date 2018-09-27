$(function(){
    // 获取百宝箱列表id
    var url = window.location.href;
    var arr = url.split("=");
    var listId = arr[1];
    // 获取商品详情
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserBaoboxDetail",
        data: {
            id:listId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            $("#lessonName").html(data[0].heading);
            $("#lessonHead").html(data[0].voice);
        },
        error: function (err) {
            console.log(err)
        }
    });
});