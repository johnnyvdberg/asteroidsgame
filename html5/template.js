function screenLoad(){
	var loader = new PxLoader();
	
	//LOAD ALL IMAGES
	//menuBgImg = loader.addImage('images/menu/bg.png');
	
	loader.addCompletionListener(function(){ 
		screenLoaded(); 
	});
	
	loader.start();
}

function screenLoaded(){
	then = Date.now();
	screenUpdate();
	timer = setInterval("screenUpdate();",1);	
	canvasShow();
}

function screenUpdate(){
	getDelta();
	
	//THE LOOP
}