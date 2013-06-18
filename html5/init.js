//OPTIONS
//=======================================================
var menuMusic = Boolean(get("menuMusic", true));
var menuAnimate = Boolean(get("menuAnimate", true));
var fullscreen = Boolean(get("fullscreen", true));

var graphicsQuality = Number(get("graphicsQuality", 2));
var difficulty = Number(get("difficulty", 1));
var menuSound = Number(get("menuSound", 0));

var musicVolume = Number(get("musicVolume", 50));
var effectsVolume = Number(get("effectsVolume", 50));
//alert(musicVolume+", "+effectsVolume+", "+fullscreen+", "+graphicsQuality+", "+difficulty+", "+menuAnimate+", "+menuMusic);
//=======================================================

var timer = null; 
var mousePos = null;
var soundManager;
var currentMusicIndex = -1;
var currentPlaylist = Array();
var playMusic = true;
var musicType; // 1 = menu, 2 = game

var mouseDown;
var mouseDownAble = true;
var demWidth = window.innerWidth;
var demHeight = window.innerHeight;
var now;
var delta;
var soundNames = [
      // menumusic
	  { id: 'menu0', url:'music/menu/01-Vangelis-Heaven-and-Hell.mp3'},
	  { id: 'menu1', url:'music/menu/206-vangelis-dream_in_an_open_place.mp3'},
	  // game music
	  { id: 'game0', url:'music/game/hypnosis-oxygene-cut.mp3'},
	  { id: 'game1', url:'music/game/koto-from_the_dawn_of_time-cut.mp3'},
	  { id: 'game2', url:'music/game/koto-time-atm-cut.mp3'},
	  { id: 'game3', url:'music/game/laserdance-humanoid_invasion-cut.mp3'},
	  { id: 'game4', url:'music/game/laserdance-power_run.mp3'},
	  { id: 'game5', url:'music/game/laserdance-space_dance-cut.mp3'},
	  { id: 'game6', url:'music/game/vangelis-blade_runner_end_titles-cut.mp3'},
	  // menu sounds
	  { id: 'click', url:'sounds/menu/clicksound.mp3'}, 
	  { id: 'hover1', url:'sounds/menu/hoversound.mp3'},
	  { id: 'hover2', url:'sounds/menu/hoversound.mp3'},
	  { id: 'hover3', url:'sounds/menu/hoversound.mp3'},
	  { id: 'hover4', url:'sounds/menu/hoversound.mp3'},
	  // game sounds
	  { id: 'explosion', url:'sounds/game/explosion.mp3'},
	];


function canvasHide(){ showLoader(); canvas.style.display = 'none'; }
function canvasShow(){ hideLoader(); canvas.style.display = ''; }
function hideLoader(){ document.getElementsByTagName("body")[0].style.backgroundImage = ''; }
function showLoader(){ document.getElementsByTagName("body")[0].style.backgroundImage = 'images/menu/loader.gif'; }
function getMousePos(canvas, evt) { var rect = canvas.getBoundingClientRect(); return { x: evt.clientX - rect.left, y: evt.clientY - rect.top }; }
function l(e){ console.log(e); }
function supportsLocalStorage() { return ('localStorage' in window) && window['localStorage'] !== null; }
function set(key,value){ if(value == false){value = ""} if(supportsLocalStorage()){ localStorage["asshole.asstroids."+key] = value.toString(); }else{ return null; } }
function get(key, def){ if(supportsLocalStorage()){ if((localStorage != null)&&(localStorage["asshole.asstroids."+key]!=undefined)){ return localStorage["asshole.asstroids."+key].toString(); }else{ return def.toString(); } }else{ return def.toString(); } }
function stopTimer(){ if(timer!=null){ window.clearInterval(timer); timer = null; } } // stop updaten 
function cmp(ymax, ymin, xmax, xmin){ if(mousePos.y>=ymax && mousePos.y<=ymin && mousePos.x>=xmax && mousePos.x<=xmin){return true;}else{return false;} } //Cursor position
function barpos(bar){return (290-(bar * 2.13));}

