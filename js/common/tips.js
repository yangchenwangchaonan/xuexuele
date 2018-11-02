
// 柠檬提示框
function lemonTips(a, b) {
	$(".submit-tips").html(a);
	var y = b * 1000;
	$(".submit-tips").show();
	window.setTimeout(() => {
		$(".submit-tips").hide();
	}, y);
}

// 牵牛花提示框
function flowerTips(a, b) {
    $(".reg-tips").show()
    $(".reg-tips").text(a)
    var date = b * 1000;
    window.setTimeout(() => {
        $(".reg-tips").hide();
    }, date);
}

// 通用弱提示
function generalTips(a, b) {
    $(".internet-tips").show();
    $(".internet-tips").text(a)
    var date = b * 1000;
    window.setTimeout(() => {
        $(".internet-tips").hide();
    }, date);
}