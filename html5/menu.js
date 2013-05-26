var menuimg;
var timer = null; 
var mousePos = null;

function menuLoadImages(){
	var loader = new PxLoader();
	menuimg = loader.addImage('images/menu/mainmenu.png');
	loader.addCompletionListener(function(){ menuLoaded(); });
	loader.start();
}

window.onload = function(e){
	setTimeout("menuLoadImages()",1000); // show off loader 1 second longer, remove later
};

function menuLoaded(){
	canvas = document.createElement("canvas");
	canvas.width=1280; canvas.height=720; // we should maybe build this to suit resizing
	ctx = canvas.getContext("2d");
	timer = setInterval("menuUpdate();",5);	
	document.body.appendChild(canvas); 
	
	canvas.addEventListener('mousemove', function(evt) { mousePos = getMousePos(canvas, evt); }, false); 
}


function canvasHide(){ showLoader(); canvas.style.display = 'none'; }
function canvasShow(){ hideLoader(); canvas.style.display = ''; }
function hideLoader(){ document.body.style.backgroundImage = ''; }
function showLoader(){ document.body.style.backgroundImage = 'images/menu/loader.gif'; }
function getMousePos(canvas, evt) { var rect = canvas.getBoundingClientRect(); return { x: evt.clientX - rect.left, y: evt.clientY - rect.top }; }
function l(e){ console.log(e); }

function menuUpdate(){
	if(mousePos!=undefined){
	  l(mousePos);
	  if((mousePos.y>468) && (mousePos.x>789) && (mousePos.x<1024) && (mousePos.y<515)){ 
		  menuArcadeMode();	
	  }
	}
    ctx.drawImage(menuimg, 0, 0);	
}

function menuArcadeMode(){
    canvasHide();	
    stopTimer();
    setTimeout("gameLoadImages();",1000); // show off loader 1 second longer, remove later
}

function stopTimer(){ if(timer!=null){ window.clearInterval(timer); timer = null; } } // stop updaten 