function drawImageRotated(img,x,y,w,h,r){
	ctx.save();
	ctx.translate(x+(w/2),y+(h/2));
	ctx.rotate(r);
	ctx.translate((-(w/2)),(-(h/2)));
	ctx.drawImage(img,0,0);
	ctx.restore();	
}

function drawScaled(img,x,y,w,h,s){
	ctx.save();
	ctx.translate(x+(w/2),y+(h/2));
	ctx.scale(s,s);
	ctx.translate((-(w/2)),(-(h/2)));
	ctx.drawImage(img,0,0);
	ctx.restore();	
}

//SWITCH TO OTHER VIEWS
function switchScreen(scr, hide){
	stopTimer();
	menuPlayClick();
	if(hide){canvasHide();}
	scr();
}

function getDelta(){ now = Date.now(); delta = (now - then); then = now; } // tijdverschil berkenen tussen nu en laatste keer

/////////////////////////////////
/// music functions
////////////////////////////////
function InitPlaylist(type){ // 1 = menu, 2 = game
  stopMusic();
  currentMusicIndex = -1; // init op -1 dan word bij play index op 0 gezet
  musicType = type;
  var done = false;
  var tmpname;
  var i = 0;
  if(type==1){ tmpname = 'menu';}else{ tmpname = 'game'; }
  while(!done){ // look for all music items starting with menu or game that are numbered from 0
	if(soundManager.getSoundById(tmpname+i)!=null){ currentPlaylist[i] = soundManager.getSoundById(tmpname+i); i++; }else{ done = true;	}
  }
  checkPlayMusic();	
}

function playNextItem(){
  currentMusicIndex++;	
  if(currentMusicIndex>=currentPlaylist.length){ currentMusicIndex = 0; }	
  playItem();  	
}

function playItem(){
  playVolume();	
  currentPlaylist[currentMusicIndex].play({ onfinish: function() { playNextItem(); } });		
}

function playVolume(){ if(currentPlaylist[currentMusicIndex]!=undefined){currentPlaylist[currentMusicIndex].setVolume(musicVolume); }}

function stopMusic(){ if(currentPlaylist[currentMusicIndex]!=undefined){ if(currentPlaylist[currentMusicIndex].playState == 1){ currentPlaylist[currentMusicIndex].stop(); } } }

function checkPlayMusic(){ if(musicType==1){  playMusic = menuMusic;  }else{ playMusic = gameMusic; } if(playMusic){ playNextItem(); }else{ stopMusic(); } } // kijk of ie mag spelen
	
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
	  if(n>=len){ menuLoad(); }  
	}); 
	 
	loader.start(); 	
}


/////////////////////////
/// begin
///////////////////////
// load sound
var SoundmanagerTries = 0;
function Init(){
    canvas = document.createElement("canvas");
	canvas.width= demWidth; 
	canvas.height= demHeight;
	canvas.style.display = "none";
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);
	
	canvas.addEventListener('mousemove', function(evt) { mousePos = getMousePos(canvas, evt); }, false);
	
	canvas.addEventListener('mousedown', function(e) { if(mouseDownAble){ mouseDown = true; } },false);
	
	canvas.addEventListener('mouseup', function(e) { mouseDownAble = true; mouseDown = false;},false); 
		

	soundManager.setup({
		url: 'soundmanager2/swf/', 
		useHTML5Audio: true,
		//preferFlash: false,
		onready: function() { loadSounds();  },
		ontimeout: function(status) { 
		  //l('Loading flash error: The status is ' + status.success + ', the error type is ' + status.error.type);
		  soundManager.useHTML5Audio = true; 
          soundManager.preferFlash = false; 
          soundManager.reboot(); 
		  l('Reboot html5 only: '+SoundmanagerTries);
		  if(SoundmanagerTries==1){ l('failed, loading without sound.'); loadSounds(); }
		  SoundmanagerTries++;
		}
	});
	
}

window.onload = function(e){ Init(); }