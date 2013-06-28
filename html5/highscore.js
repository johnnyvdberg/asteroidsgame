function highscoreLoad() {
	var loader = new PxLoader();
	
	menuBgImg = loader.addImage('images/menu/bg.png');
	menuTitleImg = loader.addImage('images/menu/title.png');
	menuQuitImg = loader.addImage('images/menu/quit.png');
	
	loader.addCompletionListener(function () { 
		highscoreLoaded(); 
	});
	loader.start();
}

function highscoreLoaded (){
	then = Date.now();
	highscoreUpdate();
	timer = setInterval("highscoreUpdate();",1);	
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

function highscoreSubmitScore(name, score){
	var highscoreString = { name: name, score: score};
	highscoreArray.push(highscoreString);	
	l(highscoreArray.sort(function(a, b) {
		var avalue = a.score,
			bvalue = b.score;
		if (avalue > bvalue) {
			return -1;
		}
		if (avalue < bvalue) {
			return 1;
		}
		return 0;
	}));
	set("highscore", JSON.stringify(highscoreString));
}

function highscoreUpdate(){
	getDelta();
	
	//Cursor
	if(mousePos!=undefined){
	  	if(cmp(demHeight-100, demHeight-60, demWidth-235, demWidth)){					//quit
			 menuHover(demHeight - 100, delta); 
			 if(mouseDown && mouseDownAble){menuPlayClick(); mouseDownAble = false; switchScreen(menuLoad, false); }
		}else{menuHoverOut(delta);}
		menuMove(delta);
	}

	//Pan the background
	if(menuAnimate){
		backgroundPanning();
	}
	
	ctx.drawImage(menuBgImg, 0 + pan.x, 0 + pan.y);
	ctx.drawImage(menuTitleImg, 20, 20);
	ctx.drawImage(menuQuitImg, demWidth - 92, demHeight - 100);
	
	//Draw menu hover effect
	ctx.beginPath();
	ctx.rect(demWidth - 235, hoverIndicator.cy, 234, 35);
	ctx.fillStyle = "rgba(255,255,255,"+(hoverIndicator.showing/1000)+")";
	ctx.fill();
}
