(function(){
	$(document).ready(function(){
		var player = {};

		palyer.imagine = document.getElementById("player");

//cod pentru taste, ficare v-a face o actiune in functie de ce anume se va apasa
    function keyDown(e){
      	var code = e.keyCode ? e.keyCode : e.which;
      	
      	if (code == 38)
        	upPressed = 1;
      	if (code == 40)
        	downPressed = 1;
      	if (code == 37)
        	leftPressed = 1;
      	if (code == 39)
        	rightPressed = 1;
    }

    function keyUp(e){
      	var code = e.keyCode ? e.keyCode : e.which;
      	
      	if (code == 38)
        	upPressed = 0;
     	if (code == 40)
       		downPressed = 0;
      	if (code == 37)
      		leftPressed = 0;
     	if (code == 39)
       		rightPressed = 0;
    }
	
	});	
}) ();


//functie de aratat animatiile pe 93% din browsere
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 80);
          };
})();