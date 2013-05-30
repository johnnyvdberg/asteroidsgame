var hsimg;

function highscoreLoad() {
	var loader = new PxLoader();
	hsimg = loader.addImage('images/highscore/bkghighscore.jpg');
	loader.addCompletionListener(function () { highscoreLoaded(); });
	loader.start();
}

function highscoreLoaded (){
	
	timer = setInterval("highscoreUpdate();",5);	
	highscoreUpdate();
	then = Date.now();
	canvas.addEventListener('mousemove', function(evt) { mousePos = getMousePos(canvas, evt); }, false);
	canvas.addEventListener('mousedown', function(e) { mouseDown = true; },false); 
	canvas.addEventListener('mouseup', function(e) { mouseDown = false; },false); 
	canvasShow();
}

function highscorePlayClick(){
    soundManager.setVolume('click',100);
    soundManager.play('click',{ onfinish: function() { } });	
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

    ctx.drawImage(hsimg, 0, 0);
	// draw menu item	
	ctx.beginPath();
	ctx.rect(790, hoverIndicator.cy, 234, 35);
	ctx.fillStyle = "rgba(255,255,255,"+(hoverIndicator.showing/1000)+")";
	ctx.fill();
}
