//==================================================================
function optionLoad(){
	var loader = new PxLoader();
	
	menuBgImg = loader.addImage('images/menu/bg.png');
	menuTitleImg = loader.addImage('images/menu/title.png');
	menuQuitImg = loader.addImage('images/menu/quit.png');
	
	menuAnimateImg = loader.addImage('images/menu/menuAnimate.png');
	menuMusicImg = loader.addImage('images/menu/menuMusic.png');
	fullscreenImg = loader.addImage('images/menu/fullscreen.png');
	graphicsImg = loader.addImage('images/menu/graphics.png');
	difficultyImg = loader.addImage('images/menu/difficulty.png');
	musicVolumeImg = loader.addImage('images/menu/musicVolume.png');
	effectsVolumeImg = loader.addImage('images/menu/effectsVolume.png');
	
	lowImg = loader.addImage('images/menu/low.png');
	mediumImg = loader.addImage('images/menu/medium.png');
	highImg = loader.addImage('images/menu/high.png');
	
	easyImg = loader.addImage('images/menu/easy.png');
	normalImg = loader.addImage('images/menu/normal.png');
	hardImg = loader.addImage('images/menu/hard.png');
	
	barImg = loader.addImage('images/menu/bar.png');
	lineImg = loader.addImage('images/menu/line.png');
	
	arrowLeftImg = loader.addImage('images/menu/arrowLeft.png');
	arrowRightImg = loader.addImage('images/menu/arrowRight.png');
	
	menuCheckboxImg = loader.addImage('images/menu/checkbox.png');
	menuCheckedImg = loader.addImage('images/menu/checked.png');
	
	loader.addCompletionListener(function(){ 
		optionLoaded(); 
	});
	
	loader.start();
}

function optionLoaded(){
	then = Date.now();
	optionUpdate();
	timer = setInterval("optionUpdate();",1);	
	canvasShow();
}


