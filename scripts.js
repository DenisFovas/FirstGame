(function(){
	$(document).ready(function(){
		var game = {};


		game.height = 500;
		game.width = 400;
		game.stars = [];

		// Creez contextul de la fiecare canvas
		// Primu canvas este pentru background
		// Al doilea canvas este pentru actiunile Jocului
		game.contextBackground = document.getElementById("background-image").getContext("2d");
		game.contextAction = document.getElementById("action").getContext("2d");
		
		//creez background-ul *definit ca si negru*
		game.contextBackground.fillStyle = "#000";
		game.contextBackground.fillRect(0, 0, game.width, game.height);


		function runBackground(){
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
			}
		}

		function showStars(){
			game.contextBackground.fillStyle = "white";
			game.contextBackground.fillRect(0, 0, game.width, game.height);
			game.contextBackground.fillStyle = "white";
			for (var i = 0; i < game.stars.length; i++) {
				var stea = game.stars[i];
				game.contextBackground.fillRect(stea.x, stea.y, stea.size, stea.size);
			}

		}

		function animation(){
			updateStars();
			showStars();
			requestAnimFrame(function(){
				animation();
			});
		}

		//rularea background-ului
	 	runBackground();
	
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