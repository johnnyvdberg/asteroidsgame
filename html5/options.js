//==================================================================
function optionLoad(){
	var loader = new PxLoader();
	
	menuBgImg = loader.addImage('images/menu/bg.png');
	menuTitleImg = loader.addImage('images/menu/title.png');
	menuQuitImg = loader.addImage('images/menu/quit.png');
	
	menuAnimateImg = loader.addImage('images/menu/menuAnimate.png');
	menuMusicImg = loader.addImage('images/menu/menuMusic.png');
	
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
			 if(mouseDown){ switchScreen(menuLoad, false); }
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
	
	ctx.drawImage(menuAnimateImg, demWidth / 2, demHeight / 2 + 30);
	ctx.drawImage(menuMusicImg, demWidth / 2, demHeight /2);
	
	if(menuAnimate){ ctx.drawImage(menuCheckedImg, demWidth / 2 - 40, demHeight /2 + 30); }else{ ctx.drawImage(menuCheckboxImg, demWidth / 2 - 40, demHeight /2 + 30); }
	if(menuMusic){ ctx.drawImage(menuCheckedImg, demWidth / 2 - 40, demHeight / 2); }else{ ctx.drawImage(menuCheckboxImg, demWidth / 2 - 40, demHeight /2); }
	
	//Draw menu hover effect
	ctx.beginPath();
	ctx.rect(demWidth - 235, hoverIndicator.cy, 234, 35);
	ctx.fillStyle = "rgba(255,255,255,"+(hoverIndicator.showing/1000)+")";
	ctx.fill();
}