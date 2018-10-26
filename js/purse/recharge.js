$(function () {
	// rmb
	$("#recharge-reminbi").click(function () {
		$(this).addClass("recharge-checked").siblings().removeClass("recharge-checked");
		$(".recharge-rmb").show();
		$(".dollar-selected").hide();
	});
	// 美元
	$("#recharge-dollar").click(function () {
		$(this).addClass("recharge-checked").siblings().removeClass("recharge-checked");
		$(".recharge-rmb").hide();
		$(".dollar-selected").show();
	});

	moneyRuleList()
});
// 获取列表内容
function moneyRuleList() {
	var uid = sessionStorage.getItem("uid")
	$.ajax({
		type: "GET",
		url: APP_URL + "/api/Wisdom/MoneyRuleList",
		data: {
			uid: uid
		},
		dataType: "json",
		success: function (res) {
			console.log(res);
			var data = res.data;
			var str = "";
			$.each(data, function (index, val) {
				str += `
				<li class="initial" data-index=${val}><h1>${val}元</h1><p>${val}智慧豆</p></li>
				 `;
			});
			$(".recharge-value>ul").html(str);
			$(".initial").click(function () {
				var initial = $(this).attr("data-index")
				console.log(initial)
				for (var i = 0; i < data.length; i++) {
					if (data[i] == initial) {
						$(this).addClass("selected")
						$(this).siblings().removeClass("selected")
						$("#recharge-input").val(initial)
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
			})
			$(".recharge-confirm").click(function () {
				if ($("#recharge-input").val() == '') {
					alert("请输入金额")
					return;
				}
				if ($("#recharge-input").val() < 1) {
					alert("金额必须大于1")
					return;
				}
				var selected = $(".selected").attr("data-index")
				$(window).attr("location", "./recharge-method.html?num=" + $("#recharge-input").val());

			});
		},
		error: function (err) {
			console.log(err);
		}
	});
}