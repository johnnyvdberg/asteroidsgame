var hsimg;
var timer = null; 
var mousePos = null;
var soundManager;
var mouseDown;
var canvas; var ctx;
var soundNames = [
	  { id: 'menumusic', url:'music/01-Vangelis-Heaven-and-Hell.mp3'},
	  { id: 'click', url:'sounds/menu/clicksound.mp3'}, 
	  { id: 'hover1', url:'sounds/menu/hoversound.mp3'},
	  { id: 'hover2', url:'sounds/menu/hoversound.mp3'},
	  { id: 'hover3', url:'sounds/menu/hoversound.mp3'},
	  { id: 'hover4', url:'sounds/menu/hoversound.mp3'}
	];
	
var hoverIndicator = {
  showing: 0, // % 0-100
  cy : 0,
  ty : 0	
}

function highscoreLoad() {
	var loader = new PxLoader();
	hsimg = loader.addImage('images/highscore/bkghighscore.jpg');
	loader.addCompletionListener(function () { hsSharedLoad(); });
	loader.start();
	// sound
	soundManager.useFlashBlock = false;
	soundManager.useHTML5Audio = true;
	soundManager.preferFlash = false;
	soundManager.setup({
		url: 'soundmanager2/swf/',
		useHTML5Audio: true,
		preferFlash: false,
		onready: function () { loadSounds(); },
		ontimeout: function(status) { 
		  l('Loading flash error: The status is ' + status.success + ', the error type is ' + status.error.type);
		  soundManager.useHTML5Audio = true; 
          soundManager.preferFlash = false; 
          soundManager.reboot(); 
		}
	});
}

var tmpsl = 0;
function hsSharedLoad (){ // laad de 2 dingen teglijk, wacht tot ze bijden klaar zijn
    tmpsl++;
    if(tmpsl>1){ highscoreLoaded(); }	
};

function highscoreLoaded (){
	timer = setInterval("highscoreUpdate();",5);	
	highscoreUpdate();
	then = Date.now();
	highscorePlayMusic();
	canvas.addEventListener('mousemove', function(evt) { mousePos = getMousePos(canvas, evt); }, false);
	canvas.addEventListener('mousedown', function(e) { mouseDown = true; },false); 
	canvas.addEventListener('mouseup', function(e) { mouseDown = false; },false); 
}

function highscorePlayMusic(){
    soundManager.setVolume('menumusic',10);
    soundManager.play('menumusic',{ onfinish: function() { highscorePlayMusic(); } });	
}

function highscorePlayClick(){
    soundManager.setVolume('click',100);
    soundManager.play('click',{ onfinish: function() { highscorePlayMusic(); } });	
}

function highscorePlayHoverSound(i){
	if(soundManager.getSoundById('hover'+i).playState==1){
	  if(i<4){ highscorePlayHoverSound(i+1); }  
	}else{
      soundManager.setVolume('hover'+i,90);
      soundManager.play('hover'+i,{ onfinish: function() { } });
	}
}

function highscoreUpdate(){
    var now = Date.now();
	var delta = (now - then);
	then = now;
	if(mousePos!=undefined){
	  	if((mousePos.y>475) && (mousePos.x>789) && (mousePos.x<1024) && (mousePos.y<511)){ // arcade mode
			highscoreHover(475, delta); if(mouseDown){ menuArcadeMode(); }
	  	}else if((mousePos.y>512) && (mousePos.x>789) && (mousePos.x<1024) && (mousePos.y<548)){  // time attack
			highscoreHover(512, delta);	
	  	}else if((mousePos.y>555) && (mousePos.x>789) && (mousePos.x<1024) && (mousePos.y<590)){ // slingshot
			highscoreHover(555, delta);	
	  	}else if((mousePos.y>659) && (mousePos.x>789) && (mousePos.x<1024) && (mousePos.y<695)){ // option
			highscoreHover(659, delta);	
	  	}else if((mousePos.y>699) && (mousePos.x>789) && (mousePos.x<1024) && (mousePos.y<735)){ // quit
			highscoreHover(699, delta);	
	  	}else{
		    highscoreHoverOut(delta);	
		}
		highscoreMove(delta);
	}
    ctx.drawImage(hsimg, 0, 0);
	// draw menu item	
	ctx.beginPath();
	ctx.rect(790, hoverIndicator.cy, 234, 35);
	ctx.fillStyle = "rgba(255,255,255,"+(hoverIndicator.showing/1000)+")";
	ctx.fill();
}

function highscoreMove(dt){
  if((hoverIndicator.cy+dt)<hoverIndicator.ty){
	hoverIndicator.cy += dt;  
  }else if ((hoverIndicator.cy-dt)>hoverIndicator.ty){
	hoverIndicator.cy -= dt;  
  }else{
	hoverIndicator.cy = hoverIndicator.ty;  
  }
}

function highscoreHover(y,dt){
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
  if(y!=oldy){ highscorePlayHoverSound(1); }
}

function highscoreHoverOut(dt){
  hoverIndicator.showing -= (dt*3);	
  if(hoverIndicator.showing<0){ hoverIndicator.showing = 0; }
}

function menuArcadeMode(){
	highscorePlayClick();
    canvasHide();	
    stopTimer();
    setTimeout("gameLoadImages();",1000); // show off loader 1 second longer, remove later
}

function loadSounds(){
	var loader = new PxLoader(), 
	i, len, url, n; 
	n = 0;
	 
	// queue each sound for loading 
	for(i=0, len = soundNames.length; i < len; i++) { 
	 
		// see if the browser can play m4a 
		url = soundNames[i].url;
		if (!soundManager.canPlayURL(url)) { 
			continue; // can't be played 
		} 
		// queue the sound using the name as the SM2 id 
		loader.addSound(soundNames[i].id, url); 
	} 
	len = soundNames.length;
	 
	// listen to load events 
	loader.addProgressListener(function(e) { 
	  n++;
	  if(n>=len){ hsSharedLoad(); }  
	}); 
	 
	loader.start(); 	
}

function stopTimer(){ if(timer!=null){ window.clearInterval(timer); timer = null; } } // stop updaten 