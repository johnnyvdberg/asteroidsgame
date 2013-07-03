
/* ======================================  
                ALL VARIABLES
 ========================================*/
var canvas; var ctx;
var gameMusic = true;
var junkhit = 0;
var score = 0;
var gear = 0;
var powerup = 2;
var poweruptime = 9;
var bullettimesound = false;

var ass = {
	speed: 0,
	x: 0,
	y: 0,
	angle:0,
	w: 80,
	h: 80,
	lives: 2,
	exploding: -1,
	alive: true
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
	visible: false,
	pop: 0,
	name: "Undefined",
	indicator: false
};

var asstroid = {
  ox: 0, oy: 0, x: 0, y:0, size: 0, spawntimer: 5, alive: false, explosion: -1, xoffset: 0, yoffset: 0
}

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
  speed: 1, // used for bullettime, drawing
  velocity: 100 // used for calculations
  
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
var loader, assImage, planetImage, starImage, bgImage, parImage, explode1Image, explode2Image, bgTiles, assFrames, smallExplodeImage, warningImage, deathImage;
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
	parIceImage = loader.addImage('images/game/ice.png');
	explodeImage1 = loader.addImage('images/game/explode.png');
	explodeImage2 = loader.addImage('images/game/ring.png');
	glowImage = loader.addImage('images/game/glow.png');
	smallExplodeImage = loader.addImage('images/game/smallring.png');
	warningImage = loader.addImage('images/game/warning.png');
	deathImage = loader.addImage('images/game/death.png');
	asteroidMiniImage = loader.addImage('images/game/asteroid.png');
	
	//displayImage = loader.addImage('images/game/display.png');
	radarbgImage = loader.addImage('images/game/radarbg.png');
	radarlineImage = loader.addImage('images/game/radarline.png');
	powerupImage = loader.addImage('images/game/powerup.png');
	speedImage = loader.addImage('images/game/speed.png');
	livesImage = loader.addImage('images/game/lives.png');
	lifeImage = loader.addImage('images/game/life.png');
	statsImage = loader.addImage('images/game/stats.png');
	orbitImage = loader.addImage('images/game/orbit.png');
	
	
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
	planetImages.push(loader.addImage('images/game/planets/Pyrobora.png'));
	planetImages.push(loader.addImage('images/game/planets/Waterless_World.png'));
	planetImages.push(loader.addImage('images/game/planets/Global_Warming.png'));
	planetImages.push(loader.addImage('images/game/planets/Mostly_Harmless.png'));
	planetImages.push(loader.addImage('images/game/planets/Nu_Earth.png'));
	planetImages.push(loader.addImage('images/game/planets/Ice_Planet.png'));
	planetImages.push(loader.addImage('images/game/planets/Small_Gas_Giant.png'));
	planetImages.push(loader.addImage('images/game/planets/High_Winds.png'));
	
	
	loader.addCompletionListener(function(){ gameStart(); });
	loader.start();
}

var gameStart = function () { // TODO: get called only once
	canvasxc = canvas.width/2;
	canvasyc = canvas.height/2;
	// cals number of tiles
	orbit.xtiles = Math.ceil(canvas.width/512)+1;
	orbit.ytiles = Math.ceil(canvas.height/512)+1;
	ass.lives = 3; // extra lives
	junkhit = 0;
	score = 0;
	
	addEventListener("keydown", function (e) { keysDown[e.keyCode] = true; }, false);
	addEventListener("keyup", function (e) { delete keysDown[e.keyCode]; }, false);
	
	gameBegin();
	
	timer = setInterval(gameMain, 1);
};

var gameResume = function (){
  timer = setInterval(gameMain, 1);	
}


