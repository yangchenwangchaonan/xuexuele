$(function () {
    // 获取百宝箱列表id
    var url = window.location.href;
    var arr = url.split("=");
    var listId = arr[1];
    // 获取百宝箱详情
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
            var str = "";
            $.each(data, function (index, val) { 
                str += `
                    <h1>${val.heading}</h1>
                    <h1>${val.create_time}</h1>
                    <img src="${val.img}">
                    <p class="treasureBox-inner">${val.article}</p>
                `;
            });
            $(".treasureBox-detail").html(str);
            $(".treasureBox-inner").append("<p class='endding1'>-END-</p>");
        },
        error: function (err) {
            console.log(err)
        }
    });

    // 返回
    $("#treasureBoxDetailBack").click(function(){
        // window.location.replace("./treasureBox.html");
        history.back(-1);
    });
});