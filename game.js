var canvas = document.getElementById('game')
var ctx = canvas.getContext('2d')
var leftArr = false;
var rightArr = false;

class Player {
	constructor(x,y,w,h,sprite){
		this.x=x
		this.y=y
		this.w=w;
		this.h=h
		this.sprite=sprite
	}
	draw(){
		ctx.fillStyle='white';
		ctx.fillRect(this.x,this.y,this.w,this.h);
	}
	move(){
		if (leftArr)
			this.x-=5;
		if (rightArr)
			this.x+=5;
	}

}
player = new Player(400,270,30,30);

function drawCanvas(){
	ctx.fillStyle='lightblue'
	ctx.fillRect(0,0,500,500)
}
function drawTiles(){
	var leftDown=new Image();
	leftDown.src = "C:/Users/smook/Desktop/js13kgames/tiles/down-left.png"
	var rightDown=new Image();
	rightDown.src = "C:/Users/smook/Desktop/js13kgames/tiles/down-right.png"
	var middleDown=new Image();
	middleDown.src = "C:/Users/smook/Desktop/js13kgames/tiles/down-middle.png"

	ctx.drawImage(leftDown,0,0,16,16,0,300,25,25);
	ctx.drawImage(rightDown,0,0,16,16,475,300,25,25)
	for(var i=25;i<475;i+=25){
		ctx.drawImage(middleDown,0,0,16,16,i,300,25,25);
	}
}
function eventHandler(){
	window.addEventListener('keydown', function(event){
		 if(event.keyCode == 37) // left
		 	leftArr = true
	     if(event.keyCode == 39) // right
	     	rightArr = true
	},false);
	window.addEventListener('keyup', function(event){
		if(event.keyCode == 37) // left
		 	leftArr = false
	     if(event.keyCode == 39) // right
	     	rightArr = false
	},false)
}


function game(){
	drawCanvas();
	drawTiles();
	player.draw();
	player.move();
}
setInterval(game,1000/60);
eventHandler();