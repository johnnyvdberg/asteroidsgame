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

//PLAY THE MENU CLICK SOUND
function menuPlayClick(){
	if(soundManager.getSoundById('click'+menuSound).playState==1){
	  soundManager.getSoundById('click'+menuSound).stop();  	
	}
	soundManager.getSoundById('click'+menuSound).setVolume(parseInt(effectsVolume));
	soundManager.play('click'+menuSound,{ onfinish: function() { } });	
}

//PLAY THE MENU HOVER SOUND
function menuPlayHoverSound(i){
	if(soundManager.getSoundById('hover'+menuSound+'_'+i).playState==1){
		if(i<4){ menuPlayHoverSound(i+1); }  
	}else{
		soundManager.getSoundById('hover'+menuSound+'_'+i).setVolume(parseInt(effectsVolume)); //Math.round(effectsVolume*0.6)
    	soundManager.play('hover'+menuSound+'_'+i,{ onfinish: function() { } });
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

//LOAD THE MENU
function menuLoad(){
	var loader = new PxLoader();
	
	menuBgImg = loader.addImage('images/menu/bg.png');
	menuBg2Img = loader.addImage('images/menu/bg2.png');
	menuTitleImg = loader.addImage('images/menu/title.png');
	menuArcadeImg = loader.addImage('images/menu/arcade.png');
	menuTimeattackImg = loader.addImage('images/menu/timeattack.png');
	menuHighscoresImg = loader.addImage('images/menu/highscores.png');
	menuOptionsImg = loader.addImage('images/menu/options.png');
	menuQuitImg = loader.addImage('images/menu/quit.png');
	
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
	InitPlaylist(1); // init en play menu
	canvasShow();
}


//DRAWING THE MENU
function menuUpdate(){
	getDelta();
	
	//Cursor
	if(mousePos!=undefined){
	  	if(cmp(demHeight-300, demHeight-260, demWidth-235, demWidth)){ 					// arcade mode
			 menuHover(demHeight - 300, delta);  if(mouseDown && mouseDownAble){mouseDownAble = false; switchScreen(gameLoad, true); }	
		
	  	}else if(cmp(demHeight-260, demHeight-220, demWidth-235, demWidth)){ 			// time attack
			menuHover(demHeight - 260, delta);
		
		}else if(cmp(demHeight-220, demHeight-180, demWidth-235, demWidth)){ 			// highscore
			menuHover(demHeight - 220, delta);	if(mouseDown && mouseDownAble){mouseDownAble = false; switchScreen(highscoreLoad, false); }
			
	  	}else if(cmp(demHeight-140, demHeight-100, demWidth-235, demWidth)){ 			// option
			menuHover(demHeight - 140, delta);	if(mouseDown && mouseDownAble){mouseDownAble = false; switchScreen(optionLoad, false); }
			
	  	//}else if(cmp(demHeight-100, demHeight-60, demWidth-235, demWidth)){ 			// quit
		//	menuHover(demHeight - 100, delta);
		
	  	//}else if(cmp(demHeight-80, demHeight-54, 20, 46)){								// toggle music
		//	if(mouseDown && mouseDownAble){ menuMusic = !menuMusic; mouseDownAble = false; set("menuMusic", menuMusic); menuPlayClick(); checkPlayMusic(); }
		
		//}else if(cmp(demHeight-50, demHeight-24, 20, 46)){ 								// toggle animation
		//	if(mouseDown && mouseDownAble){ menuAnimate = !menuAnimate; mouseDownAble = false; set("menuAnimate", menuAnimate); menuPlayClick()}
		
		}else{menuHoverOut(delta);}
		menuMove(delta);
	}
	
	//Pan the background
	if(menuAnimate){
		backgroundPanning();
	}
	
	
	ctx.drawImage(menuBgImg, 0 + pan.x, 0 + pan.y);
	ctx.drawImage(menuTitleImg, 20, 20);
	ctx.drawImage(menuArcadeImg, demWidth - 140, demHeight - 300);
	ctx.drawImage(menuTimeattackImg, demWidth - 225, demHeight - 260);
	ctx.drawImage(menuHighscoresImg, demWidth - 220, demHeight - 220);
	ctx.drawImage(menuOptionsImg, demWidth - 155, demHeight - 140);
	//ctx.drawImage(menuQuitImg, demWidth - 92, demHeight - 100);
	
	//Draw menu hover effect
	ctx.beginPath();
	ctx.rect(demWidth - 235, hoverIndicator.cy, 234, 35);
	ctx.fillStyle = "rgba(255,255,255,"+(hoverIndicator.showing/1000)+")";
	ctx.fill();
}

