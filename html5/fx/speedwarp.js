window.onload = function(){
	var canvas = document.getElementById("canvas")
	var context = canvas.getContext("2d");
	context.globalAlpha=0.25;
	
	//Make canvas occupy the full page
	var W = 800, H = 600;
	canvas.width = W;
	canvas.height = H;
	var img = new Image();
	img.src = 'star.png'
	var minimap = new Image();
	minimap.src = 'minimap.png'
	
	var asteroid = new Image();
	asteroid.src = 'asteroid.png'
	
	angle = 10;
	distance = 50;
	multiplier = 1
	
	var warp = new image();
	/////////////////////////////////////
	/////  Background Oscillation   /////
	/////////////////////////////////////
	
	function image()
	{
		//Speed, life, location, life, colors
		//Speed range = -1 to 1
		this.speed = {x: -1+Math.random()*2, y: -1+Math.random()*2}
		
		//Location = center of the screen
		this.location = {x: W/2, y: H/2};
	}
	
	function planet()
	{		
		//Location
		this.location = {angle: Math.random()*100, distance: Math.random()*100};
	}
	
	function draw()
	{
		//Load base background
		context.fillStyle = 'black';
		context.fillRect(0,0,W,H);
		context.drawImage(img, 0, 0, img.width, img.height);

		//warping();
		minimapRender();
		planetIndicator(100,100,"Class M","15,457,874,047",75,"Algara VI",true,2);
		
	}
	
	function minimapRender()
	{
		//Test every angle
		if(angle > 100)
		{
			angle = 0.5;
		}
		else
		{
			angle = angle + 0.5;
		}
		//Test every distance
		if(distance > 100)
		{
			multiplier = -0.5;
		}
		else if(distance < 20)
		{
			multiplier = 0.5;
		}
		distance += multiplier;
		
		//////////////////////
		////Minimap player////
		//////////////////////
		
		//Draw minimap
		context.drawImage(minimap, W - minimap.width/2, 0, minimap.width/2, minimap.height/2);
		
		planetCollision = -1;
		//Draw planets on minimap
		for(var i = 0; i < 5; i++)
		{
			//If planet exists
			if(planets[i] != null)
			{
				//Calculate location
				miniplanetx = ((planets[i].distance/2) * -Math.cos((planets[i].angle/100)*(2*Math.PI))) + (W - minimap.width/2 + 75);
				miniplanety = ((planets[i].distance/2) * Math.sin((planets[i].angle/100)*(2*Math.PI))) + 75;
				
				//Draw planet
				context.beginPath();
				context.fillStyle ="#000000";
				context.strokeStyle ="#00ffff";
				context.strokeWidth=3;
				context.arc(miniplanetx, miniplanety, 2, 0, 2 * Math.PI, false);
				context.stroke();
				context.closePath();
				
				//Calculate collision
				if(Math.abs(distance - planets[i].distance) < 2)
				{
					planetCollision = i;
				}
			}
		}
		
		//Calculate and draw orbit path
		miniassx = ((distance/2) * -Math.cos((angle/100)*(2*Math.PI))) + (W - minimap.width/2 + 70);
		miniassy = ((distance/2) * Math.sin((angle/100)*(2*Math.PI))) + 70;
		
		context.beginPath();
		context.strokeWidth=1;
		context.arc(W - minimap.width/2 + 75, 75, distance/2, 0, 2 * Math.PI, false);
		if(planetCollision == -1){
			context.strokeStyle = "white";
		}else{
			//Draw collision course
			//context.arc(W - minimap.width/2 + 75, 75, distance/2, (angle/100)*(2*Math.PI), (planets[planetCollision].angle/100)*(2*Math.PI), true);
			//console.log((2*Math.PI)/angle + ',' +(Math.PI)/planets[planetCollision].angle);
			//console.log((angle/100)*(2*Math.PI) + ',' +(planets[planetCollision].angle/100)*(2*Math.PI));
			context.strokeStyle = "red";
		}
		context.stroke();
		context.closePath();
		
		//Draw asteroid in orbit
		context.drawImage(asteroid, miniassx, miniassy, 10, 10);
	}
	
	function planetIndicator(x, y, type, population, requiredSpeed, name, left, performanceLevel)
	{
		sizeX = 200;
		sizeY = 75;
	
		//Draw border
		context.beginPath();
		context.strokeWidth=1;
		context.strokeStyle = "green";
		context.rect(x, y, sizeX, sizeY);
		context.fillStyle = "rgba(0, 255, 0, 0.15)";
		context.fill();
		context.stroke();
		context.closePath();
		
		//Draw pointing line thingie
		context.beginPath();
		if(left)
		{
			context.moveTo(x, y + sizeY);
			context.lineTo(x - 10, y + sizeY + 5);
		}
		else
		{
			context.moveTo(x + sizeX, y + sizeY);
			context.lineTo(x + sizeX + 10, y + sizeY + 5);
		}
		context.stroke();
		context.closePath();
		
		//Draw prestige scanlines
		for(i = 0; performanceLevel == 2 && i < sizeY/7; i++)
		{
			context.beginPath();
			context.strokeStyle = "rgba(0, 255, 0, 0.04)";
			context.moveTo(x, y + i*7);
			context.lineTo(x + sizeX, y + i*7);
			context.stroke();
			context.closePath();
		}
		
		//Write generic stuff
		context.font = 'bold 8pt Arial Black';
		context.fillStyle = 'Green'
		context.fillText('Name', x + 10, y + 16);
		context.fillText('Type', x + 10, y + 32);
		context.fillText('Pop', x + 10, y + 48);
		context.fillText('Speed', x + 10, y + 64);
		
		//Write actual values
		context.fillText(name, x + 100, y + 16);
		context.fillText(type, x + 100, y + 32);
		context.fillText(population, x + 100, y + 48);
		
		//Add progressbar
		context.beginPath();
		context.strokeWidth=1;
		context.strokeStyle = "green";
		context.rect(x + 100, y + 56, (requiredSpeed/100)*(sizeX - 110), 8);
		context.fill();
		context.stroke();
		context.closePath();
	}
	
	////////////////////////////////////
	//////     Warpdrive          //////
	////////////////////////////////////
	
	var warpZ = 14,
    units = 200,
    stars = [],
    cycle = 0,
    Z = 0.025 + (1/25 * 2);
	
	// setup aliases
	var Rnd = Math.random,
    Sin = Math.sin,
    Floor = Math.floor;
	
	// function to reset a star object
	function resetstar(a)
	{
		a.x = (Rnd() * W - (W * 0.5))-0.5 * warpZ;
		a.y = (Rnd() * H - (H * 0.5))-0.5 * warpZ;
		a.speed = 0.03 + -0.02+Math.random()*0.04
		a.z = warpZ;
		a.px = 0;
		a.py = 0;
	}
	
	// initial star setup
	for (var i=0, n; i<units; i++)
	{
		n = {};
		resetstar(n);
		stars.push(n);
	}
	
	function resetplanet(a)
	{
		a.angle = Math.random()*100;
		a.distance = Math.random()*60 + 40;
	}
	
	planets = []
	// initial planet setup
	for (var i=0, plnt; i<5; i++)
	{
		plnt = {};
		resetplanet(plnt);
		planets.push(plnt);
	}
	
	var warping = function()
	{
		// clear background
		//context.fillStyle = "#0000";
		//context.fillRect(0, 0, W, H);
   
		// mouse position to head towards
		var cx = W / 2,
		cy = H / 2;
   
		// update all stars
		var sat = Floor(Z * 500);       // Z range 0.01 -> 0.5
		if (sat > 100) sat = 100;
		for (var i=0; i<units; i++)
		{
			var n = stars[i],            // the star
			xx = n.x / n.z,          // star position
			yy = n.y / n.z,
			e = (1.0 / n.z + 1) * 2;   // size i.e. z
      
			if (n.px !== 0)
			{
				// hsl colour from a sine wave
				context.strokeStyle = "hsl(" + ((cycle * i) % 360) + "," + sat + "%,80%)";
				//context.strokeStyle = "rgb(200,200,200)";
				context.lineWidth = e;
				context.beginPath();
				context.moveTo(xx + cx, yy + cy);
				context.lineTo(n.px + cx, n.py + cy);
				context.stroke();
			}
      
			// update star position values with new settings
			n.px = xx;
			n.py = yy;
			n.z -= n.speed;
      
			// reset when star is out of the view field
			if (n.z < Z || n.px > W || n.py > H)
			{
				// reset star
				resetstar(n);
			}
		}
   
   // colour cycle sinewave rotation
   cycle += 0.01;
};

	
	setInterval(draw,33);
}