function gameBegin(){ // TODO: init game vars only, can be called to reset
	ass.x = (canvas.width /2);
	ass.y = (canvas.height /2);
	ass.angle = 0;
	ass.speed = 600;
	ass.exploding = -1;
	ass.alive = true;
	orbit.angle = 0; orbit.distance = 50; // reset position
	orbit.bullettimepercentage = 0; orbit.bullettime = false; orbit.bullettimeup = true; // reset bullettime
	orbit.velocity = 100; 
	resetEnemyAsstroid();
    //init stars
	for (var i=0, n; i<units; i++){
		n = {};
		resetstar(n);
		stars.push(n);
	}
	// load level
	loadLevel1();

	// start
	//gamePlanetReset();
	then = Date.now();
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
  if(powerup != 2){
  	drawScaled(explodeImage2,p.x-250,p.y-250,500,500,n/3);
 	ctx.drawImage(explodeImage1,0,i*240,240,240,p.x-120,p.y-120,240,240);
  }
}

function drawExplodingEnemyAsstroid(){
  var n = asstroid.explosion;
  drawScaled(smallExplodeImage,asstroid.x-137,asstroid.y-132,275,267,n);
}

function drawExplodingAsstroid(){
  var n = ass.exploding;		
  if(n<5){
    drawScaled(smallExplodeImage,ass.x-137,ass.y-132,275,267,n/3);
  }
  if((n>4)&&(n<10)){
	drawScaled(deathImage,ass.x-150,ass.y-250,300,500,(n-4)/3);  
  }
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
		  if(powerup == 1){ctx.lineWidth = e * 1.5; ctx.strokeStyle = "rgb(200,0,0)"; }else{ctx.lineWidth = e; ctx.strokeStyle = "rgb(200,200,200)"; }
		  ctx.beginPath();
		  ctx.moveTo(xx + cx, yy + cy);
		  ctx.lineTo(xx + cx, yy + cy + 3);
		  ctx.stroke();
	  }
  
	  // update star position values with new settings
	  n.px = xx;
	  n.py = yy;
	  if(orbit.bullettimepercentage>0){
		n.z -= (Z * (orbit.speed*1));	
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
			 angleDiff = getAngleDifference(orbit.angle,planets[i].angle);
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
			
			 if(Math.abs(orbit.distance - planets[i].distance) < 0.8)
			 {
				 planetCollision = i;
			 }
		 }
	 }
	
	//Calculate and draw orbit path
	if(orbit.distance>0){
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
	}
		
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
	if(p.alive){		
	  drawScaled(planetImages[p.type], p.x-60,  p.y-60, planet.w,planet.h,p.calcsize); 
	  if(p.calcsize<1){ gameDrawAsstroid(); }
	}
}

