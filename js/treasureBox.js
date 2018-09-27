$(function(){
    var $treasureboxGift1 = $(".treasureBox-gift1");
    var $treasureboxGift2 = $(".treasureBox-gift2");
    $treasureboxGift1.click(function () { 
        $(window).attr("location","./treasureBox_detail.html");
    });
    $treasureboxGift2.click(function(){
        $(window).attr("location","./treasureBox_audio.html");
    });
});