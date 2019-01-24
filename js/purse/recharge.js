$(function () {
	// rmb
	$("#recharge-reminbi").click(function () {
		allClick();
		$(this).addClass("recharge-checked").siblings().removeClass("recharge-checked");
		$(".recharge-rmb").show();
		$(".dollar-selected").hide();
	});
	// 美元
	$("#recharge-dollar").click(function () {
		allClick();
		$(this).addClass("recharge-checked").siblings().removeClass("recharge-checked");
		$(".recharge-rmb").hide();
		$(".dollar-selected").show();
	});

	moneyRuleList()

	// 返回
	$("#rechargeBack").click(function () {
		window.location.replace("./purse.html");
	});
});
// 获取列表内容
function moneyRuleList() {
	var uid = localStorage.getItem("uid");
	var token = localStorage.getItem("token");
	$.ajax({
		type: "GET",
		url: APP_URL + "/api/Wisdom/MoneyRuleList",
		data: {
			uid: uid,
			token: token
		},
		dataType: "json",
		success: function (res) {
			console.log(res);
			if (res.code == 1) {
				var data = res.data;
				var str = "";
				$.each(data, function (index, val) {
					str += `
				<li class="initial" data-index=${val}><h1>${val}元</h1><p>${val*100}智慧豆</p></li>
				 `;
				});
				$(".recharge-value>ul").html(str);
				$(".initial").click(function () {
					allClick();
					var initial = $(this).attr("data-index")
					console.log(initial)
					for (var i = 0; i < data.length; i++) {
						if (data[i] == initial) {
							$(this).addClass("selected")
							$(this).siblings().removeClass("selected")
							$("#recharge-input").val(initial);
							$(".recharge-want img").remove();
							$(".recharge-want").append("<p>元</p>");
							$("#recharge-input").addClass("recharge-input-checked");
							$(".num").text(initial)
						}
					}
				})
				$("#recharge-input").bind("input", function () {
					$(".num").text($("#recharge-input").val())
					for (var i = 0; i < data.length; i++) {
						if ($("#recharge-input").val() != data[i]) {
							$(".initial").removeClass("selected")
						}
					}
					if ($("#recharge-input").val() == "") {
						$("#recharge-input").removeClass("recharge-input-checked");
						$(".recharge-want p").remove();
						$(".recharge-want").append("<img src='../../images/191.png' />");
					} else if ($("#recharge-input").val() != "") {
						$(".recharge-want img").remove();
						$(".recharge-want").append("<p>元</p>");
					}
				})
				$(".recharge-confirm").click(function () {
					allClick();
					if ($("#recharge-input").val() == '') {
						flowerTips("请输入金额~", 1);
						return;
					}
					if ($("#recharge-input").val() < 1) {
						flowerTips("金额必须大于1~", 1);
						return;
					}
					// var selected = $(".selected").attr("data-index");
					var num = $("#recharge-input").val();
					$(window).attr("location", "./recharge-method.html?num=" + num);

				});
			} else if (res.code == 10000) {
				repeatLogin();
			}
		},
		error: function (err) {
			console.log(err);
		}
	});
}