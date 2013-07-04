//LOAD THE MENU
function insLoad(){
	var loader = new PxLoader();
	
	instructionImage = loader.addImage('images/menu/instructions.png');
	
	loader.addCompletionListener(function(){ 
		insLoaded(); 
	});
	
	loader.start();
}

//WHEN THE MENU IS LOADED
function insLoaded(){
	hoverIndicator.showing = 0;
	then = Date.now();
	insUpdate();
	timer = setInterval("insUpdate();",1);	
	canvasShow();
}


//DRAWING THE MENU
function insUpdate(){
	getDelta();
	
	var x = (canvas.width/2)-200;
	var y = (canvas.height/2)-200;
	
	//Cursor
	if(mousePos!=undefined){
	  	if(cmp(y+353, y+388, x+70, x+330)){ 					// arcade mode
			 menuHover(y+353, delta);  if(mouseDown && mouseDownAble){mouseDownAble = false; switchScreen(gameLoad, true); }			
		}else{menuHoverOut(delta);}
		menuMove(delta);
	}
	
	
	

    ctx.fillStyle="#000000";
    ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.drawImage(instructionImage,x,y);
	
	//Draw menu hover effect
	ctx.beginPath();
	ctx.rect(x+70, hoverIndicator.cy, 260, 35);
	ctx.fillStyle = "rgba(255,255,255,"+(hoverIndicator.showing/1000)+")";
	ctx.fill();
}

