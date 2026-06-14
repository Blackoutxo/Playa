// Canvas init
const canvas = document.getElementById('game-map');
const ctx = canvas.getContext('2d');

// Docs
const initScreen = document.querySelector('.first-screen');
const startButton = document.querySelector('.start-button');

// Field variables
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

canvas.width = WIDTH;
canvas.height = HEIGHT;

let key = "";

// Check start button
startButton.addEventListener('click', (e) => {
    initScreen.classList.add('hide');

    setTimeout(() => {
        initScreen.style = "transform: translateY(-100%);";
    }, 1200);
});

// Game update
setInterval(() => {


}, 1);

function drawOutline() {
    ctx.strokeStyle = "rgb(61, 92, 228)";
    ctx.lineWidth = (WIDTH * 0.005);
    ctx.strokeRect(0, 0, WIDTH, HEIGHT);
}

// Input handler
window.addEventListener('keydown', (e) => {
    
});
