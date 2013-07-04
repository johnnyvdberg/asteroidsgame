var showHighscorePopup = false;
var popupElementsDrawn = false;
var currentScore;
var currentMode;

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

// Roep deze functie aan om de popup in beeld te krijgen (werkt alleen als je in highscore-scherm bent)
function highscoreSubmitPopup(score, mode){
	currentScore = score;
	currentMode = mode;
	showHighscorePopup = true;
}

// Deze functie slaat de score daadwerkelijk op in de localstorage
function highscoreSubmitScore(name, score, mode){
	var highscoreString = { name: name, score: score, mode: mode, difficulty: difficulty};
	highscoreArray.push(highscoreString);	
	set("highscore", JSON.stringify(highscoreArray));
}

// Deze functie tekent de popup
function highscoreDrawPopup(){
	xSize = 200;
	ySize = 100;
	x = (canvas.width / 2) - (xSize / 2);
	y = (canvas.height / 2) - (ySize / 2);

	// Draw border
	ctx.beginPath();
	ctx.lineWidth=1;
	ctx.strokeStyle = "green";
	ctx.rect(x, y, xSize, ySize);
	ctx.fillStyle = "rgba(0, 255, 0, 0.15)";
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
		
	// Write generic stuff
	ctx.font = 'bold 12pt Arial Black';
	ctx.fillStyle = 'Green';
	ctx.fillText("Submit score", x + 10, y + 25);
	ctx.font = 'bold italic 10pt Arial Black';
	ctx.fillText("Score: " + currentScore, x + 10, y + 45);
	ctx.fillText("Name: ", x + 10, y + 65);
	
	// Add html elements
	if(popupElementsDrawn == false){
		var txtName = "<div id='divScorePopup' style='position:fixed;top:"+(y + 51)+"px;left:"+(x + 60)+"px;z-index:30;'><input type='text' id='txtName'></input>";
		var btnSubmitScore = "<br /><input id='btnSubmitScore' type='button' value='Submit' onclick='saveScore();'></div>";
		var appendString = txtName + btnSubmitScore;
		$("#scorePopup").append(appendString);
		popupElementsDrawn = true;
	}
}

// Click event van submit knop
function saveScore(){
	if($('#txtName').val() != ""){
		highscoreSubmitScore($('#txtName').val(), currentScore, currentMode);
		showHighscorePopup = false;
		popupElementsDrawn = false;
		$('#txtName').remove();
		$('#btnSubmitScore').remove();
		$('#divScorePopup').remove();
	}
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
	
	// HIGHSCORES DISPLAYEN
	var distanceFromMid = 100 // Afstanden waarmee gewerkt wordt
	var xPos = (canvas.width / 2) - (distanceFromMid * 2); // X positie berekend vanuit het midden met een offset
	var yPos = 200; // Y positie
	ctx.font = '24pt SpaceOne'; // Titel font
	ctx.fillStyle = 'White' // Fill kleur
	ctx.fillText('Name', xPos - distanceFromMid, yPos - 20);
	ctx.fillText('Score', xPos + (distanceFromMid * 2), yPos - 20);
	ctx.font = '20pt SpaceOne'; // Scores font
	
	// Gesorteerde array
	var sortedHighscores = highscoreArray.sort(function(a, b) {
		// Parse de score naar een floating point
		var avalue = parseFloat(a.score),
			bvalue = parseFloat(b.score);
		if (avalue > bvalue) {
			return -1;
		}
		if (avalue < bvalue) {
			return 1;
		}
		return 0;
	});
	
	// Loop door de gesoorteerde highscores
	var maxScoresToShow = 10;
	for(i = 0; i < sortedHighscores.length && i < maxScoresToShow; i++){
		// Begin met het tekenen van een streep
		ctx.beginPath();
		ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
		ctx.moveTo(xPos - distanceFromMid, yPos + 3 + (28 * (i + 1)));
		ctx.lineTo(xPos + (distanceFromMid * 4), yPos + 3 + (28 * (i + 1)));
		ctx.stroke();
		ctx.closePath();
		
		// Plaats de naam
		ctx.fillText(sortedHighscores[i].name, xPos - distanceFromMid, yPos + (28 * (i + 1)));
		
		// Als de score 13 of meer tekens bevat, cap die score!
		if(sortedHighscores[i].score.length > 12){
			sortedHighscores[i].score = "999999999999";
		}
		
		// Omdat we voor elke character een spot reserveren en we nullen willen toevoegen als getal te kort is
		// loop ik 12x
		for(ii = 0; ii < 12; ii++){
			// Als de lengte van de score reikt tot aan positie 12, dan de score schrijven
			// anders een 0 plaatsen
			if(12 - sortedHighscores[i].score.length <= ii){
				// een '1' is te klein, dus dan een offset van 5 nemen
				var singleScoreOffset = 0;
				if(sortedHighscores[i].score[ii - (12 - sortedHighscores[i].score.length)] == "1"){
					singleScoreOffset = 5;
				}
				
				ctx.fillText(sortedHighscores[i].score[ii - (12 - sortedHighscores[i].score.length)], xPos + (distanceFromMid * 2) + (16 * ii) + singleScoreOffset, yPos + (28 * (i + 1)));
			} else {
				ctx.fillText("0", xPos + (distanceFromMid * 2) + (16 * ii), yPos + (28 * (i + 1)));
			}
		}
	}
	
	if(showHighscorePopup){
		highscoreDrawPopup();
	}
	
	// Draw menu hover effect
	ctx.beginPath();
	ctx.rect(demWidth - 235, hoverIndicator.cy, 234, 35);
	ctx.fillStyle = "rgba(255,255,255," + (hoverIndicator.showing / 1000) + ")";
	ctx.fill();
}
