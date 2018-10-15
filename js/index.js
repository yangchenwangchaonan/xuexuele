$(function () {
    var preload;
    var mainfest;

    // 初始化预加载manifest清单
    function setupManifest() {
        mainfest = [{
                src: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/01f09e577b85450000012e7e182cf0.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img.zcool.cn/community/0125fd5770dfa50000018c1b486f15.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://img3.imgtn.bdimg.com/it/u=2200166214,500725521&fm=26&gp=0.jpg"
            },
            {
                src: "http://img.zcool.cn/community/01f76f5a4b4aa2a801219741c7bde1.jpg@1280w_1l_2o_100sh.jpg"
            },
            {
                src: "http://pic29.nipic.com/20130511/9252150_174018365301_2.jpg"
            },
            {
                src: "http://pic.58pic.com/58pic/13/74/51/99d58PIC6vm_1024.jpg"
            },
            {
                src: "http://img12.3lian.com/gaoqing02/01/58/85.jpg"
            },
            {
                src: "http://pic63.nipic.com/file/20150330/8993928_082652755616_2.jpg"
            },
            {
                src: "http://pic19.nipic.com/20120308/4970979_102637717125_2.jpg"
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
            $(window).attr("location", "./html/login/login.html");
        }, 400);

    }
    setupManifest();
    startPreload();
});