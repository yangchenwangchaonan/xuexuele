APP_URL = 'https://xuexuele.huimor.com';

//监听屏幕变化，自动设置rem根元素
!(function (doc, win) {
    var docEle = doc.documentElement, //获取html元素
        event = "onorientationchange" in window ? "orientationchange" : "resize", //判断是屏幕旋转还是resize;
        fn = function () {
            var width = docEle.clientWidth-50;  //获取屏幕宽度并减去状态栏高度
            width && (docEle.style.fontSize = 10 * (width / 360) + "px"); //设置html的fontSize，随着event的改变而改变。
        };

    win.addEventListener(event, fn, false);
    doc.addEventListener("DOMContentLoaded", fn, false);

}(document, window));

//清除点击事件默认300ms
// window.addEventListener( "load", function() {
//     FastClick.attach( document.body );
// }, false );