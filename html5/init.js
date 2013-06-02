var timer = null; 
var mousePos = null;
var soundManager;
var mouseDown;
var mouseDownAble = true;
var demWidth = window.innerWidth;
var demHeight = window.innerHeight;
var now;
var delta;
var soundNames = [
	  { id: 'menumusic', url:'music/01-Vangelis-Heaven-and-Hell.mp3'},
	  { id: 'click', url:'sounds/menu/clicksound.mp3'}, 
	  { id: 'hover1', url:'sounds/menu/hoversound.mp3'},
	  { id: 'hover2', url:'sounds/menu/hoversound.mp3'},
	  { id: 'hover3', url:'sounds/menu/hoversound.mp3'},
	  { id: 'hover4', url:'sounds/menu/hoversound.mp3'}
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

function getDelta(){
	now = Date.now();
	delta = (now - then);
	then = now;
}

window.onload = function(e){ Init(); }