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
		game.numarInamiciPeLinie = 5;
		game.numarInamiciPeColoana = 5;
		game.contorInamici = ((game.width / 8) / 2);
		game.contorTimpMaximInamici = (game.width / 8);
		game.deplasareInamicStanga = true;
		game.enemySpeed = 1;

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
			width: 70,
			height: 70,
			speed: 2,
			miscare: false
		};
		// Proiectil Player
		game.proiectilPlayer = [];
		game.contorFinalProiectil = 12;
		game.contorInitialProiectil = game.contorFinalProiectil;

		// SINTAXA PENTRU TASTE
		// folosesc jQuery deoarece este mai usor, si mai eficient decat un cod js
		$(document).keydown(function(e){
			game.keys[e.keyCode ? e.keyCode : e.which] = true;
		});

		$(document).keyup(function(e){
			delete game.keys[e.keyCode ? e.keyCode : e.which];
		});

		// "Culeg" contextul prin care o sa lucrez pentru Backgound, Action(player), Inamici
		game.ctxBackground = document.getElementById("background-image").getContext("2d");
		game.ctxAction = document.getElementById("action").getContext("2d");
		game.ctxInamici = document.getElementById("inamici").getContext("2d");
		game.ctxBullet = document.getElementById("bullet").getContext("2d");

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

		function formareInamici(){
			// Enemies
			for (var i = 0; i < game.numarInamiciPeLinie; i++) {
				for (var j = 0; j < game.numarInamiciPeColoana; j++) {
					game.enemies.push({
						x: ((i * 70) + (game.width / 20)),
						y: (j * 60),
						width: 60,
						height: 60, 
						image: 1
					});
				};
			};
		}


		// Functie de a adauga datele "stelelor"
		function initializare(numar){

			// Stars
			for (var i = 0; i < numar; i++) {
				game.stars.push({
					x: Math.floor(Math.random() * 390),
					y: 499,
					size: Math.random() * 3
				});
			};

			// Arata player inital
			game.ctxAction.drawImage(game.images[0], game.player.x, game.player.y, game.player.width, game.player.height);
		}

		// Functie care formeaza animatia de miscare si va elimina
		// toate stelele care nu mai apar pe ecran
		function updateData(){
			
			// Stars
			initializare(1);
			for (var i = 0; i < game.stars.length; i++) {
				game.stars[i].y--;
				if (game.stars[i].y < -1) {
					game.stars.splice(i, 1); // functie care v-a sterge din vectorul stele totul 
					// vector.splice(pozitiaDePeCareStergem, nrElementeSterse)
					// numai se afiseaza pe ecran
				};
				//console.log(game.stars.length);
				// pentru a afisa lungimea vectorilor de stele
			};


			// Player Movement

			// Stanga
			if (game.keys[37] || game.keys[65]) { 
				if(game.player.x > 0) {
					game.player.x -= game.player.speed;
					game.player.miscare = true;
				}
			};

			// Dreapta
			if (game.keys[39] || game.keys[68]) { 
				if(game.player.x < (game.width - game.player.width)){
					game.player.x += game.player.speed;
					game.player.miscare = true;
				}
			};

			// Player bullet
			if (game.contorInitialProiectil > 0) {
				game.contorInitialProiectil--;
			};

			if (game.keys[32] && game.contorInitialProiectil <= 0) {
				game.proiectilPlayer.push({
					x: (game.player.x + (game.player.width / 2) - 5),
					y: (game.player.y + 10),
					size: 10,
					speed: 5,
					image: 2
				});
				game.contorInitialProiectil = game.contorFinalProiectil;
			};


			// Miscare Inamici cu ajutorul unui contor(ceas) improvizat
			game.contorInamici++;
			if (game.contorInamici % game.contorTimpMaximInamici == 0) {
				// Pun opusul directiei de mers
				game.deplasareInamicStanga = !game.deplasareInamicStanga;
			};

			// Deplasarea efectiva a inamicilor
			for(i in game.enemies){
				if (game.deplasareInamicStanga) {
					game.enemies[i].x -= game.enemySpeed; 
				} 
				else
				{	
					game.enemies[i].x += game.enemySpeed;
				};
			}

			for (i in game.proiectilPlayer) { 
				game.proiectilPlayer[i].y -= game.proiectilPlayer[i].speed;
			};

		}	


		// Functie care afiseaza stelele pe ecran
		function renderScreen(){

			// stars
			game.ctxBackground.fillStyle = "black";
			game.ctxBackground.fillRect(0, 0, game.width, game.height);
			game.ctxBackground.fillStyle = "white";
			for (var i = 0; i < game.stars.length; i++) {
				var stea = game.stars[i];
				game.ctxBackground.fillRect(stea.x, stea.y, stea.size, stea.size);
			};
 
			// player
			if (game.player.miscare === true) {
				game.ctxAction.clearRect(game.player.x, game.player.y, game.player.width, game.player.height);
				game.ctxAction.drawImage(game.images[0], game.player.x, game.player.y, game.player.width, game.player.height);
				game.player.miscare = false;
			};


			// inamici
			for (i in game.enemies) {
				var inamic = game.enemies[i];
				game.ctxInamici.clearRect(inamic.x, inamic.y, inamic.width, inamic.height);
				game.ctxInamici.drawImage(game.images[inamic.image], inamic.x, inamic.y, inamic.width, inamic.height);
			};

			// Proiectil Player - arata pana spre sus
			for(i in game.proiectilPlayer) {
				var bullet = game.proiectilPlayer[i];
				game.ctxInamici.clearRect(bullet.x, bullet.y, bullet.size, bullet.size);
				game.ctxInamici.drawImage(game.images[bullet.image], bullet.x, bullet.y, bullet.size, bullet.size);
				//game.ctxBullet.clearRect(bullet.x, bullet.y, bullet.size, bullet.size);
			};
		}

		// Functie care animeaza totul
		function showScreen(){
			requestAnimFrame(function(){
								renderScreen();
				updateData();

				showScreen();
			});
		}

		// Functie care porneste animatiile, cu tot cu pornirea paginii
		function animareFundal(){
			// porneste stele pentru inceput
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
				formareInamici();
				animareFundal();
			}
			else
				{
					setTimeout(function(){
						startGame();
					}, 60)
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