$(function(){
	//确认上传btn
	getPush()
	//上传身份证
	$(".con1").hide();
	//确认上传
	$(".con2").hide();
	//提示信息
	$(".submit-tips").hide();
})


//提交审核
function getPush(){
	//modal
	$(".education").click(function() {
		$(".realname-shade").show()
	});
	//选择学历
	$(".verified-color").on("click","li",function(){
		$(this).addClass('verified-foot-modal-color')
		$(this).siblings().removeClass("verified-foot-modal-color")
	})
	//x
	$(".education-enter").click(function() {
		$(".realname-shade").hide()
	});
	//√
	$(".education-close").click(function() {
		$(".education").val($(".verified-foot-modal-color").html())
		$(".realname-shade").hide()
	});
	

	//身份证
	$(".identityimg").click(function(){
		$(".con3").hide();
		$(".con1").show();
	})
	//back
	$(".realname-back1").click(function(){
		$(".con1").hide();
		$(".con3").show();
	})
	//选择图片
	console.log($(".btn").text())
	if($(".btn").text()=="选择照片"){
		 $(".realname-file").change(function(e){
			var file=e.target.files[0];
			getPushImg(file)
		})
	}
		
	$(".btn").click(function(){
		if($(".btn").text()=="确认上传"){
			$(".realname-file").hide()
			//id
		    var uid=sessionStorage.getItem("uid")
		    //名字
		    var name=$(".name").val();
		    //身份证号码
		    var identitycard=$(".identitycard").val();
		    //照片图像
		    var identityimg=$('.card-photo').css('backgroundImage').split("\"")[1];
		    //学校名称
		    var schoolname=$(".schoolname").val();
		    //学历
		    var education=$(".education").val();
		    //专业
		    var profession=$(".profession").val();
		   	console.log(uid,name,identitycard,schoolname,education,profession)
		    // $.ajax({
		    //     type: "POST",
		    //     url: APP_URL + "/api/My/Identity",
		    //     data: {
		    //         uid: uid,
		    //         name:num,
		    //         identitycard:identitycard ,
		    //         identityimg:identityimg ,
		    //         schoolname:schoolname,
		    //         education:education,
		    //         profession:profession,
		    //     },
		    //     dataType: "json",
		    //     success: function(res) {
		           
		    //     },
		    //     error: function(err) {
		    //         console.log(err);
		    //     }
		    // });
			}
		})
	
}

//上传图片
function getPushImg(file){
	var formdata=new FormData();
	formdata.append("picture",file)
	$.ajax({
		processData: false, 
  		contentType: false,
        type: "POST",
        url: APP_URL + "/api/My/ImgUpload",
        data: formdata,
        dataType: "json",
        success: function(res) {
           console.log(res)
           $(".card-photo").css("background-image","url("+res.data+")")
           if (res.data!='') {
           	$(".btn").text("确认上传")
           }
        },
        error: function(err) {
            console.log(err);
        }
    });
}