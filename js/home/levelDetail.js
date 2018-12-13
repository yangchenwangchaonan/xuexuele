$(function () {
    // var url = window.location.href;
    // var isFirst = url.split("=")[1];
    // console.log(isFirst);
    UserGateDetail(); //首次渲染
    var time = 0
    // 退出关卡
    $("#levelBack").click(function () {
        $("#closeLevel").show();
        // 确定
        $("#exitLevel").click(function () {
            var levelFailAudio = $("#levelFailAudio")[0];
            levelFailAudio.play();
            window.setTimeout(function () {
                errorOut();
            }, 1000);
        });
        // 取消
        $("#exitCancel").click(function () {
            allClick();
            $("#closeLevel").hide();
        });
    });

})
//首次渲染
function UserGateDetail(a) {
    var id = sessionStorage.getItem("gateid");
    var uId = localStorage.getItem("uid");
    var token = localStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserGateDetail",
        data: {
            gateid: id,
            uid: uId,
            token: token
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data
            if (res.code == 1) {
                //答案选项
                option(data.options, data.answer, data.nextgateid);
                $(".respond-key-show").html(data.options[5]); //新手演示答案选择内容
                $(".respond-blank-show").html(data.options[5]); //新手演示答案填写内容

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
                    allClick();
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
                        $("#kitView").unbind().bind("click", function () {
                            allClick();
                            $(".kit-havebeans").hide();
                            if (answerContent.length > 0 && answerContent.length <= 4) {
                                kitView(id);
                                $("#kitAnswerShade1").show();
                                // 关闭
                                $("#kitClose1").click(function () {
                                    allClick();
                                    $("#kitAnswerShade1").hide();
                                    $("#kitShade").hide();
                                });
                            } else if (answerContent.length > 4 && answerContent.length <= 8) {
                                kitView(id);
                                $("#kitAnswerShade2").show();
                                // 关闭
                                $("#kitClose2").click(function () {
                                    allClick();
                                    $("#kitAnswerShade2").hide();
                                    $("#kitShade").hide();
                                });
                            } else if (answerContent.length > 8) {
                                kitView(id);
                                $("#kitAnswerShade3").show();
                                // 关闭
                                $("#kitClose3").click(function () {
                                    allClick();
                                    $("#kitAnswerShade3").hide();
                                    $("#kitShade").hide();
                                });
                            }
                        });
                        // 关闭
                        $("#havebeansClose").click(function () {
                            allClick();
                            $("#kitShade").hide();
                            $(".kit-havebeans").hide();
                        });
                    } else if (answerNeed > userWisdombean) {
                        $(".kit-nobeans").show();
                        $(".kit-nobeans>span").html("x" + answerNeed);
                        //点击立即充值
                        $(".kit-echarge").click(function () {
                            $(window).attr("location", "../purse/recharge.html");
                        });
                        // 关闭
                        $("#nobeansClose").click(function () {
                            allClick();
                            $("#kitShade").hide();
                            $(".kit-havebeans").hide();
                        });
                    }
                });
                //开启计时器
                if (a != 0) {
                    if (isfirst == 1) {
                        $("#time1").html("00:00");
                        return
                    }
                    Timedate()
                }
            } else if (res.code == 10000) {
                repeatLogin();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}
