$(function () {
    // 默认为国内城市
    $("#cityIn").click(function () {
        $("#cityIn").addClass("city-on").siblings("#cityOut").removeClass("city-on");
        $("#cityText").show();
        $("#city-boxInter").hide();
    });
    // 国际城市
    $("#cityOut").click(function () {
        $("#cityOut").addClass("city-on").siblings("#cityIn").removeClass("city-on");
        $("#cityText").hide();
        $("#city-boxInter").show();
    });
    //搜索
    $("#search-text1").click(function () {
        $(".area-box1").hide();
        $(".area-box2").show();
        $("#search-text2").focus();
        $("#search-text2").bind("input", function () {
            var val = $("#search-text2").val();
            if (val != "") {
                city(val);
                $("#search-close").show();
                $(".city-international").hide();
            } else {
                $("#search-close").hide();
            }
        });
    });
});

// 搜索城市
function city(val) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/CityList",
        data: {
            city: val
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var str = "";
            $.each(data, function (index, val) {
                str += `
                 <li data-name="${val.name}">${val.name}</li>
                 `;
            });
            $(".search-list>ul").html(str);
            $(".search-list>ul>li").click(function () {
                var $val = $(this).attr("data-name");
                $("#search-text2").val($val);
                $(".search-list").hide();
            });
            // 搜索
            $(".city-search-btn").click(function () {
                var city = $("#search-text2").val();
                if (val != "") {
                    citySearch(city);
                }
            });
        },
        error: function (err) {
            console.log(err)
        }
    });
}

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
                     <li class="search-res" data-val="${val.name}">${val.name}</li>
                     `;
                });
                $(".search-text>ul").html(str);
                $(".search-text>ul>li").click(function () {
                    var val = $(this).attr("data-val");
                    $(".area-body").hide();
                    $(".index-container").show();
                    $("#reg-area").html(val);
                });
            } else {
                $(".search-text").html("");
                $(".city-international").show();
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
