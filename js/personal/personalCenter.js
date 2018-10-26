$(function() {
    //个人中心信息
    UserInfo()
    Close ()
    //身份设置
    $(".setting").click(function() {
        $("#personalShade").css("display", "block");
        $("#roleSetting>p").click(function() {
            $(this).children().addClass("checked").parent().siblings().children().removeClass("checked");
        });
        $("#languageSetting").click(function() {
            $(".language-tips").css("display", "block");
            $(".language-tips").click(function() {
                $(".language-tips").css("display", "none");
            });
        }); 
    });
    // 退出登录
    $(".login-out").click(function() {
        $(window).attr("location", "../../signOut.html");
        sessionStorage.clear()
    });
});
// 关闭窗口
function Close () {
    $(".personal-close").click(function() {
        if ($(".p1>i").attr("class") == "checked") {
            Setup(2)
        } else {
            Setup(1)
        }
    });
}

// 选择身份
function Setup(num) {
    var uid=sessionStorage.getItem("uid")
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/My/Setup",
        data: {
            uid: uid,
            identity:num,
        },
        dataType: "json",
        success: function(res) {
            UserInfo()
            $("#personalShade").css("display", "none");
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function UserInfo() {
    var uid = sessionStorage.getItem("uid")
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/My/UserInfo",
        data: {
            uid:uid,
        },
        dataType: "json",
        success: function(res) {
            console.log(res);
            var data = res.data[0]
            $(".img").attr("src",data.headimg);
            $(".tutor-title").html(data.identity==1?"导师":"侠客");
            $(".tutor-title").addClass(data.identity==1?"":"ranger-title");
            $(".tutor-title").removeClass(data.identity==1?"ranger-title":"");
            $(".useName").html(data.nickname);
            $(".no-certified").html(data.certificationstate==1?"未认证":data.certificationstate==2?"已认证":data.certificationstate==3?"审核中":data.certificationstate==4?"驳回":'');
            $("#wealth-value1").html(data.wisdombean);
            $("#wealth-value2").html(data.pk);
            $("#wealth-value3").html(data.creditscore);
            if (data.identity==2) {
                $(".p1>i").addClass('checked')
            }else{
                $(".p2>i").addClass('checked')
            }
            var url=$(".certified").text()
            $(".personal-infor-history").click(function(){
               if(url=="未认证" || url=="驳回"){
                $(window).attr("location", "../personalCenter/verified.html");
               }else if(url=="审核中"){
                $(window).attr("location", "../personalCenter/infor-submitting.html");
               }
            })
        },
        error: function(err) {
            console.log(err);
        }
    });
}