$(function () {
	//提交审核
	getPush()
	//确认上传btn
	getInfo()
	$(".btn0").hide();
	//上传身份证
	$(".con1").hide();
	//提示信息
	$(".submit-tips").hide();
	//照片预览
	$(".card-photo1").hide()

	// 返回
	$("#verifiedBack").click(function () {
		$(window).attr("location", "./personal-center.html");
	});

})


//页面功能
function getInfo() {
	//modal
	$(".education").click(function () {
		allClick();
		$(".realname-shade").show()
	});
	//选择学历
	$(".verified-color").on("click", "li", function () {
		allClick();
		$(this).addClass('verified-foot-modal-color')
		$(this).siblings().removeClass("verified-foot-modal-color")
	})
	//x
	$(".education-enter").click(function () {
		allClick();
		$(".realname-shade").hide()
	});
	//√
	$(".education-close").click(function () {
		allClick();
		$(".education").val($(".verified-foot-modal-color").html())
		$(".realname-shade").hide()
	});


	//身份证
	$(".identityimg").click(function () {
		allClick();
		$(".con3").hide();
		$(".con1").show();
	})
	//back
	$(".realname-back1").click(function () {
		allClick();
		$(".con1").hide();
		$(".con3").show();
		$(".realname-file").val("")
		$(".imgsrc").attr("src", "")
		$(".submit-cancel").css("display", "none")
		$(".card-photo").show()
		$(".card-photo1").hide()
		$(".btn0").hide()
		$(".btn").show()
		$(".identityimg").val("")
	})
	//选择图片
	$(".realname-file").change(function (e) {
		var file = e.target.files[0];
		getPushImg(file, file.name)
	})

	//确认上传
	$(".btn0").click(function () {
		allClick();
		$(".identityimg").val("已上传");
		$(".con1").hide();
		$(".con3").show();
	})

	//确认上传x
	$(".submit-cancel").click(function () {
		allClick();
		$(".submit-cancel").css("display", "none")
		$(".card-photo").show()
		$(".card-photo1").hide()
		$(".btn0").hide()
		$(".btn").show()
		$(".realname-file").val("")
		$(".imgsrc").attr("src", "")
		$(".identityimg").val("")
	})
}

//上传图片
function getPushImg(file, name) {
	var formdata = new FormData();
	formdata.append("picture", file)
	$.ajax({
		processData: false,
		contentType: false,
		type: "POST",
		url: APP_URL + "/api/My/ImgUpload",
		data: formdata,
		dataType: "json",
		success: function (res) {
			console.log(res)
			//x
			$(".submit-cancel").css("display", "block")
			//img
			$(".card-photo1").show()
			//背景
			$(".card-photo").hide()
			//确认上传
			$(".btn0").show()
			//选择照片
			$(".btn").hide()
			//线上图片
			$(".imgsrc").attr("src", res.data);
			//图片名称
			$(".identityimg").val(name)
		},
		error: function (err) {
			console.log(err);
		}
	});
}

//提交审核
function getPush() {
	$(".btn1").click(function () {
		allClick();
		//id
		var uid = localStorage.getItem("uid");
		var token = localStorage.getItem("token");
		//名字
		var name = $(".name").val();
		//身份证号码
		var identitycard = $(".identitycard").val();
		//照片图像
		var identityimg = $(".imgsrc").attr("src");
		//学校名称
		var schoolname = $(".schoolname").val();
		//学历
		var education = $(".education").val();
		//专业
		var profession = $(".profession").val();
		if (name == '') {
			lemonTips("姓名不能为空", 1);
			return;
		}
		if (identitycard == '') {
			lemonTips("身份证号不能为空", 1);
			return;
		}
		if (identityimg == '') {
			lemonTips("请上传身份证正面照", 1);
			return;
		}
		if (schoolname == '') {
			lemonTips("学校名称不能为空", 1);
			return;
		}
		if (education == '') {
			lemonTips("学历名称不能为空", 1);
			return;
		}
		if (profession == '') {
			lemonTips("专业名称不能为空", 1);
			return;
		}
		if (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(identitycard) == false) {
			lemonTips("身份证号码格式不正确", 1);
			return;
		}
		var educationNum = (education == "小学" ? "1" :
			education == "初中" ? "2" :
			education == "高中" ? "3" :
			education == "大专" ? "4" :
			education == "本科" ? "5" :
			education == "研究生" ? "6" :
			education == "博士" ? "7" : '')
		// console.log(uid, name, identitycard, identityimg, schoolname, educationNum, profession)
		$.ajax({
			type: "POST",
			url: APP_URL + "/api/My/Identity",
			data: {
				uid: uid,
				token: token,
				name: name,
				identitycard: identitycard,
				identityimg: identityimg,
				schoolname: schoolname,
				education: educationNum,
				profession: profession,
			},
			dataType: "json",
			success: function (res) {
				console.log(res)
				if (res.code == 1) {
					lemonTips("提交审核成功", 1);
					window.setTimeout(function () {
						$(window).attr("location", "../personalCenter/infor-submitting.html");
					}, 1000);
				} else if (res.code == 10000) {
					repeatLogin();
				}
			},
			error: function (err) {
				console.log(err);
			}
		});
	})
}