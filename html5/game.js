
/* ======================================  
                ALL VARIABLES
 ========================================*/
var canvas; var ctx;
var gameMusic = true;

var ass = {
	speed: 0,
	x: 0,
	y: 0,
	angle:0,
	w: 88,
	h: 80,
	lives: 2
};

//Enum for all types of planets
var PlanetEnum = Object.freeze({"Arid":0, "Caldonia":1, "Cold":2, "Dead":3, "Drye":4, "PostIndustrial":5, "GasGiant":6, "Ice":7, "Earth1":8, "Earth2":9, "Fire":10, "SmallGas":11, "Waterless":12});
var planetImages = new Array();

var planet = {
	x: 0,
	y: 0,
	size: 0,
	calcsize: 0,
	w:120,
	h:120,
	alive: true,
	exploding: -1,
	angle: 0,
	calcangle: 0,
	distance: 0,
	type: 0,
	visible: false
};

var planets = new Array(); 

var orbit = {
  xtiles: 0, // number of x tiles that span the screen
  ytiles: 0, //  number of y tiles that span the screen
  angle: 0, // astroids angle in orbit
  distance: 50, // astroids distance from the sun	
  bullettime: false, // bullet
  bullettimepercentage: 0, // percentage 0..1
  bullettimeup: true, // direction
  planetinview: false, // when this is true see if planets need to be drawn
  planetlastcheck: 0, // only check every 100 ms or so
  speed: 1 // used for bullettime and sun distance
}

var planetsDestroyed = 0;
var canvasxc, canvasyc;
var fps = 0; var fpscounter = 0; var fpscount = 0;
var then;
var keysDown = {};
var detailedParticles = true;
var radarAngle = 0;
var ox, oy;  //offsets x en y voor dat lekkere explosie effect
// particles
var particles = [];
var particle_count = 1000;
// images
var loader, assImage, planetImage, starImage, bgImage, parImage, explode1Image, explode2Image, bgTiles, assFrames;
// stars
var warpZ = 25,
units = 20,
stars = [],
cycle = 0,
Z = 0.035 + (1/25 * 2);
var Rnd = Math.random,
Sin = Math.sin,
Floor = Math.floor;

/* ======================================  
           GAME LOAD / RESETS
 ========================================*/

// preload images
function gameLoad(){  // init loader
	var loader = new PxLoader();
	bgTiles = Array();
	for(var i = 0; i < 6; i++){ bgTiles[i] = loader.addImage('images/game/space_'+i+'.png'); }
	assFrames = loader.addImage('images/game/ass_sprite.png'); 
	planetImage = loader.addImage('images/game/planet.png'); 
	starImage = loader.addImage('images/game/star.png');
	bgImage = loader.addImage('images/game/bg.jpg');
	parImage = loader.addImage('images/game/1.png');
	explodeImage1 = loader.addImage('images/game/explode.png');
	explodeImage2 = loader.addImage('images/game/ring.png');
	glowImage = loader.addImage('images/game/glow.png');
	
	asteroidMiniImage = loader.addImage('images/game/asteroid.png');
	
	radarbgImage = loader.addImage('images/game/radarbg.png');
	radarlineImage = loader.addImage('images/game/radarline.png');
	powerupImage = loader.addImage('images/game/powerup.png');
	speedImage = loader.addImage('images/game/speed.png');
	speedfillImage = loader.addImage('images/game/speedfill.png');   //USELESS NEEDS PROPER BAR
	livesImage = loader.addImage('images/game/lives.png');
	lifeImage = loader.addImage('images/game/life.png');
	statsImage = loader.addImage('images/game/stats.png');
	orbitImage = loader.addImage('images/game/orbit.png');
	orbitfillImage = loader.addImage('images/game/orbitfill.png');   //USELESS NEEDS PROPER BAR
	
	
	fireImage = loader.addImage('images/game/powerups/fire.png');
	iceImage = loader.addImage('images/game/powerups/ice.png');
	scoreImage = loader.addImage('images/game/powerups/score.png');
	nostopImage = loader.addImage('images/game/powerups/nostop.png');
	
	//Add all planets
	planetImages.push(loader.addImage('images/game/planets/Arid_World.png'));
	planetImages.push(loader.addImage('images/game/planets/Caldonia.png'));
	planetImages.push(loader.addImage('images/game/planets/Cold_World.png'));
	planetImages.push(loader.addImage('images/game/planets/Dead_World.png'));
	planetImages.push(loader.addImage('images/game/planets/Drye.png'));
	planetImages.push(loader.addImage('images/game/planets/Global_Warming.png'));
	planetImages.push(loader.addImage('images/game/planets/High_Winds.png'));
	planetImages.push(loader.addImage('images/game/planets/Ice_Planet.png'));
	planetImages.push(loader.addImage('images/game/planets/Mostly_Harmless.png'));
	planetImages.push(loader.addImage('images/game/planets/Nu_Earth.png'));
	planetImages.push(loader.addImage('images/game/planets/Pyrobora.png'));
	planetImages.push(loader.addImage('images/game/planets/Small_Gas_Giant.png'));
	planetImages.push(loader.addImage('images/game/planets/Waterless_World.png'));
	
	loader.addCompletionListener(function(){ gameBegin(); });
	loader.start();
}

