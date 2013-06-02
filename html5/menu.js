var menuAnimate = !(get("menuAnimate")=="false");
var menuMusic = !(get("menuMusic")=="false");
var panXMode = true;
var panYMode = true;
var panBgX = 0;
var panBgY = 0;
var menuimg;
	
var hoverIndicator = {
  showing: 0, // % 0-100
  cy : 0,
  ty : 0	
};

function musicLevel(){
	if(menuMusic){ soundManager.setVolume('menumusic',40); }else{ soundManager.setVolume('menumusic', 0); }
}

function menuPlayMusic(){
    musicLevel();
    soundManager.play('menumusic',{ onfinish: function() { menuPlayMusic(); } });
}

function menuPlayClick(){
    soundManager.setVolume('click',100);
    soundManager.play('click',{ onfinish: function() { } });	
}

function menuPlayHoverSound(i){
	if(soundManager.getSoundById('hover'+i).playState==1){
	  if(i<4){ menuPlayHoverSound(i+1); }  
	}else{
      soundManager.setVolume('hover'+i,60);
      soundManager.play('hover'+i,{ onfinish: function() { } });
	}
}

function menuUpdate(){
    var now = Date.now();
	var delta = (now - then);
	then = now;
	
	if(mousePos!=undefined){
	  	if(cmp(demHeight-300, demHeight-260, demWidth-235, demWidth)){ 	
			 menuHover(demHeight - 300, delta);  if(mouseDown){ menuArcadeMode(); }																				}// arcade mode
			 
	  	else if(cmp(demHeight-260, demHeight-220, demWidth-235, demWidth)){ 
			menuHover(demHeight - 260, delta); 																													}// time attack
			
		else if(cmp(demHeight-220, demHeight-180, demWidth-235, demWidth)){ 	
			menuHover(demHeight - 220, delta);																													}// slingshot
			
	  	else if(cmp(demHeight-140, demHeight-100, demWidth-235, demWidth)){ 	
			menuHover(demHeight - 140, delta);	if(mouseDown){ menuHighscore(); }																				}// option
			
	  	else if(cmp(demHeight-100, demHeight-60, demWidth-235, demWidth)){ 		
			menuHover(demHeight - 100, delta);																													}// quit
					
	  	else if(cmp(demHeight-80, demHeight-54, 20, 46)){
			if(mouseDown && mouseDownAble){ menuMusic = !menuMusic; mouseDownAble = false; musicLevel(); set("menuMusic", menuMusic,365);}						}// toggle music
			
		else if(cmp(demHeight-50, demHeight-24, 20, 46)){ 						
			if(mouseDown && mouseDownAble){ menuAnimate = !menuAnimate; mouseDownAble = false; set("menuAnimate", menuAnimate,365);}							}// toggle animation
		
		else{menuHoverOut(delta);}
		menuMove(delta);
	}
	
	//Pan the background
	if(menuAnimate){
		if(panXMode){ panBgX = panBgX - 0.050 * delta; if(-panBgX > (4096 - demWidth)){ panXMode = false; } }else{ panBgX = panBgX + 0.1 * delta; if(panBgX > 0){ panXMode = true; } }
		if(panYMode){ panBgY = panBgY - 0.1 * delta; if(-panBgY > (4096 - demHeight)){ panYMode = false; } }else{ panBgY = panBgY + 0.050 * delta; if(panBgY > 0){ panYMode = true; } }
	}
	
	ctx.drawImage(menuBgImg, 0 + panBgX, 0 + panBgY);
	ctx.drawImage(menuTitleImg, 20, 20);
	ctx.drawImage(menuArcadeImg, demWidth - 140, demHeight - 300);
	ctx.drawImage(menuTimeattackImg, demWidth - 225, demHeight - 260);
	ctx.drawImage(menuSlingshotImg, demWidth - 190, demHeight - 220);
	ctx.drawImage(menuOptionsImg, demWidth - 155, demHeight - 140);
	ctx.drawImage(menuQuitImg, demWidth - 92, demHeight - 100);
	ctx.drawImage(menuAnimateImg, 50, demHeight - 50);
	ctx.drawImage(menuMusicImg, 50, demHeight - 80);
	
	// Toggle music and animation
	if(menuMusic){ ctx.drawImage(menuCheckedImg, 20, demHeight - 80); }else{ ctx.drawImage(menuCheckboxImg, 20, demHeight - 80); }
	if(menuAnimate){ ctx.drawImage(menuCheckedImg, 20, demHeight - 50); }else{ ctx.drawImage(menuCheckboxImg, 20, demHeight - 50); }
	
	// draw menu item
	ctx.beginPath();
	ctx.rect(demWidth - 235, hoverIndicator.cy, 234, 35);
	ctx.fillStyle = "rgba(255,255,255,"+(hoverIndicator.showing/1000)+")";
	ctx.fill();
}

function menuMove(dt){
  if((hoverIndicator.cy+dt)<hoverIndicator.ty){
	hoverIndicator.cy += dt;  
  }else if ((hoverIndicator.cy-dt)>hoverIndicator.ty){
	hoverIndicator.cy -= dt;  
  }else{
	hoverIndicator.cy = hoverIndicator.ty;  
  }
}

function menuHover(y,dt){
  var oldy = hoverIndicator.ty;	
  if(hoverIndicator.showing>0){
	hoverIndicator.ty = y;  
  }else{
	hoverIndicator.cy = y;
	hoverIndicator.ty = y; 
	oldy = -1; //reset so sound always play on rehover  
  }
  hoverIndicator.showing += (dt*3);
  if(hoverIndicator.showing>500){ hoverIndicator.showing = 500; }
  if(y!=oldy){ menuPlayHoverSound(1); }
}

function menuHoverOut(dt){
  hoverIndicator.showing -= (dt*3);	
  if(hoverIndicator.showing<0){ hoverIndicator.showing = 0; }
}

function menuArcadeMode(){
	menuPlayClick();
    canvasHide();	
    stopTimer();
    gameLoadImages();
}

function menuHighscore(){
	menuPlayClick();
    canvasHide();	
    stopTimer();
    highscoreLoad(); 
}



//LOAD & PLAY
function menuLoad(){
	var loader = new PxLoader();
	menuBgImg = loader.addImage('images/menu/bg.png');
	menuBg2Img = loader.addImage('images/menu/bg2.png');
	
	menuTitleImg = loader.addImage('images/menu/title.png');
	menuArcadeImg = loader.addImage('images/menu/arcade.png');
	menuTimeattackImg = loader.addImage('images/menu/timeattack.png');
	menuSlingshotImg = loader.addImage('images/menu/slingshot.png');
	menuOptionsImg = loader.addImage('images/menu/options.png');
	menuQuitImg = loader.addImage('images/menu/quit.png');
	
	menuAnimateImg = loader.addImage('images/menu/animate.png');
	menuMusicImg = loader.addImage('images/menu/music.png');
	
	menuCheckboxImg = loader.addImage('images/menu/checkbox.png');
	menuCheckedImg = loader.addImage('images/menu/checked.png');
	
	loader.addCompletionListener(function(){ menuLoaded(); });
	loader.start();
}


function menuLoaded(){
	then = Date.now();
	menuUpdate();
	timer = setInterval("menuUpdate();",1);	
	menuPlayMusic();
	canvasShow();
}



