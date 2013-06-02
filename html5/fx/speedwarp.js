window.onload = function(){
	var canvas = document.getElementById("canvas")
	var context = canvas.getContext("2d");
	
	//Make canvas occupy the full page
	var W = 800, H = 600;
	canvas.width = W;
	canvas.height = H;
	var img = new Image();
	img.src = 'star.png'
	
	var warp = new image();
	
	
	function image()
	{
		//Speed, life, location, life, colors
		//Speed range = -1 to 1
		this.speed = {x: -1+Math.random()*2, y: -1+Math.random()*2}
		
		//Location = center of the screen
		this.location = {x: W/2, y: H/2};
		
		//Colors
		this.r = Math.round((Math.random()*200)+55);
		this.g = Math.round((Math.random()*200)+55);
		this.b = Math.round((Math.random()*200)+55);
	}
	
	function draw()
	{
		context.fillStyle = 'black';
		context.fillRect(0,0,W,H);
		//context.globalCompositeOperation = "source-atop";
		//Load base background
		//context.drawImage(img, 0, 0, img.width, img.height);

		//Load oscillating image
		context.drawImage(img, warp.speed.x, warp.speed.y, img.width, img.height);
		//New value
		var time = (new Date()).getTime();
		warp.speed.x = Math.sin(time / 30) * 1.3 + 0.5;
		warp.speed.y = -Math.sin(time / 30) * 1.3 + 0.5;
		console.log('Speed ' + warp.speed.x + ',' + warp.speed.y);
	}
	
	setInterval(draw,33);
}