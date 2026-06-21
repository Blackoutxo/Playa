const levels = [
    {
        // Game data attributes
        level: "Beginner",
        ROW: 9,
        COLM: 9,
        MINES: 10,

        // Screen Attributes
        GRIDW: 20,
        GRIDH: 44, // using percentage basis for these values
        LEFT: 40,
        TOP: 25,
    },

    {
        level: "Intermediate",
        ROW: 14,
        COLM: 16,
        MINES: 30,

        GRIDW: 35.5,
        GRIDH: 68,
        LEFT: 32,
        TOP: 14,
    },

    {
        level: "Expert",
        ROW: 13,
        COLM: 27,
        MINES: 99,

        GRIDW: 59.6,
        GRIDH: 63.5,
        LEFT: 20,
        TOP: 20,
    }
]

// Field vars
let ROW;
let COLM;
let MINES;

let widthS = window.innerWidth;
let heightS = window.innerHeight;

let gridWidth;
let gridHeight;
let LEFT;
let TOP;

let level = 2;

let board = [];
let score = 0;
let gameOver = false;
let gameStarted = false;

// Documents
const gameArea = document.querySelector('.game-area');
const grid = document.getElementById('grid');
const mineCount = document.querySelector('.mine-count');
const scoreCount = document.querySelector('.score-count');
const icon = document.querySelector('.icon');

// Header and loading screen it self
const header = document.querySelector('.header');
const loadingScreen = document.querySelector('.loading-screen');

// loading screen buttons
const buttons = document.querySelectorAll('.beginner, .intermediate, .expert, .back-home');

// Restart and back button
const restartArea = document.querySelector('.restart-btn-area');
const restartButton = document.querySelector('.new-game');

const backArea = document.querySelector('.back-btn-area');
const backButton = document.querySelector('.back-button');

// Toggle theme
const theme = localStorage.getItem('theme');

if (theme === '1') {
    document.documentElement.classList.add('dark');
}

// Re-size Event listener
window.addEventListener('resize', () => {
    widthS = window.innerWidth;
    heightS = window.innerHeight;

    updateDisplay();
});

// ------ Good game innit? ------ //
function init() {
    grid.innerHTML = '';
    board = [];
    gameOver = false;

    // Fetch level data
    const levelData = levels[level];

    // Initialize values
    ROW = levelData.ROW;
    COLM = levelData.COLM;
    MINES = levelData.MINES;

    // Set grid screen size & positioning
    updateDisplay();

    // Dynamic values for rows and column
    grid.style.gridTemplateColumns = `repeat(${COLM}, 2.1vw)`;
    grid.style.gridTemplateRows = `repeat(${ROW}, 2.1vw)`;

    for (let r = 0; r < ROW; r++) {
        board[r] = [];

        for (let c = 0; c < COLM; c++) {
            board[r][c] = {
                row: r,
                col: c,
                isMine: false,
                isFlagged: false,
                neighbourMines: 0,
                element: null 
            };
        }
    }

    // Place bombs
    let minesPlanted =  0;

    while(minesPlanted < MINES) {
        let r = Math.floor(Math.random() * ROW);
        let c = Math.floor(Math.random() * COLM);

        if(!board[r][c].isMine) {
            board[r][c].isMine = true;
            minesPlanted++;
        }

        animateCounter(minesPlanted, mineCount);
    }

    // Check each and every neightbour's cell
    for (let r = 0; r < ROW; r++) {
        for (let c = 0; c < COLM; c++) {
            if (!board[r][c].isMine) {
                board[r][c].neighbourMines = countMineNeighbour(r, c);
            }
        }
    }

    // Render the elements
    for (let r = 0; r < ROW; r++) {
        for (let c = 0; c < COLM; c++) {
            const cellElements = document.createElement('div');
            cellElements.classList.add('cell');

            board[r][c].element = cellElements;

            if (cellElements.classList.contains('mine')) {
                gameOver = true;
                gameStarted = false;
            }
            
            // Left Click listener
            cellElements.addEventListener('click', () => {
                gameStarted = true;

                revealCell(r, c);
            });

            // Right Click listener
            cellElements.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                flagged(r, c);
            });

            grid.appendChild(cellElements);
        }
    }
}

// Loading screen buttons
let clicked = false;
function checkButtonClick() {
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            button.classList.add('clicked');
        
            // Set the level
            level = button.getAttribute('data-level');

            // Set clicked as tru
            clicked = clicked ? false : true;

            if (clicked) LevelSelected(button);

            // Init game when selected a level
            init();
        });

        button.addEventListener('animationend', () => {
            button.classList.remove('clicked');
        });
    });
}

// Back button
backButton.addEventListener('click', () => {
    BackButtonPressed();
});

// Area detection for button visibility
restartArea.addEventListener('mouseover', () => {
    restartButton.classList.add('hovered');
});

