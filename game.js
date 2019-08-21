var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

//player movement variables
var playerVelocityX = 5;
var gravityValue = 10;

//
//projectile params
var ejected = false;
var wasLeft = false;
//
//canvas variables
var width=500
var height=500 

var tiles = [];
for (var i = 0; i < 500; i += 25) {
    tiles.push([i, 475]);
}
var firstTile = tiles[0];
tiles.push([firstTile[0]-25,475]);

var baseTile = new Image();
baseTile.src = "../js13kgames_entry/tiles/1.png";
var baseTile2 = new Image();
baseTile.src = "../js13kgames_entry/tiles/2.png";
var hostileInteractable = new Image();
hostileInteractable.src = "../js13kgames_entry/tiles/hostile.png";
var neutralInteractable = new Image();
neutralInteractable.src = "../js13kgames_entry/tiles/neutral.png";
var beneficialInteractable = new Image();
beneficialInteractable.src = "../js13kgames_entry/tiles/beneficial.png";

class Game {
    constructor(status, gravity) {
        this.gravity = gravity;
        this.status = status; // 0 intro, 1 menu (selection), 2 gameplay, 3 menu during gameplay
        this.leftArr = false;
        this.rightArr = false;
    }

    drawCanvas() {
        var my_gradient = ctx.createLinearGradient(0, 0, 0, 320);
        my_gradient.addColorStop(0, "darkblue");
        my_gradient.addColorStop(1, "lightblue");
        ctx.fillStyle = my_gradient;
        ctx.fillRect(0, 0, 500, 500);
    }
    
    drawTiles() { 
        var random;
        if(this.leftArr){
            var lastTile = tiles[tiles.length-1];
            tiles.push([lastTile[0]-25,475]); 
            // console.log(tiles);
            for (var i=0;i<tiles.length;i++){
                ctx.drawImage(baseTile, 0, 0, 16, 16, tiles[i][0], tiles[i][1], 25, 25);
                tiles[i][0]+=5
            }
        } else
            for (var i=0;i<tiles.length;i++)
                ctx.drawImage(baseTile, 0, 0, 16, 16, tiles[i][0], tiles[i][1], 25, 25);
    }
}
game = new Game(2, true);

class Interactable {
    constructor(status) {
        this.x = parseInt(Math.random() * (400 - 100) + 100);
        this.y = parseInt(Math.random() * (400 - 100) + 100);
        this.status = status; // beneficial, neutral, hostile
    }

    draw() {
        if (this.status == 'hostile') ctx.drawImage(hostileInteractable, 0, 0, 16, 16, this.x, this.y, 16, 16);
        if (this.status == 'netural') ctx.drawImage(neutralInteractable, 0, 0, 16, 16, this.x, this.y, 16, 16);
        if (this.status == 'beneficial') ctx.drawImage(beneficialInteractable, 0, 0, 16, 16, this.x, this.y, 16, 16);
    }

    activate() {

    }

    deactivate() {

    }
}

itrct1 = new Interactable('hostile');
itrct2 = new Interactable('netural');
itrct3 = new Interactable('beneficial');

class Player {
    constructor(health, shield, x, y, w, h) {
        this.health = health;
        this.shield = shield;
        this.x_direction = 0; // -1: left, 0: none, 1: right
        this.y_direction = 0; // -1: downwards, 0: none, 1: upwards
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.jY = 0; // how far up is the player from his initial Y before jumping
        
    }

    draw() {
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    move() {
        if (this.y_direction == 1) {
            if (this.jY == 80) {
                this.y_direction = -1;
                game.gravity = true;
                return;
            }
            this.y -= 10;
            this.jY += 10;
        }

    }

    verticalCollision() {
        // Tiles, -y collision
        for (var x = 0; x < tiles.length; x++)
            if (this.y + this.h - 5 >= tiles[x][1])
                return true;
        return false;
    }

    horizontalCollision() {
        // Canvas Collision
        if (this.x + this.w > 500)
            return 'right';
        if (this.x - 1 < 0)
            return 'left';
        return 'none';
    }

    processGravity() {
        if (!this.verticalCollision() && game.gravity) {
            this.y += gravityValue;
            this.jY -= 10;
            if (this.jY == 0) this.y_direction = 0;
        }
    }
}
player = new Player(100, 0, 450, 450, 15, 30);

function eventHandler() {
    window.addEventListener('keydown', function(event) {
        if (event.keyCode == 38) // up
        {
            if (player.jY <= 0) {
                player.jY = 0;
                player.y_direction = 1;
                game.gravity = false;
            }
        }
        if (event.keyCode == 32) // space
        {
            ejected=true;      
        }
        if (event.keyCode == 37) { // left
            game.leftArr = true;
            if(!ejected) wasLeft=true;
        } 
        if (event.keyCode == 39) { // right
            game.rightArr = true;
            if (!ejected) wasLeft=false;
        } 
    }, false);
    window.addEventListener('keyup', function(event) {
        if (event.keyCode == 37) { // left
            if (player.x_direction == 1) return;
            game.leftArr = false;
            if(!ejected) wasLeft=true;
        } 
        if (event.keyCode == 39) { // right
            if (player.x_direction == -1) return;
            game.rightArr = false;
            if (!ejected) wasLeft=false;
        } 
    }, false);
}

class Projectile 
{
    constructor(x,y,w,h)
    {
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
    }

    draw()
    {
        ctx.drawImage(neutralInteractable, 0, 0, 16, 16, this.x, this.y, this.w, this.h);
     
    }
    stay() //lock to the player
    {
        if(!this.eject())
        {
          
          if(wasLeft) // stay to the left of the player 
          {this.x=player.x-10; 
            this.y=player.y;
        }
          else if(!wasLeft) // stay to the right of the player
          {this.x=player.x+15; 
            this.y=player.y;
        }
        
        }
        else //if ejected 
        {
            if (wasLeft) //if player was facing left projectile fires left
            {
                this.x-=8;
            }
            if(!wasLeft)
            {
                this.x+=8;
            }
        }
   
    }
    eject()
    {    
        if (!ejected)
        return false
        if (ejected)   
        return true      
    }
     reset() //reset currently called in recurring, can be made to be called when hitting enemy
     {
         if (this.x>600 || this.x < -100) //when projectile goes out of bounds
         {
             ejected=false;
           //  if (player.x_direction==1)
            // wasLeft=false;
            // else if(player.x_direction==-1)
            // wasLeft=true;
         }
     }
}

projectile = new Projectile(10,10,10,10)
function recurring() {
    game.drawCanvas();
    game.drawTiles();
    itrct1.draw();
    itrct2.draw();
    itrct3.draw();
    player.draw();
    projectile.stay();
    projectile.draw()
    projectile.reset();
    player.move();
    player.processGravity();
}
setInterval(recurring, 1000 / 60);
eventHandler();