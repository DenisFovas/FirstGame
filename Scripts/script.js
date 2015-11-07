(function(){
	$(document).ready(function(){
		var game = {};


		game.width = 400;
		game.height = 500;
		game.stars = [];

		game.images = [];
		game.imaginiNecesare = 0;
		game.imaginiIncarcate = 0;


		// "Culeg" contextul prin care o sa lucrez
		game.ctxBackground = document.getElementById("background-image").getContext("2d");
		game.ctxAction = document.getElementById("action").getContext("2d");

		// Setez culoarea de fundal: 'negru';
		game.ctxBackground.fillStyle = "#100";
		game.ctxBackground.fillRect(0, 0, game.width, game.height);
		game.ctxBackground.font = "bold 50px Arial";
		game.ctxBackground.fillStyle = "white";
		game.ctxBackground.fillText("Loading", 100, 200);

		// Functie de a adauga datele "stelelor"
		function addStars(numar){
			for (var i = 0; i < numar; i++) {
				game.stars.push({
					x: Math.floor(Math.random() * 390),
					y: 499,
					size: Math.random() * 3
				});
			};
		}

		// Functie care formeaza animatia de miscare si va elimina
		// toate stelele care nu mai apar pe ecran
		function updateStars(){
			addStars(1);
			for (var i = 0; i < game.stars.length; i++) {
				game.stars[i].y--;
				if (game.stars[i].y < -1) {
					game.stars.splice(i, 1); // functie care v-a sterge din vectorul cu stele tot ce 
					// vector.splice(pozDePeCareStergem, nrElementeSterse)
					// numai se afiseaza pe ecran
				};
				//console.log(game.stars.length);
				// pentru a afisa lungimea vectorilor de stele
			};
		}

		// Functie care afiseaza stelele pe ecran
		function showStars(){
			//game.ctxBackground.clearRect(0, 0, game.width, game.height);
			game.ctxBackground.fillStyle = "black";
			game.ctxBackground.fillRect(0, 0, game.width, game.height);
			game.ctxBackground.fillStyle = "white";
			for (var i = 0; i < game.stars.length; i++) {
				var stea = game.stars[i];
				game.ctxBackground.fillRect(stea.x, stea.y, stea.size, stea.size);
			};
		}

		// Functie care animeaza totul
		function animeazaFundal(){
			requestAnimFrame(function(){
				updateStars();
				showStars();
				animeazaFundal();
			});
		}

		// Functie care porneste animatiile, cu tot cu pornirea paginii
		function animareFundal(){
			for (var i = 0; i < 500; i++) {
				game.stars.push({
					x: Math.floor(Math.random() * 390),
					y: Math.floor(Math.random() * 550),
					size: Math.random() * 3
				});
			};
			//pozitionare player si afisarea lui pe ecran
			game.ctxAction.drawImage(game.images[0], game.width/2 - 25, (game.height-(game.height/10)), 50, 50);

			// porneste animatia continua
			animeazaFundal();
		}

		// functie care va incarca imaginile necesare pentru joc
		function incarcareImagini(paths){
			game.imaginiNecesare = paths.length;

			for (var i = 0; i < paths.length; i++) {
				var imagine = new Image();

				imagine.src = paths[i];
				game.images[i] = imagine;
				game.images[i].onload =  function(){
					game.imaginiIncarcate++;
				}
			};
		}

		//functie de a verifica daca s-au incarcat imaginile necesare si
		// se asigura ca avem icnarcate toate imaginile
		function verificareImagini(){
			if (game.imaginiIncarcate >= game.imaginiNecesare) {
				// Pornesc animatiile de fundal
				animareFundal();
			}
			else
				{
					setTimeout(function(){
						verificareImagini();
					}, 10)
				};

		}

		// Incarc imaginile
		incarcareImagini(["Images/Nava1.png", "Images/Inamic1.png", "Images/Glont.png"]);
		verificareImagini();
	});	
})();

//functie de aratat animatiile pe 93% din browserele care suporta HTML 5
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          function( callback ){
          	// 1000 milisecunde = 1 secunda; "/ x" <=> xfps
            window.setTimeout(callback, 1000 / 60); 
          };
})();