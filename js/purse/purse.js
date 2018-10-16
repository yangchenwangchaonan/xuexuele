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
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/WalletWisdombeanUse",
        data: {
            uid:1
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
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
                                  val.type==6?`<img src="../../images/187.png"/>`:""
                                }
                            </td>
                            <td>${val.type==1?"解锁课程":
                                  val.type==2?"打赏导师":
                                  val.type==3?"收到打赏":
                                  val.type==4?"卖出课程":
                                  val.type==5?"智慧塔获得":
                                  val.type==6?"分享获得":""
                                 }
                            </td>
                            <td><img src="../../images/125.png"/></td>
                            <td>${val.type==1?"-":"+"}${val.wisdombean}</td>
                            <td>${moment(val.create_time).format("YYYY-MM-DD")}</td>
                        </tr>
                    </table>
                 </div>
                 `;
            });
            $(".recharge-inner").html(str);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 获取余额信息
function GetAccountBalanceInfo() {
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/Wisdom/GetAccountBalanceInfo",
        data: {
            uid:1
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var str = "";
            $(".recharge-num>span>img").after("x"+data.moneybag);
        },
        error: function (err) {
            console.log(err);
        }
    });
}
