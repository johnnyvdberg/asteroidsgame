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
//HIGHSCORE
//=======================================================
var highscoreDummy;
var highscoreArray = [];
//=======================================================
var gamePlaying = false;
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
	  { id: 'menu0', url:'music/menu/01-Vangelis-Heaven-and-Hell.ogg'},
	  { id: 'menu1', url:'music/menu/206-vangelis-dream_in_an_open_place.ogg'},
	  // game music
	  { id: 'game0', url:'music/game/hypnosis-oxygene-cut.ogg'},
	  { id: 'game1', url:'music/game/koto-from_the_dawn_of_time-cut.ogg'},
	  // menu sounds
	  { id: 'click0', url:'sounds/menu/clicksound0.ogg'}, 
	  { id: 'hover0', url:'sounds/menu/hoversound0.ogg'},
	  { id: 'click1', url:'sounds/menu/clicksound1.ogg'}, 
	  { id: 'hover1', url:'sounds/menu/hoversound1.ogg'},
	  { id: 'click2', url:'sounds/menu/clicksound2.ogg'}, 
	  { id: 'hover2', url:'sounds/menu/hoversound2.ogg'},
	  { id: 'click3', url:'sounds/menu/clicksound3.ogg'}, 
	  { id: 'hover3', url:'sounds/menu/hoversound3.ogg'},
	  { id: 'click4', url:'sounds/menu/clicksound4.ogg'}, 
	  { id: 'hover4', url:'sounds/menu/hoversound4.ogg'},
	  // game sounds
	  { id: 'explosion', url:'sounds/game/explosion.ogg'},
	  { id: 'assexplosion', url:'sounds/game/assexplosion.mp3'},
	  { id: 'intoslomo', url:'sounds/game/intoslomo.ogg'},
	  { id: 'outofslomo', url:'sounds/game/outofslomo.ogg'},
	  { id: 'alert', url:'sounds/game/alert.mp3'},
	  // taunts
	  { id: 'taunt_win_0', url: 'sounds/game/taunt_corecrusher.ogg' },
	  { id: 'taunt_win_1', url: 'sounds/game/taunt_hastalaplanet.ogg' },
	  { id: 'taunt_win_2', url: 'sounds/game/taunt_muwhahaha.ogg' }, // death sound :P
	  { id: 'taunt_win_3', url: 'sounds/game/taunt_planetcrushed.ogg' },
	  { id: 'taunt_win_4', url: 'sounds/game/taunt_thatwasmoonploding.ogg' },
	  { id: 'taunt_hurt_0', url: 'sounds/game/taunt_help.ogg' },
	  { id: 'taunt_fail_0', url: 'sounds/game/taunt_missionfailed.ogg' }
	];
	
var soundNamesCompatibility = [
      // menumusic
	  { id: 'menu0', url:'music/menu/01-Vangelis-Heaven-and-Hell.mp3'},
	  { id: 'menu1', url:'music/menu/206-vangelis-dream_in_an_open_place.mp3'},
	  // game music
	  { id: 'game0', url:'music/game/hypnosis-oxygene-cut.mp3'},
	  { id: 'game1', url:'music/game/koto-from_the_dawn_of_time-cut.mp3'},
	  // menu sounds
	  { id: 'click0', url:'sounds/menu/clicksound0.mp3'}, 
	  { id: 'hover0', url:'sounds/menu/hoversound0.mp3'},
	  { id: 'click1', url:'sounds/menu/clicksound1.mp3'}, 
	  { id: 'hover1', url:'sounds/menu/hoversound1.mp3'},
	  { id: 'click2', url:'sounds/menu/clicksound2.mp3'}, 
	  { id: 'hover2', url:'sounds/menu/hoversound2.mp3'},
	  { id: 'click3', url:'sounds/menu/clicksound3.mp3'}, 
	  { id: 'hover3', url:'sounds/menu/hoversound3.mp3'},
	  { id: 'click4', url:'sounds/menu/clicksound4.mp3'}, 
	  { id: 'hover4', url:'sounds/menu/hoversound4.mp3'},
	  // game sounds
	  { id: 'explosion', url:'sounds/game/explosion.mp3'},
      { id: 'assexplosion', url:'sounds/game/assexplosion.mp3'},
	  { id: 'intoslomo', url:'sounds/game/intoslomo.mp3'},
	  { id: 'outofslomo', url:'sounds/game/outofslomo.mp3'},
	  { id: 'alert', url:'sounds/game/alert.mp3'},
	  // taunts
	  { id: 'taunt_win_0', url: 'sounds/game/taunt_corecrusher.mp3' },
	  { id: 'taunt_win_1', url: 'sounds/game/taunt_hastalaplanet.mp3' },
	  { id: 'taunt_win_2', url: 'sounds/game/taunt_muwhahaha.mp3' },
	  { id: 'taunt_win_3', url: 'sounds/game/taunt_planetcrushed.mp3' },
	  { id: 'taunt_win_4', url: 'sounds/game/taunt_thatwasmoonploding.mp3' },
	  { id: 'taunt_hurt_0', url: 'sounds/game/taunt_help.mp3' },
	  { id: 'taunt_fail_0', url: 'sounds/game/taunt_missionfailed.mp3' }
	];
	
