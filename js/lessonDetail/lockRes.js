$(function(){
    // 立即解锁
    $("#lockNow").click(function(){
        $(".unlock-shade").show();
        $(".unlock-shade").click(function(){
            $(".unlock-shade").hide();
        });
    });

});