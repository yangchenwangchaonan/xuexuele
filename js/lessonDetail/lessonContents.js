$(function () {
	getSort(1);
	var $sort = $(".lesson-sort>.sort");
	$sort.click(function () {
		var id = $(this).attr("id");
		// alert(id)
		getSort(id);
	});
});


// 获取列表内容
function getSort(id) {
	$.ajax({
		type: "GET",
		url: APP_URL + "/api/Wisdom/WisdomList",
		data: {
			id: id,
			page: 1
		},
		dataType: "json",
		success: function (res) {
			console.log(res);
			var data = res.data;
			var str = "";
			$.each(data, function (index, val) {
				str += `
				<li>
					<div class="table-lesson" data-id = "${val.id}">
						<img src="${val.courseimg}">
						<div class="lesson-name">${val.coursename}</div>
						<div class="table-smile"><img src="../../images/125.png" />x${val.coursescore}</div>
						<div class="table-star"><img src="../../images/124.png" />${val.wisdombean}</div>
					</div>
				</li>
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