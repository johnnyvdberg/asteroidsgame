var canvas; var ctx;
var gameMusic = true;

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
	alive: true,
	exploding: -1
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

var orbit = {
  xtiles: 0, // number of x tiles that span the screen
  ytiles: 0, //  number of y tiles that span the screen
  angle: 0, // astroids angle in orbit
  distance: 100, // astroids distance from the sun	
  bullettime: false // bullet
}

var planetsDestroyed = 0;
var canvasxc, canvasyc;
var fps = 0; var fpscounter = 0; var fpscount = 0;
var then;
var keysDown = {};
var detailedParticles = true;

var particles = [];
var particle_count = 1000;

var gamePlanetReset = function () {
	planet.x = -120+(canvas.width/2)+(Math.random()*240);
	planet.y = (canvas.height/2);
	planet.size = 0;
	planet.alive = true;
	planet.exploding = -1;
};

var gameStart = function () {
	ass.x = canvas.width /2;
	ass.y = canvas.height /2;
	canvasxc = canvas.width/2;
	canvasyc = canvas.height/2;
	// cals number of tiles
	orbit.xtiles = Math.ceil(canvas.width/512)+1;
	orbit.ytiles = Math.ceil(canvas.height/512)+1;
	addEventListener("keydown", function (e) { keysDown[e.keyCode] = true; }, false);
	addEventListener("keyup", function (e) { delete keysDown[e.keyCode]; }, false);
};

// preload images
var loader, assImage, planetImage, starImage, bgImage, parImage, explode1Image, explode2Image, bgTiles;
function gameLoadImages(){
	var loader = new PxLoader();
	bgTiles = Array();
	for(var i = 0; i < 6; i++){
	  bgTiles[i] = loader.addImage('images/game/space_'+i+'.png');
	}
	assImage = loader.addImage('images/game/ass.png'); 
	planetImage = loader.addImage('images/game/planet.png'); 
	starImage = loader.addImage('images/game/star.png');
	bgImage = loader.addImage('images/game/bg.jpg');
	parImage = loader.addImage('images/game/1.png');
	explodeImage1 = loader.addImage('images/game/explode.png');
	explodeImage2 = loader.addImage('images/game/ring.png');
	loader.addCompletionListener(function(){ gameBegin(); });
	loader.start();
}

function gameBegin(){
	// start
	gamePlanetReset();
	gameStart();
	then = Date.now();
	timer = setInterval(gameMain, 1);
	InitPlaylist(2); // 1 = menu, 2 is game;
	gameMain();
	canvasShow();
}

var gameUpdate = function (modifier) {
	if (37 in keysDown) { //left
		ass.x -= ass.speed * modifier;
	}
	if (39 in keysDown) { //right
		ass.x += ass.speed * modifier;
	}
	
	if(planet.alive){
	   orbit.bullettime = true;	
	   planet.size += 2*modifier; 
	   if(planet.size>4){ gamePlanetReset(); }
	   
	   if((planet.size>1.3)&&(planet.size<1.7)){
		  if (
			  ass.x <= (planet.x + (120*1.7)) && planet.x <= (ass.x + (140*1.7))
		  ) {
			  var dx = (((planet.x+(planet.w/2))-(ass.x+(ass.w/2)))/20);
			  var dy = (((planet.y+(planet.h/2))-(ass.y+(ass.h/2)))/20);
			  planetsDestroyed++;
			  planet.alive = false;
			  for(var i = 0; i< particle_count;i++){ particles.push(new particle(planet.x+(60*planet.size),planet.y+(60*planet.size),dx,dy)); }
			  planet.exploding = 0;
			  gamePlayExplosion();
			  setTimeout("explosionDone();",1000);
			  setTimeout("gamePlanetReset();",10000);
		  }
		}
	 }
	 
	// dit is in hyperspeed, update de angle 
	if(orbit.bullettime == false){
	  ass.angle += 0.05*modifier;
	  if(ass.angle>1){ ass.angle -= 1; }
      orbit.angle += 0.05*modifier;
	}else{
	  // dit is bullettime		
	}
	
};

function explosionDone(){ // explosion all gone, lets get back to sexy hyperspeed
	orbit.bullettime = false;	
}

function drawExplodingPlanet(){
  var n = planet.exploding;	
  var i = Math.round(n);	
  drawScaled(explodeImage2,(planet.x-250)+(60*planet.size),(planet.y-250)+(60*planet.size),500,500,n/2);
  ctx.drawImage(explodeImage1,0,i*240,240,240,planet.x-60,planet.y-60,240,240);	
}

function drawTiledBackground(x,y){ // tile sizes are 512 by 512 
  //what number to draw first
  var xtileindex = (x - (x % 512)) / 512;  
  var tmpti = 0;
  var tx,ty;
  for(var i =0; i< orbit.xtiles; i++){
    for(var j =0; j< orbit.ytiles; j++){
	  // this tile index
	  tx = i*512;
	  ty = j*512;
	  //tmpti = ((((i % 3)+((j % 2)*3))+xtileindex) % 6); // 2 rows with 3 tiles each, + offset over the max numbe rof tiles
	  tmpti = (((i+xtileindex) % 3)+((j % 2)*3));
	  ctx.drawImage(bgTiles[tmpti],tx-(x%512),ty);
    }	    
  }
}

