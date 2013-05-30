window.onload = function(){
	var canvas = document.getElementById("canvas")
	var context = canvas.getContext("2d");
	
	//Make canvas occupy the full page
	var W = 800, H = 600;
	canvas.width = W;
	canvas.height = H;
	
	var particles = [];
	
	//Lets create some particles now
	var particle_count = 300;
	for(var i = 0; i< particle_count;i++)
	{
		particles.push(new particle());
	}
	
	function particle()
	{
		//Speed, life, location, life, colors
		//Speed range = -2.5 to 2.5
		this.speed = {x: -5+Math.random()*10, y: -5+Math.random()*10}
		
		//Location = center of the screen
		this.location = {x: W/2, y: H/2};
		
		//Radius range 10-30
		this.radius = 40+Math.random()*40;
		
		//Life range = 20-30
		this.life = 10+(Math.random()*100);
		this.remaining_life = this.life;
		
		//Colors
		this.r = Math.round((Math.random()*125)+125);
		this.g = Math.round(Math.random()*25);
		this.b = Math.round(Math.random()*25);
	}
	
	function draw()
	{
		//Painting the canvas black
		context.fillStyle = 'black';
		context.fillRect(0,0,W,H);
		
		for(var i = 0; i < particles.length;i++)
		{
			var p = particles[i];
			if(p!=null){
			context.beginPath();
			
			//Change opacity according to ttl
			p.opacity = Math.round(p.remain_life/p.life*100)/100
			//context.fillStyle = "rgba(255,255,255," + p.opacity + ")";
			
			//Random color
			var gradient = context.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
			
			////Not working
			//gradient.addColorStop(0, "rgba(" + p.r + "," + p.g + "," + p.b + "," + p.opacity + ")");
			//gradient.addColorStop(0.5, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
			//gradient.addColorStop(1, "rgba("+p.r+", "+p.g+", "+p.b+", 0)");
			
			gradient.addColorStop(0, 'rgba(' + p.r + ', ' + p.g + ', ' + p.b + ', ' + '100)');
			//gradient.addColorStop(1, 'rgba(' + p.r + ', ' + p.g + ', ' + p.b + ', ' + p.opacity + ')');
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
				particles[i] = null;
			}
			}
		}
	}
	
	setInterval(draw,33);
}