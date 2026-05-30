// Load chime
const audio = new Audio('../../assets/game/tetris/audio/spin complete.mp3');
const loadScreen = document.querySelector('.load-screen');
const screenBox = document.querySelector('.screen-box');

window.addEventListener('load', () => {
    audio.play();
    screenBox.classList.add('popOutAnim');

    setTimeout(() => {
        loadScreen.classList.add('disappear');
    }, 2000);
});


// Game engine
const canvas = document.getElementById('canvas-area');
const ctx = canvas.getContext('2d');

// Side panel canvas
const canvaspanel = document.getElementById('panel-canvas');
const panelCtx = canvaspanel.getContext('2d');

ctx.scale(2, 2);
panelCtx.scale(2, 2);

const Tetris = {
    x: 0,
    y: 0,
    width: 150,
    height: 260
};

let currentNode = null;   
let gameOver = true;
let isFirstGame = true;
let score = 0;
let lastSec = 0;
let lastSecMove = 0;
let keysPressed = {};

// Next node preview
let nextShapeIndex = Math.floor(Math.random() * 7);

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

    removeFromList() {
        TetrisNode.nodes = TetrisNode.nodes.filter(node => node !== this);
    }

    // Color
    setColor(color) {
        for (let node of this.familyNodes) {
            node.color = color;
        }
    }

    // Get Color
    getColor() {
        return this.color;
    }

    // Shape
    setShape(shape) {
        for (let node of this.familyNodes) {
            node.shape = shape;
        }
    }

    getShape() {return this.shape; }
    addToFamily(node) { this.familyNodes.push(node); }
    setX(x) {this.x = x; }
    setY(y) {this.y = y; }
    getX() { return this.x; }
    getY() { return this.y; }


        // Get Node family
    getFamily() {
        return this.familyNodes;
    }

    // Completely move down
    moveCompletelyDown() {
        for(let i = 0; i < 150; i++) {
            if (this.canGoDown()) {
                this.moveDown();
            }
        }
    }    

    isInFamily(node) {
        return this.familyNodes.includes(node);
    } 

    static getNode(x, y) {
        for(let node of TetrisNode.nodes) {
            if (node.getX() === x && node.getY() === y) {
                return node;
            }
        }
        return null;
    }    
    
    // Clear family
    clearFamily() {
        for (let fNode of this.familyNodes) {
            if (fNode !== this) {
                TetrisNode.nodes = TetrisNode.nodes.filter(node => node !== fNode);
            }
        }
        this.familyNodes = [this];
    }    

    // Movements
    moveDown() {
        for(let node of this.familyNodes) {
            node.setY(node.getY() + TetrisNode.multiplier);
        }
    }

    moveRight() {
        for (let node of this.familyNodes) {
            node.setX(node.getX() + TetrisNode.multiplier);
        }
    }    

    moveLeft() {
        for(let node of this.familyNodes) {
            node.setX(node.getX() - TetrisNode.multiplier);
        }
    }

    // Position check
    canMoveRight() {
        for(let fmNode of this.familyNodes) {
            let nextNode = TetrisNode.getNode(fmNode.getX() + 10, fmNode.getY());

            if(nextNode != null && !this.isInFamily(nextNode)) {
                return false;
            }

            if(fmNode.getX() > Tetris.width - 20) {
                return false;
            }
        }

        return true;
    }

    canMoveLeft() {
        for(let fmNode of this.familyNodes) {
            let nextNode = TetrisNode.getNode(fmNode.getX() - 10, fmNode.getY());

            if(nextNode != null && !this.isInFamily(nextNode)) {
                return false;
            }

            if(fmNode.getX() < Tetris.x + 10) {
                return false;
            }
        }
        return true;
    }   

    canGoDown() {
        for(let fmNode of this.familyNodes) {
            let nextNode = TetrisNode.getNode(fmNode.getX(), fmNode.getY() + TetrisNode.multiplier);

            if(fmNode.getY() >= Tetris.height - 10) {
                return false;
            }

            if(nextNode != null && !this.isInFamily(nextNode)) {
                return false;
            }
        }
        return true;
    } 

    setDownPosition() {
        if (this.familyNodes.length < 4) return;

        let oldY = this.familyNodes.map(node => node.getY());

        for (let i2 = 0; i2 < 100; i2++) {
            for (let node of this.familyNodes) {
                node.setY(node.getY() + 10);
            }

            if (!this.canGoDown()) {
                for (let i = 0; i < this.familyNodes.size; i++) {}
                this.familyNodes.forEach((node, idx) => {
                    node.downpos = (node.getY() - this.getY()) + this.y;
                });

                this.familyNodes.forEach((node, idx) => {
                    node.setY(oldY[idx]);
                });
                return;
            }
        }
    }

    getDownPosition() {
        return this.downpos;
    }

    rotate() {
        let rot = this.getShape();
    
        if (rot === "O") return;

        this.rotation++;
        this.clearFamily();

        let x = this.x;
        let y = this.y;

        if (rot === "I") {
            if (this.rotation > 2) this.rotation = 1;
            if (x + 20 > Tetris.width) x -= 20;                
            if (x - 10 < Tetris.x) x += 10;
            this.x = x;
            
            if (this.rotation === 1) {
                this.addToFamily(new TetrisNode(x, y + 10));
                this.addToFamily(new TetrisNode(x, y + 20));
                this.addToFamily(new TetrisNode(x, y + 30));
            } else {
                this.addToFamily(new TetrisNode(x + 10, y));
                this.addToFamily(new TetrisNode(x + 20, y));
                this.addToFamily(new TetrisNode(x - 10, y));
            }   this.setColor("#36EAFF");

        } else if (rot === "S") {
            if (this.rotation > 2) this.rotation = 1;
            if (x + 20 > Tetris.width) x -= 10;
            this.x = x;

            if (this.rotation === 1) {
                this.addToFamily(new TetrisNode(x + 10, y));
                this.addToFamily(new TetrisNode(x, y + 10));
                this.addToFamily(new TetrisNode(x - 10, y + 10));
            } else {
                this.addToFamily(new TetrisNode(x, y + 10));
                this.addToFamily(new TetrisNode(x - 10, y));
                this.addToFamily(new TetrisNode(x - 10, y - 10));
            }   this.setColor("#FF0009");

        } else if (rot === "Z") {
            if (this.rotation > 2) this.rotation = 1;
            if (x - 10 < Tetris.x) x += 10;
            this.x = x;

            if (this.rotation === 1) {
                this.addToFamily(new TetrisNode(x, y + 10));
                this.addToFamily(new TetrisNode(x + 10, y + 10));
                this.addToFamily(new TetrisNode(x - 10, y));
            } else {
                this.addToFamily(new TetrisNode(x + 10, y));
                this.addToFamily(new TetrisNode(x + 10, y - 10));
                this.addToFamily(new TetrisNode(x, y + 10));
             } this.setColor("#00FF2B");

        } else if (rot === "L") {
            if (this.rotation > 4) this.rotation = 1;

            if (this.rotation === 1) {
                this.addToFamily(new TetrisNode(x, y + 10));
                this.addToFamily(new TetrisNode(x, y + 20));
                this.addToFamily(new TetrisNode(x + 10, y + 20));
            } else if (this.rotation === 2) {
                if (x - 10 < Tetris.x) x += 10;
                this.x = x;
                this.addToFamily(new TetrisNode(x + 10, y));
                this.addToFamily(new TetrisNode(x - 10, y));
                this.addToFamily(new TetrisNode(x - 10, y + 10));
            } else if (this.rotation === 3) {
                if (x - 10 < Tetris.x) x += 10;
                this.x = x;
                this.addToFamily(new TetrisNode(x - 10, y));
                this.addToFamily(new TetrisNode(x, y + 10));
                this.addToFamily(new TetrisNode(x, y + 20));
            } else {
                if (x - 10 < Tetris.x) x += 10;
                this.x = x;
                this.addToFamily(new TetrisNode(x + 10, y));
                this.addToFamily(new TetrisNode(x + 10, y - 10));
                this.addToFamily(new TetrisNode(x - 10, y));
            } this.setColor("#EC830C");

        } else if (rot === "J") {
            if (this.rotation > 4) this.rotation = 1;

            if (this.rotation === 1) {
                this.addToFamily(new TetrisNode(x, y + 10));
                this.addToFamily(new TetrisNode(x, y + 20));
                this.addToFamily(new TetrisNode(x - 10, y + 20));
            } else if (this.rotation === 2) {
                if (x + 20 > Tetris.width) x -= 20;
                this.x = x;
                this.addToFamily(new TetrisNode(x, y + 10));
                this.addToFamily(new TetrisNode(x + 10, y + 10));
                this.addToFamily(new TetrisNode(x + 20, y + 10));
            } else if (this.rotation === 3) {
                this.addToFamily(new TetrisNode(x, y + 10));
                this.addToFamily(new TetrisNode(x, y - 10));
                this.addToFamily(new TetrisNode(x + 10, y - 10));
            } else {
                if (x - 10 < Tetris.x) x += 10;
                this.x = x;
                this.addToFamily(new TetrisNode(x + 10, y));
                this.addToFamily(new TetrisNode(x - 10, y));
                this.addToFamily(new TetrisNode(x + 10, y + 10));
            } this.setColor("#FF19EF");

        } else if (rot === "T") {
            if (this.rotation > 4) this.rotation = 1;

            if (this.rotation === 1) {
                if (x + 10 > Tetris.width) x -= 10;
                if (x - 10 < Tetris.x) x += 10;
                this.x = x;
                this.addToFamily(new TetrisNode(x + 10, y));
                this.addToFamily(new TetrisNode(x - 10, y));
                this.addToFamily(new TetrisNode(x, y + 10));
            } else if (this.rotation === 2) {
                if (x - 10 < Tetris.x) x += 10;
                this.x = x;
                this.addToFamily(new TetrisNode(x, y + 10));
                this.addToFamily(new TetrisNode(x, y - 10));
                this.addToFamily(new TetrisNode(x - 10, y));
            } else if (this.rotation === 3) {
                if (x + 20 > Tetris.width) x -= 10;
                if (x - 10 < Tetris.x) x += 10;
                this.x = x;
                this.addToFamily(new TetrisNode(x, y - 10));
                this.addToFamily(new TetrisNode(x + 10, y));
                this.addToFamily(new TetrisNode(x - 10, y));
            } else {
                if (x + 10 > Tetris.width) x -= 10;
                this.x = x;
                this.addToFamily(new TetrisNode(x + 10, y));
                this.addToFamily(new TetrisNode(x, y + 10));
                this.addToFamily(new TetrisNode(x, y - 10));
            } this.setColor("#9100FF");
        }
    }
}

