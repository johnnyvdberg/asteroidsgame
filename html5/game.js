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
	h:120,
	alive: true
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
var detailedParticles = true;

var particles = [];
var particle_count = 100;

var gamePlanetReset = function () {
	planet.x = -120+(canvas.width/2)+(Math.random()*240);
	planet.y = (canvas.height/2);
	planet.size = 0;
	planet.alive = true;
};

var gameStart = function () {
	ass.x = canvas.width /2;
	ass.y = canvas.height /2;
	canvasxc = canvas.width/2;
	canvasyc = canvas.height/2;
	addEventListener("keydown", function (e) { keysDown[e.keyCode] = true; }, false);
	addEventListener("keyup", function (e) { delete keysDown[e.keyCode]; }, false);
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
	// start
	gamePlanetReset();
	gameStart();
	then = Date.now();
	timer = setInterval(gameMain, 1);
	gameMain();
	canvasShow();
}

var gameUpdate = function (modifier) {
	if (37 in keysDown) { //left
		ass.x -= ass.speed * modifier;
		//par.x += par.speed * modifier;
		//par2.x += par.speed * modifier;
	}
	if (39 in keysDown) { //right
		ass.x += ass.speed * modifier;
		//par.x -= par.speed * modifier;
		//par2.x -= par.speed * modifier;
	}
	
	//if(par.x > 1280) par.x = -1280;
	//if(par2.x > 1280) par2.x = -1280;
	//if(par.x < -1280) par.x = 1280;
	//if(par2.x < -1280) par2.x = 1280;
	
	ass.angle += 0.05*modifier;
	if(ass.angle>1){ ass.angle -= 1; }

	
	if(planet.alive){
	   planet.size += 2*modifier; 
	   if(planet.size>4){ gamePlanetReset(); }
	   
	   if((planet.size>1.3)&&(planet.size<1.7)){
		  if (
			  ass.x <= (planet.x + (120*1.7)) && planet.x <= (ass.x + (140*1.7))
		  ) {
			  var dx = (((planet.x+(planet.w/2))-(ass.x+(ass.w/2)))/20);
			  var dy = (((planet.y+(planet.h/2))-(ass.y+(ass.h/2)))/20);
			  l('dx: '+dx);
			  ++planetsDestroyed;
			  planet.alive = false;
			  for(var i = 0; i< particle_count;i++){ particles.push(new particle(planet.x+60,planet.y+60,dx,dy)); }
			  setTimeout("gamePlanetReset();",5000);
		  }
		}
	 }
	
};

var gameRender = function(delta) {
    ctx.drawImage(bgImage, 0, 0);
    ctx.drawImage(starImage, par.x, par.y);
	ctx.drawImage(starImage, par2.x, par2.y);	
	// far planet
	if((planet.size<(1.7))&&(planet.alive)){ drawScaled(planetImage, canvasxc+((planet.x-canvasxc)*planet.size), canvasyc+((planet.y-canvasyc)*planet.size),    planet.w,planet.h,planet.size); }
    // particles
	var f = false;
	for(var i = 0; i < particles.length;i++){
		var p = particles[i];
		if(p!=null){
			f = true;
			p.opacity = (p.remaining_life/p.life);
			//Werkt alleen cool in Chrome
			if(detailedParticles)
			{
				//l(p.opacity);
				var gradient = ctx.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);			  
				gradient.addColorStop(0, 'rgba(' + p.r + ', ' + p.g + ', ' + p.b + ', ' + '1)');
				gradient.addColorStop(0.5, "rgba("+p.r+", "+p.g+", "+p.b+","+p.opacity+")");
				gradient.addColorStop(1, "rgba("+p.r+", "+p.g+", "+p.b+", 0)");
				//ctx.strokeStyle = 'rgba(' + p.r + ', ' + p.g + ', ' + p.b + ','+ p.opacity +')';
				//ctx.strokeRect(p.location.x,p.location.y,p.radius,p.radius);
				ctx.beginPath();
		  
				ctx.fillStyle = gradient;
				ctx.arc(p.location.x, p.location.y, p.radius, Math.PI*2, false);
				ctx.fill();
				ctx.closePath();
			}
			else
			{
				ctx.strokeStyle = 'rgba(' + p.r + ', ' + p.g + ', ' + p.b + ','+ p.opacity +')';
				ctx.beginPath();
				ctx.lineWidth = p.radius;
				ctx.lineCap = 'round';
				ctx.moveTo(p.location.x,p.location.y);
				ctx.lineTo(p.location.x+1,p.location.y+1);
				ctx.stroke();
				ctx.closePath();
			}
		  p.remaining_life -= (delta*5);
		  p.radius += (delta*25);
		  p.location.x += (p.speed.x*(delta*50));
		  p.location.y += (p.speed.y*(delta*50));
		  if(p.remaining_life < 0 || p.radius > 400){ particles[i] = null; } 
		}
	}
	if((f!=true) && (particles.length>0)){ particles = Array(); }
	// asteroid
	drawImageRotated(assImage,ass.x,ass.y,ass.w,ass.h,ass.angle*6.28318531);
	// close planet
	if((planet.size>=(1.7))&&(planet.alive)){ drawScaled(planetImage, canvasxc+((planet.x-canvasxc)*planet.size),  canvasyc+((planet.y-canvasyc)*planet.size), planet.w,planet.h,planet.size);		
	}

	
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Arial";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Planets annihilated: " + planetsDestroyed, 32, 32);
	ctx.fillText("FPS: " + fps, 32, 64);
}
	
function particle(x,y,dx,dy)
{
	var r = (Math.random()*Math.PI*2);
	var s = Math.random();
	var tmpdx = dx+(Math.cos(r)*5)*s;
	var tmpdy = (Math.sin(r)*5)*s;
	
	this.speed = {x:  tmpdx, y: tmpdy }
	this.location = {x: x, y: y};
	this.radius = 20+Math.random()*20;
	this.life = 10+(Math.random()*20);
	this.remaining_life = this.life;
	//Colors
	this.r = Math.round((Math.random()*105)+145);
	this.g = Math.round(Math.random()*25+(this.r/4));
	this.b = Math.round(Math.random()*25);
}


var gameMain = function () {
	var now = Date.now();
	var delta = (now - then)/1000;
	gameUpdate(delta);
	gameRender(delta);
	then = now;	
	fpscounter += delta; fpscount++;
	if(fpscounter>1){ fpscounter -= 1; fps = fpscount; fpscount = 0; }
};

