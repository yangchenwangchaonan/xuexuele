$(function () {
  var music = $("#homeBackgroud")[0];
  //原住人数
  people();
  //闯关列表
  userGate(1, 1);
  // 网络不给力
  // generalTips("网络不给力啊~", 1);
  //站内信
  $("#maildrop-tab").click(function () {
    allClick();
    $(window).attr("location", "./letter.html");
  });

  //签到
  $("#signed-tab").click(function () {
    allClick();
    $("#recording-shade").show();
    $("img.signed-close").click(function () {
      $("#recording-shade").hide();
      userGate(1, 1);
    });
    // actioveDate()   //日历当前日期渲染
    signinDate() //当月签到日期渲染
    handleClick() //点击签到
  });

  //百宝箱
  $("#treasureBox-tab").click(function () {
    allClick();
    $(window).attr("location", "./treasureBox.html");
  });

  // 首页弹窗
  homeAlert();

});

//原住人数
function people() {
  $.ajax({
    type: "GET",
    url: APP_URL + "/api/User/UserResident",
    dataType: "json",
    success: function (res) {
      console.log(res);
      var num = res.data;
      $("#sum").html(num);
    },
    error: function (err) {
      console.log(err)
    }
  });
}

// 闯关列表
function userGate(index, iscurrent) {
  var uid = localStorage.getItem("uid");
  var token = localStorage.getItem("token");
  // console.log(token);
  $.ajax({
    type: "GET",
    url: APP_URL + "/api/Wisdom/WisdomIndex",
    data: {
      uid: uid,
      token: token,
      iscurrent: iscurrent,
      pageindex: index
    },
    dataType: "json",
    success: function (res) {
      console.log(res);
      if (res.code == 1) {
        var data = res.data;
        sessionStorage.setItem("firstlogin", data.firstlogin); //是否为第一次登录
        if (data.firstlogin == 1) {
          var scrollT = document.documentElement.scrollTop || document.body.scrollTop; //滚动条的垂直偏移
          var scrollH = document.documentElement.scrollHeight || document.body.scrollHeight; //元素的整体高度
          var clientH = document.documentElement.clientHeight || document.body.clientHeight; //元素的可见高度
          document.documentElement.scrollTop = scrollH - clientH
          window.pageYOffset = scrollH - clientH
          document.body.scrollTop = scrollH - clientH
        }
        //体力值
        // console.log(data.manvalue);
        var sVal = data.manvalue;
        if (sVal > 30) {
          sVal = 30;
        }
        $("#nowStamina").html(sVal);
        $("#ownStamina").html(sVal);
        //体力值、智慧豆、pk值进度条宽度
        var fontSize = getComputedStyle(window.document.documentElement)['font-size'];
        var fontSizeNum = fontSize.substring(0, fontSize.length - 2);
        var staminaWidth = fontSizeNum * 4.5;
        // console.log(fontSizeNum);
        var sPercent = sVal / 30;
        $(".stamina-value").css("width", sPercent * staminaWidth);
        // 体力值tips
        $("#stamina-tab").click(function () {
          allClick();
          if (sVal < 4) {
            $("#ownStamina").css("color", "red");
            $("#stamina-shade").show();
          } else {
            $("#stamina-shade").show();
          }
          $(".staminaClose").click(function () {
            $("#stamina-shade").hide();
          });
        });
        //智慧豆
        var progressWidth = fontSizeNum * 4.9;
        var bean = data.wisdombean;
        // var bean =1000;
        $("#getBeans").html(bean);
        var beanPercent = bean / 999;
        $(".beans-value").css("width", beanPercent * progressWidth);
        if (bean > 999) {
          $(".beans-value").css("width", progressWidth);
          $("#getBeans").html("999+");
          // $(".beans-value").append("<i class='icon_stamina'>+</i>");
        }
        //pk值
        var pkVal = data.pk;
        // var pkVal =1000;
        $("#pkValue").html(pkVal);
        var pkPercent = pkVal / 999;
        $(".pk-value").css("width", pkPercent * progressWidth);
        if (pkVal > 999) {
          $(".pk-value").css("width", progressWidth);
          $("#pkValue").html("999+");
          // $(".pk-value").append("<i class='icon_stamina'>+</i>");
        }
        // 站内信
        if (data.msgcount != 0) {
          $("#letterNum").addClass("maildrop-infor");
          $("#letterNum>span").html(data.msgcount);
        }
        // 百宝箱
        if (data.spgatecount != 0) {
          $("#treasureBoxNum").addClass("giftbox-infor");
          $("#treasureBoxNum>span").html(data.spgatecount);
        }
        // 是否签到
        if (data.issign != 0) {
          $("#recordContent").addClass("signed-recording");
          $("#recordContent>span").html("已签到");
        }
        var levelSum = data.gatelist.length;
        // console.log(levelSum);
        //大数组分小数组
        var array = data.gatelist;
        var size = 6;

        function sliceArr(array, size) {
          var result = [];
          for (var x = 0; x < Math.ceil(array.length / size); x++) {
            var start = x * size;
            var end = start + size;
            result.push(array.slice(start, end));
          }
          return result;
        }
        var $levelList = sliceArr(array, size);
        var $str = "";
        // console.log($levelList);
        var $levelFixed = $levelList[0].reverse();
        $.each($levelFixed, function (index, val) {
          if (val != "") {
            var levelSeq = parseInt(val.gatename.replace(/[^0-9]/ig, "")); //截取数字
            // console.log(levelSeq);
            $str += `
          <li class='${levelSeq==1?"LevelPosition1"+" "+(val.islock==0||(val.islock==1&&val.time=='')?'oddFailLevel':''):
                     levelSeq==2?"LevelPosition2"+" "+(val.islock==0||(val.islock==1&&val.time=='')?"evenFailLevel":''):
                     levelSeq==3?"LevelPosition3"+" "+(val.islock==0||(val.islock==1&&val.time=='')?'oddFailLevel':''):
                     levelSeq==4?"LevelPosition4"+" "+(val.islock==0||(val.islock==1&&val.time=='')?"evenFailLevel":''):
                     levelSeq==5?"LevelPosition5"+" "+(val.islock==0||(val.islock==1&&val.time=='')?'oddFailLevel':''):
                     levelSeq==6?"LevelPosition6"+" "+(val.islock==0||(val.islock==1&&val.time=='')?"evenFailLevel":''):""
                    }'  onclick="runLevel('${val.time}','${val.id}','${val.islock}','${val.pkvalue}','${val.rewardbeans}','${val.gatename}','${data.manvalue}')">
            <span>${levelSeq}</span>
            ${val.islock==1&&val.time==''?`
            <div class="${levelSeq%2==0?'evenWillLevel':'oddWillLevel'}"></div>
            `:''}
            ${val.time!=''?'':`
            <div class="${val.specialreward==1?"specialReward":"noSpecialReward"}"><img src="../../images/101.png" /><span>特殊奖励</span></div>
            `}
            <div class="${val.time==""?"noLevelTime":"levelTime"}"><p>${moment("2018/6/7 6:"+val.time).format("mm分ss秒")}</p><p><img src="../../images/97.png" />+${val.rewordbeans}</p></div>
          </li>
         `;
          } else {
            $str += `<li></li>`;
          }
        });
        $("#levelFixed").html($str);
        if (data.gatelist[5].islock == 1 && data.gatelist[5].time != "") {
          $(".homeFixed>.cloudContent").hide();
        }
        // console.log($levelList);
        var bgSum = Math.ceil(levelSum / 6); //背景图数量
        var str1 = "";
        for (var i = 1; i < bgSum; i++) {
          // console.log($levelList[i].length);
          str1 += `
        <div class="homeLoopBg">
          <div class="homeContentLoop"></div>
          <div class="aroundCloudLoop">
          ${i%2==0?`
            <div class="evenBigCloudLoop"><img src="../../images/right.png"></div>
          `:`
            <div class="oddBigCloudLoop"><img src="../../images/left.png"></div>
          `
          }
            <div class="leftCloudLoop"><img src="../../images/254.png" /></div>
            <div class="rightCloudLoop"><img src="../../images/254.png" /></div>
          </div>
          ${$levelList[i].length>0&&$levelList[i].length<6?`
            <div class="cloudContent">
              <div class="leftCloud"><img src="../../images/left.png" /></div>
              <div class="centerCloud"><img src="../../images/center.png"/></div>
              <div class="rightCloud"><img src="../../images/right.png"/></div>
            </div>
          `:($levelList[i][5].islock == 1 && $levelList[i][5].time != ""?"":`
          <div class="cloudContent">
            <div class="leftCloud"><img src="../../images/left.png" /></div>
            <div class="centerCloud"><img src="../../images/center.png"/></div>
            <div class="rightCloud"><img src="../../images/right.png"/></div>
          </div>`)
          }
          <ul class="level-list2">`
          // 最后一组反转
          var $level = $levelList[i].reverse();
          $.each($level, function (index, val) {
            if (val != "") {
              var levelNum = parseInt(val.gatename.replace(/[^0-9]/ig, "")); //截取数字
            }
            if (val == "") {
              str1 += `<li></li>`;
            } else {
              str1 += `
            <li class='${levelNum%6==1?"LevelLoopPosition1"+" "+(val.islock==0||(val.islock==1&&val.time=='')?'oddFailLevel':''):
                         levelNum%6==2?"LevelLoopPosition2"+" "+(val.islock==0||(val.islock==1&&val.time=='')?"evenFailLevel":''):
                         levelNum%6==3?"LevelLoopPosition3"+" "+(val.islock==0||(val.islock==1&&val.time=='')?'oddFailLevel':''):
                         levelNum%6==4?"LevelLoopPosition4"+" "+(val.islock==0||(val.islock==1&&val.time=='')?"evenFailLevel":''):
                         levelNum%6==5?"LevelLoopPosition5"+" "+(val.islock==0||(val.islock==1&&val.time=='')?'oddFailLevel':''):
                         levelNum%6==0?"LevelLoopPosition6"+" "+(val.islock==0||(val.islock==1&&val.time=='')?"evenFailLevel":''):""
                        }' onclick="runLevel('${val.time}','${val.id}','${val.islock}','${val.pkvalue}','${val.rewardbeans}','${val.gatename}','${data.manvalue}')">
                    <span>${levelNum}</span>
                    ${val.islock==1&&val.time==''?`
                    <div class="${levelNum%2==0?'evenWillLevel':'oddWillLevel'}"></div>
                    `:''}
                    ${val.time!=''?'':`
                    <div class="${val.specialreward==1?"specialReward":"noSpecialReward"}"><img src="../../images/101.png" /><span>特殊奖励</span></div>
                    `}
                    <div class="${val.time==""?"noLevelTime":"levelTime"}"><p>${moment("2018/6/7 6:"+val.time).format("mm分ss秒")}</p><p><img src="../../images/97.png" />+${val.rewordbeans}</p></div>
                  </li>
                `;
            }
          });
          str1 += `
            </ul>
          </div>
          `;
        };
        $(".homeLoop").html(str1);
        // 反转
        var homeLoop = $(".homeLoopBg");
        var loopList = [];
        for (var i = 0; i < homeLoop.length; i++) {
          loopList[i] = homeLoop[i];
        }
        loopList.reverse();
        for (var i = 0; i < loopList.length; i++) {
          $(".homeLoop").append(loopList[i]);
        }

        // $(".cloudContent").click(function () {
        //   $(this).children(".leftCloud").addClass("moveLeft");
        //   $(this).children(".centerCloud").fadeOut();
        //   $(this).children(".rightCloud").addClass("moveRight");
        //   window.setTimeout(function () {
        //     $(".cloudContent").hide();
        //   }, 4000);
        // });
        // 触顶刷新
        window.onscroll = function () {
          var index = data.pageindex;
          if ((data.gatelist.length / 6) != data.pageindex) {
            generalTips("已经到滑到顶部啦~", 1);
            return;
          }
          // console.log(index);
          if (index == 1) {
            var cloudContent = $(".homeFixed>.cloudContent");
          } else if (index > 1) {
            var cloudContent = $(".homeLoopBg").eq(index - 2).find(".cloudContent");
          }
          var scrollT = document.documentElement.scrollTop || document.body.scrollTop; //滚动条的垂直偏移
          if (scrollT == 0) {
            index++;
            cloudContent.children(".leftCloud").addClass("moveLeft");
            cloudContent.children(".centerCloud").fadeOut();
            cloudContent.children(".rightCloud").addClass("moveRight");
            window.setTimeout(function () {
              cloudContent.hide();
              userGate(index, 2);
            }, 2000);
            // userGate(index, 2);
          }
        }
      } else if (res.code == 10000) {
        repeatLogin();
      }
    },
    error: function (err) {
      console.log(err)
    }
  });
}


