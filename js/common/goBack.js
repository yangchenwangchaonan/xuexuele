$(function () {
	/*返回上一页*/
	$(".page-back,.areaSearch-back,.album-back,.series-back,.purse-back,.personal-back,.realname-back,.personal-goback,.manage-back,.album-add-back,.personal-back").click(function () {
		history.back(-1);
	});
});