$(function () {
    WalletWisdombeanUse()
    GetAccountBalanceInfo()
    // 充值记录
    $(".recharge-cost").click(function () {
        $(window).attr("location", "./recharge-reword.html");
    });
    // 充值
    $(".recharge-true").click(function () {
        $(window).attr("location", "./recharge.html");
    });
    // 课酬提现
    $(".recharge-false").click(function () {
        $(window).attr("location", "./recharge-withdraw.html");
    });
});
// 获取列表内容
function WalletWisdombeanUse() {
    var uid = localStorage.getItem("uid");
    var token = localStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/WalletWisdombeanUse",
        data: {
            uid: uid,
            token: token
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                var data = res.data;
                var str = "";
                $.each(data, function (index, val) {
                    str += `
                  <div class="recharge-detail">
                    <table cellspacing="5px">
                        <tr>
                            <td>${val.type==1?`<img src="../../images/182.png"/>`:
                                  val.type==2?`<img src="../../images/183.png"/>`:
                                  val.type==3?`<img src="../../images/184.png"/>`:
                                  val.type==4?`<img src="../../images/185.png"/>`:
                                  val.type==5?`<img src="../../images/186.png"/>`:
                                  val.type==6?`<img src="../../images/187.png"/>`:
                                  val.type==7?`<img src="../../images/newmoney.png"/>`:
                                  val.type==8?`<img src="../../images/256.png"/>`:""
                                }
                            </td>
                            <td>${val.type==1?"解锁课程":
                                  val.type==2?"打赏导师":
                                  val.type==3?"收到打赏":
                                  val.type==4?"卖出课程":
                                  val.type==5?"智慧塔获得":
                                  val.type==6?"分享获得":
                                  val.type==7?"智慧塔提示":
                                  val.type==8?"签到奖励":""
                                 }
                            </td>
                            <td><img src="../../images/125.png"/></td>
                            <td>${val.type==1 || val.type==2 || val.type==7?"-":"+"}${val.wisdombean}</td>
                            <td>${moment(val.create_time).format("YYYY-MM-DD")}</td>
                        </tr>
                    </table>
                 </div>
                 `;
                });
                $(".recharge-inner").html(str);
            } else if (res.code == 10000) {
                repeatLogin();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 获取余额信息
function GetAccountBalanceInfo() {
    var uid = localStorage.getItem("uid");
    var token = localStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/GetAccountBalanceInfo",
        data: {
            uid: uid,
            token: token
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                var data = res.data;
                $(".recharge-num>span>img").after("x" + data.wisdombean);
            } else if (res.code == 10000) {
                repeatLogin();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}