// Core Function
function setShapes() {
    let n = new TetrisNode(Tetris.x + 50, Tetris.y);
    n.addToFamily(n);

    let x = n.getX();
    let y = n.getY();

    let random = nextShapeIndex;
    nextShapeIndex = Math.floor(Math.random () * 7);
    preview();

    if (random === 0) {
        n.addToFamily(new TetrisNode(x + 10, y));
        n.addToFamily(new TetrisNode(x, y + 10));
        n.addToFamily(new TetrisNode(x + 10, y + 10));
        n.setShape("O");
        n.setColor("#FFFF00");
    } else if (random === 1) {
        n.addToFamily(new TetrisNode(x, y + 10));
        n.addToFamily(new TetrisNode(x, y + 20));
        n.addToFamily(new TetrisNode(x, y + 30));
        n.setShape("I");
        n.setColor("#39EAFF");
    } else if (random === 2) {
        n.addToFamily(new TetrisNode(x + 10, y));
        n.addToFamily(new TetrisNode(x, y + 10));
        n.addToFamily(new TetrisNode(x - 10, y + 10));
        n.setShape("S");
        n.setColor("#FF0009");
    } else if (random === 3) {
        n.addToFamily(new TetrisNode(x - 10, y));
        n.addToFamily(new TetrisNode(x, y + 10));
        n.addToFamily(new TetrisNode(x + 10, y + 10));
        n.setShape("Z");
        n.setColor("#00FF2B");
    } else if (random === 4) {
        n.addToFamily(new TetrisNode(x, y + 10));
        n.addToFamily(new TetrisNode(x, y + 20));
        n.addToFamily(new TetrisNode(x + 10, y + 20));
        n.setShape("L");
        n.setColor("#EC830C");
    } else if (random === 5) {
        n.addToFamily(new TetrisNode(x, y + 10));
        n.addToFamily(new TetrisNode(x, y + 20));
        n.addToFamily(new TetrisNode(x - 10, y + 20));
        n.setShape("J");
        n.setColor("#FF19EF");
    } else {
        n.addToFamily(new TetrisNode(x + 10, y));
        n.addToFamily(new TetrisNode(x - 10, y));
        n.addToFamily(new TetrisNode(x, y + 10));
        n.setShape("T");
        n.setColor("#9100FF");
    }

    currentNode = n;
}

