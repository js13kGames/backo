var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

//player movement variables
var playerVelocityX = 5;
var gravityValue = 10;

//
var upArr = false;
//Moved projectile parameters into the projectile class.

//canvas variables
var width = 500
var height = 500

var tiles = [];
for (var i = 0; i < 500; i += 25) {
    tiles.push([i, 475]);
}
var firstTile = tiles[0];
tiles.push([firstTile[0] - 25, 475]);

var baseTile = new Image();
baseTile.src = "../js13kgames_entry/tiles/1.png";
var baseTile2 = new Image();
baseTile.src = "../js13kgames_entry/tiles/2.png";

var openingSlopeTile = new Image();
openingSlopeTile.src = "../js13kgames_entry/tiles/3.png";
var closingSlopeTile = new Image();
closingSlopeTile.src = "../js13kgames_entry/tiles/4.png";

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
        this.slope = false;
    }

    drawCanvas() {
        var my_gradient = ctx.createLinearGradient(0, 0, 0, 320);
        my_gradient.addColorStop(0, "darkblue");
        my_gradient.addColorStop(1, "lightblue");
        ctx.fillStyle = my_gradient;
        ctx.fillRect(0, 0, 500, 500);
    }

    drawTiles() {
        if (this.leftArr && !randomTile.hitPlayer) { //now stops moving when playa is hit by obstacle
            var lastTile = tiles[tiles.length - 1];
            tiles.push([lastTile[0] - 25, 475]);
            // console.log(tiles);
            for (var i = 0; i < tiles.length; i++) {
                ctx.drawImage(baseTile, 0, 0, 16, 16, tiles[i][0], tiles[i][1], 25, 25);
                tiles[i][0] += 5
            }

            var slopeChance = Math.random(); // 1% chance of getting a slope
            if (slopeChance <= 0.01) {
                this.slope = true;
                console.log("SLOPE ACTIVATED")
                // this.drawSlope();

            }

        } else
            for (var i = 0; i < tiles.length; i++)
                ctx.drawImage(baseTile, 0, 0, 16, 16, tiles[i][0], tiles[i][1], 25, 25);
    }

    // drawSlope(){
    //     var lengthSlope = Math.floor(Math.random() * (7-3) + 3);
    //     var heightSlope = Math.floor(Math.random() * (3-1) + 1);
    //     var x = 475
    //     console.log("Slope with length " + lengthSlope + " and height " + heightSlope + " initialized")
    //     for(var i = 0; i<=heightSlope; i++){
    //         tiles.push([-25,x]);
    //         x-=25;
    //     }
    //     for(var i = tiles.length - 1- lengthSlope; i >= tiles.length - (lengthSlope + heightSlope); i--)
    //         ctx.drawImage(openingSlopeTile, 0, 0, 16, 16, tiles[i][0], tiles[i][1], 25, 25);

    //     var lastUpperTile = tiles[tiles.length-1];
    //     lastUpperTile[0]-=25;


    // }       
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
        this.jumpForce = 15; //jump speed
        this.verticalCollision = false;
        this.horizontalCollision = false;
        this.oldY = 0; //save Y before jumping
        this.jumpHeight = 90; //how high should the player go from jump point - must be divisible by this.jumpforce

    }

    draw() {
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    jump() {
        if (upArr && this.verticalCollision) {
            this.oldY += this.jumpForce;
            this.y -= this.jumpForce;
            console.log(this.oldY);
        }

    }

    fall() {
        if (!this.verticalCollision && !this.playerWasOnTop) //Fall if player not on ground or on top of object
        {
            this.y += 5;
        }
        if (this.y == 445 || this.playerWasOnTop) //stop falling if on ground or on object
        {
            this.verticalCollision = true;
            this.oldY = 0;

        } else if (this.oldY > this.jumpHeight) //stop ascending when reaching max jump height
        {
            upArr = false;
            this.verticalCollision = false;


        }


    }



}

player = new Player(100, 0, 450, 420, 20, 30);

class Projectile {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.ejected = false;
        this.wasLeft = false; //refers to player
        this.hitEnemy = false;
    }

    draw() {
        ctx.drawImage(neutralInteractable, 0, 0, 16, 16, this.x, this.y, this.w, this.h);

    }
    stay() //lock to the player
    {
        if (!this.eject()) {
            if (this.wasLeft) { // stay to the left of the player  
                this.x = player.x - 10;
                this.y = player.y;
            } else if (!this.wasLeft) {
                this.x = player.x + 15; // stay to the right of the player
                this.y = player.y;
            }
        } else //if ejected 
        {

            if (this.wasLeft) //if player was facing left projectile fires left
                this.x -= 8;
            if (!this.wasLeft)
                this.x += 8;


        }

    }
    eject() {
        if (!this.ejected) return false
        if (this.ejected) return true
    }
    reset() //reset currently called in recurring, can be made to be called when hitting enemy
    {
        if (this.x > 600 || this.x < -100 || this.hitEnemy == true) //when projectile goes out of bounds
        {
            this.x = -100;
            this.ejected = false;
            this.hitEnemy = false;

            //  if (player.x_direction==1)
            // wasLeft=false;
            // else if(player.x_direction==-1)
            // wasLeft=true;
        }
    }
}
projectile = new Projectile(10, 10, 10, 10);

