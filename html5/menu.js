var menuAnimate = !(get("menuAnimate")=="false");
var menuMusic = !(get("menuMusic")=="false");

var pan = {
	xMode : true,
	yMode : true,
	x : 0,
	y : 0
}
	
var hoverIndicator = {
	showing: 0, // % 0-100
	cy : 0,
	ty : 0	
};

//MUTE MENU MUSIC
function musicLevel(){
	if(menuMusic){ soundManager.setVolume('menumusic',40); }else{ soundManager.setVolume('menumusic', 0); }
}

//PLAY THE MENU MUSIC
function menuPlayMusic(){
    musicLevel();
    soundManager.play('menumusic',{ onfinish: function() { menuPlayMusic(); } });
}

//PLAY THE MENU CLICK SOUND
function menuPlayClick(){
    soundManager.setVolume('click',100);
    soundManager.play('click',{ onfinish: function() { } });	
}

//PLAY THE MENU HOVER SOUND
function menuPlayHoverSound(i){
	if(soundManager.getSoundById('hover'+i).playState==1){
		if(i<4){ menuPlayHoverSound(i+1); }  
	}else{
    	soundManager.setVolume('hover'+i,60);
    	soundManager.play('hover'+i,{ onfinish: function() { } });
	}
}

//MENU HOVER EFFECT
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

//SWITCH TO OTHER VIEWS
function switchScreen(scr){
	menuPlayClick();
	canvasHide();
	stopTimer();
	scr();
}

//LOAD THE MENU
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
	
	loader.addCompletionListener(function(){ 
		menuLoaded(); 
	});
	
	loader.start();
}

//WHEN THE MENU IS LOADED
function menuLoaded(){
	then = Date.now();
	menuUpdate();
	timer = setInterval("menuUpdate();",1);	
	menuPlayMusic();
	canvasShow();
}


//DRAWING THE MENU
function menuUpdate(){
	getDelta();
	
	//Cursor
	if(mousePos!=undefined){
	  	if(cmp(demHeight-300, demHeight-260, demWidth-235, demWidth)){ 					// arcade mode
			 menuHover(demHeight - 300, delta);  if(mouseDown){ switchScreen(gameLoadImages); }	
		
	  	}else if(cmp(demHeight-260, demHeight-220, demWidth-235, demWidth)){ 			// time attack
			menuHover(demHeight - 260, delta);
		
		}else if(cmp(demHeight-220, demHeight-180, demWidth-235, demWidth)){ 			// slingshot
			menuHover(demHeight - 220, delta);
			
	  	}else if(cmp(demHeight-140, demHeight-100, demWidth-235, demWidth)){ 			// option
			menuHover(demHeight - 140, delta);	if(mouseDown){ switchScreen(menuHighscore); }
			
	  	}else if(cmp(demHeight-100, demHeight-60, demWidth-235, demWidth)){ 			// quit
			menuHover(demHeight - 100, delta);
		
	  	}else if(cmp(demHeight-80, demHeight-54, 20, 46)){								// toggle music
			if(mouseDown && mouseDownAble){ menuMusic = !menuMusic; mouseDownAble = false; musicLevel(); set("menuMusic", menuMusic,365); menuPlayClick()}
		
		}else if(cmp(demHeight-50, demHeight-24, 20, 46)){ 								// toggle animation
			if(mouseDown && mouseDownAble){ menuAnimate = !menuAnimate; mouseDownAble = false; set("menuAnimate", menuAnimate,365); menuPlayClick()}
		
		}else{menuHoverOut(delta);}
		menuMove(delta);
	}
	
	//Pan the background
	if(menuAnimate){
		if(pan.xMode){ pan.x = pan.x - 0.050 * delta; if(-pan.x > (4096 - demWidth)){ pan.xMode = false; } }else{ pan.x = pan.x + 0.1 * delta; if(pan.x > 0){ pan.xMode = true; } }
		if(pan.yMode){ pan.y = pan.y - 0.1 * delta; if(-pan.y > (4096 - demHeight)){ pan.yMode = false; } }else{ pan.y = pan.y + 0.050 * delta; if(pan.y > 0){ pan.yMode = true; } }
	}
	
	ctx.drawImage(menuBgImg, 0 + pan.x, 0 + pan.y);
	ctx.drawImage(menuTitleImg, 20, 20);
	ctx.drawImage(menuArcadeImg, demWidth - 140, demHeight - 300);
	ctx.drawImage(menuTimeattackImg, demWidth - 225, demHeight - 260);
	ctx.drawImage(menuSlingshotImg, demWidth - 190, demHeight - 220);
	ctx.drawImage(menuOptionsImg, demWidth - 155, demHeight - 140);
	ctx.drawImage(menuQuitImg, demWidth - 92, demHeight - 100);
	ctx.drawImage(menuAnimateImg, 50, demHeight - 50);
	ctx.drawImage(menuMusicImg, 50, demHeight - 80);
	
	//Toggle music and animation
	if(menuMusic){ ctx.drawImage(menuCheckedImg, 20, demHeight - 80); }else{ ctx.drawImage(menuCheckboxImg, 20, demHeight - 80); }
	if(menuAnimate){ ctx.drawImage(menuCheckedImg, 20, demHeight - 50); }else{ ctx.drawImage(menuCheckboxImg, 20, demHeight - 50); }
	
	//Draw menu hover effect
	ctx.beginPath();
	ctx.rect(demWidth - 235, hoverIndicator.cy, 234, 35);
	ctx.fillStyle = "rgba(255,255,255,"+(hoverIndicator.showing/1000)+")";
	ctx.fill();
}