function planetIndicator(p, type, population, requiredSpeed, name, left, performanceLevel)
{
    var sizeX = 225;
	var sizeY = 75;
	var x = p.x;
	var y = p.y-80;
	if(x<0){ x = 0; }
	if(x>(canvas.width-sizeX)){ x = canvas.width; }
	if(x<canvasxc){ left = true; }else{ left = false; }
	var xo = 0;
    //Draw pointing line thingie
	ctx.strokeStyle = "green";
    ctx.lineWidth=1;
	ctx.beginPath();
	ctx.moveTo(x, y + sizeY);
	ctx.lineTo(x, y + sizeY + 20);
    ctx.closePath();
	ctx.stroke();

	//Draw border
	ctx.beginPath();
	ctx.rect(x+xo, y, sizeX, sizeY);
	ctx.fillStyle = "rgba(0, 255, 0, 0.15)";
	ctx.fill();
    ctx.closePath();
	ctx.stroke();
		
	//Draw prestige scanlines
	for(i = 0; performanceLevel == 2 && i < sizeY/7; i++)
	{
		ctx.beginPath();
		ctx.strokeStyle = "rgba(0, 255, 0, 0.04)";
		ctx.moveTo(x + xo, y + i*7);
		ctx.lineTo(x + sizeX + xo, y + i*7);
		ctx.stroke();
		ctx.closePath();
	}
		
	//Write generic stuff
	ctx.font = 'bold 8pt Arial Black';
	ctx.fillStyle = 'Green'
	ctx.fillText('Name', x + 10 + xo, y + 8);
	ctx.fillText('Type', x + 10 + xo, y + 24);
	ctx.fillText('Pop', x + 10 + xo, y + 40);
	ctx.fillText('Speed', x + 10 + xo, y + 56);
		
	//Write actual values
	ctx.fillText(name, x + 100 + xo, y + 8);
	ctx.fillText(type, x + 100 + xo, y + 24);
	ctx.fillText(population, x + 100 + xo, y + 40);
	
	//Add progressbar
	ctx.beginPath();
	ctx.strokeWidth=1;
	ctx.strokeStyle = "green";
	ctx.rect(x + 100 + xo, y + 60, (requiredSpeed/100)*(sizeX - 110), 8);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

function gameDrawAsstroid(){
  var n = Math.floor(ass.angle);	
  if(ass.alive){	
  	//drawScaled(explodeImage2,(planet.x-190)+(60*planet.size),(planet.y-250)+(60*planet.size),500,500,n/2);
  	ctx.drawImage(assFrames,0,n*80,80,80,ass.x-40,ass.y-40,80,80);	  
  }else{
	drawExplodingAsstroid();
  }
}

function gameDrawEnemyAsstroid(){
  if(asstroid.alive){	
    var n = Math.floor(asstroid.size*10);	
    ctx.drawImage(assFrames,0,n*80,80,80,asstroid.x-40,asstroid.y-40,80*asstroid.size,80*asstroid.size);	
  }else{
	if(asstroid.explosion>-1){
	  drawExplodingEnemyAsstroid();	
	}
  }
}

function gameDead(){
	ass.exploding = 0;
    ass.alive = false;
}

function gameDeadEnd(){
	ass.lives--;
	if(ass.lives>-1){
	  gameBegin()	
	}else{
	  gameOver();
	}	
}

function gameOver(){
	l('gameover');
	switchScreen(menuLoad,true);
}

function scoreAdd(population, type, speedMult)
{
	//Calculate type bonus
	typeBonus = 0;
	if(type < 7)
	{
		typeBonus = 10000;
	}
	else if(type < 10)
	{
		typeBonus = 20000;
	}
	else
	{
		typeBonus = 50000;
	}
	tempScore = ((population/10000000) + typeBonus)*speedMult;
	
	//Randomize a bit because score system will seem more accurate, yeah right
	tempScore = Math.floor(tempScore*(0.95 + Math.random()*0.1));
	
	
	if(powerup == 1){
		score += (tempScore * 1.5);
	}else if(powerup == 4 || powerup == 2){
		score += (tempScore * 2);
	}else{
		score += tempScore;
	}
}

function resetEnemyAsstroid(){
  asstroid.ox = (Math.random()*(canvasxc*1.2))+(canvasxc/2); asstroid.oy = (Math.random()*(canvasyc*1.5))+(canvasyc/2);	
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
    // modieifer hangt as van velocity
	speedmodifier = modifier*((orbit.velocity/100));

    // key input + ass movement
	if (37 in keysDown) { //left
		ass.x -= ass.speed * modifier*1.5;
		if((ass.x-50)<0) ass.x = 0;
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
	  if(orbit.distance<0){ orbit.distance = 0; if(ass.alive){ gameDead(); } } 
	  if((orbit.distance>100) && (ass.alive)){ gameDead(); }
	
	  // push asstroid to middle
	  if(ass.x<canvasxc){ ass.x += 35*modifier; if(ass.x>canvasxc) ass.x = canvasxc; }
	  if(ass.x>canvasxc){ ass.x -= 35*modifier; if(ass.x<canvasxc) ass.x = canvasxc; }
	}
	
	// our dead astroid handeling
	if(ass.alive==false){
	  ass.exploding += (modifier*15);
	  if(ass.exploding>10){
		gameDeadEnd();  
	  }
	}
	// enemy astroid handeling
	if((asstroid.spawntimer>0) && (!asstroid.alive)){
	  // explosion
	  if(asstroid.explosion>-1){
		asstroid.explosion += (modifier*5);
		if(asstroid.explosion>1.5){ asstroid.explosion = -1; }  
	  }
	  asstroid.spawntimer -= modifier;
	  if(asstroid.spawntimer<0){
		asstroid.spawntimer = (Math.random()*8)+4; 
		asstroid.alive = true;
		asstroid.size = 0;
	  }
	  	
	}else{
	  asstroid.size += (speedmodifier*3);
	  if(asstroid.size>2){ 
	    asstroid.alive = false; 
		resetEnemyAsstroid();
	  }else{
		asstroid.x =  asstroid.ox + ((canvasxc-asstroid.ox)*asstroid.size);
		asstroid.y =  asstroid.oy + ((canvasyc-asstroid.oy)*asstroid.size);   
	  }
	  if((asstroid.size>1)&&(asstroid.size<1.3)){
	    if( (asstroid.x<(ass.x+80)) && asstroid.x>(ass.x-80)){
		  asstroid.alive = false;
		  asstroid.explosion = 0;
		  junkhit++;
		  
		  if(powerup != 3 || powerup != 1){
			  if(powerup == 2){
					if(difficulty == 0){ orbit.velocity -= ((orbit.velocity/100)*20)/2 + 15; }else 
					if(difficulty == 1){ orbit.velocity -= ((orbit.velocity/100)*25)/2 + 20 }else 
					if(difficulty == 2){ orbit.velocity -= ((orbit.velocity/100)*30)/2 + 25; }
				}else{
					if(difficulty == 0){ orbit.velocity -= ((orbit.velocity/100)*20) + 15; }else 
					if(difficulty == 1){ orbit.velocity -= ((orbit.velocity/100)*25) + 20;}else 
					if(difficulty == 2){ orbit.velocity -= ((orbit.velocity/100)*30) + 25; }
				}
		  }
		  resetEnemyAsstroid();
		}
	  }
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
		  (p.distance<(orbit.distance+4)) && 
		  (p.distance>(orbit.distance-4)) 
		){
		  
		  var pdist = (p.distance-orbit.distance);
		  btdist = -5.8*(orbit.velocity/100);
		  p.x = canvasxc+(pdist*(canvas.width/2));
		  p.indicator = true;
		  if(
			(p.alive) && 
			
			checkAngleDifference(p.angle,orbit.angle,btdist,0.5) && 
			(p.distance<(orbit.distance+0.7)) && 
			(p.distance>(orbit.distance-0.7)) 
		  ){
			p.visible = true;	
			orbit.planetinview = true;
			orbit.bullettime = true;
			orbit.bullettimeup = true;
		  }else{
			p.visible = false;  
		  }
		}else{
		  p.indicator = false;
		  p.visible = false;	
		}
	  }
	}else{ orbit.planetlastcheck += modifier; } // add time
	// if planets are near or in bullet time check for collision
	if((orbit.planetinview) || (orbit.bullettime)){
		for(var i=0; i<planets.length; i++){
	    	var p = planets[i];
		 	// get angle difference
		 	p.calcangle = getAngleDifference(p.angle,orbit.angle);
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
					
					if(powerup != 3 || powerup != 1){
					  if(powerup == 2){
							if(difficulty == 0){ orbit.velocity -= ((orbit.velocity/100)*20)/2;}else 
							if(difficulty == 1){ orbit.velocity -= ((orbit.velocity/100)*25)/2;}else 
							if(difficulty == 2){ orbit.velocity -= ((orbit.velocity/100)*30)/2;}
						}else{
							if(difficulty == 0){ orbit.velocity -= ((orbit.velocity/100)*20);}else 
							if(difficulty == 1){ orbit.velocity -= ((orbit.velocity/100)*25);}else 
							if(difficulty == 2){ orbit.velocity -= ((orbit.velocity/100)*30);}
						}
				  	}
					
					p.alive = false;
					p.exploding = 0;
					
					//Add score
					scoreAdd(p.pop, p.type, ass.speed);
					
					for(var i = 0; i< particle_count;i++){ particles.push(new particle(p.x,p.y,dx,dy)); }
					gamePlayExplosion();
			
		  		}
			}
		}
		
	}
	// check orbit speed
	if((orbit.velocity<5) && (ass.alive)){
	  gameDead();		
	}
	
	// orbit and ass angle;
	if(orbit.bullettime == false){
	  ass.angle += 25*speedmodifier; 
      orbit.angle -= 15*speedmodifier;
	  orbit.speed = 1; 
	}else{
	  // dit is bullettime		
	  if(orbit.bullettimeup){
		if(!bullettimesound)
		{
			bullettimesound = true;
			slowMotionSound(true);
		}
		orbit.bullettimepercentage+=1.5*modifier;
		if(orbit.bullettimepercentage>1) 
		{
			orbit.bullettimepercentage = 1;
		}
	  }else{
		  orbit.bullettimepercentage-=1.5*speedmodifier;
		  if(orbit.bullettimepercentage <= 0){ orbit.bullettimepercentage = 0; orbit.bullettime = false; bullettimesound = false; slowMotionSound(false);}		  
	  } 
	  orbit.speed = (1-(orbit.bullettimepercentage*0.97));
	  
	  if(orbit.bullettimepercentage>0){
	    orbit.angle -= (15*speedmodifier)*orbit.speed;
	    ass.angle += (25*speedmodifier)*orbit.speed; 
	  }
	}
	// overbound
	if(ass.angle>=60){ ass.angle -= 60; }
	if(orbit.angle<0){ orbit.angle += 100; }
};

