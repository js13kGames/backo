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
var tiles = [];
var tilesRunDown = false;
var baseTile = new Image();
baseTile.src = "../js13kgames_entry/tiles/1.png";
var hostileInteractable = new Image();
hostileInteractable.src = "../js13kgames_entry/tiles/hostile.png";
var neutralInteractable = new Image();
neutralInteractable.src = "../js13kgames_entry/tiles/neutral.png";
var beneficialInteractable = new Image();
beneficialInteractable.src = "../js13kgames_entry/tiles/beneficial.png";
//


class Game {
    constructor(status, gravity) {
        this.gravity = gravity;
        this.status = status; // 0 intro, 1 menu (selection), 2 gameplay, 3 menu during gameplay
    }

    drawCanvas() {
        var my_gradient = ctx.createLinearGradient(0, 0, 0, 320);
        my_gradient.addColorStop(0, "darkblue");
        my_gradient.addColorStop(1, "lightblue");
        ctx.fillStyle = my_gradient;
        ctx.fillRect(0, 0, 500, 500);
    }
    
    drawTiles() { 
        for (var i = 0; i < 500; i += 25) {
            ctx.drawImage(baseTile, 0, 0, 16, 16, i, 475, 25, 25);
            if (!tilesRunDown) tiles.push([i, 475]);
        }
        tilesRunDown = true;
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
            console.log('(moving up) player.jY: ' + this.jY);
            console.log('(moving up) player.x: ' + this.x);
            console.log('(moving up) player.y: ' + this.y);
            console.log('(moving up) player.x_direction: ' + this.x_direction);
            console.log('(moving up) player.y_direction: ' + this.y_direction);
            console.log('(moving up) player.verticalCollision: ' + this.verticalCollision());
            console.log('(moving up) player.horizontalCollision: ' + this.horizontalCollision());
            console.log('(moving up) game.gravity: ' + game.gravity);
            console.log('---------------------------------------');
            if (this.jY == 80) {
                this.y_direction = -1;
                game.gravity = true;
                console.log('(after max jump Y reached) player.jY: ' + this.jY);
                console.log('(after max jump Y reached) player.x: ' + this.x);
                console.log('(after max jump Y reached) player.y: ' + this.y);
                console.log('(after max jump Y reached) player.x_direction: ' + this.x_direction);
                console.log('(after max jump Y reached) player.y_direction: ' + this.y_direction);
                console.log('(after max jump Y reached) player.verticalCollision: ' + this.verticalCollision());
                console.log('(after max jump Y reached) player.horizontalCollision: ' + this.horizontalCollision());
                console.log('(after max jump Y reached) game.gravity: ' + game.gravity);
                console.log('---------------------------------------');
                return;
            }
            this.y -= 10;
            this.jY += 10;
        }
        if (this.x_direction == -1 && this.horizontalCollision() != 'left') 
            this.x -= playerVelocityX;
        if (this.x_direction == 1 && this.horizontalCollision() != 'right') 
            this.x += playerVelocityX;
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
player = new Player(100, 0, 250, 450, 15, 30);

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
            player.x_direction = -1;
            if(!ejected) wasLeft=true;
            console.log('(keydown: left) player.x: ' + player.x);
            console.log('(keydown: left) player.y: ' + player.y);
            console.log('(keydown: left) player.x_direction: ' + player.x_direction);
            console.log('(keydown: left) player.y_direction: ' + player.y_direction);
            console.log('(keydown: left) player.verticalCollision: ' + player.verticalCollision());
            console.log('(keydown: left) player.horizontalCollision: ' + player.horizontalCollision());
            console.log('(keydown: left) game.gravity: ' + game.gravity);
            console.log('---------------------------------------');
        } 
        if (event.keyCode == 39) { // right
            player.x_direction = 1;
            if (!ejected) wasLeft=false;
            console.log('(keydown: right) player.x: ' + player.x);
            console.log('(keydown: right) player.y: ' + player.y);
            console.log('(keydown: right) player.x_direction: ' + player.x_direction);
            console.log('(keydown: right) player.y_direction: ' + player.y_direction);
            console.log('(keydown: right) player.verticalCollision: ' + player.verticalCollision());
            console.log('(keydown: right) player.horizontalCollision: ' + player.horizontalCollision());
            console.log('(keydown: right) game.gravity: ' + game.gravity);
            console.log('---------------------------------------');
        } 
    }, false);
    window.addEventListener('keyup', function(event) {
        if (event.keyCode == 37) { // left
            if (player.x_direction == 1) return;
            player.x_direction = 0;
            if(!ejected) wasLeft=true;
            console.log('(keyup: left) player.x: ' + player.x);
            console.log('(keyup: left) player.y: ' + player.y);
            console.log('(keyup: left) player.x_direction: ' + player.x_direction);
            console.log('(keyup: left) player.y_direction: ' + player.y_direction);
            console.log('(keyup: left) player.verticalCollision: ' + player.verticalCollision());
            console.log('(keyup: left) player.horizontalCollision: ' + player.horizontalCollision());
            console.log('(keyup: left) game.gravity: ' + game.gravity);
            console.log('---------------------------------------');
        } 
        if (event.keyCode == 39) { // right
            if (player.x_direction == -1) return;
            player.x_direction = 0;
            if (!ejected) wasLeft=false;
            console.log('(keyup: right) player.x: ' + player.x);
            console.log('(keyup: right) player.y: ' + player.y);
            console.log('(keyup: right) player.x_direction: ' + player.x_direction);
            console.log('(keyup: right) player.y_direction: ' + player.y_direction);
            console.log('(keyup: right) player.verticalCollision: ' + player.verticalCollision());
            console.log('(keyup: right) player.horizontalCollision: ' + player.horizontalCollision());
            console.log('(keyup: right) game.gravity: ' + game.gravity);
            console.log('---------------------------------------');
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