// 闯关
function runLevel(levelTime, levelId, levelLock, pkvalue, rewardbeans, levelName, userValue) {
  document.body.style.height = '100vh';
  document.body.style['overflow-y'] = 'hidden';
  if (levelLock == 0) {
    homeLevel("请先闯过当前关卡~", 1);
    return;
  } else {
    var clickMp3 = $("#clcikMp3")[0];
    clickMp3.play();
  }
  $("#levelNum").html(levelName);
  var str = "";
  str +=
    levelTime == '' ? `
        <div class="pass-gift">
          <div class="stamina-reward"><img src="../../images/108.png" /><span>x${rewardbeans}</span></div>
          <div class="pk-reward"><img src="../../images/107.png" /><span>x${pkvalue}</span></div>
          <div class="other-gift">
            <div class="other-giftbox">
              <img src="../../images/109.png" />
              <div>特殊奖励</div>
            </div>
          </div>
        </div>
        ` : `
        <div class="pass-again">
          <img src="../../images/117.png" />
          <p>${levelTime}</p>
        </div>
        `;
  $(".passLevel").html(str);
  ranking(levelId); //全网排名
  $("#levelShade").show();
  $("#levelFirst").click(function () {
    if (userValue >= 3) {
      sessionStorage.setItem("gateid", levelId);
      $(window).attr("location", "./level_content.html");
    } else {
      homeLevel("当前体力值不足哦~", 1);
    }
  });
  // 取消闯关
  $(".level_btn").click(function () {
    $("#levelShade").hide();
    document.body.style.height = 'unset';
    document.body.style['overflow-y'] = 'auto';
  });
}

