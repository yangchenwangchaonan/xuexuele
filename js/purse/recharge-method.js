$(function(){
	var url = window.location.href;
	var arr1 = url.split("=");
	var a = arr1[1];
	$(".num").text(a)
	$(".moys").text(a)
	$(".alipay").click(function(){
		aliPay(a)
	})
	$(".wechat").click(function(){
		walletOrderWxPay(a)
	})
	
});

function aliPay(a) {
	var uid = sessionStorage.getItem("uid")
	$.ajax({
		type: "POST",
		url: APP_URL + "/api/Wisdom/AliPay",
		data: {
			uid:uid,
			order_money:a,
		},
		dataType: "json",
		success: function (res) {
		},
		error: function (err) {
			console.log(err);
		}
	});
}
function walletOrderWxPay(a) {
	var uid = sessionStorage.getItem("uid")
	$.ajax({
		type: "POST",
		url: APP_URL + "/api/Wisdom/WalletOrderWxPay",
		data: {
			uid:uid,
			fee:a,
		},
		dataType: "json",
		success: function (res) {
		},
		error: function (err) {
			console.log(err);
		}
	});
}