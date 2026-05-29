const canvas = document.getElementById('canvas-area');
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

    // Movements
    moveDown() {
        for(let node of this.familyNodes) {
            node.setX(node.getY() + TetrisNode.multiplier);
        }
    }

    moveLeft() {
        for(let node of this.familyNodes) {
            node.setX(node.getX() + TetrisNode.multiplier);
        }
    }

    moveRight() {
        for (let node of this.familyNodes) {
            node.setY(node.getX() + TetrisNode.multiplier);
        }
    }

    // Position check
    isInFamily(node) {
        return this.familyNodes.includes(node);
    }

    static getNode(x, y) {
        for(let node of TetrisNode.nodes) {
            if (node.getX() === x && node.getY() === y) {
                return node;
            }
        }
    }

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

    // Get Node family
    getFamily() {
        return this.familyNodes;
    }

    // Completely move down
    moveDownInstant() {
        for(let i = 0; i < 150; i++) {
            if (this.canGoDown()) {
                this.moveDown();
            }
        }
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

    setDownPosition() {
        if (this.familyNodes.length < 4) return;

        let oldY = this.familyNodes.map(node => node.getY());

        for (let i2 = 0; i2 < 100; i2++) {
            for (let node of this.familyNodes) {
                node.setY(node.getY() + 10);
            }

            if (!this.canGoDown()) {
                for (let i = 0; i < this.familyNodes.size; i++) {
                    this.familyNodes.forEach((node, idx) => {
                        node.downPos = (node.getY() - this.getY()) + this.y;
                    });

                    this.familyNodes.forEach((node, idx) => {
                        node.setY(oldY[idx]);
                    });
                    return;
                }
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

        // Shape define
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
            }
            this.setColor("#36EAFF");
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
            }
            this.setColor("#FF0009");
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
            }
            this.setColor("#00FF2B");
        } else if (rot === "L") {
            if (this.rotation > 4) this.rotation = 1;
            
            if (this.rotation === 1) {
                this.addToFamily(new TetrisNode(x, y + 10));
                this.addToFamily(new TetrisNode(x, y + 20));
                this.addToFamily(new TetrisNode(x + 10, y + 20));    
            } else if (this.rotation === 2) {
                if (x - 10 < Tetris.x) x+= 10;
                this.x = x;
                this.addToFamily(new TetrisNode(x + 10, y));
                this.addToFamily(new TetrisNode(x - 10, y));
                this.addToFamily(new TetrisNode(x - 10, y + 10));
            } else if (this.rotation === 3) {
                if (x - 10 < Tetris.x) x += 10;
                this.x = x;
                this.addToFamily(new TetrisNode(x + 10, y));
                this.addToFamily(new TetrisNode(x + 10, y - 10));
                this.addToFamily(new TetrisNode(x - 10, y));
            } 
            this.setColor("#EC830C");
        } else if (rot === "J") {
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
            }
            this.setColor("#FF19EF");
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
            }
            this.setColor("#9100FF");    
        }
    }
}

// Core Function
function setShapes() {
    let n = new TetrisNode(Tetris.x + 50, Tetris.y);
    n.addToFamily(n);

    let x = n.getX();
    let y = n.getY();

    let random = Math.floor(Math.random () * 7);

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
        n.setShape("T");
        n.setColor("#9100FF");
    }

    currentNode = n;
}

// remove layer
const scored = new Audio('../../assets/audio/gain.mp3');

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
                score += 5;
                scored.currentTime= 0.5;
                scored.play();
                break;
            }

            if (TetrisNode.getNode(x1, y1) == null) {
                break;
            }
        }
    }
}

// Game over
function gameOver() {
    gameOver = true;
    isFirstGame = false;
    Tetris.nodes = [];
    currentNode = null;
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
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, Tetris.width, Tetris.height);

    // Gravity calculation Math loop
    let divided = 300 - Math.floor(score / 10);
    if (divided < 10) divided = 10;

    let sec = Math.floor(Date.now() / divided);
    if(sec !== lastSec && !gameOver) {
        if(TetrisNode.nodes.length === 0 || !currentNode.canGoDown()) {
            score++;
            removeLayer();
            setShapes();

            if (!currentNode.canGoDown()) {
                gameOver();
            }
        }

        if (currentNode && currentNode.canGoDown()) {
            currentNode.moveDown();
        }

        lastSec = sec;
    }

    // Input handler
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

    // Draw Hard drop preview
    if (!gameover && currentNode && currentNode.canGoDown()) {
        currentNode.setDownPosition();
        
        for (let fNode of currentNode.getFamily()) {
            let tx = fNode.getX();
            let ty = fNode.getDownPosition();

            ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
            ctx.lineWidth = 1;
            ctx.strokeRect(tx, ty - Tetris.multiplier, TetrisNode.multiplier, Tetris.multiplier);
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

    if (!gameOver) {
        ctx.fillStyle = '#00FFFF';
        ctx.font = "8px 'Inconsolata', monospace";  
        ctx.fillText("Score: " );

    }
}