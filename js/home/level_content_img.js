$(function() {
    sessionStorage.setItem("gateid", 1)
    UserGateDetail()
})


//首次渲染
function UserGateDetail(a) {
    var id = sessionStorage.getItem("gateid")
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserGateDetail",
        data: {
            gateid: id
        },
        dataType: "json",
        success: function(res) {
            console.log(res);
            var data = res.data[0]
            $(".level-name").html(data.gatename)
            $(".level-img").attr("src", data.hintcontent)
            $(".kit-content").html(data.hintcontent_txt)
            var str = ''
            $.each(data.options, function(index, el) {
                str += `
						<li>${el}</li>
				`
            });
            $(".respond-key>ul").html(str)

            //定义答案数组
            var con = []
            //遍历答案
            $(".respond-key>ul").on("click", "li", function() {
                con.push($(this).html())
                table(con, data.answer)
            })
            //首次遍历
            if (a!= 0) {
                Timedate()
            }
            answerData(data.answer)
        },
        error: function(err) {
            console.log(err);
        }
    });
}




//定时器
function Timedate() {
    var h = m = s = ms = 0; //定义时，分，秒，毫秒并初始化为0；
    var time = 0;

    function timer() { //定义计时函数
        ms = ms + 50; //毫秒
        if (ms >= 1000) {
            ms = 0;
            s = s + 1; //秒
        }

        if (s >= 60) {
            s = 0;
            m = m + 1; //分钟
        }

        // if(m>=60){
        //   m=0;
        //   h=h+1;
        //   toDub(h)+":"+        //小时
        // }

        str = toDub(m) + ":" + toDub(s);
        $(".level-timing>span").html(str)
    }

    //补0操作
    function toDub(n) {
        if (n < 10) {
            return "0" + n;
        } else {
            return "" + n;
        }
    }

    //开启定时器
    time = setInterval(timer, 50);
}




//答案比对
function table(con, answer) {
    if (con.length == answer.length) {
        if (JSON.stringify(con) == JSON.stringify(answer)) {
            var id = $.parseJSON(sessionStorage.getItem("gateid"))
            sessionStorage.setItem("gateid", id + 1) //重置关卡id
            // clearInterval(time) //清除定时器
            Ok(con) //提交后台
            UserGateDetail(1) //进入下一关卡
            con = [] //清空答案
        } else {
            con = [] //清空错误答案
            UserGateDetail(0)
        }
    }


    //遍历答案
    var main = ''
    $.each(con, function(index, val) {
        main += `
				<li class="delete">${val}</li>
      		`
    });
    $(".respond-blank>ul").html(main)

    //点击答案删除
    $(".delete").click(function() {
        con.splice($.inArray(this, con), 1);
        table(con, answer, time)
    })
}





//正确 提交
function Ok(con) {
    var id = sessionStorage.getItem("id")
    var gid = sessionStorage.getItem("gateid")
    var time = $(".level-timing>span").html()
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserGateDetail",
        data: {
            uid: id,
            gateid: gid,
            answer: con,
            time: time,
        },
        dataType: "json",
        success: function(res) {
            console.log(res);
        },
        error: function(err) {
            console.log(err)
        }
    })
}





//首次渲染四个答案框
function answerData(answer) {
    console.log(answer)
    var x = ''
    $.each(answer, function(index, el) {
        x += `
					<li></li>
			`
    });

    $(".respond-blank>ul").html(x)
}