class RandomTile {
    constructor(w, tile) {
        this.x = -100;
        this.w = w;
        this.h = 40; // random object height
        this.y = 450 - (30 * (this.h / 30 - 1)); //makes sure object is always above ground
        this.tile = tile;
        this.random = 0;
        this.appear = false;
        this.hitPlayer = false;
        this.playerWasOnTop = false; //tells the player if the player is on top of object
    }

    decideIfAppear() {
        if (game.leftArr)
            this.random = Math.random() * 101;
        if (this.random > 95) //appear if true
        {
            this.appear = true;
        }
        if (this.appear) {
            this.appearnow();
        }
    }

    appearnow() {

        ctx.drawImage(this.tile, this.x, this.y, this.w, this.h);


        if (game.leftArr && !this.hitPlayer) // if game is scrolling and player is not hit
        {
            this.x += 5; //tile moves weee
            // console.log(this.y);
        }
        if (this.x > 600) //reset when going off screen
        {
            this.appear = false; //appearn() will stop being called
            this.w=20 * Math.floor((Math.random()*5)+1) //must be bigger than 20 and divisible by 20
            this.x = -100; // reset at original position on the left
            this.h = 10+10*Math.floor((Math.random()*5)+1); //new object height //must at least 20 and divisible by 10
            this.y = 450 - (30 * (this.h / 30 - 1)); //adjust y to new height
            
        }
        if (Math.abs(this.x - player.x) == this.w   && player.x > this.x) //when player and object collide on x axis
        {
            if (player.y + player.h / 2 > (this.y - this.h / 2)) // if player isnt in the air over the obstacle
            this.hitPlayer = true;

            else this.hitPlayer = false;
        }
    }

    playerOnTop() {
        if (Math.abs(this.y - player.y) == 30 && Math.abs(this.x - player.x) < this.w &&player.x > this.x-20) {

            player.playerWasOnTop = true;
         
        } else if (player.playerWasOnTop) {

            player.playerWasOnTop = false;
            if (!upArr) {
                upArr = false;
                player.verticalCollision = false;
            }
        }
    }
}
randomTile = new RandomTile(100, baseTile);


function eventHandler() {
    window.addEventListener('keydown', function(event) {
        if (event.keyCode == 38) // up
        {
            upArr = true;
        }
        if (event.keyCode == 32) // space
        {
            projectile.ejected = true;
        }
        if (event.keyCode == 37) { // left
            game.leftArr = true;
            if (!projectile.ejected) projectile.wasLeft = true;
        }
        if (event.keyCode == 39) { // right
            game.rightArr = true;
            if (!projectile.ejected) projectile.wasLeft = false;
        }
    }, false);
    window.addEventListener('keyup', function(event) {

        if (event.keyCode == 37) { // left
            if (player.x_direction == 1) return;
            game.leftArr = false;
            if (!projectile.ejected) projectile.wasLeft = true;
        }
        if (event.keyCode == 39) { // right
            if (player.x_direction == -1) return;
            game.rightArr = false;
            if (!projectile.ejected) projectile.wasLeft = false;
        }
    }, false);
}

class Enemy {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.life = 2;
        this.dead = false;
        this.verticalCollision = false;
    }

    head()
    {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x+this.w/4, this.y-this.w/2, this.w/2, this.h/2)
        ctx.fillStyle = 'white';
        ctx.fillRect((this.x+this.w/4)+3,(this.y-this.w/2)+2,this.w/8,this.h/8)
        ctx.fillRect((this.x+this.w/4)+9,(this.y-this.w/2)+2,this.w/8,this.h/8)
    }

    draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
    fall() {
        if (!this.verticalCollision && !this.playerWasOnTop) //Fall if player not on ground or on top of object
        {
            this.y += 5;
        }
        if (this.y >= 445 + (30 - this.h)) //stop falling if on ground or on object
            this.verticalCollision = true;
        else this.verticalCollision = false;
    }
    move() {
        if (game.leftArr && !randomTile.hitPlayer) {
            this.x += 5;
            
        }
    }
    gothit() {
        if (Math.abs(projectile.x - this.x) < 30 && Math.abs(projectile.y - this.y) < 30 && projectile.hitEnemy == false) {

            projectile.hitEnemy = true;
            
            SlideBackWhenHit(function () {
                    
                enemy.x-=4; 
             }, 1000/60, 25); //25 = number of times process repeats
            this.life--;
            if (this.life == 1) {
                this.h /= 2;
                this.w /= 2;
                this.y -= 50;
                
            }
        }

        if (this.life == 0) {
            this.dead = true;
        }
    }


}

enemy = new Enemy(150, 350, 30, 30)

function SlideBackWhenHit(callback, delay, repetitions) {
    var x = 0;
   
    var intervalID = window.setInterval(function () {

       callback();

       if (++x === repetitions) {
           window.clearInterval(intervalID);
       }
    }, delay);
}

//Functions containing class function exec order
function EnemyThings() {
    if (!enemy.dead) {
        enemy.draw();
        enemy.head();
        enemy.fall();
        enemy.move();
        enemy.gothit();
    }
}

function ProjectileDoesThings() {
    projectile.stay();
    projectile.draw()
    projectile.reset();
}

function PlayerDoesThings() {
    player.fall();
    player.jump();
    player.draw();

}
//



function recurring() {
    game.drawCanvas();
    game.drawTiles();
    itrct1.draw();
    itrct2.draw();
    itrct3.draw();
    randomTile.decideIfAppear();
    randomTile.playerOnTop();
    PlayerDoesThings();
    EnemyThings();
    ProjectileDoesThings();
}
setInterval(recurring, 1000 / 60);
eventHandler();