var gameStart = function () { // TODO: get called only once
	ass.x = (canvas.width /2);
	ass.y = (canvas.height /2);
	ass.angle = 0;
	ass.speed = 400;
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
	// load level
	loadLevel1();
	
	addEventListener("keydown", function (e) { keysDown[e.keyCode] = true; }, false);
	addEventListener("keyup", function (e) { delete keysDown[e.keyCode]; }, false);
};


function gameBegin(){ // TODO: init game vars only, can be called to reset
	// start
	//gamePlanetReset();
	ass.lives = 2; // extra lives
	gameStart();
	then = Date.now();
	timer = setInterval(gameMain, 1);
	InitPlaylist(2); // 1 = menu, 2 is game;
	gameMain();
	canvasShow();
}

/* ======================================  
           NORMAL GAME FUNCTIONS
 ========================================*/

function drawExplodingPlanet(p){
    var n = p.exploding;	
  var i = Math.round(n);	
  drawScaled(explodeImage2,p.x-250,p.y-250,500,500,n/3);
  ctx.drawImage(explodeImage1,0,i*240,240,240,p.x-120,p.y-120,240,240);	
}

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

function resetstar(a){ // function to reset a star object
	a.x = (-20+(Math.random()*40)) * warpZ; // start pos
	a.y = (-10+(Math.random()*30)) * warpZ; // start pos
	a.z = 2+Math.random()*2;
	a.px = 0; //ass.x+(Math.random()*2);
	a.py = 0; //ass.y+(Math.random()*2);
}
	
/* ======================================  
           SUB RENDER FUNCTIONS
 ========================================*/

