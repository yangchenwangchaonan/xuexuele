$(function(){
	UserGateDetail()
})


function UserGateDetail() {
  $.ajax({
    type: "GET",
    url: APP_URL + "/api/User/UserGateDetail",
    data: {
      gateid: 1
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
					<td>${el}</td>
			`
      	});
      	$(".level-options").html(str)
      	console.log(data.gatename)
    },
    error: function(err) {
      console.log(err);
    }
  });
}