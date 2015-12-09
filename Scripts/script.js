(function(){
	$(document).ready(function(){
		var game = {};

		// setiings for start
		game.width = 400;
		game.height = 500;

		// Stele (fundal)
		game.stars = [];

		// Inamici
		game.enemies = [];

		// imagini
		game.images = [];
		game.imaginiNecesare = 0;
		game.imaginiIncarcate = 0;

		// Key
		game.keys = [];

		// Player
		game.player = {
			x: game.width * 0.37 + 25,
			y: game.height - (game.height * 0.2),
			width: 60,
			height: 60,
			speed: 2
		};

		// SINTAXA PENTRU TASTE
		// folosesc jQuery deoarece este mai usor, si mai eficient decat un cod js
		$(document).keydown(function(e){
			game.keys[e.keyCode ? e.keyCode : e.which] = true;
		});

		$(document).keyup(function(e){
			delete game.keys[e.keyCode ? e.keyCode : e.which];
		});

		// "Culeg" contextul prin care o sa lucrez
		game.ctxBackground = document.getElementById("background-image").getContext("2d");
		game.ctxAction = document.getElementById("action").getContext("2d");

		// Setez culoarea de fundal: 'negru';
		game.ctxBackground.fillStyle = "#100";
		game.ctxBackground.fillRect(0, 0, game.width, game.height);
		// loading time (in caz ca am imagini multe)
		game.ctxBackground.font = "bold 50px Arial";
		game.ctxBackground.fillStyle = "white";
		game.ctxBackground.fillText("Loading", 100, 200);



		/* 
			FUNCTIILE NECESARE
		*/

		// Functie de a adauga datele "stelelor"
		function initializare(numar){

			//stars
			for (var i = 0; i < numar; i++) {
				game.stars.push({
					x: Math.floor(Math.random() * 390),
					y: 499,
					size: Math.random() * 3
				});
			};

			// enemies
			for (var i = 0; i < 5; i++) {
				for (var j = 0; j < 5; j++) {
					game.enemies.push({
						x: (i * 70),
						y: (j * 70),
						size: 60,
						image: 1
					});
				};
			};
		}

		// Functie care formeaza animatia de miscare si va elimina
		// toate stelele care nu mai apar pe ecran
		function updateData(){
			
			// stars
			initializare(1);
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

			// player movement
			if (game.keys[37] || game.keys[65]) { // stanga
				if(game.player.x > 0) {
					game.player.x -= game.player.speed;
				}

			};
			if (game.keys[39] || game.keys[68]) { // dreapta
				if(game.player.x < (game.width - game.player.width)){
					game.player.x += game.player.speed;
				}
			};
		}	


		// Functie care afiseaza stelele pe ecran
		function renderScreen(){

			// stars
			//game.ctxBackground.clearRect(0, 0, game.width, game.height);
			game.ctxBackground.fillStyle = "black";
			game.ctxBackground.fillRect(0, 0, game.width, game.height);
			game.ctxBackground.fillStyle = "white";
			for (var i = 0; i < game.stars.length; i++) {
				var stea = game.stars[i];
				game.ctxBackground.fillRect(stea.x, stea.y, stea.size, stea.size);
			};

			// player
			game.ctxAction.clearRect(game.player.x, game.player.y, game.player.width, game.player.height);
			game.ctxAction.drawImage(game.images[0], game.player.x, game.player.y, game.player.width, game.player.height);
		
			for (i in game.enemies){
				game.ctxAction.drawImage(game.images[game.enemies[i].image], game.enemies[i].x, game.enemies[i].y, game.enemies[i].size, game.enemies[i].size);
			}

		}

		// Functie care animeaza totul
		function showScreen(){
			requestAnimFrame(function(){
				updateData();
				renderScreen();
				showScreen();
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
			// porneste animatia continua
			showScreen();
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
		function startGame(){
			if (game.imaginiIncarcate >= game.imaginiNecesare) {
				// Pornesc animatiile de fundal
				animareFundal();
			}
			else
				{
					setTimeout(function(){
						startGame();
					}, 10)
				};

		}

		// Incarc imaginile
		incarcareImagini(["Images/Nava1.png", "Images/Inamic1.png", "Images/Glont.png"]);
		// verific imaginile.
		// daca sunt incarcate atunci o sa se poata porni jocul
		startGame();
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