var time = 0
$(function () {
    // var url = window.location.href;
    // var isFirst = url.split("=")[1];
    // console.log(isFirst);
    UserGateDetail(1, 1); //首次渲染
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
function UserGateDetail(a, b) {
    var id = sessionStorage.getItem("gateid");
    var uId = localStorage.getItem("uid");
    var token = localStorage.getItem("token");
    // console.log(uId);
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
            var data = res.data;
            if (res.code == 1) {
                // 失败广告弹框渲染
                if (data.gate_erralert) {
                    $("img.errorImg").attr("src", data.gate_erralert.image_path);
                    $("img.errorImg").attr("data-url", data.gate_erralert.url);
                }
                //答案选项
                var subjectContent = data.subject[b - 1];
                var sum = data.subject.length;
                option(subjectContent.options, subjectContent.answer, data.nextgateid, sum, b);
                $(".respond-key-show").html(subjectContent.options[5]); //新手演示答案选择内容
                $(".respond-blank-show").html(subjectContent.options[5]); //新手演示答案填写内容
                $(".level-name").html(subjectContent.gatename + " " + subjectContent.subject_name); //关卡名称+题目名称
                /*--------------垃圾代码分割线------------------*/
                if (subjectContent.contenttype == 1) {
                    $(".level-img").attr("src", subjectContent.hintcontent);
                    $("#levelImg").show();
                } else if (subjectContent.contenttype == 2) {
                    $("#lessonAudio").attr("src", subjectContent.hintcontent);
                    $("#levelAudio").show();
                }
                $(".kit-content").html(subjectContent.hintcontent_txt);
                // 新用户演示
                var isfirst = sessionStorage.getItem("firstlogin");
                if (id == 1 && isfirst == 1) {
                    levelShow();
                }
                // 点击锦囊
                var userWisdombean = data.userwisdombean;
                var answerNeed = subjectContent.answerwisdombeanuse;
                var answerContent = subjectContent.answer;
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
                                kitView(id, subjectContent.id, b);
                                $("#kitAnswerShade1").show();
                                // 关闭
                                $("#kitClose1").click(function () {
                                    allClick();
                                    $("#kitAnswerShade1").hide();
                                    $("#kitShade").hide();
                                });
                            } else if (answerContent.length > 4 && answerContent.length <= 8) {
                                kitView(id, subjectContent.id, b);
                                $("#kitAnswerShade2").show();
                                // 关闭
                                $("#kitClose2").click(function () {
                                    allClick();
                                    $("#kitAnswerShade2").hide();
                                    $("#kitShade").hide();
                                });
                            } else if (answerContent.length > 8) {
                                kitView(id, subjectContent.id, b);
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
                        return;
                    }
                    Timedate1()
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

function Timedate1(i) {
    clearInterval(time);
    if (i != 1) {
        Timedate();
    }

}
//游戏动作
function option(options, answer, nextgateid, sum, b) {
    var time = time;
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
                        clearInterval(time);
                        if (b < sum) {
                            var time = toSeconds($("#time1").html()); //每道题目花费的时间
                            answerTime.push(time);
                            b++;
                            UserGateDetail(1, b);
                        } else if (b == sum) {
                            Timedate1(1)
                            correctAnawer(nextgateid); //进入下一关
                        }

                    } else {
                        var answerError = $("#answerError")[0];
                        answerError.play();
                        $(".respond-blank>ul>li").css("border", "1px solid red")
                        setTimeout(function () {
                            option(options, answer, nextgateid, sum, b);
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
        if ($("#time1").html() == "01:00") {
            Timedate1(1);
            $("#errorTime").show();
            console.log($(".errorImg").attr("src"));
            if ($(".errorImg").attr("src")) {
                $("#errorAlert").show();
                $(".errorImg").unbind().bind("click", function () {
                    var url = $(this).attr("data-url");
                    $(window).attr("location", url);
                });
                $(".errorAet").unbind().bind("click", function () {
                    $("#errorAlert").hide();
                });
            }
            $(".errtorBtn").unbind().bind("click", function () {
                $(window).attr("location", "./home.html");
            });
            return;
        }
        s++;
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
    var id = localStorage.getItem("uid")
    var gid = sessionStorage.getItem("gateid")
    var token = localStorage.getItem("token");
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
function correctAnawer(nextgateid) {
    var id = localStorage.getItem("uid");
    var token = localStorage.getItem("token");
    var gid = sessionStorage.getItem("gateid");
    var timeSec = toSeconds($("#time1").html());
    $.each(answerTime, function (index, val) {
        timeSec += val;
    });
    var time = transTime(timeSec);
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserGateChallenge",
        data: {
            uid: id,
            token: token,
            gateid: gid,
            answer: 1,
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
                    if (nextgateid) {
                        $("#levelPass").show();
                        if (res.data.gate_alert) {
                            // 广告位
                            $(".alertImg").attr("src", res.data.gate_alert.image_path);
                            $("#levelAlert").show();
                            // 跳转广告
                            $(".alertImg").click(function () {
                                $(window).attr("location", res.data.gate_alert.url);
                            });
                            // 关闭广告
                            $(".closeAlert").click(function () {
                                $("#levelAlert").hide();
                            });
                        }
                    } else {
                        homeLevel("已闯完所有关卡哦~", 1);
                        window.setTimeout(function () {
                            $(window).attr("location", "./home.html");
                        }, 1500);
                    }
                } else if (res.data.isfirst == 1) {
                    //再次闯关成功
                    var goThrough = $("#goThrough")[0];
                    goThrough.play();
                    $("#passAgainTime").html(res.data.time);
                    if (nextgateid) {
                        $("#levelPassAgain").show();
                        if (res.data.gate_alert) {
                            // 广告位
                            $(".alertImg").attr("src", res.data.gate_alert.image_path);
                            $("#levelAlert").show();
                            // 跳转广告
                            $(".alertImg").click(function () {
                                $(window).attr("location", res.data.gate_alert.url);
                            });
                            // 关闭广告
                            $(".closeAlert").click(function () {
                                $("#levelAlert").hide();
                            });
                        }

                    } else {
                        homeLevel("已闯完所有关卡哦~", 1);
                        window.setTimeout(function () {
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
function kitView(gid, sbId, b) {
    var uid = localStorage.getItem("uid");
    var token = localStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/GateAnswer",
        data: {
            gateid: gid,
            subject_id: sbId,
            uid: uid,
            token: token
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                UserGateDetail(0, b); //首次渲染
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

// 转换时间
function toSeconds(time) {
    var str = time;
    var arr = str.split(':');
    var ms = parseInt(arr[0] * 60);
    var ss = parseInt(arr[1]);
    var seconds = ms + ss;
    return seconds;
}
//秒转换00:00
function transTime(time) {
    var duration = parseInt(time);
    var minute = parseInt(duration / 60);
    var sec = duration % 60 + '';
    var isM0 = ':';
    if (minute == 0) {
        minute = '00';
    } else if (minute < 10) {
        minute = '0' + minute;
    }
    if (sec.length == 1) {
        sec = '0' + sec;
    }
    return minute + isM0 + sec
}

// 闯关失败弹窗
function errorAlert() {
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
        },
        error: function () {
            console.log(res);
        }
    });
}