const canvas = document.querySelector('.canvas-area');
const ctx = canvas.getContext('2d');

const Tetris = {
    x: 0,
    y: 0,
    width: 150,
    height: 250
};

let currentNode = null;   
let gameOver = true;
let isFirstGame = true;
let score = 0;
let lastSec = 0;
let lastSecMove = 0;
let keysPressed = {};

// Tetris Node
class TetrisNode {
    static nodes = [];
    static multiplier = 10;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.rotation = 1;
        this.color = 0xFFFFFFFF;
        this.shape = "";
        this.downpos = 0;
        this.familyNodes = [];
        TetrisNode.nodes.push(this);
    }

    
}