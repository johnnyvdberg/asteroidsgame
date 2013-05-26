var menuimg;
var timer = null; 

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
}


function canvasHide(){ showloader(); canvas.style.display = 'none'; }
function canvasShow(){ hideLoader(); canvas.style.display = ''; }
function hideLoader(){ document.body.style.backgroundImage = ''; }
function showLoader(){ document.body.style.backgroundImage = 'images/menu/loader.gif'; }


function menuUpdate(){
    ctx.drawImage(menuimg, 0, 0);	
}

function menuArcadeMode(){
    canvasHide();	
    stopTimer();
    setTimeout("gameLoadImages();",1000); // show off loader 1 second longer, remove later
}

function stopTimer(){ if(timer!=null){ window.clearInterval(timer); timer = null; } } // stop updaten 

