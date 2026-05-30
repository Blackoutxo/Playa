const canvas = document.getElementById('board-canvas');
const ctx = canvas.getContext('2d');

// var
let bodyX = [];
let bodyY = [];

let snakeSize = 0;
let snakeX, snakeY;
let lastX, lastY;
let lastBodyX, lastBodyY;

let isFirstGame = false;
let gameOver = true;

let fX, tX, fY, tY;

let score = 0;
let appleX, appleY;
let delay = 0;
let lastSec = 0;
let direction = "";

let xM, yM;

let x = window.innerWidth / 2.5;
let y = window.innerHeight / 4;

let keysPressed = [];

// Draw
function render() {

    // From
    fX = x;
    fY = y;

    // To
    tX = fX + 200;
    tY = fY + 200;

    // Mid vales
    xM = tX - (200 / 2);
    yM = tY - (200 / 2);

    // Rect
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(fX - 1, fY - 1, tX + 1, tY + 1);

    ctx.fillStyle = "#000000";
    ctx.fillRect(fX, fY, tX, tY);

    if (snakeX < x || snakeX >= x + 200 || snakeY < y || snakeY >= y + 200) {
        GameOver();
    }

    if (!gameOver) {
        // Die if body collide
        for (i = 0; i < bodyX.size; i++) {
            if (bodyX.size[i] === snakeX) {
                if (bodyY.length[i] ==- snakeY) {
                    GameOver();
                    return;
                }
            }
        }

        // Draw score
        //fX + 2, fY + 2
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "4px 'Comic Relief', monospace";
        ctx.fillText("Score: " + score, fX + 2, fY + 2);

        // Generate apple Yum yum nom nom
        if (appleX === 0 || appleY === 0) {
            generateApple();
        }

        // make apple generate or fall down from apple tree
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(appleX, appleY, appleX + 20, appleY + 20);
        
   
        let divided = 250 - Math.floor(score / 10);
        if (divided < 10) divided = 10;
    
        let sec = Math.floor(Date.now() / divided);
        if (sec != lastSec) {
            delay = 0;

            // Snake movement
            if (!gameOver && currentNode != null) {
                if (keysPressed['ArrowUp']) {
                    snakeY = snakeY - 20;
                } else if (keysPressed['ArrowDown']) {
                    snakeY = snakeY + 20;
                } else if (keysPressed['ArrowLeft']) {
                    snakeX = snakeX - 20;          
                } else if (keysPressed['ArrowRight']) {
                    snakeX = snakeX + 20;
                }
            }

            if (!bodyX.length === 0) {
                bodyX.shift(bodyX.get(0));
                bodyY.shift(bodyY.get(0));
                bodyX.push(lastSnakeX);
                bodyY.push(lastSnakeY);
            }
            lastSec = sec; 
        }

        // Snake eat apple yummmm!
        if (snakeX === appleX && snakeY === appleY) {
            snakeSize++;
            
            appleX = 0;
            appleY = 0;

            //More body for snake bcs he fat and eating all those sugary apples
            if (bodyX.length === 0) {
                bodyX.push(lastSnakeX);
                bodyY.push(lastSnakeY);
            } else {
                bodyX.push(lastBodyX);
                bodyY.push(lastBodyY);
            }
        }

        lastSnakeX = snakeX;
        lastSnakeY = snakeY;

        if (!bodyX.length === 0) {
            lastBodyX = bodyX[bodyX.length - 1];
            lastBodyY = bodyY[bodyY.length - 1];
        }

        // draw sssnake
        ctx.fillStyle = "#55FF00";
        ctx.fillRect(snakeX, snakeY, snakeX + 20, snakeY + 20);

        ctx.fillStyle = "#000000";
        ctx.fillRect(snakeX + 3, snakeY + 3, snakeX + 8, snakeY + 8);

        for (i = 0; i < bodyX.length; i++) {
            ctx.fillStyle = "#55FF00";
            ctx.fillRect(bodyX.get(i), bodyY.get(i), bodyX.get(i) + 20, bodyY.get(i) + 20);
        }
    }

    if (gameOver) {

        // EHH game ova!
        ctx.fillStyle = "#FF0000";
        ctx.font = "16px 'Comic Relief', monospace";
        ctx.filltext("Game Over!", xM - 60, yM);

        // Score
        ctx.fillStyle = "#0BFF03";
        ctx.font = "8px 'Comic Relief', monospace";
        ctx.fillText("Score : " + snakeSize, xM - 28, yM + 15);
    
        // Click to play text
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "10px 'Comic Relief', monospace";
        ctx.fillText( "Click to Play!", xM - 40, tY - 10);

        isFirstGame = false;
    }
}

function GameOver() {
    gameOver = true;
    bodyX.length = 0;
    bodyY.length = 0;
    lastSnakeX = 0;
    lastSnakeY = 0;
    appleX = 0;
    appleY = 0;
}

function generateApple() {
    for (i = 0; i < 100; i++) {
        let randomX = Math.random(1, 10);
        let randomY = Math.random(1, 10);

        appleX = x + randomX * 20;
        appleY = y + randomY * 20;    

        for (i2 = 0; i2 < bodyX.length; i2++) {
            if (!body.length === 0 && bodyX.length[i2] === appleX && bodyY.length[i2] === appleY) {
                appleX = 0;
                appleY = 0;
                break;
            }
        }
    }

    if (snakeX === appleX && snakeY === appleY) {
        appleX = 0;
        appleY = 0;
    }

    if (appleX < 140 || appleX > 340 || appleY < 140 || appleY > 340) {
        appleX = 0;
        appleY = 0;
    }

    if (appleX != 0 && appleY != 0) {
        
    }
}

function startGame() {
    gameOver = false;
    snakeX = x + 100;
    snakeY = y + 180;
    direction = "Up";
    snakeSize = 1;
}

// Input handler
window.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        startGame();
    } 

    if (e.key === "ArrowUp") {
        console.log('up');
        direction = "Up";
    } else if (e.key === "ArrowDown") {
        console.log('down');
        direction = "Down";
    } else if (e.key === "ArrowLeft") {
        console.log('left');
        direction = "Left";
    } else if (e.key === "ArrowRight") {
        console.log('rght');
        direction = "Right";
    }
});
