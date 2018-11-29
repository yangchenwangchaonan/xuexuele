$(function () {
	var url = window.location.href;
	var arr1 = url.split("=");
	var a = arr1[1];
	$(".num").text(a)
	$(".moys").text(a)
	// 支付宝
	$(".alipay").click(function () {
		aliPay(a);
	})
	// 微信
	$(".wechat").click(function () {
		walletOrderWxPay(a);
	})

	// 返回
	$("#rechargeMethodBack").click(function () {
		window.location.replace("./recharge.html");
	});

});

// 支付宝支付
function aliPay(a) {
	var uid = localStorage.getItem("uid");
	var token = localStorage.getItem("token");
	$.ajax({
		type: "GET",
		url: APP_URL + "/api/Pay/AliPayWeb",
		data: {
			uid: uid,
			token: token,
			order_money: a,
		},
		dataType: "json",
		success: function (res) {
			console.log(res)
			console.log(res.data)
			$(".apay").html(res.data)
		},
		error: function (err) {
			console.log(err);
		}
	});
}

//获取微信公众号信息


// 微信支付
function walletOrderWxPay(a) {
	// window.open("https://xuexuele.huimor.com/api/Pay/WxPayJsApi?uid=90&order_money=6")
	var uid = localStorage.getItem("uid");
	var token = localStorage.getItem("token");
	alert(uid);
	$.ajax({
		type: "post",
		url: APP_URL + "/api/Pay/WxPayJsApi",
		data: {
			uid: uid,
			token: token,
			order_money: a
		},
		dataType: "json",
		success: function (res) {
			console.log(res)
		},
		error: function (err) {
			console.log(err);
		}
	});
}