//日历
var calUtil = {

  //当前日历显示的年份
  showYear: 2015,
  //当前日历显示的月份
  showMonth: 1,
  //当前日历显示的天数
  showDays: 1,
  eventName: "load",

  //初始化日历
  init: function (signList, s = '') {
    calUtil.setMonthAndDay();
    if (typeof (s) == 'undefined') {} else {
      signList.splice('', '', s);
    }
    calUtil.draw(signList);
    calUtil.bindEnvent(signList);
  },
  draw: function (signList) {
    //绑定日历
    //alert(signList.length);
    //console.log(signList);
    // if(signList.length > 21){
    //   //alert(21);
    //   $("#sign_note").empty();
    //   $("#sign_note").html('<button class="sign_contener" type="button"><i class="fa fa-calendar-check-o" aria-hidden="true"></i>&nbsp;已达标，获取1次抽奖</button>');
    // }
    var str = calUtil.drawCal(calUtil.showYear, calUtil.showMonth, signList);
    $("#calendar").html(str);
    //绑定日历表头
    var calendarName = calUtil.showYear + "年" + calUtil.showMonth + "月";
    $(".calendar_month_span").html(calendarName);
  },
  //绑定事件

  bindEnvent: function (signList) {
    // $(".calendar_record").click(function(){
    // var tmp = {"signDay":$(this).html()};
    // calUtil.init(signList,tmp);
    // });
  },

  //获取当前选择的年月
  setMonthAndDay: function () {
    switch (calUtil.eventName) {
      case "load":
        var current = new Date();
        calUtil.showYear = current.getFullYear();
        calUtil.showMonth = current.getMonth() + 1;
        break;
      case "prev":
        var nowMonth = $(".calendar_month_span").html().split("年")[1].split("月")[0];
        calUtil.showMonth = parseInt(nowMonth) - 1;
        if (calUtil.showMonth == 0) {
          calUtil.showMonth = 12;
          calUtil.showYear -= 1;
        }
        break;
      case "next":
        var nowMonth = $(".calendar_month_span").html().split("年")[1].split("月")[0];
        calUtil.showMonth = parseInt(nowMonth) + 1;
        if (calUtil.showMonth == 13) {
          calUtil.showMonth = 1;
          calUtil.showYear += 1;
        }
        break;
    }
  },
  getDaysInmonth: function (iMonth, iYear) {
    var dPrevDate = new Date(iYear, iMonth, 0);
    return dPrevDate.getDate();
  },
  bulidCal: function (iYear, iMonth) {
    var aMonth = new Array();
    aMonth[0] = new Array(7);
    aMonth[1] = new Array(7);
    aMonth[2] = new Array(7);
    aMonth[3] = new Array(7);
    aMonth[4] = new Array(7);
    aMonth[5] = new Array(7);
    aMonth[6] = new Array(7);
    var dCalDate = new Date(iYear, iMonth - 1, 1);
    var iDayOfFirst = dCalDate.getDay();
    var iDaysInMonth = calUtil.getDaysInmonth(iMonth, iYear);
    var iVarDate = 1;
    var d, w;
    aMonth[0][0] = "日";
    aMonth[0][1] = "一";
    aMonth[0][2] = "二";
    aMonth[0][3] = "三";
    aMonth[0][4] = "四";
    aMonth[0][5] = "五";
    aMonth[0][6] = "六";
    for (d = iDayOfFirst; d < 7; d++) {
      aMonth[1][d] = iVarDate;
      iVarDate++;
    }
    for (w = 2; w < 7; w++) {
      for (d = 0; d < 7; d++) {
        if (iVarDate <= iDaysInMonth) {
          aMonth[w][d] = iVarDate;
          iVarDate++;
        }
      }
    }
    return aMonth;
  },
  ifHasSigned: function (signList, day) {
    var signed = false;
    $.each(signList, function (index, item) {
      if (item.signDay == day) {
        signed = true;
        return false;
      }
    });
    return signed;
  },
  drawCal: function (iYear, iMonth, signList) {
    var myMonth = calUtil.bulidCal(iYear, iMonth);
    // var todayWeek = new Date().getDay();
    var htmls = new Array();
    // htmls.push("<div class='sign_main' id='sign_layer'>");
    // htmls.push("<div class='sign_succ_calendar_title'>");
    //htmls.push("<div class='calendar_month_next'>下月</div>");
    //htmls.push("<div class='calendar_month_prev'>上月</div>");
    // htmls.push("<div class='calendar_month_span'></div>");
    // htmls.push("</div>");
    htmls.push("<div class='sign_equal' id='sign_cal'>");
    htmls.push("<div class='sign_row'>");
    htmls.push("<div class='th_1 bold'>" + myMonth[0][0] + "</div>");
    htmls.push("<div class='th_2 bold'>" + myMonth[0][1] + "</div>");
    htmls.push("<div class='th_3 bold'>" + myMonth[0][2] + "</div>");
    htmls.push("<div class='th_4 bold'>" + myMonth[0][3] + "</div>");
    htmls.push("<div class='th_5 bold'>" + myMonth[0][4] + "</div>");
    htmls.push("<div class='th_6 bold'>" + myMonth[0][5] + "</div>");
    htmls.push("<div class='th_7 bold'>" + myMonth[0][6] + "</div>");
    htmls.push("</div>");
    var d, w;
    for (w = 1; w < 6; w++) {
      htmls.push("<div class='sign_row'>");
      for (d = 0; d < 7; d++) {
        var ifHasSigned = calUtil.ifHasSigned(signList, myMonth[w][d]);
        // console.log("001:"+ifHasSigned);
        // if(ifHasSigned && typeof(myMonth[w][d]) != 'undefined'){
        //  htmls.push("<div class='td_"+d+" on'>" + (!isNaN(myMonth[w][d]) ? myMonth[w][d] : " ") + "</div>");
        // } else {
        //  htmls.push("<div class='td_"+d+" calendar_record'>" + (!isNaN(myMonth[w][d]) ? myMonth[w][d] : " ") + "</div>");
        // }

        htmls.push("<div class='td_" + d + " calendar_record'>" + (!isNaN(myMonth[w][d]) ? myMonth[w][d] : " ") + "</div>");

      }
      htmls.push("</div>");
    }
    // htmls.push("</div>");
    // htmls.push("</div>");
    htmls.push("</div>");
    return htmls.join('');
  }
};