//游戏动作
function option(options, answer, nextgateid) {
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
    $.each(answer, function (indexL, val) {
        info += `
                    <li data-index=${indexL}></li>
            `
    });
    $(".respond-blank>ul").html(info);
    //选择选项
    var UserAnswer = []
    $(".respond-key>ul").unbind().on("click", "li", function () {
        allClick();
        var dataIndex = $(this).attr("data-index")
        var dataName = $(this).html()
        if (dataName == "") {
            return;
        }
        $(this).replaceWith("<li data-index=" + dataIndex + "></li>")
        var answerName = $(".respond-blank>ul").children()
        for (var i = 0; i < answerName.length; i++) {
            if (answerName[i].innerHTML == "") {
                answerName[i].innerHTML = dataName
                answerName[i].dataset.index = dataIndex
                UserAnswer.push(dataName)
                if (UserAnswer.length == answer.length) {
                    if (JSON.stringify(UserAnswer) == JSON.stringify(answer)) {
                        clearInterval(time)
                        correctAnawer(UserAnswer, nextgateid)
                    } else {
                        var answerError = $("#answerError")[0];
                        answerError.play();
                        $(".respond-blank>ul>li").css("border", "1px solid red")
                        setTimeout(function () {
                            option(options, answer, nextgateid)
                        }, 500);
                        return;
                    }
                }
                return;
            }
        }
    })
    //答案归位
    $(".respond-blank>ul").unbind().bind().on("click", "li", function () {
        allClick();
        var dataIndex = $(this).attr("data-index")
        var dataName = $(this).html()
        if (dataName == '') {
            return;
        }
        for (var j = 0; j < UserAnswer.length; j++) {
            if (UserAnswer[j] == dataName) {
                UserAnswer.splice(j, 1)
            }
        }
        $(this).replaceWith("<li data-index=" + dataIndex + "></li>")
        var optionName = $(".respond-key>ul").children()
        for (var i = 0; i < optionName.length; i++) {
            if (optionName[i].dataset.index == dataIndex) {
                optionName[i].innerHTML = dataName;
                optionName[i].dataset.index = i
            }
        }
    })
}
//定时器
function Timedate() {
    var m = s = 0; //定义时，分，秒，毫秒并初始化为0；
    function timer() { //定义计时函数
        if ($("#time1").html() == "60:00") {
            $(window).attr("location", "../../html/homePages/home.html")
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
//错误提交 减少体力值
function errorOut() {
    // var answer = UserAnswer.join(",")
    // console.log(answer)
    var id = localStorage.getItem("uid")
    var gid = sessionStorage.getItem("gateid")
    var token = localStorage.getItem("token");
    // var time = $("#time1").html()
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserGateChallenge",
        data: {
            uid: id,
            token: token,
            gateid: gid,
            answer: "",
            time: "00:00",
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                window.location.replace("./home.html");
            } else if (res.code == 10000) {
                repeatLogin();
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

//正确 提交
function correctAnawer(UserAnswer, nextgateid) {
    var answer = UserAnswer.join(",")
    // console.log(answer)
    var id = localStorage.getItem("uid");
    var token = localStorage.getItem("token");
    var gid = sessionStorage.getItem("gateid");
    var time = $("#time1").html();
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserGateChallenge",
        data: {
            uid: id,
            token: token,
            gateid: gid,
            answer: answer,
            time: time,
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                ranking(gid);
                if (res.data.isfirst == 0) {
                    //初次闯关成功
                    var goThrough = $("#goThrough")[0];
                    goThrough.play();
                    $("#passFirstTime").html(res.data.time);
                    $("#passStamina").html("x" + res.data.rewardbeans);
                    $("#passPk").html("x" + res.data.pkvalue);
                    if(nextgateid){
                        $("#levelPass").show();
                    }else{
                        homeLevel("已闯完所有关卡哦~", 1);
                        window.setTimeout(function() {
                            $(window).attr("location", "./home.html");
                        }, 1500);
                    }  
                } else if (res.data.isfirst == 1) {
                    //再次闯关成功
                    var goThrough = $("#goThrough")[0];
                    goThrough.play();
                    $("#passAgainTime").html(res.data.time);
                    if(nextgateid){
                        $("#levelPassAgain").show();
                    }else{
                        homeLevel("已闯完所有关卡哦~", 1);
                        window.setTimeout(function() {
                            $(window).attr("location", "./home.html");
                        }, 1500);
                    }  
                }

                // 下一关
                $(".next-level").click(function () {
                    if (res.data.manvalue >= 3) {
                        allClick();
                        sessionStorage.setItem("gateid", nextgateid) //重置关卡id
                        UserGateDetail(1);
                        window.location.reload();
                        $("#levelPass").hide();
                    } else {
                        homeLevel("当前体力值不足哦~", 1);
                    }
                });
                $(".next").click(function () {
                    if (res.data.manvalue >= 3) {
                        allClick();
                        sessionStorage.setItem("gateid", nextgateid) //重置关卡id
                        UserGateDetail(1);
                        window.location.reload();
                        $("#levelPassAgain").hide();
                    } else {
                        homeLevel("当前体力值不足哦~", 1);
                    }
                });
                // 关闭
                $("#passFirstClose,#passAgainClose").click(function () {
                    $(window).attr("location", "./home.html");
                });
            } else if (res.code == 10000) {
                repeatLogin();
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}



// 立即查看
function kitView(gid) {
    var uid = localStorage.getItem("uid");
    var token = localStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/GateAnswer",
        data: {
            gateid: gid,
            uid: uid,
            token: token
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                UserGateDetail(0); //首次渲染
                var data = res.data;
                var $str = "";
                $("")
                $.each(data.answer, function (index, val) {
                    $str += `
                    <li>${val}</li>
                 `;
                });
                if (data.answer.length > 0 && data.answer.length <= 4) {
                    $("#answerList1").html($str);
                    $(".kit-lesson1>.lessonbackground1").attr("src", data.courseimg); //推荐课程图片
                    $(".kit-lesson1>h1").html(data.coursename); //课程名称
                    $(".kit-lesson1>.lesson-gifts>.lesson-smile>span").html(data.wisdombean); //智慧豆数量
                    $(".kit-lesson1>.lesson-gifts>.lesson-star>span").html(data.coursescore); //课程评分
                } else if (data.answer.length > 4 && data.answer.length <= 8) {
                    $("#answerList2").html($str);
                    $(".kit-lesson2>.lessonbackground1").attr("src", data.courseimg); //推荐课程图片
                    $(".kit-lesson2>h1").html(data.coursename); //课程名称
                    $(".kit-lesson2>.lesson-gifts>.lesson-smile>span").html(data.wisdombean); //智慧豆数量
                    $(".kit-lesson2>.lesson-gifts>.lesson-star>span").html(data.coursescore); //课程评分
                } else if (data.answer.length > 8) {
                    $("#answerList3").html($str);
                    $(".kit-lesson3>.lessonbackground1").attr("src", data.courseimg); //推荐课程图片
                    $(".kit-lesson3>h1").html(data.coursename); //课程名称
                    $(".kit-lesson3>.lesson-gifts>.lesson-smile>span").html(data.wisdombean); //智慧豆数量
                    $(".kit-lesson3>.lesson-gifts>.lesson-star>span").html(data.coursescore); //课程评分
                }
            } else if (code == 10000) {
                repeatLogin();
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
        allClick();
        $("#contentShow").hide();
        $(".level-topic").css("z-index", "350");
        $("#tipContentShow").show();
        $(".kit-content").css("z-index", "99999");
        $(".key-show").show();
    });
    // 第三步
    $("#keyShow").click(function () {
        allClick();
        $("#tipContentShow").hide();
        $(".kit-content").css("z-index", "350");
        $(".key-show").hide();
        $("#tipKeyShow").show();
        $(".blank-show").show();
    });
    $("#blankShow").click(function () {
        allClick();
        $("#tipKeyShow").hide();
        $(".blank-show").hide();
        sessionStorage.setItem("firstlogin", "9");
        UserGateDetail("999")
    });

}