function optionUpdate(){
	getDelta();
	
	//Cursor
	if(mousePos!=undefined){
	  	if(cmp(demHeight-100, demHeight-60, demWidth-235, demWidth)){					//quit
			 menuHover(demHeight - 100, delta); 
			 if(mouseDown && mouseDownAble){menuPlayClick(); mouseDownAble = false; switchScreen(menuLoad, false); }
			 
	  	}else if(cmp(demHeight / 2 - 195, demHeight / 2 - 169, demWidth / 2 - 100, demWidth / 2 - 74)){ 			// Menu Music
			if(mouseDown && mouseDownAble){menuPlayClick(); mouseDownAble = false; menuMusic = !menuMusic; set("menuMusic", menuMusic); checkPlayMusic();}
		
		}else if(cmp(demHeight / 2 - 155, demHeight / 2 - 129, demWidth / 2 - 100, demWidth / 2 - 74)){ 			// Menu Animate
			if(mouseDown && mouseDownAble){menuPlayClick(); mouseDownAble = false; menuAnimate = !menuAnimate; set("menuAnimate", menuAnimate);}
		
		}else if(cmp(demHeight / 2 - 115, demHeight / 2 - 79, demWidth / 2 - 100, demWidth / 2 - 74)){ 			// Fullscreen
			if(mouseDown && mouseDownAble){menuPlayClick(); mouseDownAble = false; fullscreen = !fullscreen; set("fullscreen", fullscreen);}
		
		}else if(cmp(demHeight / 2 - 30, demHeight / 2 + 5, demWidth / 2 - 100, demWidth / 2 - 66)){ 			// Graphics up
			if(mouseDown && mouseDownAble){menuPlayClick(); mouseDownAble = false; if(graphicsQuality<2){set("graphicsQuality", graphicsQuality++);}}
		
		}else if(cmp(demHeight / 2 - 30, demHeight / 2 + 5, demWidth / 2 - 290, demWidth / 2 - 256)){ 			// Graphics down
			if(mouseDown && mouseDownAble){menuPlayClick(); mouseDownAble = false; if(graphicsQuality>0){set("graphicsQuality", graphicsQuality--);}}
		
		}else if(cmp(demHeight / 2 + 10, demHeight / 2 + 45, demWidth / 2 - 100, demWidth / 2 - 66)){ 			// Difficulty up
			if(mouseDown && mouseDownAble){menuPlayClick(); mouseDownAble = false; if(difficulty<2){set("difficulty", difficulty++);}}
		
		}else if(cmp(demHeight / 2 + 10, demHeight / 2 + 45, demWidth / 2 - 290, demWidth / 2 - 256)){ 			// Difficulty down
			if(mouseDown && mouseDownAble){menuPlayClick(); mouseDownAble = false; if(difficulty>0){set("difficulty", difficulty--);}}
		
		}else if(cmp(demHeight / 2 + 100, demHeight / 2 + 138, demWidth / 2 - 300, demWidth / 2 - 54)){ 			// Music slider
			if(mouseDown){
				musicVolume = Math.round(((mousePos.x-(demWidth / 2 - 290))*0.4425));
				if(musicVolume > 100){ musicVolume = 100;}
				if(musicVolume < 0){ musicVolume = 0;}
				set("musicVolume", musicVolume);
			}
		
		}else if(cmp(demHeight / 2 + 140, demHeight / 2 + 178, demWidth / 2 - 290, demWidth / 2 - 64)){ 			// Effects slider
			if(mouseDown){
				effectsVolume = Math.round(((mousePos.x-(demWidth / 2 - 290))*0.4425));	
				if(effectsVolume > 100){ effectsVolume = 100;}
				if(effectsVolume < 0){ effectsVolume = 0;}
				set("effectsVolume", effectsVolume);
			}
		
		}else{menuHoverOut(delta);}
		menuMove(delta);
	}
	
	//Pan the background
	if(menuAnimate){
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
	
	ctx.drawImage(menuBgImg, 0 + pan.x, 0 + pan.y);
	ctx.drawImage(menuTitleImg, 20, 20);
	ctx.drawImage(menuQuitImg, demWidth - 92, demHeight - 100);
	
	
	if(menuMusic){ ctx.drawImage(menuCheckedImg, demWidth / 2 - 100, demHeight / 2 - 195); }else{ ctx.drawImage(menuCheckboxImg, demWidth / 2 - 100, demHeight /2 - 195); }
	if(menuAnimate){ ctx.drawImage(menuCheckedImg, demWidth / 2 - 100, demHeight /2 - 155); }else{ ctx.drawImage(menuCheckboxImg, demWidth / 2 - 100, demHeight /2 -155); }
	if(fullscreen){ ctx.drawImage(menuCheckedImg, demWidth / 2 - 100, demHeight /2 - 115); }else{ ctx.drawImage(menuCheckboxImg, demWidth / 2 - 100, demHeight /2 - 115); }
	
	ctx.drawImage(menuMusicImg, demWidth / 2 - 50, demHeight /2 - 200);
	ctx.drawImage(menuAnimateImg, demWidth / 2 - 50, demHeight / 2 - 160);
	ctx.drawImage(fullscreenImg, demWidth / 2 - 50, demHeight / 2 - 120);
	
	if(graphicsQuality == 0){ //LOW
		//ctx.drawImage(arrowLeftImg, demWidth / 2 - 290, demHeight / 2 - 30);
		ctx.drawImage(lowImg, demWidth / 2 - 220, demHeight / 2 - 30);	
		ctx.drawImage(arrowRightImg, demWidth / 2 - 100, demHeight / 2 - 30);
	} 
	if(graphicsQuality == 1){ //MEDIUM
		ctx.drawImage(arrowLeftImg, demWidth / 2 - 290, demHeight / 2 - 30);
		ctx.drawImage(mediumImg, demWidth / 2 - 250, demHeight / 2 - 30);
		ctx.drawImage(arrowRightImg, demWidth / 2 - 100, demHeight / 2 - 30);
	} 
	if(graphicsQuality == 2){ //HIGH
		ctx.drawImage(arrowLeftImg, demWidth / 2 - 290, demHeight / 2 - 30);
		ctx.drawImage(highImg, demWidth / 2 - 215, demHeight / 2 - 30);
		//ctx.drawImage(arrowRightImg, demWidth / 2 - 100, demHeight / 2 - 30);
	} 
	
	ctx.drawImage(graphicsImg, demWidth / 2 - 50, demHeight / 2 - 30);
	
	
	
	if(difficulty == 0){ //LOW
		//ctx.drawImage(arrowLeftImg, demWidth / 2 - 290, demHeight / 2 + 10);
		ctx.drawImage(easyImg, demWidth / 2 - 220, demHeight / 2 + 10);	
		ctx.drawImage(arrowRightImg, demWidth / 2 - 100, demHeight / 2 + 10);
	} 
	if(difficulty == 1){ //MEDIUM
		ctx.drawImage(arrowLeftImg, demWidth / 2 - 290, demHeight / 2 + 10);
		ctx.drawImage(normalImg, demWidth / 2 - 245, demHeight / 2 + 10);
		ctx.drawImage(arrowRightImg, demWidth / 2 - 100, demHeight / 2 + 10);
	} 
	if(difficulty == 2){ //HIGH
		ctx.drawImage(arrowLeftImg, demWidth / 2 - 290, demHeight / 2 + 10);
		ctx.drawImage(hardImg, demWidth / 2 - 220, demHeight / 2 + 10);
		//ctx.drawImage(arrowRightImg, demWidth / 2 - 100, demHeight / 2 + 10);
	} 
	
	ctx.drawImage(difficultyImg, demWidth / 2 - 50, demHeight / 2 + 10);
	
	
	ctx.drawImage(lineImg, demWidth / 2 - 290, demHeight / 2 + 110);
	ctx.drawImage(barImg, demWidth / 2 - barpos(musicVolume), demHeight / 2 + 100);
	ctx.drawImage(musicVolumeImg, demWidth / 2 - 50, demHeight / 2 + 100);
	
	ctx.drawImage(lineImg, demWidth / 2 - 290, demHeight / 2 + 150);
	ctx.drawImage(barImg, demWidth / 2 - barpos(effectsVolume), demHeight / 2 + 140);
	ctx.drawImage(effectsVolumeImg, demWidth / 2 - 50, demHeight / 2 + 140);
	
	//Draw menu hover effect
	ctx.beginPath();
	ctx.rect(demWidth - 235, hoverIndicator.cy, 234, 35);
	ctx.fillStyle = "rgba(255,255,255,"+(hoverIndicator.showing/1000)+")";
	ctx.fill();
}