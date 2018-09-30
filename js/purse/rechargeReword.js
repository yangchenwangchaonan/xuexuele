$(function(){
	recharge();
    $(".no-recharge").css("display","none");
});
// 获取列表内容
function recharge() {
	$.ajax({
		type: "GET",
		url: APP_URL + "/api/Wisdom/WalletRecord",
		data: {
			uid:1
		},
		dataType: "json",
		success: function (res) {
			console.log(res);
			var data = res.data;
			var str = "";
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