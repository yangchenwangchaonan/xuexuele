$(function(){
    $("#addLesson").click(function(){
        $("#addlessonShade").css("display","block");

        // 关闭窗口
        $(".lesson-add-close").click(function(){
            $("#addlessonShade").css("display","none");
        });
    });
});