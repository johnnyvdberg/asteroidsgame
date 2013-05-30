var demWidth = window.innerWidth;
var demHeight = window.innerHeight;
var menuimg;
var timer = null; 
var mousePos = null;
var soundManager;
var mouseDown;
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

function menuLoad(){
	var loader = new PxLoader();
	menuBgImg = loader.addImage('images/menu/bg.jpg');
	
	menuTitleImg = loader.addImage('images/menu/title.png');
	menuArcadeImg = loader.addImage('images/menu/arcade.png');
	menuTimeattackImg = loader.addImage('images/menu/timeattack.png');
	menuSlingshotImg = loader.addImage('images/menu/slingshot.png');
	menuOptionsImg = loader.addImage('images/menu/options.png');
	menuQuitImg = loader.addImage('images/menu/quit.png');
	
	loader.addCompletionListener(function(){ sharedLoad(); });
	loader.start();
	// sound
	soundManager.useFlashBlock = false; 
	soundManager.useHTML5Audio = true; 
	soundManager.preferFlash = false;
	soundManager.setup({
		url: 'soundmanager2/swf/',
		useHTML5Audio: true,
		preferFlash: false,
		onready: function() { loadSounds(); },
		ontimeout: function(status) { 
		  l('Loading flash error: The status is ' + status.success + ', the error type is ' + status.error.type);
		  soundManager.useHTML5Audio = true; 
          soundManager.preferFlash = false; 
          soundManager.reboot(); 
		}
	});
}

window.onload = function(e){
    setTimeout("menuLoad()",1000); // show off loader 1 second longer, remove later
};

var tmpsl = 0;
function sharedLoad(){ // laad de 2 dingen teglijk, wacht tot ze bijden klaar zijn
    tmpsl++;
    if(tmpsl>1){ menuLoaded(); }	
};

function menuLoaded(){
	canvas = document.createElement("canvas");
	canvas.width= demWidth; canvas.height= demHeight; // we should maybe build this to suit resizing
	ctx = canvas.getContext("2d");
	timer = setInterval("menuUpdate();",5);	
	menuUpdate();
	then = Date.now();
	document.body.appendChild(canvas); 
	menuPlayMusic();
	canvas.addEventListener('mousemove', function(evt) { mousePos = getMousePos(canvas, evt); }, false);
	canvas.addEventListener('mousedown', function(e) { mouseDown = true; },false); 
	canvas.addEventListener('mouseup', function(e) { mouseDown = false; },false); 
}

function menuPlayMusic(){
    soundManager.setVolume('menumusic',10);
    soundManager.play('menumusic',{ onfinish: function() { menuPlayMusic(); } });	
}

function menuPlayClick(){
    soundManager.setVolume('click',100);
    soundManager.play('click',{ onfinish: function() { menuPlayMusic(); } });	
}

function menuPlayHoverSound(i){
	if(soundManager.getSoundById('hover'+i).playState==1){
	  if(i<4){ menuPlayHoverSound(i+1); }  
	}else{
      soundManager.setVolume('hover'+i,90);
      soundManager.play('hover'+i,{ onfinish: function() { } });
	}
}


function canvasHide(){ showLoader(); canvas.style.display = 'none'; }
function canvasShow(){ hideLoader(); canvas.style.display = ''; }
function hideLoader(){ document.body.style.backgroundImage = ''; }
function showLoader(){ document.body.style.backgroundImage = 'images/menu/loader.gif'; }
function getMousePos(canvas, evt) { var rect = canvas.getBoundingClientRect(); return { x: evt.clientX - rect.left, y: evt.clientY - rect.top }; }
function l(e){ console.log(e); }

function menuUpdate(){
    var now = Date.now();
	var delta = (now - then);
	then = now;
	if(mousePos!=undefined){
	  	if((mousePos.y>475) && (mousePos.x>789) && (mousePos.x<1024) && (mousePos.y<511)){ // arcade mode
			menuHover(475, delta); if(mouseDown){ menuArcadeMode(); }
	  	}else if((mousePos.y>512) && (mousePos.x>789) && (mousePos.x<1024) && (mousePos.y<548)){  // time attack
			menuHover(512, delta);	
	  	}else if((mousePos.y>555) && (mousePos.x>789) && (mousePos.x<1024) && (mousePos.y<590)){ // slingshot
			menuHover(555, delta);	
	  	}else if((mousePos.y>659) && (mousePos.x>789) && (mousePos.x<1024) && (mousePos.y<695)){ // option
			menuHover(659, delta);	
	  	}else if((mousePos.y>699) && (mousePos.x>789) && (mousePos.x<1024) && (mousePos.y<735)){ // quit
			menuHover(699, delta);	
	  	}else{
		    menuHoverOut(delta);	
		}
		menuMove(delta);
	}
    ctx.drawImage(menuBgImg, 0, 0);
	
	ctx.drawImage(menuTitleImg, 20, 20);
	
	ctx.drawImage(menuArcadeImg, demWidth - 145, demHeight - 300);
	ctx.drawImage(menuTimeattackImg, demWidth - 230, demHeight - 260);
	ctx.drawImage(menuSlingshotImg, demWidth - 195, demHeight - 220);
	ctx.drawImage(menuOptionsImg, demWidth - 160, demHeight - 140);
	ctx.drawImage(menuQuitImg, demWidth - 100, demHeight - 100);
	// draw menu item	
	ctx.beginPath();
	ctx.rect(790, hoverIndicator.cy, 234, 35);
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
	  if(n>=len){ sharedLoad(); }  
	}); 
	 
	loader.start(); 	
}

function stopTimer(){ if(timer!=null){ window.clearInterval(timer); timer = null; } } // stop updaten 

