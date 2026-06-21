const levels = [
    {
        // Game data attributes
        level: "Beginner",
        ROW: 9,
        COLM: 9,
        MINES: 10,

        // Screen Attributes
        GRIDW: 22,
        GRIDH: 23, // using percentage basis for these values
        LEFT: 0,
        TOP: 0,
    },

    {
        level: "Intermediate",
        ROW: 16,
        COLM: 16,
        MINES: 20,

        GRIDW: 22,
        GRIDH: 34,
        LEFT: 0,
        TOP: 0,
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

const buttons = document.querySelectorAll('.beginner, .intermediate, .expert');
const restartButton = document.querySelector('.new-game');

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
            
            // Left Click listner
            cellElements.addEventListener('click', () => {
                gameStarted = true;
                gameOver = false;

                revealCell(r, c);
            });

            // Right Click listner
            cellElements.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                flagged(r, c);
            });

            grid.appendChild(cellElements);
        }
    }
}

// Loading screen buttons
function checkButtonClick() {
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            button.classList.add('clicked');
        
            // Set the level
            level = button.getAttribute('data-level');

            // Init game when selected a level
            init();
        });

        button.addEventListener('animationend', () => {
            button.classList.remove('clicked');
        });
    });
}

// Restart button
restartButton.addEventListener('click', () => {
    init();
});

// Animate upon level selection 


// score
var intv = setInterval(function() {
    if (!gameStarted) return;

    scoreCount.textContent = score;
    score++;

    if (gameOver) clearInterval(intv);
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

    if (cell.isFlagged) {
        cell.element.classList.add('flagged');
    } else {
        cell.element.classList.remove('flagged');
    }
}

// Restart
function restart() {
    gameOver = false;
    gameStarted = false;

    endGame(false);
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