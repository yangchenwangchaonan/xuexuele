$(function () {
    var preload;
    var mainfest;

    // 初始化预加载manifest清单
    function setupManifest() {
        mainfest = [{
                src: "http://www.taobao.com"
            },
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
        preload.setMaxConnections(1);
        preload.loadManifest(mainfest);
    }

    // 当整个队列变化时展示的进度事件的处理函数
    function handleFileProgress(event) {
        if (event.loaded > 0.4) {
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
        // 设置定时器，当全部加载完毕后让100%停留0.4秒，提高用户体验，不至于让用户感觉不到
        window.setTimeout(() => {
            $(window).attr("location", "http://www.taobao.com");
        }, 400);

    }
    setupManifest();
    startPreload();
});