function preview() {
    panelCtx.fillStyle = "#222020";
    panelCtx.fillRect(0, 0, 40, 40);

    if (gameOver) return;

    let blocks = [];
    let color = "#FFFFFF";

    switch(nextShapeIndex) {
        case 0:
            blocks = [{x: 10, y: 10}, {x:20, y:10}, {x: 10, y:20}, {x: 20, y: 20}];
            color = "#FFFF00";
            break;
        
        case 1:
            blocks = [{x: 15, y: 0}, {x: 15, y: 10}, {x: 15, y: 20}, {x:15, y: 30}];
            color = "#36EAFF";
            break;
        case 2:
            blocks = [{x: 15, y: 10}, {x: 25, Y: 10}, {x: 15, y: 20}, {x: 5, y: 20}];
            color = "#FF0009";
            break;
        case 3:
            blocks = [{x: 15, y: 10}, {x: 5, y: 10}, {x: 15, y: 20}, {x: 25, y: 20}];
            color = "#00FF2B";
            break;
        case 4:
            blocks = [{x: 10, y: 5}, {x: 10, y: 15}, {x: 10, y: 25}, {x: 20, y: 25}];
            color = "#EC830C";
            break;
        case 5:
            blocks = [{x: 20, y: 5}, {x: 20, y: 15}, {x: 20, y: 25}, {x: 10, y: 25}];
            color = "#FF10EF";
            break;
        case 6: 
            blocks = [{x: 15, y: 10}, {x: 5, y: 10}, {x: 25, y: 10}, {x: 15, y: 20}];
            color = "#9100FF";
            break;               
    }

    panelCtx.fillStyle = color;
    for (let b of blocks) {
        panelCtx.fillRect(b.x, b.y, 10, 10);
        panelCtx.strokeStyle = "#000000";
        panelCtx.lineWidth = 0.5;
        panelCtx.strokeRect(b.x, b.y, 10, 10);
    }
}