function gameWarp(){ // warp star effect
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
		  ctx.strokeStyle = "rgb(200,200,200)";
		  ctx.lineWidth = e;
		  ctx.beginPath();
		  ctx.moveTo(xx + cx, yy + cy);
		  ctx.lineTo(xx + cx, yy + cy + 3);
		  ctx.stroke();
	  }
  
	  // update star position values with new settings
	  n.px = xx;
	  n.py = yy;
	  if(orbit.bullettimepercentage>0){
		n.z -= (Z * (orbit.speed*100));	
	  }else{
		n.z -= Z*120;
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

function minimapRender(performanceLevel){
	planetCollision = -1;
	 for(var i = 0; i < planets.length; i++){
		//If planet exists
		 if((planets[i] != null) && (planets[i].alive))
		 {
			 miniplanetx = ((planets[i].distance/1.5) * -Math.cos(((1-planets[i].angle)/100)*6.28318531)) + 83;
			 miniplanety = ((planets[i].distance/1.5) * Math.sin(((1-planets[i].angle)/100)*6.28318531)) + (canvas.height-84);
			 //debugLine(0,miniplanety,canvas.width,miniplanety,'red');
			 ctx.beginPath();
			 //ctx.fillStyle ="#000000";
			 ctx.strokeStyle ="#00ff00";
			 //Give it blip effect
			 angleDiff = orbit.angle - planets[i].angle;
			 if(angleDiff < 0 && angleDiff > -10)
			 {
				ctx.lineWidth= 3 + Math.sin((Math.abs(angleDiff)/10)*3.14159265359)*3;
			 }
			 else
			 {
				ctx.lineWidth=3;
			 }
			 ctx.arc(miniplanetx, miniplanety, 1, 0, 6.28318531, false);
			 ctx.stroke();
			 ctx.closePath();
			
			 if(Math.abs(orbit.distance - planets[i].distance) < 1.2)
			 {
				 planetCollision = i;
			 }
		 }
	 }
	
	//Calculate and draw orbit path
	miniassx = ((orbit.distance/1.5) * -Math.cos(((100-orbit.angle)/100)*(6.28318531))) + 78;
	miniassy = ((orbit.distance/1.5) * Math.sin(((100-orbit.angle)/100)*(6.28318531))) + canvas.height - 89;
		
	ctx.beginPath();
	ctx.lineWidth=1;
	ctx.arc(83,canvas.height - 84, orbit.distance/1.5, 0, 6.28318531, false);
	if(planetCollision == -1){
		ctx.strokeStyle = "white";
	}else{
		//Draw collision course
		ctx.strokeStyle = "red";
	}
	ctx.stroke();
	ctx.closePath();
		
	// Draw radar line
	var currentTime = new Date();
	
	if(performanceLevel < 2)
	{
		radarx = (75 * Math.cos(currentTime.getTime()/1000) + (83));
		radary = (75 * Math.sin(currentTime.getTime()/1000)) + canvas.height-84;		
		ctx.beginPath();
		ctx.strokeStyle = "rgba(0, 255, 0, 0.3)";
		ctx.lineWidth=1;
		ctx.moveTo(83,canvas.height - 84);
		ctx.lineTo(radarx, radary);
		ctx.closePath();
		ctx.stroke();
		
	}
	else
	{
		//Rotation
		if(radarAngle >= 1)
		{
			radarAngle = 0;
		}
		radarAngle += 0.005;
		drawImageRotated(radarlineImage, 7, demHeight - 159, 150, 150, (((orbit.angle+75)%100)/100) * 6.28318531);
		//drawImageRotated(radarlineImage,6,canvas.height-8-radarlineImage.height,radarlineImage.width,radarlineImage.height,radarAngle*6.28318531);
	}
	
	//Draw asteroid in orbit
	ctx.drawImage(asteroidMiniImage, miniassx, miniassy, 10, 10);
}
	
function gameDrawPlanet(i){
    var p = planets[i];		
	var size = 0;
	drawScaled(planetImages[p.type], p.x-60,  p.y-60, planet.w,planet.h,p.calcsize); 
	planetIndicator(p.x+60, p.y-120, p.type, 10000000, 75, "Je moeder", true, 2);
}

function planetIndicator(x, y, type, population, requiredSpeed, name, left, performanceLevel)
{
	sizeX = 200;
	sizeY = 75;

	//Draw border
	ctx.beginPath();
	ctx.lineWidth=1;
	ctx.strokeStyle = "green";
	ctx.rect(x, y, sizeX, sizeY);
	ctx.fillStyle = "rgba(0, 255, 0, 0.15)";
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
	
	//Draw pointing line thingie
	ctx.beginPath();
	if(left)
	{
		ctx.moveTo(x, y + sizeY);
		ctx.lineTo(x - 10, y + sizeY + 5);
	}
	else
	{
		ctx.moveTo(x + sizeX, y + sizeY);
		ctx.lineTo(x + sizeX + 10, y + sizeY + 5);
	}
	ctx.stroke();
	ctx.closePath();
		
	//Draw prestige scanlines
	for(i = 0; performanceLevel == 2 && i < sizeY/7; i++)
	{
		ctx.beginPath();
		ctx.strokeStyle = "rgba(0, 255, 0, 0.04)";
		ctx.moveTo(x, y + i*7);
		ctx.lineTo(x + sizeX, y + i*7);
		ctx.stroke();
		ctx.closePath();
	}
		
	//Write generic stuff
	ctx.font = 'bold 8pt Arial Black';
	ctx.fillStyle = 'Green'
	ctx.fillText('Name', x + 10, y + 8);
	ctx.fillText('Type', x + 10, y + 24);
	ctx.fillText('Pop', x + 10, y + 40);
	ctx.fillText('Speed', x + 10, y + 56);
		
	//Write actual values
	ctx.fillText(name, x + 100, y + 8);
	ctx.fillText(type, x + 100, y + 24);
	ctx.fillText(population, x + 100, y + 40);
	
	//Add progressbar
	ctx.beginPath();
	ctx.strokeWidth=1;
	ctx.strokeStyle = "green";
	ctx.rect(x + 100, y + 60, (requiredSpeed/100)*(sizeX - 110), 8);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

function gameDrawAsstroid(){
    var n = Math.floor(ass.angle);		
  //drawScaled(explodeImage2,(planet.x-190)+(60*planet.size),(planet.y-250)+(60*planet.size),500,500,n/2);
  ctx.drawImage(assFrames,0,n*80,80,80,ass.x-40,ass.y-40,80,80);	
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

/* ======================================  
           LOOPING FUNCTIONS
 ========================================*/
 
var gameMain = function () {
	var now = Date.now();
	var delta = (now - then)/1000;
	gameUpdate(delta);
	gameRender(delta);
	then = now;	
	fpscounter += delta; fpscount++;
	if(fpscounter>1){ fpscounter -= 1; fps = fpscount; fpscount = 0; }
}; 

var gameUpdate = function (modifier) { // modier is in seconds
    // key input + ass movement
	if (37 in keysDown) { //left
		ass.x -= ass.speed * modifier;
		if(ass.x<0) ass.x = 0;
	} else
	if (39 in keysDown) { //right
		ass.x += ass.speed * modifier;
		if((ass.x+50)>canvas.width) ass.x = canvas.width-50;
	}else if (27 in keysDown) {
        gamePlaying = true;
  		menuPlayClick();
  		switchScreen(optionLoad, false);
    }
	// update distance, push asstroid to middle
	if(!orbit.bullettime){
	  orbit.distance += ((ass.x-canvasxc)/30000); 
	  if(orbit.distance<0){ gameDead();  } 
	  if(orbit.distance>100){ gameDead(); }
	
	  // push asstroid to middle
	  if(ass.x<canvasxc){ ass.x += 35*modifier; if(ass.x>canvasxc) ass.x = canvasxc; }
	  if(ass.x>canvasxc){ ass.x -= 35*modifier; if(ass.x<canvasxc) ass.x = canvasxc; }
	}
	// check if planets are near every 100 ms
	if(orbit.planetlastcheck>0){
	  orbit.planetlastcheck = 0;	
	  orbit.planetinview = false;	
	  orbit.bullettimeup = false;
	  for(var i=0; i<planets.length; i++){
		var p = planets[i];  
	    if(
		  (p.alive) && 
		  (p.angle<(orbit.angle+0.5)) && 
		  (p.angle>(orbit.angle-6)) && 
		  (p.distance<(orbit.distance+2)) && 
		  (p.distance>(orbit.distance-2)) 
		){
		  p.visible = true;	
		  var pdist = (p.distance-orbit.distance);
		  p.x = canvasxc+(pdist*(canvas.width/2));
		  orbit.planetinview = true;
		  orbit.bullettime = true; 
		  orbit.bullettimeup = true;	
		}else{
		  p.visible = false;	
		}
	  }
	}else{ orbit.planetlastcheck += modifier; } // add time
	// if planets are near or in bullettime check for colission
	if((orbit.planetinview) || (orbit.bullettime)){
		for(var i=0; i<planets.length; i++){
	    	var p = planets[i];
		 	// get angle difference
		 	p.calcangle = p.angle - orbit.angle;
		 	if(p.calcangle>100) p.calcangle -= 100;
		 	if(p.calcangle<-100) p.calcangle += 100;
		 	if(p.calcangle<0.1){
	        	p.calcsize = (((p.calcangle*2)+1));
	       		if(p.calcsize<0){ p.calcsize = 0.0; }  
	     	}else{
	       		p.calcsize = ((p.calcangle*2)+1);
			}		 
		 	if((p.calcangle<0.01) && (p.calcangle>-0.01) && (p.visible)){ // colission
			    if ((ass.x-40) <= (p.x+(60*p.calcsize)) && (ass.x+40) >= (p.x-(60*p.calcsize)) ) { // todo, make real
					var dx = ((p.x-ass.x)/50);
					var dy = (((p.y+(p.h/2))-(ass.y+(ass.h/2)))/30);
					planetsDestroyed++;
					p.alive = false;
					p.exploding = 0;
					for(var i = 0; i< particle_count;i++){ particles.push(new particle(p.x,p.y,dx,dy)); }
					gamePlayExplosion();
			
		  		}
			}
		} 
	}
	// orbit and ass angle;
	if(orbit.bullettime == false){
	  ass.angle += 25*modifier; 
      orbit.angle -= 15*modifier;
	  orbit.speed = 1; 
	}else{
	  // dit is bullettime		
	  if(orbit.bullettimeup){
		  orbit.bullettimepercentage+=1.5*modifier;
		  if(orbit.bullettimepercentage>1) orbit.bullettimepercentage = 1;
	  }else{
		  orbit.bullettimepercentage-=1.5*modifier;
		  if(orbit.bullettimepercentage <= 0){ orbit.bullettimepercentage = 0; orbit.bullettime = false; }		  
	  } 
	  orbit.speed = (1-(orbit.bullettimepercentage*0.99));
	  
	  if(orbit.bullettimepercentage>0){
	    orbit.angle -= (15*modifier)*orbit.speed;
	    ass.angle += (25*modifier)*orbit.speed; 
	  }
	}
	// overbound
	if(ass.angle>=60){ ass.angle -= 60; }
	if(orbit.angle<0){ orbit.angle += 100; }
};

var gameRender = function(delta) {
	// calculate shake effect in hyperspeed and explosion
	if(planet.exploding>-1){  //offsets x en y voor dat lekkere explosie effect
	  ox = -10+(Math.random()*20); oy = -10+(Math.random()*20);	
	}else{
	  ox = 0; oy = 0;	
	} 
	// hyperspeed
	if(orbit.bullettime==false){  //offsets x en y voor dat lekkere speed effect
	  ox = -2+(Math.random()*4); oy = -2+(Math.random()*4);	
	}else{
	  ox = 0; oy = 0;	
	}
 	// draw tiled background
	drawTiledBackground(Math.round(orbit.angle*30.72),0);  // dat is zodat we 512*3 loopen	
	// draw stars coming at you
	if(orbit.bullettime){
	  gameWarp();
	}
	// draw sun glow
	glowx = -(orbit.distance*3);
	ctx.drawImage(glowImage, glowx, 0, glowImage.width/2, canvas.height);
	// draw planet
	if((orbit.planetinview) || (orbit.bullettime)){
	  for(var i = 0; i < planets.length; i++){ 
	    var p = planets[i];
 	    if(p.visible){ 
		  gameDrawPlanet(i); 
		  debugLine(p.x+(60*p.calcsize),0,p.x+(60*p.calcsize),canvas.height,"blue");
		  debugLine(p.x-(60*p.calcsize),0,p.x-(60*p.calcsize),canvas.height,"blue"); 
		  debugLine(ass.x+40,0,ass.x+40,canvas.height,"red");
		  debugLine(ass.x-40,0,ass.x-40,canvas.height,"red");
		}
		
		l(p.calcsize);
	    
	    // chunks
        if((p.alive==false) && (p.exploding>-1) && (p.exploding<5)){
	      p.exploding += (delta*15); 
	      drawExplodingPlanet(p); 
        }else{
	      p.exploding = -1;	 
        }
	  }
	  // draw asteroid alone , over or under? <- TODO
	  gameDrawAsstroid();
	  //drawImageRotated(assImage,(ass.x+ox)-50,(ass.y+oy)-71,ass.w,ass.h,ass.angle*6.28318531); 
	}else{
      // draw asteroid alone
	 gameDrawAsstroid(); //drawImageRotated(assImage,(ass.x+ox)-50,(ass.y+oy)-71,ass.w,ass.h,ass.angle*6.28318531); 
	}
    // update and draw explosion particles
    var f = false;
 	for(var i = 0; i < particles.length;i++){
  		var p = particles[i];
  		if(p!=null){
   			f = true;
   			p.opacity = (p.remaining_life/p.life);

            ctx.drawImage(parImage,p.location.x,p.location.y); // images zijn sneller
   			
    		p.remaining_life -= (delta*70);
    		p.radius += (delta*10);
    		p.location.x += (p.speed.x*(delta*220));
   		 	p.location.y += (p.speed.y*(delta*220));
    		if(p.remaining_life < 0 || p.radius > 400){ particles[i] = null; } 
  		}	
 	}
    if((f!=true) && (particles.length>0)){ particles = Array(); }
    // draw debug text
	drawDebugText();
	
	
	
    //Draw HUD
  	ctx.drawImage(radarbgImage, 6, demHeight - 160);
	ctx.drawImage(speedfillImage, 130 , demHeight - 160);  //USELESS NEEDS PROPER BAR
	ctx.drawImage(speedImage, 130 , demHeight - 160);
	ctx.drawImage(powerupImage, 168 , demHeight - 118);
	
	ctx.drawImage(livesImage, 290, demHeight - 160);
	ctx.drawImage(lifeImage, 290, demHeight - 160);
	ctx.drawImage(statsImage, 290, demHeight - 118);
	ctx.drawImage(orbitImage, 290, demHeight - 33)
	ctx.drawImage(orbitfillImage, 290, demHeight - 33) //USELESS NEEDS PROPER BAR
	
	//FIRE, ICE, NOSTOP, SCORE
	ctx.drawImage(fireImage, 173, demHeight - 113);
	
  	ctx.font = "12px Rock";
  	minimapRender(2);
  	ctx.fillStyle = "rgb(20, 105, 5)";	
	ctx.fillText("POWERUP", 173, demHeight - 127);
	ctx.fillText("SPEED", 143, demHeight - 170);
	ctx.fillText("LIVES", 303, demHeight - 169);
	ctx.fillText("STATS", 303, demHeight - 127);
	ctx.fillText("ORBIT", 303, demHeight - 43);
	
	ctx.font = "14px Rock";
	ctx.fillText("4", 263, demHeight - 20); //POWERUP TIME LEFT
	ctx.fillText("SCORE: " + "2897546235", 295, demHeight - 110);
	ctx.fillText("PLANETS HIT: " + planetsDestroyed, 295, demHeight - 95);
	ctx.fillText("JUNK HIT: " + "5", 295, demHeight - 80);
	ctx.fillText("LIVES LOST: " + "0", 295, demHeight - 65);
}

/* ======================================  
           DEBUG FUNCTIONS
 ========================================*/

function drawDebugText(){
   ctx.fillStyle = "rgb(250, 250, 250)";
   ctx.font = "24px Arial";
   ctx.textAlign = "left";
   ctx.textBaseline = "top";
   ctx.fillText("Planets annihilated: " + planetsDestroyed, 32, 32);
   ctx.fillText("FPS: " + fps, 32, 64);
   ctx.fillText("Angle: " + Math.round(orbit.angle)+" AssAngle :"+Math.round(ass.angle), 32, 140);
   ctx.fillText("bullatp: " + Math.round(orbit.bullettimepercentage*100), 32, 170);
   ctx.fillText("distance: " + Math.round(orbit.distance), 32, 200);
   ctx.fillText("Lives: " + ass.lives, 32, 230);
   ctx.fillText("Planet x: " + Math.round(planet.x)+" Planet y: "+Math.round(planet.y), 32, 260);
   ctx.fillText("Planet in view: " + orbit.planetinview, 32, 290);
   ctx.fillText("p dist: " + Math.round(planets[0].distance)+" p angle: "+planets[0].angle+' p alive: '+planets[0].alive+' calcangle: '+Math.round(planets[0].calcangle)+' P.exp:'+Math.round(planets[0].exploding), 32, 320);
   if(orbit.bullettime){
	 ctx.fillText("FUCKING BULLETTIME", 36-(Math.random()*8), 100-(Math.random()*8));	 
   }	
}

function debugLine(x1,y1,x2,y2,color){
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke(); 	
}
	
function particle(x,y,dx,dy){
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

/* ======================================  
           SOUND FUNCTIONS
 ========================================*/

function gamePlayExplosion(){
	if(soundManager.getSoundById('explosion').playState==1){ soundManager.getSoundById('explosion').stop();	}
    soundManager.setVolume('explosion',Math.round(effectsVolume*0.3));
    soundManager.play('explosion',{ onfinish: function() { } });	
}

/* ======================================  
         LEVEL LOADING FUNCTIONS
 ========================================*/

function loadLevel1(){
    planet.alive = true;
    planet.angle = 40;
    planet.distance = 50;
    planet.size = 1;
    planet.h = 120;
    planet.w = 120;
    planet.y = canvasyc;
    planet.x = canvasxc;
    planets.push($.extend(true, {}, planet));
	planet.distance = 44;
	planet.angle = 70;
	planet.type = Math.round(Math.random()*12);
	planets.push($.extend(true, {}, planet));
	planet.distance = 50;
	planet.angle = 90;
	planet.type = Math.round(Math.random()*12);
	planets.push($.extend(true, {}, planet));
	planet.distance = 67.9;
	planet.angle = (Math.random()*60)+20;
	planet.type = Math.round(Math.random()*12);
	planets.push($.extend(true, {}, planet));
	planet.distance = 20;
	planet.angle = (Math.random()*60)+20;
	planet.type = Math.round(Math.random()*12);
	planets.push($.extend(true, {}, planet));
}



