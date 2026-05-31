const canvas = document.getElementById('board-canvas');
const ctx = canvas.getContext('2d');

// var
const width = 680;
const height = 440;

// making this so I dont have to constantly change every body of snake (i just found out that any grid size greater than 20 cause snake go kablow)
const grid_size = 20;

canvas.width = width;
canvas.height = height;

let bodyX = [];
let bodyY = [];

let snakeSize = 0;
let snakeX, snakeY;
let lastX, lastY;
let lastBodyX, lastBodyY;

let isFirstGame = false;
let gameOver = true;

let score = 0;
let appleX, appleY;
let lastSec = 0;
let direction = "Up";

// Start the game
function startGame() {
    gameOver = false;
    snakeX = 100;
    snakeY = 180;
    direction = "Up";
    snakeSize = 1;
    bodyX = [];
    bodyY = [];
    appleX = 0;
    appleY = 0;
    generateApple();
}

// End the game
function GameOver() {
    if (!gameOver) {
        gameOver = true;
        bodyX = [];
        bodyY = [];
        lastSnakeX = 0;
        lastSnakeY = 0;
        appleX = 0;
        appleY = 0;
    }
}

// Generate the plump, juicy, red apple yyum
function generateApple() {
    for (i = 0; i < 100; i++) {
        let randomX = Math.floor(Math.random() * 10);
        let randomY = Math.floor(Math.random() * 10);

        appleX = randomX * grid_size;
        appleY = randomY * grid_size;    

        for (i2 = 0; i2 < bodyX.length; i2++) {
            if (bodyX[i2] === appleX && bodyY[i2] === appleY) {
                appleX = 0;
                appleY = 0;
                score++;
                break;
            }
        }
    }

    if (snakeX === appleX && snakeY === appleY) {
        appleX = 0;
        appleY = 0;
    }

    if (appleX < 0 || appleX >= width || appleY < 0 || appleY >= width) {
        appleX = 0;
        appleY = 0;
    }
}

// Game mechanism
setInterval(() => {
    if (!gameOver) {

        if (snakeX < 0 || snakeX >= width || snakeY < 0 || snakeY >= height) { 
            GameOver();
            return;
        }

        // Die if body collide
        for (let i = 0; i < bodyX.length; i++) {
            if (bodyX[i] === snakeX) {
                if (bodyY[i] === snakeY) {
                    GameOver();
                    return;
                }
            }
        }

        // Snake movement
         switch (direction) {
            case "Up": snakeY -= grid_size; break;
            case "Down": snakeY += grid_size; break;
            case "Right": snakeX += grid_size; break;
            case "Left": snakeX -= grid_size; break;
        }

         if (bodyX.length !== 0) {
            bodyX.shift();
            bodyY.shift();
            bodyX.push(lastSnakeX);
            bodyY.push(lastSnakeY);
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

            // Yum yum nom nom sweet sweet apple
            generateApple();
        }

        lastSnakeX = snakeX;
        lastSnakeY = snakeY;

        if (bodyX.length > 0) {
            lastBodyX = bodyX[bodyX.length - 1];
            lastBodyY = bodyY[bodyY.length - 1];
        }
    }
}, 150);

// Render engine
function render() {
    // Rect
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    if (!gameOver) {
        // Generate apple Yum yum nom nom
        if (appleX === 0 || appleY === 0) {
            generateApple();
        }         

        // Draw score
        //fX + 2, fY + 2
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "15px 'Comic Relief', monospace";
        ctx.fillText("Score: " + score,  30, 15);

        // make apple generate or fall down from apple tree
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(appleX, appleY, grid_size, grid_size);

        // draw sssnake
        ctx.fillStyle = "#55FF00";
        ctx.fillRect(snakeX, snakeY, grid_size, grid_size);

        // Them eyes
        ctx.fillStyle = "#000000";
        ctx.fillRect(snakeX + 3, snakeY + 3, grid_size - 12, grid_size - 12);

        ctx.fillStyle = "#55FF00";
        for (let i = 0; i < bodyX.length; i++) {
            ctx.fillRect(bodyX[i], bodyY[i], grid_size, grid_size);
        }
    }

    if (gameOver) {
        ctx.textAlign = "center";

        // EHH game ova!
        ctx.fillStyle = "#FF0000";
        ctx.font = "50px 'Comic Relief', monospace";
        ctx.fillText("Game Over!", (width / 2), (height / 2));

        // Score
        ctx.fillStyle = "#0BFF03";
        ctx.font = "20px 'Comic Relief', monospace";
        ctx.fillText("Score : " + snakeSize, (width / 2), (height / 2) + 25);
    
        // Click to play text
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "20px 'Comic Relief', monospace";
        ctx.fillText( "Press Enter to play!", (width / 2), height - 20);

        isFirstGame = false;
    }

    requestAnimationFrame(render);
}

// Input handler
window.addEventListener('keydown', (e) => {

    if (e.key === "Enter") {
        startGame();
    } 

    switch(e.key) {
        case "ArrowUp":
        case "w":
        case "W":
            direction = "Up";
            break;

        case "ArrowDown":
        case "s":
        case "S":
            direction = "Down";
            break;
            
        case "ArrowLeft":
        case "a":
        case "A":
            direction = "Left";
            break;

        case "ArrowRight":
        case "d":
        case "D":
            direction = "Right";
            break;
    }
});

// Render
render();
