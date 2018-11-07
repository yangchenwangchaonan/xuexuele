$(function () {
  //滚动条在底部
  var scrollT = document.documentElement.scrollTop || document.body.scrollTop; //滚动条的垂直偏移
  var scrollH = document.documentElement.scrollHeight || document.body.scrollHeight; //元素的整体高度
  var clientH = document.documentElement.clientHeight || document.body.clientHeight; //元素的可见高度
  document.documentElement.scrollTop = scrollH - clientH
  window.pageYOffset = scrollH - clientH
  document.body.scrollTop = scrollH - clientH
  //原住人数
  people();
  //闯关列表
  userGate(1, 1);
  // 网络不给力
  // generalTips("网络不给力啊~", 1);
  //站内信
  $("#maildrop-tab").click(function () {
    $(window).attr("location", "./letter.html");
  });

  //签到
  $("#signed-tab").click(function () {
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
    $(window).attr("location", "./treasureBox.html");
  });

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
  var uid = sessionStorage.getItem("uid")
  $.ajax({
    type: "GET",
    url: APP_URL + "/api/Wisdom/WisdomIndex",
    data: {
      uid: uid,
      iscurrent: iscurrent,
      pageindex: index
    },
    dataType: "json",
    success: function (res) {
      console.log(res);
      var data = res.data;
      var pageIndex = res.data.pageindex;
      //体力值
      var sVal = data.manvalue;
      if (sVal > 30) {
        sVal = 30;
      }
      $("#nowStamina").html(sVal);
      var sPercent = sVal / 30;
      $(".stamina-value").css("width", sPercent * 48);
      // 体力值tips
      //体力值
      $("#stamina-tab").click(function () {
        if (sVal < 4) {
          $("#realStamina,#maxStamina").css("color", "red");
          $("#stamina-shade").show();
        } else {
          $("#stamina-shade").show();
        }
        $(".staminaClose").click(function () {
          $("#stamina-shade").hide();
        });
      });


      //智慧豆
      var bean = data.wisdombean;
      $("#getBeans").html(bean);
      var beanPercent = bean / 9999999;
      $(".beans-value").css("width", beanPercent * 52);
      if (bean > 9999999) {
        $(".beans-value").css("width", 52);
        $("#getBeans").html(9999999);
        $(".beans-progress").append("<i class='icon_stamina'>+</i>");
      }
      //pk值
      var pkVal = data.pk;
      $("#pkValue").html(pkVal);
      var pkPercent = pkVal / 9999999;
      $(".pk-value").css("width", pkPercent * 52);
      if (pkVal > 9999999) {
        $(".beans-value").css("width", 52);
        $("#pkValue").html(9999999);
        $(".pk-progress").append("<i class='icon_stamina'>+</i>");
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
      var $levelFixed = $levelList[0].reverse();
      $.each($levelFixed, function (index, val) {
        var levelSeq = parseInt(val.gatename.replace(/[^0-9]/ig, "")); //截取数字
        $str += `
         <li class="${levelSeq%2==0?"evenList"+" "+(val.islock==0||(val.islock==1&&val.time=='')?"evenFailLevel":''):"oddList "+(val.islock==0||(val.islock==1&&val.time=='')?'oddFailLevel':'')}" onclick="runLevel('${val.time}','${val.id}','${val.islock}','${val.pkvalue}','${val.rewardbeans}','${val.gatename}')">
            <span>${levelSeq}</span>
            ${val.islock==1&&val.time==''?`
            <div class="${levelSeq%2==0?'evenWillLevel':'oddWillLevel'}"></div>
            `:''}
            ${val.time!=''?'':`
            <div class="${val.specialreward==1?"specialReward":"noSpecialReward"}"><img src="../../images/101.png" /><span>其他奖励</span></div>
            `}
            <div class="${val.time==""?"noLevelTime":"levelTime"}"><p>${moment("2010-10-20 6:"+val.time).format("mm分ss秒")}</p><p><img src="../../images/97.png" />+${val.rewordbeans}</p></div>
          </li>
         `;
      });
      $("#levelFixed").html($str);
      if (data.gatelist[6].islock == 1 && data.gatelist[6].time != "") {
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
            <div class="oddBigCloudLoop"><img src="../../images/left.png"></div>
          `:`
            <div class="evenBigCloudLoop"><img src="../../images/right.png"></div>
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
                  <li class="${levelNum%2==0?"evenList"+" "+(val.islock==0||(val.islock==1&&val.time=='')?"evenFailLevel":''):"oddList "+(val.islock==0||(val.islock==1&&val.time=='')?'oddFailLevel':'')}" onclick="runLevel('${val.time}','${val.id}','${val.islock}','${val.pkvalue}','${val.rewardbeans}','${val.gatename}')">
                    <span>${levelNum}</span>
                    ${val.islock==1&&val.time==''?`
                    <div class="${levelNum%2==0?'evenWillLevel':'oddWillLevel'}"></div>
                    `:''}
                    ${val.time!=''?'':`
                    <div class="${val.specialreward==1?"specialReward":"noSpecialReward"}"><img src="../../images/101.png" /><span>其他奖励</span></div>
                    `}
                    <div class="${val.time==""?"noLevelTime":"levelTime"}"><p>${moment("2010-10-20 6:"+val.time).format("mm分ss秒")}</p><p><img src="../../images/97.png" />+${val.rewordbeans}</p></div>
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

      $(".cloudContent").click(function () {
        $(this).children(".leftCloud").addClass("moveLeft");
        $(this).children(".centerCloud").fadeOut();
        $(this).children(".rightCloud").addClass("moveRight");
        window.setTimeout(function () {
          $(".cloudContent").hide();
        }, 4000);
      });
      // 触顶刷新
      window.onscroll = function () {
        var index = data.pageindex;
        if ((data.gatelist.length / 6) != data.pageindex) {
          generalTips("已经到滑到顶部啦~", 1);
          return;
        }
        // console.log(1);
        var scrollT = document.documentElement.scrollTop || document.body.scrollTop; //滚动条的垂直偏移
        if (scrollT == 0) {
          index++;
          userGate(index, 2);
        }
      }

    },
    error: function (err) {
      console.log(err)
    }
  });
}


// 闯关
function runLevel(levelTime, levelId, levelLock, pkvalue, rewardbeans, levelName) {
  if (levelLock == 0) {
    return;
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
                <div>其他奖励</div>
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
    sessionStorage.setItem("gateid", levelId);
    $(window).attr("location", "./level_content.html");
  });
  // 取消闯关
  $(".level_btn").click(function () {
    $("#levelShade").hide();
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
  console.log(datelist)
  var li = $('#sign_cal').children().children()
  $(li).each(function (index, val) {
    var count = $(this).html()
    for (var i = 0; i < datelist.length; i++) {
      var date = (moment(datelist[i].signdate).format("D"));
      if (count == date) {
        $(this).css({
          "background": "#5ABE1B"
        })
      }
    }
  });
}

//当月签到日期渲染
function signinDate() {
  var uid = sessionStorage.getItem("uid"); //用户id
  $.ajax({
    type: "get",
    url: APP_URL + "/api/User/UserSigninTotal",
    dataType: "json",
    data: {
      uid: uid
    },
    success: function (res) {
      var data = res.data
      $('.calendar-day').text(data.days)
      $('.calendar-beans').text(data.beans)
      actioveDate(data.datelist)
      console.log(res)
    },
    error: function (err) {
      console.log(err)
    }
  })
}

//点击签到
function handleClick() {
  $(".on").click(function () {
    var uid = sessionStorage.getItem("uid"); //用户id
    $.ajax({
      type: "post",
      url: APP_URL + "/api/User/UserSignin",
      dataType: "json",
      data: {
        uid: uid
      },
      success: function (res) {
        console.log(res)
        signinDate();
        if (res.code == 1) {
          if (res.data == "") {
            $("#recordTips").show();
          } else {
            $(".recordBeans>span").html("x" + res.data);
            $("#recordHasbeanTips").show();
          }
        } else {
          $(".recordMsg").html(res.msg);
          $("#recordTips").show();
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