restartArea.addEventListener('mouseout', () => {
    restartButton.classList.remove('hovered');
});

backArea.addEventListener('mouseover', () => {
    backButton.classList.add('show');
});

backArea.addEventListener('mouseout', () => {
    backButton.classList.remove('show');
});

// Restart button
restartButton.addEventListener('click', () => {
    restart();
});

// Animate upon level selection 
function LevelSelected(btn) {
    btn.classList.add('clicked');
    
    buttons.forEach(button => button.classList.add('fade'));

    header.classList.remove('back');
    header.classList.add('enter-game');

    icon.classList.remove('back');
    icon.classList.add('enter-game');

    loadingScreen.classList.remove('slideIn');
    loadingScreen.classList.add('slideOut');
}

function BackButtonPressed(btn) {
    buttons.forEach(button => button.classList.remove('fade'));

    header.classList.add('back');
    header.classList.remove('enter-game');

    icon.classList.remove('enter-game');
    icon.classList.add('back');

    loadingScreen.classList.add('slideIn');
    loadingScreen.classList.remove('slideOut');
}

// score
var intv = setInterval(function() {
    if (!gameStarted || gameOver) return;

    score++;
    scoreCount.textContent = score;
}, 1000);

// update Screen
function updateDisplay() {
    // level data
    const levelData = levels[level];

    // Set Values
    gridWidth = levelData.GRIDW;
    gridHeight = levelData.GRIDH;

    LEFT = levelData.LEFT;
    TOP = levelData.TOP;

    // Set style using these values
    gameArea.style.width = gridWidth + 'vw';
    gameArea.style.height = gridHeight + 'vh';
    
    gameArea.style.position = 'absolute';
    gameArea.style.top = TOP + 'vh';
    gameArea.style.left = LEFT + 'vw';
}

// Count neighbours cell mine
function countMineNeighbour(r, c) {
    // Count
    let count = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newRow = r + i;
            let newColm = c + j;

            // Ensure neighbour cell inside of board
            if ((newRow >= 0 && newRow < ROW) && (newColm >= 0 && newColm < COLM)) { 
                if(board[newRow][newColm].isMine) count++;
            }
        }
    }

    return count;
}

// Reveal cell
function revealCell(r, c) {
    if (gameOver || board[r][c].isRevealed || board[r][c].isFlagged) return;

    let cell = board[r][c];
    cell.isRevealed = true;
    cell.element.classList.add('revealed');

    if (cell.isMine) {
        endGame(false);
        return;
    }

    if (cell.neighbourMines > 0) {
        cell.element.textContent = cell.neighbourMines;
        cell.element.setAttribute('data-count', cell.neighborMines);
        checkCondition();
        return;
    }

    revealNeighbours(r, c);
    checkCondition();
}

// reveal neighbours
function revealNeighbours(r, c) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newRow = r + i;
            let newColm = c + j;
     
            // Ensure neighbour cell inside of board
            if (newRow >= 0 && newRow < ROW && newColm >= 0 && newColm < COLM) {
                if(!board[newRow][newColm].isRevealed) {
                    revealCell(newRow, newColm);
                }
            }
        }
    }
}

// reveal flagged
function flagged(r, c) {
    if (gameOver || board[r][c].isRevealed) return;

    let cell = board[r][c];

    cell.isFlagged = !cell.isFlagged;

    var img = document.createElement('img');
    img.src = "../../assets/game/minesweeper/images/minesweeper-icon.svg";
    img.width = 25;
    img.height = 25;

    if (cell.isFlagged) {
        cell.element.classList.add('flagged');
        cell.element.style.backgroundImage = "url('../../assets/game/minesweeper/images/minesweeper-icon.svg')";
        cell.element.style.backgroundSize = "25px 25px";
    } else {
        cell.element.classList.remove('flagged');
        cell.element.style.backgroundImage = null;
    }
}

// Restart
function restart() {
    gameStarted = false;

    score = 0;
    scoreCount.textContent = score;

    init();
}

// Game over handling
function endGame(win) {
    gameOver = true;

    for(let r = 0; r < ROW; r++) {
        for (let c = 0; c < COLM; c++) {
            if(board[r][c].isMine) {
                board[r][c].element.classList.add('mine');
            }
        }
    }
}

// Check conditions
function checkCondition() {
    for(let r = 0; r < ROW; r++) {
        for (let c = 0; c < COLM; c++) {
            if (!board[r][c].isMine && !board[r][c].isRevealed) {
                return;
            }
        }
    }
    endGame(true);
}

// Animate counter
function animateCounter(i, elm) {
    const target = i;
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        elm.textContent = Math.round(ease * target);

        if (t < 1) requestAnimationFrame(update);
        else elm.textContent = target;
    }

    requestAnimationFrame(update);
}

// Check which level the user selected
checkButtonClick();