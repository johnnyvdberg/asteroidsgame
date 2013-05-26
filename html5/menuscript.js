function menuLoadImages(){
	var loader = new PxLoader();
	assImage = loader.addImage('images/ass.png'); 
	planetImage = loader.addImage('images/planet.png'); 
	starImage = loader.addImage('images/star.png');
	bgImage = loader.addImage('images/bg.jpg');
	loader.addCompletionListener(function(){ menuLoaded(); });
	loader.start();
}

window.onload = function(e){
	setTimeout("menuLoadImages()",1000); // show off loader 1 second longer, remove later
};

function menuLoaded(){
  
  
  gameLoadImages();

}

