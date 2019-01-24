$(function () {
    var preload;
    var mainfest;
    // 初始化预加载manifest清单
    function setupManifest() {
        var path = "./images/";
        var vosice = "./mp3/";
        // console.log(path)
        mainfest = [{
                src: path + "01.png"
            },
            {
                src: path + "02.png"
            },
            {
                src: path + "03.png"
            },
            {
                src: path + "04.png"
            },
            {
                src: path + "05.png"
            },
            {
                src: path + "06.png"
            },
            {
                src: path + "10.png"
            },
            {
                src: path + "11.png"
            },
            {
                src: path + "19.png"
            },
            {
                src: path + "25.png"
            },
            {
                src: path + "31.png"
            },
            {
                src: path + "34.png"
            },
            {
                src: path + "36.png"
            },
            {
                src: path + "38.png"
            },
            {
                src: path + "47.png"
            },
            {
                src: path + "60.png"
            },
            {
                src: path + "70.png"
            },
            {
                src: path + "80.png"
            },
            {
                src: path + "89.png"
            },
            {
                src: path + "90.png"
            },
            {
                src: path + "91.png"
            },
            {
                src: path + "92.png"
            },
            {
                src: path + "103.png"
            },
            {
                src: path + "104.png"
            },
            {
                src: path + "105.png"
            },
            {
                src: path + "106.png"
            },
            {
                src: path + "112.png"
            },
            {
                src: path + "114.png"
            },
            {
                src: path + "120.png"
            },
            {
                src: path + "121.png"
            },
            {
                src: path + "123.png"
            },
            {
                src: path + "126.png"
            },
            {
                src: path + "127.png"
            },
            {
                src: path + "128.png"
            },
            {
                src: path + "134.png"
            },
            {
                src: path + "145.png"
            },
            {
                src: path + "158.png"
            },
            {
                src: path + "159.png"
            },
            {
                src: path + "169.png"
            },
            {
                src: path + "176.png"
            },
            {
                src: path + "170.png"
            },
            {
                src: path + "177.png"
            },
            {
                src: path + "178.png"
            },
            {
                src: path + "189.png"
            },
            {
                src: path + "198.png"
            },
            {
                src: path + "200.png"
            },
            {
                src: path + "215.png"
            },
            {
                src: path + "218.png"
            },
            {
                src: path + "220.png"
            },
            {
                src: path + "229.png"
            },
            {
                src: path + "231.png"
            },
            {
                src: path + "236.png"
            },
            {
                src: path + "251.png"
            },
            {
                src: path + "252.png"
            },
            {
                src: path + "255.png"
            },
            {
                src: path + "center.png"
            },
            {
                src: path + "favicon.ico"
            },
            {
                src: path + "left.png"
            },
            {
                src: path + "right.png"
            },
            {
                src: vosice + "answerError.mp3"
            },
            {
                src: vosice + "button.mp3"
            },
            {
                src: vosice + "homeBackgroud.mp3"
            },
            {
                src: vosice + "levelBackground.mp3"
            },
            {
                src: vosice + "levelClick.mp3"
            },
            {
                src: vosice + "levelFail.mp3"
            },
            {
                src: vosice + "otherPages.mp3"
            },
            {
                src: vosice + "throughLevel.mp3"
            }
        ];
    }
    // 预加载函数
    function startPreload() {
        preload = new createjs.LoadQueue(false);
        //注意加载音频文件需要调用如下代码行
        preload.installPlugin(createjs.SOUND);
        //为preloaded添加整个队列变化时展示的进度事件
        preload.addEventListener("progress", handleFileProgress);
        //为preloaded添加当队列完成全部加载后触发事件
        preload.addEventListener("complete", loadComplete);
        //设置最大并发连接数  最大值为10
        preload.setMaxConnections(5);
        preload.loadManifest(mainfest);
    }

    // 当整个队列变化时展示的进度事件的处理函数
    function handleFileProgress(event) {
        // console.log(event.loaded);
        if (event.loaded > 0.48) {
            $(".index-process-wrapper>.loading>h1").text("加载中..." + Math.ceil(event.loaded * 100) + "%");
        }
        var num = Math.ceil(event.loaded * 100);
        // console.log(num)
        var a = 56;
        var right = (num * 0.56);
        var index = a - right;
        $(".index-process-wrapper>.loading").css("right", index + "vw");
        $("#pg").val(num);
        // console.log($("#pg").val(num))
    }

    // 处理preload添加当队列完成全部加载后触发事件
    function loadComplete() {
        $(".index-process-wrapper>.loading>img").attr("src", "./images/loading_end.png");
        // 设置定时器，当全部加载完毕后让100%停留0.4秒，提高用户体验，不至于让用户感觉不到
        window.setTimeout(function () {
            startPage(); //启动页
        }, 400);
    }
    setupManifest();
    startPreload();
});

// 启动页
function startPage() {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/getStartupPage",
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                $(".adPage").show();
                $(".index-container").hide();
                var data = res.data;
                $(".startImg").attr("src", data.image_path); //启动页图片
                // 点击跳转
                $(".startImg").unbind().bind("click", function () {
                    $(window).attr("location", data.url);
                });
                // 5s后自动跳转首页或登录页
                window.setTimeout(function () {
                    var token = localStorage.getItem("token");
                    var uid = localStorage.getItem("uid");
                    if (token && uid) {
                        getToken();
                    } else {
                        $(window).attr("location", "./html/login/login.html");
                    }
                }, 5000);
                countDown(); //5s倒计时
                // 跳过广告
                $(".countTime").unbind().bind("click", function () {
                    var token = localStorage.getItem("token");
                    var uid = localStorage.getItem("uid");
                    if (token && uid) {
                        getToken();
                    } else {
                        $(window).attr("location", "./html/login/login.html");
                    }
                });
            } else {
                var token = localStorage.getItem("token");
                var uid = localStorage.getItem("uid");
                if (token && uid) {
                    getToken();
                } else {
                    $(window).attr("location", "./html/login/login.html");
                }
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 5s倒计时
function countDown() {
    var tempshijian = 5;
    var I = setInterval(function () {
        if (tempshijian != 0) {
            tempshijian--;
            $(".countTime").html("跳过广告&nbsp;&nbsp;" + tempshijian);
        }
    }, 1000);
}

// 判断token是否过期
function getToken() {
    var token = localStorage.getItem("token");
    var uid = localStorage.getItem("uid");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserGate",
        data: {
            uid: uid,
            token: token
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                $(window).attr("location", "./html/homePages/home.html");
            } else if (res.code == 10000) {
                $(window).attr("location", "./html/login/login.html");
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}