// Remove layer
const scored = new Audio('../../assets/game/tetris/audio/gain.mp3');
const animation = document.getElementById('game-container');

function removeLayer() {
    if (!currentNode) return;

    for (let i = 0; i < currentNode.getFamily().length; i++) {
        let y1 = currentNode.getFamily()[i].getY();
        let x1 = Tetris.x - 10;

        for (let i2 = 0; i2 < 100; i2++) {
            x1 = x1 + 10;

            if (x1 > Tetris.width - 10) {
                // Complete layer
                x1 = Tetris.x - 10;
                for (let i3 = 0; i3 < 100; i3++) {
                    x1 = x1 + 10;
                    let targetedNode = TetrisNode.getNode(x1, y1);
                    if (targetedNode) targetedNode.removeFromList();
                }

                /// Pull Down upper layers
                for (let i4 = 0; i4 < TetrisNode.nodes.length; i4++) {
                    if (TetrisNode.nodes[i4].getY() <= y1) {
                        TetrisNode.nodes[i4].setY(TetrisNode.nodes[i4].getY() + 10);
                    }
                }
                
                // Score Count
                score += 5;

                // Score sound & animation
                scored.play();
                animation.classList.add('scoreAnim');
                
                break;
            }

            if (animation.classList.contains('scoreAnim')) {
                setTimeout(() => {
                    animation.classList.remove('scoreAnim');
                }, 500);
            }

            if (TetrisNode.getNode(x1, y1) == null) {
                break;
            }
        }
    }
}

// Game over
function GameOver() {
    gameOver = true;
    isFirstGame = false;
    TetrisNode.nodes = [];
    currentNode = null;
    preview();
}

