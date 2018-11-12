APP_URL = 'https://xuexuele.huimor.com';


$(document).ready(function(){  
	console.log(122555)
    function stopScrolling( touchEvent ) {   
        touchEvent.preventDefault();   
    }  
    document.addEventListener( 'touchstart' , stopScrolling , false );  
    document.addEventListener( 'touchmove' , stopScrolling , false );  
});