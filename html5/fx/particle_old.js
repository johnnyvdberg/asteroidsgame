window.onload = function(){
	var canvas = document.getElementById("canvas")
	var context = canvas.getContext("2d");
	
	//Make canvas occupy the full page
	var W = window.innerWidth, H = window.innerHeight;
	canvas.width = W;
	canvas.height = H;
	
	var particles = [];
	
	//Lets create some particles now
	var particle_count = 100;
	for(var i = 0; i<particle_count.length;i++)
	{
		particles.push(new particle());
	}
	
	function particle()
	{
		//Speed, life, location, life, colors
		//Speed range = -2.5 to 2.5
		this.speed = {x: -2.5+Math.random()*5, y: -2.5+Math.random()*5}
		
		//Location = center of the screen
		this.location = {x: W/2, y: H/2};
		
		//Radius range 10-30
		this.radius = 10+Math.random()*20;
		
		//Life range = 20-30
		this.life = 20+Math.random()*10;
		this.remaining_life = this.life;
		
		//Colors
		this.r = Math.round(Math.random()*255);
		this.g = Math.round(Math.random()*255);
		this.b = Math.round(Math.random()*255);
	}
	
	function draw()
	{
		//Painting the canvas black
		context.fillStyle = "black";
		context.fillRect(0,0,W,H);
		
		for(var i = 0; i < particles.length;i++)
		{
			var p = particles[i];
			context.beginPath();
			
			//Change opacity according to ttl
			p.opacity = Math.round(p.remain_life/p.life*100)/100
			//context.fillStyle = "rgba(255,255,255," + p.opacity + ")";
			
			//Random color
			var gradient = ctx.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
			gradient.addColorStop(0, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
			gradient.addColorStop(0.5, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
			gradient.addColorStop(1, "rgba("+p.r+", "+p.g+", "+p.b+", 0)");
			context.fillStyle = gradient;
			context.arc(p.location.x, p.location.y, p.radius, Math.PI*2, false);
			context.fill();
			
			//Move particles
			p.remaining_life--;
			p.radius--;
			p.location.x += p.speed.x;
			p.location.y += p.speed.y;
			
			//Regenerate particles
			if(p.remaining_life < 0 || p.radius < 0)
			{
				//New particle replacing the dead one
				particles[i] = new particle();
			}
		}
	}
	
	setInterval(draw,33);
}