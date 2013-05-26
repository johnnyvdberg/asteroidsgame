  var canvas; var ctx; 

  var ass = {
	  speed: 956,
	  x: 0,
	  y: 0,
	  angle:0,
	  w: 100,
	  h: 142
  };
  
  var planet = {
	  x: 0,
	  y: 0,
	  size: 0,
	  w:120,
	  h:120
  };
  
  var par = {
	  speed: 300,
	  x: 0,
	  y: 0
  };
  
  var par2 = {
	  speed: 300,
	  x: 1280,
	  y: 0
  };
  
  var planetsDestroyed = 0;
  var canvasxc, canvasyc;
  var fps = 0; var fpscounter = 0; var fpscount = 0;
  var then;
  var keysDown = {};
  
  addEventListener("keydown", function (e) { keysDown[e.keyCode] = true; }, false);
  addEventListener("keyup", function (e) { delete keysDown[e.keyCode]; }, false);
  
  var reset = function () {
	  planet.x = 120 + (Math.random() * (canvas.width - 240));
	  planet.y = 120 + (Math.random() * (canvas.height - 240));
	  planet.x = planet.x-canvasxc;
	  planet.y = planet.y-canvasyc;
	  planet.size = 0;
  };
  
  var start = function () {
	  ass.x = canvas.width /2;
	  ass.y = canvas.height /2;
	  canvasxc = canvas.width/2;
	  canvasyc = canvas.height/2;
  };

  var update = function (modifier) {
	  if (37 in keysDown) { //left
		  ass.x -= ass.speed * modifier;
		  par.x += par.speed * modifier;
		  par2.x += par.speed * modifier;
	  }
	  if (39 in keysDown) { //right
		  ass.x += ass.speed * modifier;
		  par.x -= par.speed * modifier;
		  par2.x -= par.speed * modifier;
	  }
	  
	  if(par.x > 1280) par.x = -1280;
	  if(par2.x > 1280) par2.x = -1280;
	  if(par.x < -1280) par.x = 1280;
	  if(par2.x < -1280) par2.x = 1280;
	  
	  ass.angle += 0.2*modifier;
	  if(ass.angle>1){ ass.angle -= 1; }
  
	  if (
		  ass.x <= (planet.x + 120)
		  && planet.x <= (ass.x + 140)
		  && ass.y <= (planet.y + 120)
		  && planet.y <= (ass.y + 140)
	  ) {
		  ++planetsDestroyed;
		  reset();
	  }
	  
	  planet.size += 2*modifier;
	  if(planet.size>2){ reset(); }
  };
  
// preload images
var loader, assImage, planetImage, starImage, bgImage;
function gameLoadImages(){
	var loader = new PxLoader();
	assImage = loader.addImage('images/game/ass.png'); 
	planetImage = loader.addImage('images/game/planet.png'); 
	starImage = loader.addImage('images/game/star.png');
	bgImage = loader.addImage('images/game/bg.jpg');
	loader.addCompletionListener(function(){ gameBegin(); });
	loader.start();
}

function gameBegin(){
	canvas = document.createElement("canvas");
	canvas.width=1280; canvas.height=720;
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);
	// start
	reset();
	start();
	then = Date.now();
	setInterval(main, 1);
}

function drawImageRotated(img,x,y,w,h,r){
	ctx.save();
	ctx.translate(x+(w/2),y+(h/2));
	ctx.rotate(r);
	ctx.translate((-(w/2)),(-(h/2)));
	ctx.drawImage(img,0,0);
	ctx.restore();	
}

function drawScaled(img,x,y,w,h,s){
	ctx.save();
	ctx.translate(x+(w/2),y+(h/2));
	ctx.scale(s,s);
	ctx.translate((-(w/2)),(-(h/2)));
	ctx.drawImage(img,0,0);
	ctx.restore();	
}

var render = function() {
    ctx.drawImage(bgImage, 0, 0);
    ctx.drawImage(starImage, par.x, par.y);
	ctx.drawImage(starImage, par2.x, par2.y);
	
	drawScaled(planetImage,canvasxc+(planet.x*planet.size),canvasyc+(planet.y*planet.size),planet.w,planet.h,planet.size);
	
	drawImageRotated(assImage,ass.x,ass.y,ass.w,ass.h,ass.angle*6.28318531);

	

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Arial";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Planets annihilated: " + planetsDestroyed, 32, 32);
	ctx.fillText("FPS: " + fps, 32, 64);
}

var main = function () {
	var now = Date.now();
	var delta = (now - then)/1000;
	update(delta);
	render();
	then = now;	
	fpscounter += delta; fpscount++;
	if(fpscounter>1){ fpscounter -= 1; fps = fpscount; fpscount = 0; }
};

