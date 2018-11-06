$(function () {
	getSort(1);
	var $sort = $(".lesson-sort>.sort");
	$sort.click(function () {
		var $id = $(this).attr("data-sId");
		getSort(1,$id);
	});

	// 禁止屏幕滚动
	var handle = function (event) {
		event.preventDefault();
	}
	document.body.addEventListener('touchmove', handle, false);
	document.body.removeEventListener('touchmove', handle, false);

});

// 获取列表内容
function getSort(page,id) {
	$.ajax({
		type: "GET",
		url: APP_URL + "/api/Wisdom/WisdomList",
		data: {
			sort: id,
			page: page
		},
		dataType: "json",
		success: function (res) {
			console.log(res);
			var data = res.data;
			var str = "";
			$.each(data, function (index, val) {
				str += `
				<li>
					<div class="table-lesson" data-lId = "${val.id}">
						<img src="${val.courseimg}">
						<div class="lesson-name1">${val.coursename}</div>
						<div class="table-smile"><img src="../../images/125.png" />x${val.coursescore}</div>
						<div class="table-star"><img src="../../images/124.png" />${val.wisdombean}</div>
					</div>
				</li>
				 `;
			});
			$(".lesson-list>ul").html(str);
			$(".table-lesson").click(function () {
				var lessonId = $(this).attr("data-lId");
				$(window).attr("location", "./lesson-detail.html?lessonId=" + lessonId);
			});
			// 触底刷新
			// var nDivHight = $(".lesson-list").height();
			// $(".lesson-list").scroll(function () {
			// 	var nScrollHight = $(this)[0].scrollHeight;
			// 	var nScrollTop = $(this)[0].scrollTop;
			// 	console.log(nDivHight, nScrollHight, nScrollTop);
			// 	if (nScrollTop + nDivHight == nScrollHight) {
			// 		var pageIndex = index;
			// 		pageIndex++;
			// 		getSort(pageIndex,id);
			// 	}
			// });

		},
		error: function (err) {
			console.log(err);
		}
	});
}