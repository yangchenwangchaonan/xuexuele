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

	// 返回
	$("#rechargeMethodBack").click(function(){
		window.location.replace("./recharge.html");
	});
	
});

function aliPay(a) {
	var uid = sessionStorage.getItem("uid")
	$.ajax({
		type: "GET",
		url: APP_URL + "/api/Pay/AliPayWeb",
		data: {
			uid:uid,
			order_money:a,
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