var planetNames = [
		{ name: 'Ariel' },
		{ name: 'Beaumonde' },
		{ name: 'Bellerophon' },
		{ name: 'Hera' },
		{ name: 'Jiangyin' },
		{ name: 'Miranda' },
		{ name: 'Osiris' },
		{ name: 'Persephone' },
		{ name: 'Regina' },
		{ name: 'Santo' },
		{ name: 'St. Albans' },
		{ name: 'Triumph' },
		{ name: 'Aberdeen' },
		{ name: 'Angel' },
		{ name: 'Athens' },
		{ name: 'Bernadette' },
		{ name: 'Beylix' },
		{ name: 'Boros' },
		{ name: 'Constance' },
		{ name: 'Deadwood' },
		{ name: 'Ezra' },
		{ name: 'Greenleaf' },
		{ name: 'Harvest' },
		{ name: 'Highgate' },
		{ name: 'Kerry' },
		{ name: 'Liann Jiun' },
		{ name: 'Londinium' },
		{ name: 'Muir' },
		{ name: 'Newhall' },
		{ name: 'New Melbourne' },
		{ name: 'Pelorum' },
		{ name: 'Salisbury' },
		{ name: 'Shadow' },
		{ name: 'Sihnon' },
		{ name: 'Three Hills' },
		{ name: 'Verbena' },
		{ name: 'Whittier' },
		{ name: 'Druidia' },
		{ name: 'Planet Spaceballs' },
		{ name: 'Times New Roman' },
		{ name: 'Comic Sans' },
		{ name: 'Vulcan' },
		{ name: 'Omicron' },
		{ name: 'Kronos' },
		{ name: 'Bergia' },
		{ name: 'Titan' },
		{ name: 'Canceros' },
		{ name: 'Olympus' },
		{ name: 'New Vegas' },
		{ name: 'Liteon' },
		{ name: 'Olsen' },
		{ name: 'Hannibal' },
		{ name: 'Nigerium' },
		{ name: 'Eurydome' },
		{ name: 'Carme' },
		{ name: 'Natrium' }
	]
	
var planetProperties = [
		{ name: 'Barren', popMultiplier: 0.3, speedMultiplier:40 },
		{ name: 'Sulfuric', popMultiplier: 0, speedMultiplier:45 },
		{ name: 'Glacial', popMultiplier: 0.5, speedMultiplier:45 },
		{ name: 'Barren', popMultiplier: 0, speedMultiplier: 45},
		{ name: 'Sulfuric', popMultiplier: 0, speedMultiplier: 45},
		{ name: 'Molten', popMultiplier: 0, speedMultiplier: 50},
		{ name: 'Barren', popMultiplier: 0.4, speedMultiplier: 55},
		{ name: 'Terrestrial', popMultiplier: 500000000, speedMultiplier: 70},
		{ name: 'Terrestrial', popMultiplier: 750000000, speedMultiplier: 75},
		{ name: 'Terrestrial', popMultiplier: 1000000000, speedMultiplier: 80},
		{ name: 'Glacial', popMultiplier: 0.2, speedMultiplier: 80},
		{ name: 'Gas Giant', popMultiplier: 0, speedMultiplier: 100},
		{ name: 'Gas Giant', popMultiplier: 0, speedMultiplier: 100}
	]

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

function notification(x,y,width,height,textHeader, textInfo)
{
	sizeX = width;
	sizeY = height;

	//Draw border
	ctx.beginPath();
	ctx.lineWidth=1;
	ctx.strokeStyle = "green";
	ctx.rect(x, y, sizeX, sizeY);
	ctx.fillStyle = "rgba(0, 255, 0, 0.15)";
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
	
	//Draw prestige scanlines
	for(i = 0; i < sizeY/7; i++)
	{
		ctx.beginPath();
		ctx.strokeStyle = "rgba(0, 255, 0, 0.04)";
		ctx.moveTo(x, y + i*7);
		ctx.lineTo(x + sizeX, y + i*7);
		ctx.stroke();
		ctx.closePath();
	}
		
	//Write generic stuff
	ctx.font = 'bold 12pt Arial Black';
	ctx.fillStyle = 'Green';
	ctx.fillText(textHeader, x + 10, y + 5);
	ctx.font = 'bold italic 10pt Arial Black';
	ctx.fillText(textInfo, x + 10, y + 25);
}

