$(function(){
	recharge();
    $(".no-recharge").hide()
});
// 获取列表内容
function recharge() {
	var uid = sessionStorage.getItem("uid")
	$.ajax({
		type: "GET",
		url: APP_URL + "/api/Wisdom/WalletRecord",
		data: {
			uid:uid
		},
		dataType: "json",
		success: function (res) {
			console.log(res);
			var data = res.data;
			var str = "";
			if (res.data=='') {
				$(".no-recharge").show()
			}
			$.each(data, function (index, val) {
				str += `
				<div class="recharge-record">
					<div class="record-tab1"><img src="../../images/125.png"/><span>x${val.wisdombean}</span></div>
					<div class="record-tab2">￥${val.wisdombean}</div>
					<div class="record-tab3">${val.create_time}</div>
				</div>
				 `;
			});
			$(".recharge-box").html(str);
		},
		error: function (err) {
			console.log(err);
		}
	});
}