var parralaxToggle = false;
var menuAnimate = !(get("menuAnimate")=="false");
var menuMusic = !(get("menuMusic")=="false");
var panXMode = true;
var panYMode = true;
var panBgX = 0;
var panBgY = 0;
var panBgX2 = 0;
var panBgY2 = 0;
var menuimg;

	
var hoverIndicator = {
  showing: 0, // % 0-100
  cy : 0,
  ty : 0	
};

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
	  	if((mousePos.y>(demHeight - 300)) && (mousePos.x>(demWidth - 235)) && (mousePos.x<(demWidth)) && (mousePos.y<(demHeight - 260))){ // arcade mode
			menuHover(demHeight - 300, delta);  if(mouseDown){ menuArcadeMode(); }
	  	}else if((mousePos.y>(demHeight - 260)) && (mousePos.x>(demWidth - 235)) && (mousePos.x<(demWidth)) && (mousePos.y<(demHeight - 220))){  // time attack
			menuHover(demHeight - 260, delta); 
	  	}else if((mousePos.y>(demHeight - 220)) && (mousePos.x>(demWidth - 235)) && (mousePos.x<(demWidth)) && (mousePos.y<(demHeight - 180))){ // slingshot
			menuHover(demHeight - 220, delta);	
	  	}else if((mousePos.y>(demHeight - 140)) && (mousePos.x>(demWidth - 235)) && (mousePos.x<(demWidth)) && (mousePos.y<(demHeight - 100))){ // option
			menuHover(demHeight - 140, delta);	if(mouseDown){ menuHighscore(); }
	  	}else if((mousePos.y>(demHeight - 100)) && (mousePos.x>(demWidth - 235)) && (mousePos.x<(demWidth)) && (mousePos.y<(demHeight - 60))){ // quit
			menuHover(demHeight - 100, delta);	
	  	}else if((mousePos.y>(demHeight - 80)) && (mousePos.x>20) && (mousePos.x<46) && (mousePos.y<(demHeight - 54))){ // toggle music
			if(mouseDown && mouseDownAble){ menuMusic = !menuMusic; mouseDownAble = false; musicLevel(); set("menuMusic", menuMusic,365);}
		}else if((mousePos.y>(demHeight - 50)) && (mousePos.x>20) && (mousePos.x<46) && (mousePos.y<(demHeight - 24))){ // toggle animation
			if(mouseDown && mouseDownAble){ menuAnimate = !menuAnimate; mouseDownAble = false; set("menuAnimate", menuAnimate,365);}
		}else{
		    menuHoverOut(delta);	
		}
		menuMove(delta);
	}
    ctx.drawImage(menuBgImg, 0 + panBgX, 0 + panBgY);
	
	if(parralaxToggle == true){
		ctx.drawImage(menuBg2Img, 0 + panBgX2, 0 + panBgY2);
	}
	
	if(menuAnimate == true){
			if(panXMode == true){
				panBgX = panBgX - 0.50;
				panBgX2 = panBgX2 - 0.25;
				if(-panBgX > (4096 - demWidth)){
					panXMode = false;
				}
			}else{
				panBgX = panBgX + 1;
				panBgX2 = panBgX2 + 0.5;
				if(panBgX > 0){
					panXMode = true;
				}
			}
			
			if(panYMode == true){
				panBgY = panBgY - 1;
				panBgY2 = panBgY2 - 0.5;
				if(-panBgY > (4096 - demHeight)){
					panYMode = false;
				}
			}else{
				panBgY = panBgY + 0.50;
				panBgY2 = panBgY2 + 0.25;
				if(panBgY > 0){
					panYMode = true;
				}
			}
	}
	
	ctx.drawImage(menuTitleImg, 20, 20);
	
	ctx.drawImage(menuArcadeImg, demWidth - 140, demHeight - 300);
	ctx.drawImage(menuTimeattackImg, demWidth - 225, demHeight - 260);
	ctx.drawImage(menuSlingshotImg, demWidth - 190, demHeight - 220);
	ctx.drawImage(menuOptionsImg, demWidth - 155, demHeight - 140);
	ctx.drawImage(menuQuitImg, demWidth - 92, demHeight - 100);
	
	ctx.drawImage(menuAnimateImg, 50, demHeight - 50);
	ctx.drawImage(menuMusicImg, 50, demHeight - 80);
	
	if(menuMusic == true){
		ctx.drawImage(menuCheckedImg, 20, demHeight - 80);
	}else{
		ctx.drawImage(menuCheckboxImg, 20, demHeight - 80);
	}
	if(menuAnimate == true){
		ctx.drawImage(menuCheckedImg, 20, demHeight - 50);
	}else{
		ctx.drawImage(menuCheckboxImg, 20, demHeight - 50);
	}
	
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