var ox, oy;  //offsets x en y voor dat lekkere explosie effect

var gameRender = function(delta) {
	//l(planet.exploding);
	if(planet.exploding>-1){  //offsets x en y voor dat lekkere explosie effect
	  ox = -10+(Math.random()*20); oy = -10+(Math.random()*20);	
	}else{
	  ox = 0; oy = 0;	
	} 
	// hyperspeed
	if(orbit.bullettime==false){  //offsets x en y voor dat lekkere explosie effect
	  ox = -2+(Math.random()*4); oy = -2+(Math.random()*4);	
	}else{
	  ox = 0; oy = 0;	
	} 
	 //ctx.globalCompositeOperation = "source-over";
    //ctx.drawImage(bgImage, ox, oy);
    //ctx.drawImage(starImage, par.x, par.y);
    //ctx.drawImage(starImage, par2.x, par2.y); 
 	// far planet
    drawTiledBackground(Math.round(orbit.angle*5120),0); // dat is zodat we 512 loopen
	
 	if((planet.size<(1.7))&&(planet.alive)){ drawScaled(planetImage, canvasxc+((planet.x-canvasxc)*planet.size), canvasyc+((planet.y-canvasyc)*planet.size),    planet.w,planet.h,planet.size); }
    // asteroid
	drawImageRotated(assImage,ass.x+ox,ass.y+oy,ass.w,ass.h,ass.angle*6.28318531);
    // particles
    var f = false;
 	for(var i = 0; i < particles.length;i++){
  		var p = particles[i];
  		if(p!=null){
   			f = true;
   			p.opacity = (p.remaining_life/p.life);
   			//Werkt alleen cool in Chrome
   			if(detailedParticles){
				//l(p.opacity);
				//var gradient = ctx.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);     
				//gradient.addColorStop(0, 'rgba(' + p.r + ', ' + p.g + ', ' + p.b + ', ' + '1)');
				//gradient.addColorStop(0.5, "rgba("+p.r+", "+p.g+", "+p.b+","+p.opacity+")");
				//gradient.addColorStop(1, "rgba("+p.r+", "+p.g+", "+p.b+", 0)");
				//ctx.strokeStyle = 'rgba(' + p.r + ', ' + p.g + ', ' + p.b + ','+ p.opacity +')';
				//ctx.strokeRect(p.location.x,p.location.y,p.radius,p.radius);
				//ctx.beginPath();
				
				//ctx.fillStyle = gradient;
				//ctx.arc(p.location.x, p.location.y, p.radius, Math.PI*2, false);
				//ctx.fill();
				//ctx.closePath();
				ctx.drawImage(parImage,p.location.x,p.location.y);
   			}else{
				ctx.strokeStyle = 'rgb(' + p.r + ', ' + p.g + ', ' + p.b +')';
				ctx.beginPath();
				ctx.lineWidth = p.radius;
				ctx.lineCap = 'round';
				ctx.moveTo(p.location.x,p.location.y);
				ctx.lineTo(p.location.x+1,p.location.y+1);
				ctx.stroke();
				ctx.closePath();
		  	}
    		p.remaining_life -= (delta*70);
    		p.radius += (delta*10);
    		p.location.x += (p.speed.x*(delta*220));
   		 	p.location.y += (p.speed.y*(delta*220));
    		if(p.remaining_life < 0 || p.radius > 400){ particles[i] = null; } 
  		}	
 	}
 	if((f!=true) && (particles.length>0)){ particles = Array(); }
 	 // chunks
	 if((planet.alive==false) && (planet.exploding>-1) && (planet.exploding<5)){
		planet.exploding += (delta*15); 
		drawExplodingPlanet(); 
	 }else{
	    planet.exploding = -1;	 
	 }
	 // NEARBY planet
	 if((planet.size>=(1.7))&&(planet.alive)){ drawScaled(planetImage, canvasxc+((planet.x-canvasxc)*planet.size),  canvasyc+((planet.y-canvasyc)*planet.size), planet.w,planet.h,planet.size); }

 
	 ctx.fillStyle = "rgb(250, 250, 250)";
	 ctx.font = "24px Arial";
	 ctx.textAlign = "left";
	 ctx.textBaseline = "top";
	 ctx.fillText("Planets annihilated: " + planetsDestroyed, 32, 32);
	 ctx.fillText("FPS: " + fps, 32, 64);
	 if(orbit.bullettime){
	   ctx.fillText("FUCKING BULLETTIME", 36-(Math.random()*8), 100-(Math.random()*8));	 
	 }
}
	
function particle(x,y,dx,dy)
{
	var r = (Math.random()*Math.PI*2);
	var s = Math.random()+0.2;
	var tmpdx = dx+(Math.cos(r)*5)*s;
	var tmpdy = (Math.sin(r)*5)*s;
	
	this.speed = {x:  tmpdx, y: tmpdy }
	this.location = {x: x, y: y};
	this.radius = 1+Math.random()*20;
	this.life = 10+(Math.random()*20);
	this.remaining_life = this.life;
	//Colors
	this.r = Math.round((Math.random()*105)+145);
	this.g = Math.round(Math.random()*25+(this.r/4));
	this.b = Math.round(Math.random()*25);
}

function gamePlayExplosion(){
    soundManager.setVolume('explosion',30);
    soundManager.play('explosion',{ onfinish: function() { } });	
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

