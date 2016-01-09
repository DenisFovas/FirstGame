(function(){
	$(document).ready(function(){
		var game = {};
		

		/*=========================================
		=            Presatari pagina.            =
		=========================================*/
				
		/**
		 * Setari penntru dimensiunile canvas-ului Pe viitor o sa se
		 * stabileasca dimensiunile ecranului, prin innersize (sau
		 * ceva de genu).
		 * @type {Number}
		 */
		game.width = 400;
		game.height = 500;
		/**
		 * Variabila care arata ca jocul nu s-a terminat
		 * @type {Boolean}
		 */
		game.over = true;
		/**
		 * Variabila care va insemna numarul de secunde in care
		 * jucatorul are sa treaca nivelul. Aceasta va fi inmultita cu
		 * 1000 in functia startGame, ca sa redea exact numarul de
		 * secunde
		 * @type {Number}
		 */
		game.timeOver = 20;


		/*================================
		=            Entitati            =
		================================*/
				
		/**
		 * Vector care retine pozitiile stelelor, cat si datele lor.
		 * Se pot pune functiile legate de stele intr-un fisier
		 * separat pe viitor.
		 * @type {Array}
		 */
		game.stars = [];

		/**
		 * game.enemies va fi un vector care retine toti inamicii. Ei
		 * se afla la inceput intr-o formatie prestabilita, iar pe
		 * viitor acel contor se va schimba, in functie de nivel. Am
		 * un contorTimpMaximInamici care il fac in functie de latimea
		 * canvas-ului, contorul contorInamici va stabili exact pe ce
		 * distanta se vor misca navele, iar deplasareInamicStanga
		 * arata directia In caz ca deplasareInamicStanga este fals,
		 * se va misca in dreapta, daca este true, se misca spre
		 * stanga
		 */
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

		/*==============================
		=            Player            =
		==============================*/
				
		/**
		 * dimensiunile / setarile initiale ale jucatorului
		 * @type {Object}
		 */
		game.player = {
			x: game.width * 0.37 + 25,
			y: game.height - (game.height * 0.2),
			width: 70,
			height: 70,
			speed: 2,
			miscare: false	// folosit pentru a randa player-ul, decat daca se misca.	
		};
		
		/*=================================
		=            Proiectil player     =
		=================================*/
		game.proiectilPlayer = [];
		game.contorFinalProiectil = 30;
		game.contorInitialProiectil = game.contorFinalProiectil;


		/*====================================
		=            Context Work            =
		====================================*/
		
		// "Culeg" contextul prin care o sa lucrez pentru Backgound, Action(player), Inamici
		game.ctxBackground = document.getElementById("background-image").getContext("2d");
		game.ctxAction = document.getElementById("action").getContext("2d");
		game.ctxInamici = document.getElementById("inamici").getContext("2d");
		game.ctxBullet = document.getElementById("bullet").getContext("2d");

		// Setez culoarea de fundal: 'negru';
		game.ctxBackground.fillStyle = "#100";
		game.ctxBackground.fillRect(0, 0, game.width, game.height);
		
		/**
		 * Cat timp se va incarca fiecare imagine in parte, afisez un
		 * "Loading Screen" 
		 */
		// loading time (in caz ca am imagini multe)
		game.ctxBackground.font = "bold 50px Arial";
		game.ctxBackground.fillStyle = "white";
		game.ctxBackground.fillText("Loading", 100, 200);



		/*========================================
		=            Functii necesare            =
		========================================*/

		// Functie de a adauga datele "stelelor", formeaza player-ul
		function initializare(numar) {

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
		function updateData() {
			
			// Stars
			initializare(1);
			for (var i = 0; i < game.stars.length; i++) {
				game.stars[i].y--;
				if (game.stars[i].y < -1) {
					game.stars.splice(i, 1); 
					// functie care v-a sterge din vectorul stele totul 
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


			// Adaugare proiectil
			if (game.keys[32] && game.contorInitialProiectil <= 0) {
				game.proiectilPlayer.push({
					x: (game.player.x + (game.player.width / 2) - 5),
					y: (game.player.y + 10),
					width: 10,
					height: 10,
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

			// In caz ca proiectilul se afla inafara ecranului, il sterg
			for (i in game.proiectilPlayer) { 
				game.proiectilPlayer[i].y -= game.proiectilPlayer[i].speed;
				if (game.proiectilPlayer[i].y < -(game.proiectilPlayer[i].size + game.height/100)) {
					game.proiectilPlayer.splice(i, 1);
				};
			};


			// Verificare daca se afla o coliziune intre proiectil, si
			// intre inamici.
			for (contorInamic in game.enemies){
				for (contorProiectil  in game.proiectilPlayer){
					if (coliziune(game.enemies[contorInamic], game.proiectilPlayer[contorProiectil])) {
						game.enemies[contorInamic].mort = true;
						// Imaginea este Inamic-Explozie.png
						game.enemies[contorInamic].image = 3;
						// Oprim proiectulul odata cu o coliziune
						game.ctxBullet.clearRect(game.proiectilPlayer[contorProiectil].x, game.proiectilPlayer[contorProiectil].y, game.proiectilPlayer[contorProiectil].width + 5, game.proiectilPlayer[contorProiectil].height + 10)
						game.proiectilPlayer.splice(contorProiectil, 1);

					};
				}
			}


			// Arat imaginea Inamic-Explozie.png, folosesc un mic
			// contor, pentru a arata imaginea, iar dupa expirarea
			// unui anumit timp, sterg imaginea de pe canvas,
			for (i in game.enemies){
				if (game.enemies[i].mort === true) {
					game.enemies[i].timpMoarte--;
				};
				if (game.enemies[i].mort === true && game.enemies[i].timpMoarte <= 0 ) {
					game.ctxInamici.clearRect(game.enemies[i].x, game.enemies[i].y, game.enemies[i].width, game.enemies[i].height);
					game.enemies.splice(i, 1);
				};
			}

		}	


		// Functie care afiseaza stelele pe ecran
		function renderScreen() {

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
				game.ctxBullet.clearRect(bullet.x, bullet.y, game.width, game.height);
				game.ctxBullet.drawImage(game.images[bullet.image], bullet.x, bullet.y, bullet.width, bullet.height);
				//game.ctxBullet.clearRect(bullet.x, bullet.y, bullet.size, bullet.size);
			};
		}

		// Functie care animeaza totul
		function showScreen() {
			requestAnimFrame(function(){
				renderScreen();
				updateData();
				showScreen();
			});
		}

		// Functie care porneste animatiile, cu tot cu pornirea
		// paginii
		function animareFundal() {
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

		/**
		 * Formarea de inamici
		 * aici formez datele necesare pentru a putea forma inamicii
		 * functia este folosita initial pentur a incarca inamicii pe
		 * nivel.
		 */
		function formareInamici() {
			for (var i = 0; i < game.numarInamiciPeLinie; i++) {
				for (var j = 0; j < game.numarInamiciPeColoana; j++) {
					game.enemies.push({
						x: ((i * 70) + (game.width / 20)),
						y: (j * 60),
						width: 60,
						height: 60, 
						mort: false,
						timpMoarte: 15,
						image: 1
					});
				};
			};
		}

		/**
		 * Functie care verifica daca apare o coliziune.
		 * @param  {obiect} obiectUnu Primul obiect, la care i se
		 *                            verifica posibila coliziune
		 * @param  {obiect} obiectDoi Al doilea obiect, la care i se
		 *                            verifica posibila coliziune
		 * @return {bool} se returneaza true/false in functie de
		 *                   coliziunea in sine, dintre obiecte
		 */
		function coliziune(obiectUnu, obiectDoi) {
			return !(obiectUnu.x > obiectDoi.x + obiectDoi.size ||
					obiectUnu.x + obiectUnu.width < obiectDoi.x ||
					obiectUnu.y > obiectDoi.y + obiectDoi.size ||
					obiectUnu.y + obiectUnu.height < obiectDoi.y);
		}		

		/*=============================
		=            Taste            =
		=============================*/

		// folosesc jQuery deoarece este mai usor, si mai eficient
		// decat un cod js
		$(document).keydown(function(e) {
			game.keys[e.keyCode ? e.keyCode : e.which] = true;
		});

		$(document).keyup(function(e) {
			delete game.keys[e.keyCode ? e.keyCode : e.which];
		});

		/*===============================
		=            Imagini            =
		===============================*/
				

		// functie care va incarca imaginile necesare pentru joc
		function incarcareImagini(paths) {
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

		/**
		 * functia verifica daca au fost incarcate toate imaginile in
		 * joc Odata incarcate imaginile, jocul va porni.
		 */
		function startGame() {
			if (game.imaginiIncarcate >= game.imaginiNecesare) {
				// Pornesc animatiile de fundal
				formareInamici();
				animareFundal();
			} else {
				if (game.over !== false) {
					setTimeout(function(){
						startGame();
					}, 60)
				}
			};
		}

		/**
		 * Functie care va returna victoria sau infrangerea
		 * jucatorului in nivelul respectiv
		 * @return {bool} 
		 */	
		function afisareRezultatNivel() {
			if (game.enemies.length <= 0) {
				return true; // S-a castigat.
			}
			else
			{
				return false; //S-a pierdut.
			}
		}

		function gameOver () {
			setTimeout(function() {
				afisareRezultatNivel();
			}, game.timeOver * 1000);
		}



		/*=====================================================================
		=            Apelare de functii, pentru a incepe programul            =
		=====================================================================*/
				

		// Incarc imaginile
		incarcareImagini([
			"Images/Nava1.png", 
			"Images/Inamic1.png",
			"Images/Glont.png",
			"Images/Inamic-Explozie.png"
			]);
		
		// verific imaginile.
		// daca sunt incarcate atunci o sa se poata porni jocul
		startGame();
	});	
})();

/**
 * Aici am o functie care poate sa randeze pe broswere aplicatia.
 * Totul se bazeaza pe aceasta functie de baza pe care mare parte din
 * browsere o au, dar am ales sa o mai adaug casa pot sa am o
 * siguranta in plus legat de aceasta chestie. Astfel orice browser se
 * va folosi, daca este din 2006 sau mai recent, se poate folosi
 * pentru aplicatie.
 */
window.requestAnimFrame = (function() {
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          function( callback ){
          	// 1000 milisecunde = 1 secunda; "/ x" <=> xfps
            window.setTimeout(callback, 1000 / 60); 
          };
})();