function startGame() {
    gameOver = false;
    score = 0;
    TetrisNode.nodes = [];
    setShapes();
}

// Render wahooo
function render() {
    // Clear BG
    ctx.fillStyle = "#222020";
    ctx.fillRect(0, 0, Tetris.width, Tetris.height);

    // Gravity calculation
    let divided = 300 - Math.floor(score / 10);
    if (divided < 10) divided = 10;

    let sec = Math.floor(Date.now() / divided);
    if(sec !== lastSec && !gameOver) {
        if(TetrisNode.nodes.length === 0 || !currentNode.canGoDown()) {
            score++;
            removeLayer();
            setShapes();

            if (!currentNode.canGoDown()) {
                GameOver();
            }
        }

        if (currentNode && currentNode.canGoDown()) {
            currentNode.moveDown();
        }
        lastSec = sec;
    }

    // Continuous Input handling
    let sec2 = Math.floor(Date.now() / 40);
    if (sec2 !== lastSecMove) {
        if (!gameOver && currentNode != null) {
            if (keysPressed['ArrowRight'] || keysPressed['ArrowLeft'] || keysPressed['ArrowDown']) {
                if (keysPressed['ArrowRight'] && currentNode.canMoveRight()) {
                    currentNode.moveRight();
                } else if (keysPressed['ArrowLeft'] && currentNode.canMoveLeft()) {
                    currentNode.moveLeft();
                } else if (keysPressed['ArrowDown'] && currentNode.canGoDown()) {
                    currentNode.moveDown();                
                }
            }
        }
        lastSecMove = sec2;
    }

    // Draw Hard drop preview outline
    if (!gameOver && currentNode && currentNode.canGoDown()) {
        currentNode.setDownPosition();
        
        for (let fNode of currentNode.getFamily()) {
            let tx = fNode.getX();
            let ty = fNode.getDownPosition();

            ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
            ctx.lineWidth = 1;
            ctx.strokeRect(tx, ty - TetrisNode.multiplier, TetrisNode.multiplier, TetrisNode.multiplier);
        }
    }

    // Draw Set Nodes
    for (let node of TetrisNode.nodes) {
        ctx.fillStyle = node.getColor();
        ctx.fillRect(node.getX(), node.getY() - TetrisNode.multiplier, TetrisNode.multiplier, TetrisNode.multiplier);

        // Ouline divider
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(node.getX(), node.getY() - TetrisNode.multiplier, TetrisNode.multiplier, TetrisNode.multiplier);
    }

    // Score HUD
    if (!gameOver) {
        ctx.fillStyle = '#00FFFF';
        ctx.font = "8px 'Inconsolata', monospace";  
        ctx.fillText("Score: " + score, 4, 12);
    }

    if (gameOver) {
        let xm = Tetris.width / 2;
        let ym = Tetris.height / 2;

        ctx.textAlign = "center"; 
        if (!isFirstGame) {
            ctx.fillStyle = "#FF0000";
            ctx.font = "bold 16px 'Inconsolata', monospace";
            ctx.fillText("Game Over!", xm, ym - 10);

            ctx.fillStyle = "#FFFFFF";
            ctx.font = "10px 'Inconsolata', monospace";
            ctx.fillText("Final Score: " + score, xm, ym + 10);
        } else {
            ctx.fillStyle = "#00FF2B";
            ctx.font = "12px 'Inconsolata', monospace";
            ctx.fillText("Press enter to play", xm, ym - 10);
        }

        ctx.fillStyle = "#00FF2B";
        ctx.font = "9px 'Inconsolata', monospace";
        ctx.fillText("", xm, Tetris.height - 20);
        ctx.textAlign = "start";
    }

    requestAnimationFrame(render);
}

// Input handler
window.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;

    if (e.key === "Enter" && gameOver) { 
        startGame();
    }

    if (e.key === "Enter") {
        startGame();
    }

    if (!currentNode || gameOver) return;

    // Prevent anything default
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }

    if (e.key === "ArrowUp") {
        currentNode.rotate();
    } else if (e.key === ' ') {
        currentNode.moveCompletelyDown();
    }
});

window.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false;
});

// Render the game
preview();        
render();