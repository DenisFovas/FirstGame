(function(){
	$(document).ready(function(){
		var game = {};


		game.height = 500;
		game.width = 400;
		game.stars = [];
		game.contextBackground = document.getElementById("background-image").getContext("2d");
		game.contextAction = document.getElementById("action").getContext("2d");
		game.contextBackground.fillStyle = "black";
		game.contextBackground.fillRect(0, 0, game.width, game.height);


		function initializare(){
			animation();
		}

		function addStars(numar){
			for (var i = 0; i < numar; i++) {
				game.stars.push({
					x: Math.floor(Math.random()*400),
					y: game.height + 10,
					size: Math.random() * 5
				});
			};
		}

		function updateStars(){
			addStars(1);
			for (var i = 0; i < game.stars.length; i++) {
				game.stars[i].y--;
				console.log("merge");
			}
		}

		function showStars(){
			game.contextBackground.clearRect(0, 0, game.width, game.height);
			game.contextBackground.fillStyle = "white";
			for (var i = 0; i < game.stars.length; i++) {
				var stea = game.stars[i];
				game.contextBackground.fillRect(stea.x, stea.y, stea.size, stea.size);
			}

		}

		function animation(){

			requestAnimFrame(function(){
				updateStars();
				showStars();
				animation();
			});
		}

		//rularea background-ului
		initializare();
	});	
});


//functie de aratat animatiile pe 93% din browsere
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
