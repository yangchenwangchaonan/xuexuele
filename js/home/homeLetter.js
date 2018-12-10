$(function () {
    userLetter();
    // 返回
    $(".page-back1").click(function () {
        window.location.replace("../homePages/home.html");
    })
});

/* 获取站内信 */
function userLetter() {
    var uid = localStorage.getItem("uid");
    var token = localStorage.getItem("token");
    // console.log(uid,token);
    $.ajax({
        type: "GET",
        url: APP_URL + "/api/User/UserMessage",
        data: {
            uid: uid,
            token: token
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 1) {
                var data = res.data;
                var $str = "";
                if (res.data == "") {
                    $(".noletter").show();
                    $(".list").html("");
                } else {
                    $.each(data, function (index, val) {
                        $str += `
                    <ul class="box-box">
                        <li>
                            <a href="#">
                                <div class="box-text" onclick="detail(${val.id})">
                                    <p class="readList">${val.is_read==1?`<img src="../../images/68.png"/>`:`<img />`}<span>${val.heading}</span></p>
                                    <span class="span">${val.create_time}</span>
                                    <p class="ov-text">${val.content}</p>
                                </div>
                                <i onclick="deleteInfo(${val.id})">
                                    <img src="../../images/69.png" class="del-key" />
                                </i>
                            </a>
                        </li>
                    </ul>
                    `;
                    });
                    $(".list").html($str);
                    scorll();
                }
            } else if (res.code == 10000) {
                repeatLogin();
            }else if(res.code==0){
                $(".noletter").show();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}


//删除站内信
function deleteInfo(id) {
    $.ajax({
        type: "POST",
        url: APP_URL + "/api/User/UserMessageDelete",
        data: {
            id: id,
            _method: "DELETE",
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            flowerTips("删除信息成功​", 1)
            userLetter()
        },
        error: function (err) {
            console.log(err);
        }
    });
}



/* 查看站内信详情 */
function detail(id) {
    $(window).attr("location", "./letter-infor.html?id=" + id);
}

function scorll() {
    //侧滑显示删除按钮
    var expansion = null; //是否存在展开的list
    var container = document.querySelectorAll('.list li a');
    for (var i = 0; i < container.length; i++) {
        var x, y, X, Y, swipeX, swipeY;
        container[i].addEventListener('touchstart', function (event) {
            x = event.changedTouches[0].pageX;
            y = event.changedTouches[0].pageY;
            swipeX = true;
            swipeY = true;
            if (expansion) { //判断是否展开，如果展开则收起
                expansion.className = "";
            }
        });
        container[i].addEventListener('touchmove', function (event) {

            X = event.changedTouches[0].pageX;
            Y = event.changedTouches[0].pageY;
            // 左右滑动
            if (swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0) {
                // 阻止事件冒泡
                event.stopPropagation();
                if (X - x > 10) { //右滑
                    event.preventDefault();
                    this.className = ""; //右滑收起
                }
                if (x - X > 10) { //左滑
                    event.preventDefault();
                    this.className = "swipeleft"; //左滑展开
                    expansion = this;
                }
                swipeY = false;
            }
            // 上下滑动
            if (swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
                swipeX = false;
            }
        });
    }
}