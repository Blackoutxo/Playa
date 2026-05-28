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
    } else if
}