function romanize(num) {
	if (num > 3999999) { alert('Number is too big!'); return false; }
	var result = '',
		ref = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'],
        xis = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];

    if (num <= 3999999 && num >= 4000) {
		result = '<label style="text-decoration: overline;">'+convert(num.substr(0,num.length-3))+'</label>';
        num = num.substr(num.length-3);
    }

    for (x = 0; x<ref.length; x++) {
		while(num >= xis[x]) { result = result + ref[x]; num = num - xis[x]; }
    }
    return result;
}

//SWITCH TO OTHER VIEWS
function switchScreen(scr, hide){
	stopTimer();
	menuPlayClick();
	if(hide){canvasHide();}
	scr();
}

function backgroundPanning(){
	if(pan.xMode){ 
		pan.x = pan.x - 0.050 * delta; 
		if(-pan.x > (4096 - demWidth)){ 
			pan.xMode = false; 
		} 
	}else{ 
		pan.x = pan.x + 0.1 * delta; 
		if(pan.x > 0){ 
			pan.xMode = true; 
		}
	}
	if(pan.yMode){ 
		pan.y = pan.y - 0.1 * delta; 
		if(-pan.y > (4096 - demHeight)){ 
			pan.yMode = false; 
		}
	}else{
		pan.y = pan.y + 0.050 * delta; 
		if(pan.y > 0){ 
			pan.yMode = true;
		}
	}
}

$(window).resize(function() {
  demWidth = window.innerWidth
  demHeight = window.innerHeight	
  canvas.width = demWidth; 
  canvas.height = demHeight;
  canvasxc = demWidth/2; 
  canvasyc = demHeight/2;
});

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

function getInternetExplorerVersion()
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
{
  var rv = -1; // Return value assumes failure.
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  return rv;
}
	
var realLen = 0;	
	
function loadSounds(){
	var loader = new PxLoader(),
	i, len, url, n; 
	n = 0;
	// Queue each sound for loading
	if(getInternetExplorerVersion()>-1){ var soundList = soundNamesCompatibility; } else{var soundList = soundNames; }
	for(i=0, len = soundList.length; i < len; i++) {
		url = soundList[i].url;
		if (!soundManager.canPlayURL(url)) { 
			continue; // can't be played 
		} 
		// queue the sound using the name as the SM2 id 
		if(soundList[i].id.substring(0, 5)=='hover'){
		   loader.addSound(soundList[i].id+'_1', url); 
		   loader.addSound(soundList[i].id+'_2', url); 
		   loader.addSound(soundList[i].id+'_3', url); 
		   loader.addSound(soundList[i].id+'_4', url); 
		   realLen += 4;	
		}else{
		  loader.addSound(soundList[i].id, url); 
		  realLen ++;
		}
	} 
	len = soundList.length;
	 
	// listen to load events 
	loader.addProgressListener(function(e) { 
	  n++;
	  if(n>=realLen){ menuLoad(); }  
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
	
	// initialize the sound manager 
	soundManager.url = 'soundmanager2/'; 
	soundManager.flashVersion = 9; 
	soundManager.useHighPerformance = true; // reduces delays 
	 
	// reduce the default 1 sec delay to 500 ms 
	soundManager.flashLoadTimeout = 500; 
	 
	// mp3 is required by default, but we don't want any requirements 
	soundManager.audioFormats.mp3.required = false; 
	
	soundManager.onready(function() { 
	  loadSounds(); 
	});
	
	soundManager.ontimeout(function(){
	  l('Failed to load flash, going for html5 only');
	  // no flash, go with HTML5 audio
	  soundManager.useHTML5Audio = true;
	  soundManager.preferFlash = false;
	  soundManager.reboot();	
	});
	
	highscoreDummy = get("highscore", "null");
	
	if(highscoreDummy != "null"){
		$.each(JSON.parse(highscoreDummy), function(i, obj) {
			var highscoreItem = { name: obj.name, score: obj.score, mode: obj.mode, difficulty: obj.difficulty};
			highscoreArray.push(highscoreItem);
		});
	}
}

window.onload = function(e){ Init(); }