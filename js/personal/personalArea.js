$(function () {
    // 默认为国内城市
    $("#cityIn").click(function () {
        allClick();
        $("#cityIn").addClass("city-on").siblings("#cityOut").removeClass("city-on");
        $("#cityText").show();
        $("#city-boxInter").hide();
    });
    // 国际城市
    $("#cityOut").click(function () {
        allClick();
        $("#cityOut").addClass("city-on").siblings("#cityIn").removeClass("city-on");
        $("#cityText").hide();
        $("#city-boxInter").show();
    });
    //搜索
    $("#search-text1").click(function () {
        allClick();
        $(".area-box1").hide();
        $(".area-box2").show();
        $("#search-text2").focus();
        $(".city-search-btn").click(function () {
            allClick();
            var city = $("#search-text2").val();
            if (city != "") {
                citySearch(city);
            }
        });
    });

    // 返回
    $("#searchClose").click(function () {
        allClick();
        $(".personal-container").hide();
        $(".area-box1").show();
        $(".area-box2").hide();
    });

});


//搜索结果
function citySearch(city) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/CityList",
        data: {
            city: city
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.data.length != 0) {
                var str = "";
                $.each(res.data, function (index, val) {
                    str += `
                     <li data-name="${val.name}">${val.name}</li>
                     `;
                });
                $(".search-list>ul").html(str);
                $(".city-international").hide();
                $(".search-list>ul>li").click(function () {
                    allClick();
                    var val = $(this).attr("data-name");
                    $(".personal-area").hide();
                    $(".personal-container").show();
                    $("#perArea").html(val);
                });
            } else {
                $(".city-international").show();
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}