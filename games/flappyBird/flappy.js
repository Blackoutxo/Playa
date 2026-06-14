// Canvas init
const canvas = document.getElementById('game-map');
const ctx = canvas.getContext('2d');

// Field variables
let hitbox;
var bird;

let x, y;

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

canvas.width = WIDTH;
canvas.height = HEIGHT;

let keyDown = "";

// Game update

    window.addEventListener('keydown', (e) => {
        if (e.key === "ArrowRight")
        keyDown = "RIGHT";

        if (e.key === "ArrowLeft")
            keyDown = "LEFT";
    });

// Drawing
x= 100;
y= 0;

setInterval(() => {
if (keyDown === "RIGHT") {
    x += 1;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
} else if (keyDown === "LEFT") {
    x -= 1;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

    let topX = x;
    let topY = y;

    let topTX = 90;
    let topTY = 100;

    ctx.fillStyle = "rgb(19, 228, 54)";
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.lineWidth= 6;
    ctx.strokeRect(topX, topY, topTX, topTY);

    ctx.fillRect(topX, topY, topTX, topTY);
    ctx.fillRect(topX - 30, topTY, 150, 50);

    ctx.lineWidth = 3;
    ctx.strokeRect(topX - 30, topTY, 150, 50);

    drawOutline();
}, 0.01);

function drawOutline() {
    ctx.strokeStyle = "rgb(61, 92, 228)";
    ctx.lineWidth = (WIDTH * 0.005);
    ctx.strokeRect(0, 0, WIDTH, HEIGHT);
}
