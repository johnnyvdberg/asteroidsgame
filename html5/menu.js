var parralaxToggle = false;

if(getCookie("menuAnimate") != null){
	var menuAnimate = getCookie("menuAnimate");
}else{ var menuAnimate = true;}
 
if(getCookie("menuMusic") != null){
	var menuMusic = getCookie("menuMusic");
}else{ var menuMusic = true;}


var demWidth = window.innerWidth;
var demHeight = window.innerHeight;
var panXMode = true;
var panYMode = true;
var panBgX = 0;
var panBgY = 0;
var panBgX2 = 0;
var panBgY2 = 0;
var menuimg;
var timer = null; 
var mousePos = null;
var soundManager;
var mouseDown;
var mouseDownAble = true;
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
	
	loader.addCompletionListener(function(){ sharedLoad(); });
	loader.start();
	// sound
	//soundManager.useFlashBlock = false; 
	//soundManager.useHTML5Audio = true; 
	//soundManager.preferFlash = false;
	soundManager.setup({
		url: 'soundmanager2/swf/', 
		useHTML5Audio: true,
		//preferFlash: false,
		onready: function() { loadSounds(); },
		ontimeout: function(status) { 
		  //l('Loading flash error: The status is ' + status.success + ', the error type is ' + status.error.type);
		  soundManager.useHTML5Audio = true; 
          soundManager.preferFlash = false; 
          soundManager.reboot(); 
		  l('Reboot html5 only');
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
	l('done');
	canvas = document.createElement("canvas");
	canvas.width= demWidth; canvas.height= demHeight; // we should maybe build this to suit resizing
	ctx = canvas.getContext("2d");
	timer = setInterval("menuUpdate();",5);	
	menuUpdate();
	then = Date.now();
	document.body.appendChild(canvas); 
	menuPlayMusic();
	canvas.addEventListener('mousemove', function(evt) { mousePos = getMousePos(canvas, evt); }, false);
	canvas.addEventListener('mousedown', function(e) {
		if(mouseDownAble){ 
			mouseDown = true;
			setTimeout(function(){mouseDownAble = true;}, 500) 
		}else{ setTimeout(function(){mouseDownAble = true;}, 100) }
	},false); 
	canvas.addEventListener('mouseup', function(e) { mouseDown = false; },false); 
}

function musicLevel(){
		if(menuMusic){ soundManager.setVolume('menumusic',40); }
		else{ soundManager.setVolume('menumusic', 0);}
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


function canvasHide(){ showLoader(); canvas.style.display = 'none'; }
function canvasShow(){ hideLoader(); canvas.style.display = ''; }
function hideLoader(){ document.body.style.backgroundImage = ''; }
function showLoader(){ document.body.style.backgroundImage = 'images/menu/loader.gif'; }
function getMousePos(canvas, evt) { var rect = canvas.getBoundingClientRect(); return { x: evt.clientX - rect.left, y: evt.clientY - rect.top }; }
function l(e){ console.log(e); }

function setCookie(c_name,value,exdays){
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name){
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1){
  		c_start = c_value.indexOf(c_name + "=");
  	}
	if (c_start == -1){
  		c_value = null;
  	}else{
  		c_start = c_value.indexOf("=", c_start) + 1;
  		var c_end = c_value.indexOf(";", c_start);
  		if (c_end == -1){
			c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start,c_end));
	}
	return c_value;
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
			if(mouseDown && mouseDownAble){ menuMusic = !menuMusic; mouseDownAble = false; musicLevel(); setCookie("menuMusic", menuMusic,365);}
		}else if((mousePos.y>(demHeight - 50)) && (mousePos.x>20) && (mousePos.x<46) && (mousePos.y<(demHeight - 24))){ // toggle animation
			if(mouseDown && mouseDownAble){ menuAnimate = !menuAnimate; mouseDownAble = false; setCookie("menuAnimate", menuAnimate,365);}
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
    setTimeout("gameLoadImages();",1000); // show off loader 1 second longer, remove later
}

function menuHighscore(){
	menuPlayClick();
    canvasHide();	
    stopTimer();
    setTimeout("highscoreLoad();",1000); // show off loader 1 second longer, remove later
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

