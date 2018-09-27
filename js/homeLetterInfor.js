$(function () {
    var url = window.location.href;
    var arr1 = url.split("?");
    var arr2 = arr1[1].split("&");
    var letterId = arr2[0].substr(arr2[0].indexOf("=") + 1);
    var userId = arr2[1].substr(arr2[1].indexOf("=") + 1);
    /* 站内信详情 */
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserMessageInfo",
        data: {
            uid: userId,
            messageid: letterId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var str = "";
            str += `
                <h1>${data.heading}</h1>
                <h3>${data.create_time}</h3>
                <p>${data.content}</p>
            `;
            $("div#letterInfor").html(str);
        },
        error: function (err) {
            console.log(err);
        }
    });

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