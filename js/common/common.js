APP_URL = 'https://xuexuele.huimor.com';  //测试域名
APP_URL = 'http://192.168.0.198';  //本地测试域名

var answerTime = [];
//监听屏幕变化，自动设置rem根元素
!(function (doc, win) {
    var docEle = doc.documentElement, //获取html元素
        event = "onorientationchange" in window ? "orientationchange" : "resize", //判断是屏幕旋转还是resize;
        fn = function () {
            var width = docEle.clientWidth - 50; //获取屏幕宽度并减去状态栏高度
            width && (docEle.style.fontSize = 10 * (width / 360) + "px"); //设置html的fontSize，随着event的改变而改变。
        };

    win.addEventListener(event, fn, false);
    doc.addEventListener("DOMContentLoaded", fn, false);

}(document, window));

//监听用户是否离开浏览器
var hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : null;
var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
var onVisibilityChange = function () {
    if (!document[hiddenProperty]) {
        var levelBackground = $("#levelBackground")[0];
        var homeBackgroud = $("#homeBackgroud")[0];
        if (levelBackground) {
            levelBackground.play();
        }
        if (homeBackgroud) {
            homeBackgroud.play();
        }
    } else {
        var audio = $("audio");
        if (audio) {
            for (var i = 0; i < audio.length; i++) {
                audio[i].pause();
            }
        }
    }
}
document.addEventListener(visibilityChangeEvent, onVisibilityChange);