var gameRender = function(delta) {
	speeddelta = delta*((orbit.velocity/100));
	
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
	gameWarp();
	// draw sun glow
	glowx = -(orbit.distance*2.5);
	ctx.drawImage(glowImage, glowx, 0, glowImage.width/2, canvas.height);
	// draw enemy astroid 
	if((asstroid.spawntimer<1) && (asstroid.spawntimer>0)){
      ctx.drawImage(warningImage, asstroid.ox-100, asstroid.oy-50, 200, 100);
	  alertSound();
		  
	}
	gameDrawEnemyAsstroid();
	//debugLine(asstroid.ox,0,asstroid.ox,canvas.height,"green");
	//debugLine(0,asstroid.oy,canvas.width,asstroid.oy,"green");
	// draw astroid
	gameDrawAsstroid(); 
	// draw planet
	if((orbit.planetinview) || (orbit.bullettime)){
	  for(var i = 0; i < planets.length; i++){ 
	    var p = planets[i];
		// planet in line of sight, show the indicator
 	    if(p.visible){ 
		  // draw under
		  gameDrawPlanet(i);
		  //debugLine(p.x+(60*p.calcsize),0,p.x+(60*p.calcsize),canvas.height,"blue");
		  //debugLine(p.x-(60*p.calcsize),0,p.x-(60*p.calcsize),canvas.height,"blue"); 
		  //debugLine(ass.x+40,0,ass.x+40,canvas.height,"red");
		  //debugLine(ass.x-40,0,ass.x-40,canvas.height,"red");
		}
	    // chunks
        if((p.alive==false) && (p.exploding>-1) && (p.exploding<5)){
	      p.exploding += (delta*15); 
	      drawExplodingPlanet(p); 
        }else{
	      p.exploding = -1;	 
        }
		// draw over
		
	  }
	  // draw asteroid alone , over or under? <- TODO
	  
	  //drawImageRotated(assImage,(ass.x+ox)-50,(ass.y+oy)-71,ass.w,ass.h,ass.angle*6.28318531); 
	}else{
      // draw asteroid alone
	  gameDrawAsstroid(); //drawImageRotated(assImage,(ass.x+ox)-50,(ass.y+oy)-71,ass.w,ass.h,ass.angle*6.28318531); 
	}
    // draw indicators
	for(var i = 0; i < planets.length; i++){ 
	  var p = planets[i];
	  if(p.indicator){ planetIndicator(p,planetProperties[p.type].name, p.pop, 75, p.name, false, 2); }		
	}
	
    // update and draw explosion particles
    var f = false;
 	for(var i = 0; i < particles.length;i++){
  		var p = particles[i];
  		if(p!=null){
   			f = true;
   			p.opacity = (p.remaining_life/p.life);

			if(powerup == 2){
				ctx.drawImage(parIceImage,p.location.x,p.location.y);
			}else{
				ctx.drawImage(parImage,p.location.x,p.location.y); // images zijn sneller
			}
   			
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
	
	if(!orbit.bullettime){
		orbit.velocity = orbit.velocity + 2 * delta;
	}
	
    //Draw HUD
  	ctx.drawImage(radarbgImage, 6, demHeight - 160);
	ctx.drawImage(speedImage, 130 , demHeight - 160);
	ctx.drawImage(powerupImage, 168 , demHeight - 118);
	
	ctx.drawImage(livesImage, 290, demHeight - 160);
	ctx.drawImage(statsImage, 290, demHeight - 118);
	ctx.drawImage(orbitImage, 290, demHeight - 33)
	
	if(ass.lives > 0){ ctx.drawImage(lifeImage, 295, demHeight - 160); }
	if(ass.lives > 1){ ctx.drawImage(lifeImage, 323, demHeight - 160); }
	if(ass.lives > 2){ ctx.drawImage(lifeImage, 351, demHeight - 160); }
	if(ass.lives > 3){ ctx.drawImage(lifeImage, 379, demHeight - 160); }
	if(ass.lives > 4){ ctx.drawImage(lifeImage, 407, demHeight - 160); }
	
	
	//SPEEDBAR
	ctx.beginPath();
	ctx.strokeWidth=1;
	if(orbit.velocity < 50){
	ctx.fillStyle = "rgba(180, 0, 0, 0.5)";
	}else{
	ctx.fillStyle = "rgba(6, 64, 2, 0.5)";
	}
	gear = Math.floor(orbit.velocity / 100);
	ctx.rect(277, demHeight - 157, -(orbit.velocity * 1.08) + (108*gear), 27);
	ctx.fill();
	ctx.closePath();
	
	//ORBITBAR
	ctx.beginPath();
	ctx.strokeWidth=1;
	if(orbit.distance < 10 || orbit.distance > 90){
	ctx.fillStyle = "rgba(180, 0, 0, 0.5)";
	}else{
	ctx.fillStyle = "rgba(6, 64, 2, 0.5)";
	}
	ctx.rect(293, demHeight - 30, orbit.distance * 1.45, 19);
	ctx.fill();
	ctx.closePath();
	
	
	//FIRE, ICE, NOSTOP, SCORE
	if(powerup == 1){ctx.drawImage(fireImage, 173, demHeight - 113);}
	if(powerup == 2){ctx.drawImage(iceImage, 173, demHeight - 113);}
	if(powerup == 3){ctx.drawImage(nostopImage, 173, demHeight - 113);}
	if(powerup == 4){ctx.drawImage(scoreImage, 173, demHeight - 113);}
	
  	ctx.font = "12px Rock";
  	minimapRender(2);
  	ctx.fillStyle = "rgb(20, 105, 5)";	
	ctx.fillText("POWERUP", 173, demHeight - 127);
	ctx.fillText("SPEED", 143, demHeight - 170);
	ctx.fillText("LIVES", 303, demHeight - 169);
	ctx.fillText("STATS", 303, demHeight - 127);
	ctx.fillText("ORBIT", 303, demHeight - 43);
	
	ctx.font = "14px Rock";
	ctx.fillText(gear, 152, demHeight - 160);
	ctx.fillText(Math.round(poweruptime), 263, demHeight - 20);
	
	poweruptime = poweruptime - 1 * delta;
	if(poweruptime < 0){powerup = 0;}
	
	ctx.fillText("SCORE: " + score, 295, demHeight - 110);
	ctx.fillText("PLANETS HIT: " + planetsDestroyed, 295, demHeight - 95);
	ctx.fillText("JUNK HIT: " + junkhit, 295, demHeight - 80);
	ctx.fillText("TIME LEFT: " + "0", 295, demHeight - 65);
	
	//Notification test
	notification(demWidth - 270, 20, 250, 50, "Achievement Unlocked", "Being an asshole");
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
   ctx.fillText("Velocity: " + Math.round(orbit.velocity), 32, 200);
   ctx.fillText("Lives: " + ass.lives, 32, 230);
   ctx.fillText("Planet x: " + Math.round(planet.x)+" Planet y: "+Math.round(planet.y), 32, 260);
   ctx.fillText("Planet in view: " + orbit.planetinview, 32, 290);
   //ctx.fillText("p dist: " + Math.round(planets[0].distance)+" p angle: "+planets[0].angle+' p alive: '+planets[0].alive+' calcangle: '+Math.round(planets[0].calcangle)+' P.exp:'+Math.round(planets[0].exploding), 32, 320);
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

function checkAngleDifference(a,b,minv,maxv){ // angles from 0 to 100, returns true or false
  var c = getAngleDifference(a,b);
  if((c >= minv) && (c <= maxv)) return true;	
}

function getAngleDifference(a,b){ // angles from 0 to 100
  var c = a-b; if(c>50) c -= 100; if(c<-50) c+=100;
  return c;	
}

function slowMotionSound(enter)
{
    
	if(enter && soundManager.getSoundById('intoslomo').playState==0)
	{
		soundManager.setVolume('intoslomo',Math.round(effectsVolume));
		soundManager.play('intoslomo',{ onfinish: function() { } });
	}
	else if(soundManager.getSoundById('outofslomo').playState==0)
	{
		soundManager.setVolume('outofslomo',Math.round(effectsVolume));
		soundManager.play('outofslomo',{ onfinish: function() { } });
	}
}

function alertSound()
{
    
	if(soundManager.getSoundById('alert').playState==0)
	{
		soundManager.setVolume('alert',Math.round(effectsVolume));
		soundManager.play('alert',{ onfinish: function() { } });
	}
}

/* ======================================  
         LEVEL LOADING FUNCTIONS
 ========================================*/

function loadLevel1(){
	randomLevel(3,5,5);
}

function randomLevel(gasPlanets, normalPlanets, otherPlanets)
{
	planets = new Array();
	planet.alive = true;
    planet.size = 1;
    planet.h = 120;
    planet.w = 120;
    planet.y = canvasyc;
    planet.x = canvasxc;
	
	//Dead or lifeless planets
	for(i = 0; i < otherPlanets; i++)
	{
		//Properties
		planet.size = 0.5;
		planet.angle = Math.random()*100;
		planet.distance = Math.random()*20 + 20;
		planet.type = Math.floor(Math.random()*7);
		
		//Name
		planet.name = planetNames[Math.floor(Math.random()*planetNames.length)].name + " " + romanize(Math.floor(Math.random()*11));
		
		//Population
		//Because most civilizations in our game are capable of limited space travel, some uninhabitable planets may have some people
		planet.pop = Math.floor(Math.random() * 10 * planetProperties[planet.type].popMultiplier);
		
		planets.push($.extend(true, {}, planet));
	}
	
	//Earthlike planets
	for(i = 0; i < normalPlanets; i++)
	{
		planet.size = 1;
		planet.angle = Math.random()*100;
		planet.distance = Math.random()*25 + 35;
		planet.type = Math.floor(Math.random()*4 + 7);
		
		//Name
		planet.name = planetNames[Math.floor(Math.random()*planetNames.length)].name + " " + romanize(Math.floor(Math.random()*11));
		
		//Population
		planet.pop = Math.floor(Math.random() * 10 * planetProperties[planet.type].popMultiplier);
		
		planets.push($.extend(true, {}, planet));
	}
	
	//Gas Planets
	for(i = 0; i < gasPlanets; i++)
	{
		planet.size = 3;
		planet.angle = Math.random()*100;
		planet.distance = Math.random()*25 + 70;
		planet.type = Math.floor(Math.random()*3 + 10);
		
		//Name
		planet.name = planetNames[Math.floor(Math.random()*planetNames.length)].name + " " + romanize(Math.floor(Math.random()*11));

		//Population
		//Although it is suggested that some gas planets may support life, the player doesn't care and think we're retarded
		planet.pop = 0;		
		
		planets.push($.extend(true, {}, planet));
	}
	
	//Check for collisions
	for(i = 0; i < planets.length; i++)
	{
		for(x = 0; x <planets.length; x++)
		{
			if(x != i)
			{
				//Check orbit
				angleDiff = getAngleDifference(planets[i].angle,planets[x].angle);
				distDiff = Math.abs(planets[i].distance - planets[x].distance);
				
				if(distDiff < 7.5 && Math.abs(angleDiff) < 5)
				{
					randomLevel(gasPlanets, normalPlanets, otherPlanets);
				}
			}
		}
	}
}