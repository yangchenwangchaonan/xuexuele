$(function () {
    $(".menu").click(function () {
        $(this).addClass("menu1").siblings().removeClass("menu1");
        // alert($(this).parents("tr").find("td").index($(this)) == 1);
        if($(this).parents("tr").find("td").index($(this)) == 0){
            $(window).attr("location", "../../html/homePages/home.html");
        }else if ($(this).parents("tr").find("td").index($(this)) == 1) {
            $(window).attr("location", "../../html/lessonDetail/lesson-contents.html");
        } else if($(this).parents("tr").find("td").index($(this)) == 2){
            $(window).attr("location", "../../html/purse/purse.html");
        }else if($(this).parents("tr").find("td").index($(this)) == 3){
            $(window).attr("location", "../../html/personalCenter/personal-center.html");
        }
    });
});