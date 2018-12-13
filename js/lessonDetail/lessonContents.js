$(function () {
	getSort(1, 1);
	$(".lesson-menu a").click(function () {
		allClick();
	})
});

function sortClick(e) {
	allClick();
	var $id = $(e).attr("data-sId");
	// console.log($id);
	if($id==1){
		$(e).addClass("sort1");
		$(e).siblings().attr("class","sort");
	}else if($id==2){
		$(e).addClass("sort2");
		$(e).siblings().attr("class","sort");
	}else if($id==3){
		$(e).addClass("sort3");
		$(e).siblings().attr("class","sort");
	}else if($id==4){
		$(e).addClass("sort4");
		$(e).siblings().attr("class","sort");
	}
	getSort(1, $id);
}


// 获取列表内容
function getSort(page, sortId) {
	$.ajax({
		type: "GET",
		url: APP_URL + "/api/Wisdom/WisdomList",
		data: {
			sort: sortId,
			page: page
		},
		dataType: "json",
		success: function (res) {
			console.log(res);
			var data = res.data;
			var str = "";
			$.each(data, function (index, val) {
				str += `
				<li data-sortId="${sortId}">
					<div class="table-lesson" data-lId = "${val.id}">
						<img src="${val.courseimg}">
						<div class="sortText">
							<div class="lesson-name1">${val.coursename}</div>
							<div class="table-smile"><img src="../../images/125.png" />x${val.wisdombean}</div>
							<div class="table-star"><img src="../../images/124.png" />${val.coursescore}</div>
						</div>
					</div>
				</li>
				 `;
			});
			if (page == 1) {
				$(".lesson-list>ul").html(str);
			} else {
				$(".lesson-list>ul").append(str);
			}
			$(".table-lesson").click(function () {
				var lessonId = $(this).attr("data-lId");
				var sort = $(this).parent().attr("data-sortId");
				// console.log(sort);
				$(window).attr("location", "./lesson-detail.html?lessonId=" + lessonId + "&sortId=" + sort);
			});
			// 触底刷新
			var nDivHight = $(".lesson-list").height();
			$(".lesson-list").unbind("scroll").bind("scroll", function () {
				// console.log(sortId);
				var nScrollHight = $(this)[0].scrollHeight;
				var nScrollTop = $(this)[0].scrollTop;
				// console.log(nDivHight, nScrollHight, nScrollTop);
				if (nScrollTop + nDivHight >= nScrollHight) {
					var pageIndex = page;
					pageIndex++;
					getSort(pageIndex, sortId);
				}
			});
			// 清除触底刷新
			if (data.length != 10 || data.length == 0) {
				$(".lesson-list").unbind('scroll');
			}

		},
		error: function (err) {
			console.log(err);
		}
	});
}