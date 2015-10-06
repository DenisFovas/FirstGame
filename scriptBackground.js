(function(){
	$(document).ready(function(){
		var game = {};


		game.stars = [];

		// "Culeg" contextul prin care o sa lucrez
		game.ctxBackground = document.getElementById("background-image").getContext("2d");

		// Setez culoarea de fundal: 'negru';
		game.ctxBackground.fillStyle = "black";
		game.ctxBackground.fillRect(0, 0, 400, 500);


		// Functie de a adauga datele "stelelor"
		function addStars(numar){
			for (var i = 0; i < numar; i++) {
				game.stars.push({
					x: Math.floor(Math.random() * 400),
					y: 520,
					size: Math.random() * 5
				});
			};
		}

		// Functie care formeaza animatia de miscare
		function updateStars(){
			addStars(1);
			for (var i = 0; i < game.stars.length; i++) {
				game.stars[i].y--;
				if (game.stars[i].y < -10) {
					game.stars.splice(i, 1);
				};
				//console.log(game.stars.length);
			};
		}

		// Functie care afiseaza stelele pe ecran
		function showStars(){
			game.ctxBackground.fillStyle = "black";
			game.ctxBackground.fillRect(0, 0, 400, 500);
			game.ctxBackground.fillStyle = "white";
			for (var i = 0; i < game.stars.length; i++) {
				var stea = game.stars[i];
				game.ctxBackground.fillRect(stea.x, stea.y, stea.size, stea.size);
			};
		}

		// Functie care animeaza totul
		function animeazaFundal(){
			updateStars();
			showStars();
			requestAnimFrame(function(){
				animeazaFundal();
			});
		}

		// Functie care porneste animatiile
		function fundalActiv(){
			animeazaFundal();
			for (var i = 0; i < 900; i++) {
				game.stars.push({
					x: Math.floor(Math.random() * 400),
					y: Math.floor(Math.random() * 600),
					size: Math.random() * 5
				});
			};
		}

		// Pornesc animatiile
		fundalActiv();
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
          	// 1000 milisecunde = 1 secunda; "/ x" <=> xfps
            window.setTimeout(callback, 1000 / 60); 
          };
})();