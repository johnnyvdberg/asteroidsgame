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
	  { id: 'menu0', url:'music/menu/206-vangelis-dream_in_an_open_place.mp3'},
	  { id: 'menu1', url:'music/menu/01-Vangelis-Heaven-and-Hell.mp3'},
	  // game music
	  { id: 'game0', url:'music/game/09-hypnosis-oxygene-dps-cut.mp3'},
	  { id: 'game1', url:'music/game/01_from_the_dawn_of_time-atm.mp3'},
	  { id: 'game2', url:'music/game/01_power_run.mp3'},
	  { id: 'game3', url:'music/game/02_humanoid_invasion.mp3'},
	  { id: 'game4', url:'music/game/03_space_dance.mp3'},
	  { id: 'game5', url:'music/game/08_time-atm.mp3'},
	  { id: 'game6', url:'music/game/103-vangelis-blade_runner_end_titles.mp3'},
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
function hideLoader(){ document.body.style.backgroundImage = ''; }
function showLoader(){ document.body.style.backgroundImage = 'images/menu/loader.gif'; }
function getMousePos(canvas, evt) { var rect = canvas.getBoundingClientRect(); return { x: evt.clientX - rect.left, y: evt.clientY - rect.top }; }
function l(e){ console.log(e); }
function supportsLocalStorage() { return ('localStorage' in window) && window['localStorage'] !== null; }
function set(key,value){ if(supportsLocalStorage()){ localStorage["asshole.asstroids."+key] = value; }else{ return null; } }
function get(key){ if(supportsLocalStorage()){ if(localStorage != null){ return localStorage["asshole.asstroids."+key]; }else{ return null; } }else{ return null; } }
function stopTimer(){ if(timer!=null){ window.clearInterval(timer); timer = null; } } // stop updaten 
function cmp(ymax, ymin, xmax, xmin){ if(mousePos.y>ymax && mousePos.y<ymin && mousePos.x>xmax && mousePos.x<xmin){return true;}else{return false;} } //Cursor position

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
	menuPlayClick();
	if(hide){canvasHide();}
	stopTimer();
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
  l('id3:');
  l(currentPlaylist[currentMusicIndex].id3);
  currentPlaylist[currentMusicIndex].setVolume(40); 
  currentPlaylist[currentMusicIndex].play({ onfinish: function() { playNextItem(); } });	
}

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
function Init(){
	
    canvas = document.createElement("canvas");
	canvas.width= demWidth; 
	canvas.height= demHeight;
	canvas.style.display = "none";
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);
	
	canvas.addEventListener('mousemove', function(evt) { mousePos = getMousePos(canvas, evt); }, false);
	
	canvas.addEventListener('mousedown', function(e) {
		if(mouseDownAble){ 
			mouseDown = true;
			setTimeout(function(){mouseDownAble = true;}, 500) 
		}else{ setTimeout(function(){mouseDownAble = true;}, 100) }
	},false);
	
	canvas.addEventListener('mouseup', function(e) { mouseDown = false; },false); 
		
	// load sound
    var tries = 0;
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
		  l('Reboot html5 only');
		  if(tries==1){ l('failed, loading without sound.'); loadSounds(); }
		}
	});
	
}

window.onload = function(e){ Init(); }