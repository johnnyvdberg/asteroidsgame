var planet = {
	x: 0,
	y: 0,
	width:120,
	height:120,
	scale: 0,
	radius: 1000,
	angle: 0
};

function gameLoad(){
	var loader = new PxLoader();
	
	//LOAD ALL IMAGES
	planetImg = loader.addImage('images/game/planet.png');
	assImg = loader.addImage('images/game/ass.png');
	spaceImg = loader.addImage('images/game/space.png');
	starImg = loader.addImage('images/game/star.png');
	
	loader.addCompletionListener(function(){ 
		gameLoaded();
	});
	
	loader.start();
}

function gameLoaded(){
	then = Date.now();
	gameUpdate();
	timer = setInterval("gameUpdate();",1);
	canvasShow();
}

function gameUpdate(){																	
	getDelta();
	
	ctx.drawImage(spaceImg, 0 , 0);
	
	drawScaled(planetImg, planet.x, planet.y, planet.width, planet.height, planet.scale);
	planet.scale = planet.scale + (0.0007 * delta);
	
	planet.x = Math.cos(planet.angle) * planet.radius;
	planet.y = demHeight + Math.sin(planet.angle) * planet.radius;
	planet.angle = planet.angle + 0.001 * delta;
	if(planet.x < 1){planet.scale = 0;}
	
	ctx.drawImage(assImg, (demWidth/2) - 50, (demHeight/2) +150);
	
}