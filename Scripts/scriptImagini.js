(function(){
	$(document).ready(function{
		var interacriune = {};

		interacriune.ctx = document.getElementById("action").getContext("2d");
		interacriune.images = [];
		interacriune.imaginiIncarcate = 0;
		interacriune.imaginiNecesare = 0;

		function incarcareImagini(paths){
			for (var i = 0; i < paths.length; i++) {
				var imagine = new Image();

				imagine.src = paths[i];

				interacriune.images[i] = imagine;
				interacriune.images[i].onload = function{
					interacriune.imaginiIncarcate++;
				}
			};
		}

		function verificareImagini(){
			if (imaginiIncarcate >= imaginiNecesare)
			{
				main();
			} 
			else
			{
				function.setTimeout(function{
					verificareImagini();
				}, 1000/60);
			}
		}

		function displayPLayer(){
			
		}


		function main(){
			requestAnimFrame(function{
				verificareImagini();
				displayPLayer();
			})
			main();
		}

		main();
		incarcareImagini(["glont.png", "Inamic1.png", "Nava.png"]);


	});//sfarsit "document.ready(function{})"
});

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