//日历当前日期渲染
function actioveDate(datelist) {
  // console.log(datelist)
  var li = $('#sign_cal').children().children()
  $(li).each(function (index, val) {
    var count = $(this).html()
    for (var i = 0; i < datelist.length; i++) {
      var date = (moment(datelist[i].signdate).format("D"));
      if (count == date) {
        $(this).css({
          "background": "#5ABE1B",
          "color": "#FFF"
        })
      }
    }
  });
}

//当月签到日期渲染
function signinDate() {
  var uid = localStorage.getItem("uid"); //用户id
  var token = localStorage.getItem("token");
  $.ajax({
    type: "get",
    url: APP_URL + "/api/User/UserSigninTotal",
    dataType: "json",
    data: {
      uid: uid,
      token: token
    },
    success: function (res) {
      console.log(res);
      if (res.code == 1) {
        var data = res.data
        $('.calendar-day').text(data.days);
        $('.calendar-beans').text(data.beans);
        actioveDate(data.datelist);
      } else if (code == 10000) {
        repeatLogin();
      }
    },
    error: function (err) {
      console.log(err)
    }
  })
}

//点击签到
function handleClick() {
  $(".on").click(function () {
    var uid = localStorage.getItem("uid"); //用户id
    var token = localStorage.getItem("token");
    $.ajax({
      type: "post",
      url: APP_URL + "/api/User/UserSignin",
      dataType: "json",
      data: {
        uid: uid,
        token: token
      },
      success: function (res) {
        console.log(res);
        signinDate();
        if (res.code == 1) {
          if (res.data == "") {
            $("#recordTips").show();
          } else {
            $(".recordBeans>span").html("x" + res.data);
            $("#recordHasbeanTips").show();
          }
        } else if (res.code == 0) {
          $(".recordMsg").html(res.msg);
          $("#recordTips").show();
        } else if (code == 10000) {
          repeatLogin();
        }
        $(".recordClose").click(function () {
          $("#recordTips").hide();
          $("#recordHasbeanTips").hide();
        });
      },
      error: function (err) {
        console.log(err)
      }
    })
  })
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
            <p class="border-num ${((index+1)>0&&(index+1)<4)?'border-num-color':''}">${index+1}</p>
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

// 首页弹窗
function homeAlert() {
  var url = window.location.href;
  var uid = localStorage.getItem("uid"); //用户id
  var token = localStorage.getItem("token");
  var loginOne = sessionStorage.getItem("loginOne");
  var el = {};
  el.uid = uid;
  el.token = token;
  if(url.indexOf("?") != -1){
    if(loginOne){
      el.type = 0;
    }else{
      el.type = 1;
      sessionStorage.setItem("loginOne",1);
    }
  }
  $.ajax({
    type: "GET",
    url: APP_URL + "/api/User/getAdvertisementAlert",
    data: el,
    dataType: "json",
    success: function (res) {
      console.log(res);
      var data = res.data;
      if (res.code == 1) {
        $("#homeAlert").show();
        // 广告位
        // var imgsrc = "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3012416466,1705705744&fm=26&gp=0.jpg";
        // $(".alertImg").attr("src", imgsrc);
        $(".alertImg").attr("src", data.image_path);
        $("#levelAlert").show();
        // 跳转广告
        $(".alertImg").click(function () {
          $(window).attr("location", data.url);
        });
        // 关闭广告
        $(".closeAlert").click(function () {
          $("#homeAlert").hide();
        });
      } else {
        $("#homeAlert").hide();
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
}