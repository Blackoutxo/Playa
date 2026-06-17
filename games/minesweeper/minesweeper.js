const BOARD_SIZE = 10;
const MINES = 10;

let board = [];
let gameOver = false;

const grid = document.getElementById('grid');

// ------ Good game innit? ------ //
function init() {
    grid.innerHTML = '';
    board = [];
    gameOver = false;
}

// Grid coordinate
function generateGridCord() {
    for (let r = 0; r < BOARD_SIZE; r++) {
        board[r] = [];

        for (let c = 0; c < BOARD_SIZE; r++) {
            board[r][c] = {
                row: r,
                col: c,
                isMine: false,
                isFlagged: false,
                neighbourMines: 0,
                element = null
            };
        }
    }

    // Place bombs
    let minesPlanted =  0;

    while(minesPlanted < MINES) {
        let r = Math.floor(Math.random() * BOARD_SIZE);
        let c = Math.floor(Math.random() * BOARD_SIZE);

        if(!board[r][c].isMine) {
            board[r][c].isMine = true;
            minesPlanted++;
        }
    }
}

// Count neighbours cell mine
function countMineNeighbour(r, c) {
    // Count
    let count = 0;

    for (let i = -1; i <= 1; i++) {
        let newRow = r + i;
        let newColm = c + i;

        // Ensure neighbour cell inside of board
        if ((newRow >= 0 && newR < BOARD_SIZE) && (newColm >= 0 && newColm < BOARD_SIZE)) {
            if(board[newRow][newColm].isMine) count++;
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

        return;
    }

    if (cell.neighbourMines > 0) {
        cell.element.textContent = cell.neighbourMines;
    } else {
        revealNeighbours(r, c);
    }
}

function revealNeighbours(r, c) {
    for (let i = -1; i <= 1; i++) {
        let newRow = r + i;
        let newColm = c + i;

        // Ensure neighbour cell inside of board
        if ((newRow >= 0 && newR < BOARD_SIZE) && (newColm >= 0 && newColm < BOARD_SIZE)) {
            if(!board[newRow][newColm].isRevealed) {
                revealCell(newRow, newColm);
            }
        }
    }
}