function screenLoad(){																		//CHANGE SCEEEN TO UNIQUE NAME
	var loader = new PxLoader();
	
	//LOAD ALL IMAGES
	/*
	menuBgImg = loader.addImage('images/menu/bg.png');
	menuTitleImg = loader.addImage('images/menu/title.png');
	menuQuitImg = loader.addImage('images/menu/quit.png');
	*/
	
	loader.addCompletionListener(function(){ 
		screenLoaded(); 																	//CHANGE SCEEEN TO UNIQUE NAME
	});
	
	loader.start();
}

function screenLoaded(){																	//CHANGE SCEEEN TO UNIQUE NAME
	then = Date.now();
	screenUpdate();																			//CHANGE SCEEEN TO UNIQUE NAME
	timer = setInterval("screenUpdate();",1);												//CHANGE SCEEEN TO UNIQUE NAME
	canvasShow();
}

function screenUpdate(){																	//CHANGE SCEEEN TO UNIQUE NAME
	getDelta();
	
	
	//Cursor
	/*
	if(mousePos!=undefined){
	  	if(cmp(demHeight-100, demHeight-60, demWidth-235, demWidth)){					//quit
			 menuHover(demHeight - 100, delta); 
			 if(mouseDown && mouseDownAble){mouseDownAble = false; switchScreen(menuLoad, false); }
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
		backgroundPanning();
	}
	ctx.beginPath();
	ctx.rect(demWidth - 235, hoverIndicator.cy, 234, 35);
	ctx.fillStyle = "rgba(255,255,255,"+(hoverIndicator.showing/1000)+")";
	ctx.fill();
	*/
}