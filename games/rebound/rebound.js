// canvas context
const canvas = document.getElementById('game-area');
const ctx = canvas.getContext('2d');

// Display dimensions
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight; 

// Game level define
const levels = [
    {
        levelID: "1",
        objectFPos: [
            {x: (WIDTH / 2), y: (HEIGHT / 2), width: 40, height: 10, angle: 180},
            {x: (WIDTH / 2), y: (HEIGHT / 5), width: 40, height: 10, angle: 180}
        ],

        objectCPos: [
            {x: 0, y: 0, radius: 0},
        ],

        objectTPos: [
            {x: 0, y: 0, radius: 0, sides: 3}
        ],

        obstaclePos: [
            {x: 0, y: 0, width: 0, height: 0},
        ],
    },

    {
        levelID: "2",
        objectPos: [
            {x: 10, y: 10, width: 40, height: 10},
        ],

        obstaclePos: [
            {x: 0, y: 0, width: 0, height: 0},
        ],
    }
];

let ball;
let objects;
let obstacle;

let currentLevel = 0;

// Modules
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;
    Events = Matter.Events;

const Body = Matter.Body;
var engine = Engine.create();

var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: WIDTH,
        height: HEIGHT,
        wireframes: false,
        background: "#254e58"
     }
});

Render.run(render);
var runner = Runner.create();
Runner.run(runner, engine);

// Event listners
window.addEventListener('mousedown', place);
window.addEventListener('mouseup', (e) => {
    handleVelocity(e);
});

// Initialize
function initialize() {
    // No gravity area
    engine.gravity.scale = 0;

    loadLevel(currentLevel);
}

function loadLevel(levelIndex) {
    Composite.clear(engine.world, false);

    // Fetch level data
    const levelData = levels[levelIndex];

    // Load objects
    loadObjectT(levelData);
}

// Object loading 
function loadObjectT(levelInfo) {
    
    // Rectangle
    levelInfo.objectTPos.forEach(object => {
        Composite.add(engine.world, Bodies.rectangle(object.x, object.y, object.width, object.height, {
            restitution: 0.8,
            angle: object.angle,
            isStatic: true,
            render: {
                fillStyle: "#ffffff"
            }
        }));    
    })

    // Circle
    levelInfo.objectCPos.forEach(object => {
        Composite.add(engine.world, Bodies.circle(object.x, object.y, object.radius, {
            restitution: 0.8,
            isStatic: true,
            render: {
                fillStyle: "#ffffff"
            }
        })); 
    });

    // Triangle
    levelInfo.objectTPos.forEach(object => {
        Composite.add(engine.world, Bodies.polygon(object.x, object.y,  {
            restitution: 0.8,
            angle: object.angle,
            isStatic: true,
            render: {
                fillStyle: "#ffffff"
            }
        })); 
    });
}

// Handle placing & directional velocity
function place(e) {
    ball = Bodies.circle(e.clientX, e.clientY, 20, {
        isStatic: true,
        mass: 0,
        friction: 0,
        frictionAir: 0,
        render: {
            fillStyle: "#000000"
        }
    });

    Composite.add(engine.world, ball);
}

function handleVelocity(e) {
    const angle = Math.atan2(e.clientY - ball.position.y, e.clientX - ball.position.x);
    const speed = 15;

    Body.setVelocity(ball, {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
    });

    Body.setStatic(ball, false);
}

// function handle draw
function drawSling() {

}

// Initialize
initialize();