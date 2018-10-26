$(function(){
	sessionStorage.setItem("gateid",1)
    UserGateDetail()
})


function UserGateDetail(time) {
	var id = sessionStorage.getItem("gateid")
  $.ajax({
    type: "GET",
    url: APP_URL + "/api/User/UserGateDetail",
    data: {
      gateid: id
    },
    dataType: "json",
    success: function (res) {
    	console.log(res);
    	var data = res.data[0]
      	$(".level-name").html(data.gatename)
      	$(".level-img").attr("src",data.hintcontent)
      	$(".kit-content").html(data.hintcontent_txt)
      	var str=''
      	$.each(data.options,function(index, el) {
      		str+=`
					<li>${el}</li>
			`
      	});
      	$(".respond-key>ul").html(str)

      	var h=m=s=ms= 0;  //定义时，分，秒，毫秒并初始化为0；
		var time=0;

		function timer(){   //定义计时函数
		 ms=ms+50;         //毫秒
		 if(ms>=1000){
		   ms=0;
		   s=s+1;         //秒
		 }
		 if(s>=60){
		   s=0;
		   m=m+1;        //分钟
		 }
		 // if(m>=60){
		 //   m=0;
		 //   h=h+1;
		 //   toDub(h)+":"+        //小时
		 // }
		 str =toDub(m)+":"+toDub(s);
		$(".level-timing>span").html(str)
         }
		function toDub(n){  //补0操作
		     if(n<10){
		       return "0"+n;
		     }
		     else {
		       return ""+n;
		     }
		   }
        time=setInterval(timer,50);
  
      	var con=[]
      	$(".respond-key>ul").on("click","li",function(){
      		con.push($(this).html())
      		table(con,data.answer,time)
      	})
      	
    },
    error: function(err) {
      console.log(err);
    }
  });
}



function table(con,answer,time){	
if (JSON.stringify(con)==JSON.stringify(answer)) {
	var id = $.parseJSON(sessionStorage.getItem("gateid"))
	sessionStorage.setItem("gateid",id+1)
	    clearInterval(time)
	    Ok(con)
     	UserGateDetail()
		con=[]
	}
	var main=''
  	$.each(con,function(index,val){
      		main+=`
				<li>${val}</li>
      		`
      });
  	$(".respond-blank>ul").html(main)
}




//正确 提交
function Ok(con){
	var id = sessionStorage.getItem("id")
	var gid = sessionStorage.getItem("gateid")
	var time = $(".level-timing>span").html()
	  $.ajax({
	    type: "GET",
	    url: APP_URL + "/api/User/UserGateDetail",
	    data: {
	      uid: id,
	      gateid:gid,
	      answer:con,
	      time:time,
	    },
	    dataType: "json",
	    success: function (res) {
	    	console.log(res);
	      	},
	    error: function (err) {
	    	console.log(err)
	    }
	})
}