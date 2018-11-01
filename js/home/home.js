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
  userGate();
  // 网络不给力
  $(".internet-tips").hide();
  //体力值
  $("#stamina-tab").click(function () {
    $("#stamina-shade").show();
    $("#stamina-shade").click(function () {
      $("#stamina-shade").hide();
    });
  });
  //站内信
  $("#maildrop-tab").click(function () {
    $(window).attr("location", "./letter.html");
    /* 关闭窗口 */
    $(".signed-close").click(function () {
      $("#maildrop-tab").hide();
    });
  });

  //签到
  $("#signed-tab").click(function () {
    $("#recording-shade").show();
    $(".signed-close").click(function () {
      $("#recording-shade").hide();
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
function userGate() {
  var uid = sessionStorage.getItem("uid")
  $.ajax({
    type: "GET",
    url: APP_URL + "/api/Wisdom/WisdomIndex",
    data: {
      uid: uid,
      iscurrent: 1
    },
    dataType: "json",
    success: function (res) {
      console.log(res);
      var data = res.data;
      var pageIndex = res.data.pageindex;
      $("#nowStamina").html(data.manvalue); //体力值
      $("#getBeans").html(data.wisdombean); //智慧豆
      $("#pkValue").html(data.pk);  //pk值
      // 站内信
      if(data.msgcount != 0){
        $("#letterNum").addClass("maildrop-infor");
        $("#letterNum>span").html(data.msgcount);
      }
      // 百宝箱
      if(data.spgatecount != 0){
        $("#treasureBoxNum").addClass("giftbox-infor");
        $("#treasureBoxNum>span").html(data.spgatecount);
      }
      var str1 = "";
      for (var i = 1; i < pageIndex; i++) {
        str1 = `
          <div class="homeLoopBg">
            <div class="homeContentLoop"></div>
          </div>
        `;
        $(".homeLoop").prepend(str1);
      };
      var levelList = data.gatelist.reverse();
      var str2 = "";
      $.each(levelList, function (index, val) {
        var levelNum = parseInt(val.gatename.replace(/[^0-9]/ig, "")); //截取数字
        // console.log(levelNum);
        str2 += `
          <li class="${levelNum%2==0?"evenList"+" "+(val.islock==0||(val.islock==1&&val.time=='')?"evenFailLevel":''):"oddList "+(val.islock==0||(val.islock==1&&val.time=='')?'oddFailLevel':'')}" onclick="runLevel('${val.time}','${val.id}','${val.islock}','${val.pkvalue}','${val.rewardbeans}','${val.gatename}')">
            <span>${levelNum}</span>
            ${val.islock==1&&val.time==''?`
            <div class="${levelNum%2==0?'evenWillLevel':'oddWillLevel'}"></div>
            `:''}
            ${val.time!=''?'':`
            <div class="${val.specialreward==1?"specialReward":"noSpecialReward"}"><img src="../../images/101.png" /><span>其他奖励</span></div>
            `}
            <div class="${val.time==""?"noLevelTime":"levelTime"}"><p>${moment("2010-10-20 6:"+val.time).format("mm分ss秒")}</p><p><img src="../../images/97.png" />+${val.rewordbeans}</p></div>
            ${levelNum%6==0&&levelNum!=0&&(val.time=="")?`
              <div class="cloudContent">
                <div class="leftCloud"></div>
                <div class="centerCloud"></div>
                <div class="rightCloud"></div>
              </div>
            `:''}
          </li>
        `;
      });
      $(".level-list").html(str2);
      $(".cloudContent").click(function () {
        $(this).children(".leftCloud").addClass("moveLeft");
        $(this).children(".centerCloud").fadeOut();
        $(this).children(".rightCloud").addClass("moveRight");
        window.setTimeout(() => {
          $(".cloudContent").hide();
        }, 4000);
      });
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
    $(window).attr("location", "./level_content_img.html");
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
        signinDate()
        if (res.code == 1) {
          alert("签到成功")
        } else {
          alert(res.msg)
        }
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