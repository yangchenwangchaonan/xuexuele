$(function () {
    UserGateDetail();
    // 退出关卡
    $("#levelBack").click(function () {
        $("#closeLevel").show();
        // 确定
        $("#exitLevel").click(function () {
            $(window).attr("location", "./home.html");
        });
        // 取消
        $("#exitCancel").click(function () {
            $("#closeLevel").hide();
        });
    });
})
//首次渲染
function UserGateDetail(a) {
    var id = sessionStorage.getItem("gateid");
    var uId = sessionStorage.getItem("uid");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserGateDetail",
        data: {
            gateid: id,
            uid: uId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data
            $(".level-name").html(data.gatename)
            if (data.contenttype == 1) {
                $(".level-img").attr("src", data.hintcontent);
                $("#levelImg").show();
            } else if (data.contenttype == 2) {
                $("#lessonAudio").attr("src", data.hintcontent);
                $("#levelAudio").show();
            }

            $(".kit-content").html(data.hintcontent_txt)
            var str = ''
            $.each(data.options, function (index, el) {
                str += `
						<li>${el}</li>
				`
            });
            $(".respond-key>ul").html(str)
            // 点击锦囊
            var userWisdombean = data.userwisdombean;
            var answerNeed = data.answerwisdombeanuse;
            var answerContent = data.answer;
            $("#kitImg").click(function () {
                $(this).addClass("kitShake");
                window.setTimeout(function () {
                    $("#kitImg").removeClass("kitShake");
                    $("#kitShade").show();
                }, 1500);
                if (answerNeed <= userWisdombean) {
                    $(".kit-havebeans>span").html("x" + answerNeed);
                    $(".kit-havebeans>p").html("剩余智慧豆:" + userWisdombean);
                    $(".kit-havebeans").show();
                    // 立即查看
                    $("#kitView").click(function () {
                        $(".kit-havebeans").hide();
                        if (answerContent.length > 0 && answerContent.length <= 4) {
                            kitView(id, uId);
                            $("#kitAnswerShade1").show();
                            // 关闭
                            $("#kitClose1").click(function () {
                                $("#kitAnswerShade1").hide();
                                $("#kitShade").hide();
                            });
                        } else if (answerContent.length > 4 && answerContent.length <= 8) {
                            kitView(id, uId);
                            $("#kitAnswerShade2").show();
                            // 关闭
                            $("#kitClose2").click(function () {
                                $("#kitAnswerShade2").hide();
                                $("#kitShade").hide();
                            });
                        } else if (answerContent.length > 8) {
                            kitView(id, uId);
                            $("#kitAnswerShade3").show();
                            // 关闭
                            $("#kitClose3").click(function () {
                                $("#kitAnswerShade3").hide();
                                $("#kitShade").hide();
                            });
                        }
                    });
                    // 关闭
                    $("#havebeansClose").click(function () {
                        $("#kitShade").hide();
                        $(".kit-havebeans").hide();
                    });
                } else if (answerNeed > userWisdombean) {
                    $(".kit-nobeans").show();
                    $(".kit-nobeans>span").html("x" + answerNeed);
                    // 关闭
                    $("#nobeansClose").click(function () {
                        $("#kitShade").hide();
                        $(".kit-havebeans").hide();
                    });
                }
            });
            //定义答案数组
            var con = []
            //遍历答案
            $(".respond-key>ul").on("click", "li", function () {
                con.push($(this).html())
                table(con, data.answer, data.nextgateid)
            })
            //首次遍历
            if (a != 0) {
                Timedate()
            }
            answerData(data.answer)
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 立即查看
function kitView(gid, uid) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/GateAnswer",
        data: {
            gateid: gid,
            uid: uid
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var $str = "";
            $.each(data.answer, function (index, val) {
                $str += `
                    <li>${val}</li>
                 `;
            });
            if (data.answer.length > 0 && data.answer.length <= 4) {
                $("#answerList1").html($str);
            } else if (data.answer.length > 4 && data.answer.length <= 8) {
                $("#answerList2").html($str);
            } else if (data.answer.length > 8) {
                $("#answerList3").html($str);
            }
        },
        error: function (err) {
            console.log(err)
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
        $("#time1").html(str);
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
function table(con, answer, nextgateid) {
    console.log(con)

    //遍历答案
    var main = ''
    $.each(con, function (index, val) {
        main += `
				<li class="delete">${val}</li>
      		`
    });
    $(".respond-blank>ul").html(main)

   if (con.length == answer.length) {
        if (JSON.stringify(con) == JSON.stringify(answer)) {
            Ok(con) //提交后台
            sessionStorage.setItem("gateid", nextgateid) //重置关卡id
            // clearInterval(time) //清除定时器
            con = [] //清空答案
        } else {
            con = [] //清空错误答案
            UserGateDetail(0)
        }
    }
    
    //点击答案删除
    $(".delete").click(function () {
        con.splice($.inArray(this, con), 1);
        table(con, answer)
    })

}

//正确 提交
function Ok(con) {
    var answer = con.join(",")
    var id = sessionStorage.getItem("uid")
    var gid = sessionStorage.getItem("gateid")
    var time = $("#time1").html()
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserGateChallenge",
        data: {
            uid: id,
            gateid: gid,
            answer: answer,
            time: time,
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                // $(".level-timing").html("<span>00:00</span>");
                ranking(gid);
                if (res.data.isfirst == 0) {
                    //初次闯关成功
                    $("#passFirstTime").html(res.data.time);
                    $("#passStamina").html("x" + res.data.rewardbeans);
                    $("#passPk").html("x" + res.data.pkvalue);
                    $("#levelPass").show();
                } else if (res.data.isfirst == 1) {
                    //再次闯关成功
                    $("#passAgainTime").html(res.data.time);
                    $("#levelPassAgain").show();
                }

                // 下一关
                $(".next-level").click(function () {
                    // $(".level-timing").html("<span id='time1'></span>");
                    UserGateDetail(1);
                    window.location.reload();
                    $("#levelPass").hide();
                });
                $(".next").click(function () {
                    UserGateDetail(1);
                    $("#levelPassAgain").hide();
                });
                // 关闭
                $("#passFirstClose,#passAgainClose").click(function () {
                    $(window).attr("location", "./home.html");
                });
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}





//首次渲染四个答案框
function answerData(answer) {
    console.log(answer)
    var x = ''
    $.each(answer, function (index, el) {
        x += `
					<li></li>
			`
    });

    $(".respond-blank>ul").html(x)
}

// 全网排名 
function ranking(levelId) {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserGateSort",
        data: {
            gateid: levelId,
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var $str = ""
            $.each(data, function (index, val) {
                $str +=
                    `
            <li>
              <p class="border-num">${index+1}</p>
              <p class="border-head"><img src="${val.headimg}" /></p>
              <p class="border-name">${val.nickname}</p>
              <p class="border-time">${val.time}</p>
              <p class="border-phiz"><img src="../../images/97.png" /><span>x${val.rewordbeans}</span></p>
            </li>
            `
            })
            $(".board-list").html($str)
        },
        error: function (err) {
            console.log(err)
        }
    });
}