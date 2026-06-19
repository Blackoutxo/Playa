const ROW = 13;
const COLM = 27;
const MINES = 20;

let board = [];
let score = 0;
let gameOver = false;

const grid = document.getElementById('grid');
const mineCount = document.querySelector('.mine-count');
const scoreCount = document.querySelector('.score-count');

// Toggle theme
const theme = localStorage.getItem('theme');

if (theme === '1') {
    document.documentElement.classList.add('dark');
}

// ------ Good game innit? ------ //
function init() {
    grid.innerHTML = '';
    board = [];
    gameOver = false;

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
            cellElements.addEventListener('click', () => revealCell(r, c));

            // Right Click listner
            cellElements.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                flagged(r, c);
            });

            grid.appendChild(cellElements);
        }
    }
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
    cell.element.classList.add('Revealed');

    if (cell.isMine) {
        endGame(false);
        return;
    }

    if (cell.neighbourMines > 0) {
        cell.element.textContent = cell.neighbourMines;
        cell.element.setAttribute('data-count', cell.neighborMines);
    } else {
        revealNeighbours(r, c);
    }

    checkWinCondition();
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
    //setTimeout(() => alert(win ? 'You won!' : 'Gameover!'), 10);
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

// Initialize the game
init();