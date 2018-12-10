// 柠檬提示框
function lemonTips(a, b) {
    otherPages();
    $(".submit-tips").html(a);
    var y = b * 1000;
    $(".submit-tips").show();
    window.setTimeout(() => {
        $(".submit-tips").hide();
    }, y);
}

// 牵牛花提示框
function flowerTips(a, b) {
    otherPages();
    $(".reg-tips").show()
    $(".reg-tips").text(a)
    var date = b * 1000;
    window.setTimeout(() => {
        $(".reg-tips").hide();
    }, date);
}

// 通用弱提示
function generalTips(a, b) {
    otherPages();
    $(".internet-tips").show();
    $(".internet-tips").text(a)
    var date = b * 1000;
    window.setTimeout(() => {
        $(".internet-tips").hide();
    }, date);
}
//清空value
function deleteVal(a, b) {
    $(a).click(function () {
        $(b).val("")
        console.log(a, b)
    });

}

//智慧塔提示框
function homeLevel(a, b) {
    otherPages();
    $(".home-tips").show()
    $(".home-tips").text(a)
    var date = b * 1000;
    window.setTimeout(() => {
        $(".home-tips").hide();
    }, date);
}

//按钮音效
function allClick() {
    var buttonMps = $("#buttonMps")[0];
    buttonMps.play();
}

// 附加页面音效
function otherPages() {
    var shadePages = $("#otherPages")[0];
    shadePages.play();
}

// 重新登录 
function repeatLogin() {
    var shadePages = $("#otherPages")[0];
    shadePages.play();
    $(".otherPlace").show();
    $(".placeBtn").click(function () {
        window.location.replace("../login/login.html");
    });
}

// 星星闪烁
function starFlicker() {
    var status = 1;
    setInterval('run()', 200);
}
function run() {
    if (status == 1) {
        $('.wrapper-04').show();
        $('.wrapper-05').show();
        $('.wrapper-06').show();
        status = 0;
    } else {
        $('.wrapper-04').hide();
        $('.wrapper-05').hide();
        $('.wrapper-06').hide();
        status = 1;
    }

}