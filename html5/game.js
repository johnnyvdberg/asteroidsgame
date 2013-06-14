var canvas; var ctx;
var gameMusic = true;

var ass = {
	speed: 1000,
	x: 0,
	y: 0,
	angle:0,
	w: 100,
	h: 142,
	lives: 2
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

var orbit = {
  xtiles: 0, // number of x tiles that span the screen
  ytiles: 0, //  number of y tiles that span the screen
  angle: 0, // astroids angle in orbit
  distance: 50, // astroids distance from the sun	
  bullettime: false, // bullet
  bullettimepercentage: 0, // percentage
  bullettimeup: true, // direction
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
	ass.x = (canvas.width /2)-50;
	// 100 pixels from the middle
	ass.y = (canvas.height /2)-70;
	ass.angle = 0;
	ass.speed = 1000;
	orbit.angle = 0; orbit.distance = 50; // reset position
	orbit.bullettimepercentage = 0; orbit.bullettime = false; orbit.bullettimeup = true; // reset bullettime
	canvasxc = canvas.width/2;
	canvasyc = canvas.height/2;
	// cals number of tiles
	orbit.xtiles = Math.ceil(canvas.width/512)+1;
	orbit.ytiles = Math.ceil(canvas.height/512)+1;
	//init stars
	for (var i=0, n; i<units; i++)
	{
		n = {};
		resetstar(n);
		stars.push(n);
	}
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
	glowImage = loader.addImage('images/game/glow.png')
	loader.addCompletionListener(function(){ gameBegin(); });
	loader.start();
}

function gameBegin(){ // init alles
	// start
	gamePlanetReset();
	ass.lives = 2; // extra lives
	gameStart();
	then = Date.now();
	timer = setInterval(gameMain, 1);
	InitPlaylist(2); // 1 = menu, 2 is game;
	gameMain();
	canvasShow();
}

function explosionDone(){ // explosion all gone, lets get back to sexy hyperspeed
	orbit.bullettimeup = false;	
}

function drawExplodingPlanet(){
  var n = planet.exploding;	
  var i = Math.round(n);	
  drawScaled(explodeImage2,(planet.x-250)+(60*planet.size),(planet.y-250)+(60*planet.size),500,500,n/2);
  ctx.drawImage(explodeImage1,0,i*240,240,240,planet.x-60,planet.y-60,240,240);	
}

/* function drawTiledBackground(x,y){ // tile sizes are 512 by 512 
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
} */

function drawTiledBackground(x,y){ // tile sizes are 512 by 512 
  //what number to draw first
  var xtileindex = (x - (x % 512)) / 512; 
  var ytileindex = (y - (y % 512)) / 512;  
  var tmpti = 0;
  var tx,ty;
  for(var i =0; i< orbit.xtiles; i++){
    for(var j =0; j< orbit.ytiles; j++){
		// this tile index
		tx = i*512;
		ty = j*512;
		//tmpti = ((((i % 3)+((j % 2)*3))+xtileindex) % 6); // 2 rows with 3 tiles each, + offset over the max numbe rof tiles
		tmpti = (((i+xtileindex) % 3)+(((j+ytileindex)% 2)*3));
		ctx.drawImage(bgTiles[tmpti],tx-(x%512),ty-(y%512));
    }     
  }
}

var warpZ = 25,
units = 5,
stars = [],
cycle = 0,
Z = 0.035 + (1/25 * 2);

// setup aliases
var Rnd = Math.random,
Sin = Math.sin,
Floor = Math.floor;

// function to reset a star object
function resetstar(a)
{
	a.x = (-20+(Math.random()*40)) * warpZ; // start pos
	a.y = (-10+(Math.random()*30)) * warpZ; // start pos
	a.z = 2+Math.random()*2;
	a.px = 0; //ass.x+(Math.random()*2);
	a.py = 0; //ass.y+(Math.random()*2);
}
	


function gameWarp(){
// mouse position to head towards
		var cx = ass.x+60;
		cy = (canvas.height/2);
   
		// update all stars
		var sat = Floor(Z * 500);       // Z range 0.01 -> 0.5
		if (sat > 100) sat = 100;
		for (var i=0; i<units; i++)
		{
			var n = stars[i],            // the star
			xx = n.x / n.z,          // star position
			yy = n.y / n.z,
			e = (0.5 / n.z + 1) * 2;   // size i.e. z
			xx -= (n.z*20);
      
			if (n.px !== 0)
			{
				// hsl colour from a sine wave
				//ctx.strokeStyle = "hsl(" + ((cycle * i) % 360) + "," + sat + "%,80%)";
				ctx.strokeStyle = "rgb(200,200,200)";
				ctx.lineWidth = e;
				ctx.beginPath();
				ctx.moveTo(xx + cx, yy + cy);
				//ctx.lineTo(n.px + cx, n.py + cy);
				ctx.lineTo(xx + cx, yy + cy + 3);
				ctx.stroke();
			}
      
			// update star position values with new settings
			n.px = xx;
			n.py = yy;
			if(orbit.bullettimepercentage>0){
			  n.z -= (Z * ((120 - (orbit.bullettimepercentage))/100));	
			}else{
			  n.z -= Z*1.2;
			}
      
			// reset when star is out of the view field
			if (n.z < Z || n.px > canvas.width || n.py > canvas.height)
			{
				// reset star
				resetstar(n);
			}
		}
   
   // colour cycle sinewave rotation
   cycle += 0.01;
}

var gameUpdate = function (modifier) {
	if (37 in keysDown) { //left
		ass.x -= ass.speed * modifier;
		if(ass.x<0) ass.x = 0;
	}
	if (39 in keysDown) { //right
		ass.x += ass.speed * modifier;
		if((ass.x+50)>canvas.width) ass.x = canvas.width-50;
	}
	
	orbit.distance += (((ass.x+50)-canvasxc)/10000);
	if(orbit.distance<0){ gameDead();  }
	if(orbit.distance>100){ gameDead(); }
	
	if(planet.alive){
	   orbit.bullettime = true;	
	   orbit.bullettimeup = true;
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
	//alert(modifier);
	//alert(orbit.angle);
	if(orbit.bullettime == false){
	  ass.angle += 0.05*modifier; 
      orbit.angle -= 15*modifier; 
	}else{
	  // dit is bullettime		
	  if(orbit.bullettimeup){
		  orbit.bullettimepercentage+=150*modifier;
		  if(orbit.bullettimepercentage>100) orbit.bullettimepercentage = 100;
	  }else{
		  orbit.bullettimepercentage-=150*modifier;
		  if(orbit.bullettimepercentage <= 1){ orbit.bullettimepercentage = 0; orbit.bullettime = false; }		  
	  } 
	  if(orbit.bullettimepercentage>0){
	    orbit.angle -= (15*modifier)*((100-orbit.bullettimepercentage)/100);
	    ass.angle += (0.05*modifier)*((100-orbit.bullettimepercentage)/100); 
	  }
	}
	// overbound
	if(ass.angle>1){ ass.angle -= 1; }
	if(orbit.angle<0){ orbit.angle += 100; }
	
};

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
 	// far planet
    //drawTiledBackground(Math.round(orbit.angle*5120),0); // dat is zodat we 512 loopen
	drawTiledBackground(Math.round(orbit.angle*30.72),0);
	
	// far approach lines
	/*lx = ass.x+60;
	ly = ass.y+60;
	ctx.beginPath();
	for(var i = 1; i < 20; i++){
	  
      ctx.moveTo(lx,ly);
	  lx -= (i*5);
	  ly = (ass.y+60)-Math.sqrt(i*2000);
      ctx.lineTo(lx,ly);
      
	  
	}
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'red';
	ctx.stroke(); */
	
	
	// sterren
	gameWarp();
	
	//Sunglow
	ctx.drawImage(glowImage, -30, canvas.height/2 - 100);
	
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
	 ctx.fillText("Angle: " + orbit.angle, 32, 140);
	 ctx.fillText("bullatp: " + orbit.bullettimepercentage, 32, 170);
	 ctx.fillText("distance: " + orbit.distance, 32, 200);
	 if(orbit.bullettime){
	   ctx.fillText("FUCKING BULLETTIME", 36-(Math.random()*8), 100-(Math.random()*8));	 
	 }
	// close approach lines
	/*lx = ass.x+60;
	ly = ass.y+60;
	ctx.beginPath();
	for(var i = 1; i < 35; i++){
	  
      ctx.moveTo(lx,ly);
	  lx -= (i*5);
	  ly = (ass.y+60)+Math.sqrt(i*2000);
      ctx.lineTo(lx,ly);
      
	  
	}
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'red';
	ctx.stroke(); */
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

function gameDead(){
	ass.lives--;
	if(ass.lives>-1){
	  gameStart()	
	}else{
	  gameOver();
	}
}

function gameOver(){
	switchScreen(menuLoad,true);
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

