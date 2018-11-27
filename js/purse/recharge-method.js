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
	
	$('.submitMethod').on('submit', function () {
		var uid = $('inpur[name=uid]').val(),
			order_money = $('inpur[name=order_money]').val();
			alert(uid);
			alert(order_money);
		$(this).ajaxSubmit({
			type: 'post', // 提交方式 get/post            
			url: 'https://xuexuele.huimor.com/api/Pay/WxPayJsApi', // 需要提交的 url            
			data: {
				'uid': uid,
				'order_money': order_money
			},
			success: function (res) { // data 保存提交后返回的数据，一般为 json 数据                
				console.log(res);
				// alert('提交成功！');
			}
		});
		// $(this).resetForm(); // 提交后重置表单              
		// return false; // 阻止表单自动提交事件，必须返回false，否则表单会自己再做一次提交操作，并且页面跳转
	});
});

// 支付宝支付
function aliPay(a) {
	var uid = sessionStorage.getItem("uid")
	$.ajax({
		type: "GET",
		url: APP_URL + "/api/Pay/AliPayWeb",
		data: {
			uid: uid,
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
	var uid = sessionStorage.getItem("uid")
	alert(uid);
	$.ajax({
		type: "post",
		url: APP_URL + "/api/Pay/WxPayJsApi",
		data: {
			uid: uid,
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