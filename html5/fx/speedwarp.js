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
	
	function draw()
	{
		context.fillStyle = 'black';
		context.fillRect(0,0,W,H);
		//context.globalCompositeOperation = "source-atop";
		//Load base background
		context.drawImage(img, 0, 0, img.width, img.height);

		//Load oscillating image
		context.drawImage(img, warp.speed.x, warp.speed.y, img.width, img.height);
		//New value
		var time = (new Date()).getTime();
		warp.speed.x = Math.sin(time / 30) * 1.3 + 0.5;
		warp.speed.y = -Math.sin(time / 30) * 1.3 + 0.5;
		warping();
		//console.log('Speed ' + warp.speed.x + ',' + warp.speed.y);
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