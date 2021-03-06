(function(){
	$(document).ready(function(){
   /**
		 * In aceasta variabila se afla toate informatiile importante pentru
		 * functionarea jocului
		 * @type {Object}
		 */
      var game = {};
		
   		/*=========================================
			=            Presatari pagina.            =
			=========================================*/
					
			/**
			 * Setari penntru dimensiunile canvas-ului Pe viitor o sa se
			 * stabileasca dimensiunile ecranului, prin innersize (sau
			 * ceva de genul).
			 * @type {Number}
			 */
			game.width = 800;
			game.height = 600;
			/**
			 * Variabila care arata daca jocul s-a terminat, sau nu.	
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
			game.numarInamiciPeColoana = 2;
			game.contorInamici = ((game.width / 8) / 2);
			game.contorTimpMaximInamici = (game.width / 8);
			game.deplasareInamicStanga = true;
			game.enemySpeed = 1;

      /**
       * Player object.
       *
       */
      game.player = {};
			// imagini
			game.images = [];
			game.imaginiNecesare = 0;
			game.imaginiIncarcate = 0;

			// Key
			game.keys = [];

         // Scorul utilizatorului
         game.score = 0;
          /**
           * Vector in care se va stoca fiecare proiectil al inamicilor in momentul in care tragem.
           * Acest mod asigura o simpla organizare a modului in care putem modifica informatiile din
           * cadrul proiectilelor.
           *
           */
         game.proiectilInamici = [];
         /*==============================
          *     Context Work            =
          *============================*/

        game.ctxBackground = document.getElementById("background").getContext("2d");
        game.ctxAction	   = document.getElementById("action").getContext("2d");
        game.ctxInamici    = document.getElementById("inamici").getContext("2d");
        game.ctxBullet     = document.getElementById("bullet").getContext("2d");
        game.ctxText       = document.getElementById("text").getContext("2d");
        game.ctxEnemyBullet = document.getElementById("enemyBullet").getContext("2d");


			/*=================================
			=            Proiectil player     =
			=================================*/
			game.proiectilPlayer = [];
			game.contorFinalProiectil = 30;
			game.contorInitialProiectil = game.contorFinalProiectil;
		

		/*=========================================
		=            Functii auxiliare            =
		=========================================*/
		

		function formeazaFundalInitial() {
			game.ctxBackground.fillStyle = "#100";
			game.ctxBackground.fillRect(0, 0, game.width, game.height);			
		}

		/**
		 * Aceasta functie v-a afisa un "Loading Screen", pana in momentul in
		 * care se poate juca jocul. Astel jocul va avea ceva de afisat, pana
		 * sunt incarcate toate imaginile/sunetele.
		 * @return {text} 
		 */
		function renderLoadingScreen() {
			game.ctxBackground.font = "bold 50px Arial";
			game.ctxBackground.fillStyle = "white";
			game.ctxBackground.fillText("Loading", 100, 200);
		}

		/**
		 * Functie care formeaza datele necesare prezentarii stelelor, pentru
		 * fundal.
		 */
		function formareStele (numar) {
			for (var i = 0; i < numar; i++) {
				game.stars.push({
					x: Math.floor(Math.random() * game.width),
					y: 0,
					size: Math.random() * 3
				});
			};
		}

		/**
		 * Functie care formeaza stelele initiale, astfel ca ele se vor afisa
		 * random, pe ecran, ca si cum ele existau dinainte de a se incarca
		 * jocul.
		 */
		function formareSteleInitial(numar) {
			for (var i = 0; i < numar; i++) {
				game.stars.push({
					x: Math.floor(Math.random() * game.width),
					y: Math.floor(Math.random() * game.height),
					size: Math.random() * 3
				});
			};
		}

    function formeazaPlayer() {

      	var width = game.width * 0.1;
        var height = width;
        
        var x = game.width * 0.5 - width / 2;
        var y = game.height * 0.8;
        var speed = 4;
        var hp = 10;
        var player = {
                x,
                y,
                width,
                height,
                speed,
                hp: 10,
                miscare: false,
        };
        return player;
    }
		/**
		 * Functie care formeaza datele inamicilor afisati pe ecran.
		 */
		function updateDataEnemies() {
			var enemies = [];
                var enemy = {
                        x: 20 + Math.random() * (game.width - 40) , 
                        y: 60,
                        width: 50,
                        height: 50,
                        speed: 5,
                        image: 1,
                        mort: false,
                        timpMoarte: 20,
                }
			          enemies.push(enemy);
         return enemies;
		}

        function displayScore() { 
                game.ctxText.fillStyle = "white";
                game.ctxText.font = "25px bold Arial";
                game.ctxText.clearRect(0, 0, game.width, 30);
                game.ctxText.fillText("Score: " + game.score, game.width-140, 30);
      }

      function gameIsWon() {
        var gameWon = false;
        if (game.enemies.length <= 0) {
                gameWon = true;
        } else {
                gameWon = false;
        }
        return gameWon;
      }

      /**
       * Se va trece la urmatorul nivel in caz ca se termina nivelul.
       *
       */
      function finishLevel() {
              /**
              * Reafiseaza inamiicii pentru un nou nivel. 
              * Trebuie sa fac un mod in care sa fie afisati dupa un anumit interval.
              * Poate o sa folosesc un temporizator improvizat.
              *
              */
              game.enemies = updateDataEnemies();

              /**
              * Trebuie sa aratam ca s-a castigat.
              *
              */
              console.log("LevelPassed");
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
			return (obiectUnu.x < obiectDoi.x + obiectDoi.width &&
   					obiectUnu.x + obiectUnu.width > obiectDoi.x &&
   					obiectUnu.y < obiectDoi.y + obiectDoi.height &&
   					obiectUnu.height + obiectUnu.y > obiectDoi.y);
		}		

		/*=============================
		=            Taste            =
		=============================*/

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

		

		/*========================================
		=            Functii necesare            =
		========================================*/

		// Functie de a adauga datele "stelelor", formeaza player-ul
		function initializare() {
			formeazaFundalInitial();
			formareSteleInitial(600);
			renderLoadingScreen();
      game.player = formeazaPlayer();
			game.enemies = updateDataEnemies();
      game.ctxAction.drawImage(game.images[0], game.player.x, game.player.y, game.player.width, game.player.height);
		}

		// Functie care formeaza animatia de miscare si va elimina
		// toate stelele care nu mai apar pe ecran
		function updateData() {
			formareStele(1);
			// Stars
			for (var i = 0; i < game.stars.length; i++) {
				game.stars[i].y++;
				if (game.stars[i].y > game.height + 10) {
					game.stars.splice(i, 1); 
					// functie care v-a sterge din vectorul stele un numar de stele care ii indicam.
          // In aceasta situatie, stergem un element, de pe pozitia i, deoarece
          // a iesit inafara ecranului.
					// vector.splice(pozitiaDePeCareStergem, nrElementeSterse)
					// numai se afiseaza pe ecran
				};
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


			// Adaugare proiectil pentru player.
			if (game.keys[32] && game.contorInitialProiectil <= 0) {
				game.proiectilPlayer.push({
					x: (game.player.x + (game.player.width / 2) - 5),
					y: (game.player.y + 10),
					width: 10,
					height: 10,
					speed: 9,
					image: 2
				});
				game.contorInitialProiectil = game.contorFinalProiectil;
			};

      game.contorInamici++;
        if (game.contorInamici % game.contorTimpMaximInamici == 0) {
                // Pun opusul directiei de mers
                game.deplasareInamicStanga = !game.deplasareInamicStanga;
        };

			// Deplasarea efectiva a inamicilor
      /**
       * Miscarea lor se bazeaza pe folosierea unui temporizator improvizat. 
       * In momentul in care indicele 'game.contorInamici' devine un multiplu al lui 'game.contorTimpMaximInamici' atunci
       * o sa fie momentul in care o sa schimbam directia lor de mers.
       *
       */
			for(i in game.enemies){
				if (game.deplasareInamicStanga) {
					game.enemies[i].y -= game.enemySpeed; 
				} 
				else
				{	
					game.enemies[i].y += game.enemySpeed;
				};
			}

			// In caz ca proiectilul se afla inafara ecranului, il sterg
			for (i in game.proiectilPlayer) { 
				game.proiectilPlayer[i].y -= game.proiectilPlayer[i].speed;
				if (game.proiectilPlayer[i].y < -(game.proiectilPlayer[i].size + game.height/100)) {
					game.proiectilPlayer.splice(i, 1);
				};
			};

         /**
          * Se va alege inamicul care v-a trage.
          *
          */
      for(i in game.enemies) {
         var trage = false;
		 if(Math.random() * 1 >= 80) {
		 
		 /*
		 var idInamicActiv = Math.round(Math.random() * (game.enemies.lenght - 1));

         /**
          * Cat timp nu avem conditiile ca sa putem alege un inamic unic de fiecare data, o sa
          * cautam un inamic posibil.
          *
         while (typeof game.enemies[idInamicActiv] === undefined) {
              idInamicActiv = Math.round(Math.random() * (game.enemies.lenght - 1));   
         }
         */
		    /**
		    * Creez un bullet in punctul x-width/2, y+height, width heigth, speed
		    * In cadrul acestuia, ii atribuim imaginea dorita.
		    * Acesta va fi stocat intr-un vector 'game.proiectilInamici'.
		    *
		    */
		    var proiectil = {
		            x: game.enemies[i].x + game.enemies[i].width / 2,
		            y: game.enemies[i].y + game.enemies[i].height - 8,
		            width: 10,
		            height: 10,
		            speed: 5,
                draw: function () {
                        game.ctxEnemyBullet.drawImage(game.images[2], this.x, this.y, this.width, this.height);
                }
		    }
		    game.proiectilInamici.push(proiectil);
		 }

     console.log(game.proiectilInamici.length);
      }
     		/**
		    * Algoritmul de tip update al proiectilelor inamicilor.
		    *
		    */
		    for (var i = 0, l = game.proiectilInamici.length; i < l; i++) {
		            var proiectilCurent = game.proiectilInamici[i];
		            /**
		            * In caz ca proiectilul este inafara ecranului, o s ail stergem din vector, si o
		            * sa punem algoritmul sa poata continua.
		            *
		            */
		            proiectilCurent.y += proiectilCurent.speed;
		            if (proiectilCurent.y + proiectilCurent.height >= game.height + 10) {
		                     game.proiectilInamici.splice(i, 1);
		                     i--;
		                     l--;
		                     continue;
		            } 
		    }

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
            i--;
            continue;
                  /**
                   * Se modifica scorul in caz ca se distrug inamici.
                   *
                   */
                  game.score += 100;

					}
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
         if (gameIsWon() === true) {
               finishLevel(); 
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

			// Proiectil Player 
			for(i in game.proiectilPlayer) {
				var bullet = game.proiectilPlayer[i];
				game.ctxBullet.clearRect(bullet.x, bullet.y, game.width, game.height);
				game.ctxBullet.drawImage(game.images[bullet.image], bullet.x, bullet.y, bullet.width, bullet.height);
			};
        
      /**
       * Afisare proiectil inamic.
       *
       */
      game.ctxEnemyBullet.clearRect(0, 0, game.width, game.height);
      for (var i = 0, l = game.proiectilInamici.length; i < l; i++) {
        var proiectil = game.proiectilInamici[i];
        proiectil.draw();
      }
         /**
          * Afisare scor.
          *
          */
         displayScore();
		}

		// Functie care animeaza totul
		function showScreen() {
			requestAnimFrame(function(){
				updateData();
				renderScreen();
				showScreen();
			});
		}

		// Functie care porneste animatiile, cu tot cu pornirea
		// paginii
		function animareFundal() {
        initializare();
			// porneste animatia continua
			showScreen();
		}
		/**
		 * functia verifica daca au fost incarcate toate imaginile in
		 * joc Odata incarcate imaginile, jocul va porni.
		 */
		function startGame() {
			if (game.imaginiIncarcate >= game.imaginiNecesare) {
				// Pornesc animatiile de fundal
				animareFundal();
			} else {
					setTimeout(function(){
						startGame();
					}, 60);
			};
		}

		/*=====================================================================
		=            Apelare de functii, pentru a incepe programul            =
		=====================================================================*/
				
		// Incarc imaginile
		incarcareImagini([
			"Images/player/Nava1.png", 
			"Images/player/Glont.png",
			"Images/inamici/Inamic-Explozie.png",
			"Images/inamici/big-data.png",
			"Images/inamici/csharp.png",
			"Images/inamici/Java.png",
			"Images/inamici/php.png",
			"Images/proiectileInamici/code.png",
			"Images/proiectileInamici/code_ok.png",
			"Images/proiectileInamici/code_bun.png"
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
          	// 1000 milisecunde = 1 secunde si "1000 / x" <=> xfps
            window.setTimeout(callback, 1000 / 60); 
          };
})();
