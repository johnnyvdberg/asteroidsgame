//CHANGE SCEEEN TO OWN NAME

function screenLoad(){
	var loader = new PxLoader();
	
	//LOAD ALL IMAGES
	/*
	menuBgImg = loader.addImage('images/menu/bg.png');
	menuTitleImg = loader.addImage('images/menu/title.png');
	menuQuitImg = loader.addImage('images/menu/quit.png');
	*/
	
	loader.addCompletionListener(function(){ 
		screenLoaded(); 
	});
	
	loader.start();
}

function screenLoaded(){
	then = Date.now();
	screenUpdate();
	timer = setInterval("screenUpdate();",1);	
	canvasShow();
}

function screenUpdate(){
	getDelta();
	
	
	//Cursor
	/*
	if(mousePos!=undefined){
	  	if(cmp(demHeight-100, demHeight-60, demWidth-235, demWidth)){					//quit
			 menuHover(demHeight - 100, delta); 
			 if(mouseDown){ switchScreen(menuLoad, false); }
	  	}else{menuHoverOut(delta);}
		menuMove(delta);
	}
	*/
	
	
	//BACKGROUND TITLE AND QUIT BUTTON
	/*
	ctx.drawImage(menuBgImg, 0 + pan.x, 0 + pan.y);
	ctx.drawImage(menuTitleImg, 20, 20);
	ctx.drawImage(menuQuitImg, demWidth - 92, demHeight - 100);
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
	ctx.beginPath();
	ctx.rect(demWidth - 235, hoverIndicator.cy, 234, 35);
	ctx.fillStyle = "rgba(255,255,255,"+(hoverIndicator.showing/1000)+")";
	ctx.fill();
	*/
}