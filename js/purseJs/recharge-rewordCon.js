// 获取列表内容
function () {
	$.ajax({
		type: "GET",
		url: APP_URL + "/api/Wisdom/WalletRecord",
		data: {
			uid:1,
		},
		dataType: "json",
		success: function (res) {
			console.log(res);
			var data = res.data;
			var str = "";
			$.each(data, function (index, val) {
				str += `
				<div class="recharge-record">
					<div class="record-tab1"><img src="../../images/125.png"/><span>x200</span></div>
					<div class="record-tab2">￥200</div>
					<div class="record-tab3">2017-01-01</div>
				</div>
				 `;
			});
			$(".lesson-list>ul").html(str);
			$(".table-lesson").click(function () {
				var lessonId = $(this).attr("data-id");
				$(window).attr("location", "./lesson-detail.html?lessonId="+lessonId);
			});
		},
		error: function (err) {
			console.log(err);
		}
	});
}