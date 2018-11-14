$(function () {
    // var url = window.location.href;
    // var isFirst = url.split("=")[1];
    // console.log(isFirst);
    UserGateDetail(); //首次渲染
    var time =0
    // 退出关卡
    $("#levelBack").click(function () {
        $("#closeLevel").show();
        // 确定
        $("#exitLevel").click(function () {
            window.location.replace("./home.html");
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
             //答案选项
            option(data.options,data.answer,data.nextgateid)
            
            /*--------------垃圾代码分割线------------------*/
            $(".level-name").html(data.gatename)
            if (data.contenttype == 1) {
                $(".level-img").attr("src", data.hintcontent);
                $("#levelImg").show();
            } else if (data.contenttype == 2) {
                $("#lessonAudio").attr("src", data.hintcontent);
                $("#levelAudio").show();
            }
            $(".kit-content").html(data.hintcontent_txt)
            // 新用户演示
            var isfirst = sessionStorage.getItem("firstlogin");
            if (id == 1 && isfirst == 1) {
                levelShow();
            }
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
                    $("#kitView").unbind().bind("click",function () {
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
            //开启计时器
            if (a != 0 ) {
                if (isfirst==1) {
                    $("#time1").html("00:00");
                    return
                }
                Timedate()
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function option(options,answer,nextgateid) {
        //选项渲染
        var str = ''
        $.each(options, function (index, el) {
            str += `
                    <li data-index=${index}>${el}</li>
            `
        });
        $(".respond-key>ul").html(str);
        //答案渲染
        var info = ''
        $.each(answer,function (indexL,val) {
            info+= `
                    <li data-index=${indexL}></li>
            `
        });
        $(".respond-blank>ul").html(info);
        //选择选项
        var UserAnswer=[]
        $(".respond-key>ul").unbind().on("click","li",function(){
            var dataIndex=$(this).attr("data-index")
            var dataName=$(this).html()
            if (dataName=="") {
                return;
            }
            $(this).replaceWith("<li data-index="+dataIndex+"></li>")
            var  answerName=$(".respond-blank>ul").children()
            for (var i=0; i<answerName.length; i++) {
                if (answerName[i].innerHTML=="") {
                    answerName[i].innerHTML=dataName
                    answerName[i].dataset.index=dataIndex
                    UserAnswer.push(dataName)
                    if (UserAnswer.length==answer.length) {
                        if (JSON.stringify(UserAnswer)==JSON.stringify(answer)) {
                            clearInterval(time)
                            correctAnawer(UserAnswer,nextgateid)
                        }else{
                            $(".respond-blank>ul>li").css("border","1px solid red")
                            setTimeout(function() {
                             option(options,answer)
                            }, 500);
                            return;
                        }
                    }
                    return;
                }
            }
        })
        //答案归位
        $(".respond-blank>ul").unbind().bind().on("click","li",function(){
            var dataIndex=$(this).attr("data-index")
            var dataName=$(this).html()
            if (dataName=='') {
                return;
            }
            for (var j=0; j<UserAnswer.length; j++){
                if (UserAnswer[j]==dataName) {
                    UserAnswer.splice(j,1)
                }
            }
            $(this).replaceWith("<li data-index="+dataIndex+"></li>")
            var  optionName=$(".respond-key>ul").children()
            for (var i=0; i<optionName.length; i++) {
               if (optionName[i].dataset.index==dataIndex) {
                    optionName[i].innerHTML=dataName;
                    optionName[i].dataset.index=i
               }
            }
        })
    }
//定时器
function Timedate() {
    var m = s  = 0; //定义时，分，秒，毫秒并初始化为0；
    function timer() { //定义计时函数
        if ($("#time1").html()=="60:00") {
            $(window).attr("location","../../html/homePages/home.html")
            return;
        }
         s++
        if (s >= 60) {
            s = 0;
            m = m + 1; //分钟
        }
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
    time = setInterval(timer, 1000);

}
//正确 提交
function correctAnawer(UserAnswer,nextgateid) {
    var answer = UserAnswer.join(",")
    console.log(answer)
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
                    sessionStorage.setItem("gateid", nextgateid) //重置关卡id
                    UserGateDetail(1);
                    window.location.reload();
                    $("#levelPass").hide();
                });
                $(".next").click(function () {
                    sessionStorage.setItem("gateid", nextgateid) //重置关卡id
                    UserGateDetail(1);
                    window.location.reload();
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
            UserGateDetail(0); //首次渲染
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
            console.log(err);
        }
    });
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

// 新用户演示
function levelShow() {
    // 第一步
    $("#contentShow").show();
    $(".level-topic").css("z-index", "99999");
    // 第二步
    $("#topicShow").click(function () {
        $("#contentShow").hide();
        $(".level-topic").css("z-index", "350");
        $("#tipContentShow").show();
        $(".kit-content").css("z-index", "99999");
        $(".key-show").show();
    });
    // 第三步
    $("#keyShow").click(function () {
        $("#tipContentShow").hide();
        $(".kit-content").css("z-index", "350");
        $(".key-show").hide();
        $("#tipKeyShow").show();
        $(".blank-show").show();
    });
    $("#blankShow").click(function(){
        $("#tipKeyShow").hide();
        $(".blank-show").hide();
         sessionStorage.setItem("firstlogin","9");
        UserGateDetail("999")
    });

}




