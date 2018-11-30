$(function () {
    var url = window.location.href;
    var letterId = url.split("=")[1];
    var token = localStorage.getItem("token");
    var userId = localStorage.getItem("uid");
    /* 站内信详情 */
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserMessageInfo",
        data: {
            uid: userId,
            token: token,
            messageid: letterId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                var data = res.data;
                var str = "";
                str += `
                <h1>${data.heading}</h1>
                <h3>${data.create_time}</h3>
                <p>${data.content}</p>
            `;
                $("div#letterInfor").html(str);
            } else if (code == 10000) {
                repeatLogin();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
    $('.page-back1').click(function () {
        $(window).attr("location", "../homePages/letter.html");
    })
    /* 站内信更新为已读 */
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserMessageIsread",
        data: {
            id: letterId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
        },
        error: function (err) {
            console.log(err);
        }
    });
});