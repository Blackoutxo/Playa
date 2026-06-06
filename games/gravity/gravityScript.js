// Plugin
Matter.use(MatterAttractors);

// Window Dimension
let width = window.innerWidth;
let height = window.innerHeight;

// Define game levels
const gameLevels = [
    {
        levelID: 1,
        startPos: { x: 0, y: (height / 2) },
        velocity: { x: 6.5, y: 0},
        goalPos: {x: (width - 200), y: (height / 2)},
        heavenlyPos: [
            { x: width * 2, y: 300, radius: 60, mass: 15000}
        ],
        allotedHeavenlyBodies: 2
    },

    {
        levelID: 2,
        startPos: { x: 0, y: (height / 2)},
        velocity: { x: 6.5, y: 0},
        goalPos: {x: (width - 300), y: (height / 2)},
        heavenlyPos: [
            { x: (width / 3), y: (height / 5), radius: 60, mass: 15000}
        ],
        allotedHeavenlyBodies: 2
    }, 

    {
        levelID: 3,
        startPos: { x: 0, y: (height / 2)},
        velocity: { x: 7, y: 0},
        goalPos: {x: (width / 1.5), y: (height / 2) + 100 },
        heavenlyPos: [
            { x: (width / 3), y: (height / 5), radius: 50, mass: 10000},
            { x: (width / 1.8), y: (height - 200), radius: 40, mass: 1000}
        ],
        allotedHeavenlyBodies: 3
    },

    {
        levelID: 4,
        startPos: { x: -100, y: (height / 2)},
        velocity: { x: 7, y: 0},
        goalPos: {x: (width / 1.6), y: ((height / 2) + 50)},
        heavenlyPos: [
            { x: (width / 2), y: (height / 2), radius: 50, mass: 10000}
        ],
        allotedHeavenlyBodies: 3
    },

    {
        levelID: 5,
        startPos: { x: -100, y: (height / 2)},
        velocity: { x: 5, y: 0},
        goalPos: {x: (width / 1.5), y: (height / 3.5)},
        heavenlyPos: [
            { x: ((width / 2 ) - 100), y: ((height / 2) - 50), radius: 50, mass: 10000},
            { x: ((width / 2) + 50), y: (height / 3), radius: 40, mass: 7000}
        ],
        allotedHeavenlyBodies: 3
    },

    {
        levelID: 6,
        startPos: { x: (width / 2 + 100), y: (height + 200)},
        velocity: { x: 0, y: -6},
        goalPos: { x: ((width / 3) - 200), y: ((height / 2))},
        heavenlyPos: [
            { x: ((width / 2) - 100), y: ((height / 2) + 100), radius: 55, mass: 10000}
        ],
        allotedHeavenlyBodies: 2
    },

    {
        levelID: 7,
        startPos: { x: -100, y: (height / 2)},
        velocity: { x: 7, y: 0},
        goalPos: { x: (width - 150), y: (height / 3.5)},
        heavenlyPos: [
            { x: (width / 3), y: (height / 2), radius: 60, mass: 10000},
            { x: (width / 2.3), y: ((height / 2) - 220), radius: 50, mass: 6000},
            { x: (width / 2.7), y: (height - 50), radius: 40, mass: 5000}
        ],
        allotedHeavenlyBodies: 3
    },

    {
        levelID: 8,
        startPos: { x: 0, y: (height)},
        velocity: { x: 10, y: -10},
        goalPos: { x: (width / 1.05), y: (height / 1.1)},
        heavenlyPos: [
            { x: (width / 2), y: (height / 3), radius: 60, mass: 70000},

        ],
        allotedHeavenlyBodies: 4
    },

    {
        levelID: 9,
        startPos: { x: -100, y: (height / 2)},
        velocity: { x: 3, y: 0.02},
        goalPos: { x: (width - 100), y: (height / 2)},
        heavenlyPos: [
            { x: (width / 3), y: (height / 2), radius: 55, mass: 9000},
            { x: (width / 2), y: (height / 5), radius: 40, mass: 6000},
            { x: (width / 2.3), y: (height / 1.2), radius: 45, mass: 8000},
            { x: (width / 1.3), y: (height / 2.5), radius : 45, mass: 8000}
        ],
        allotedHeavenlyBodies: 3
    },

    {
        levelID: 10,
        startPos: { x: -100, y: -100},
        velocity: { x: 6, y: 5},
        goalPos: { x: (width - 100), y: (height / 1.2)},
        heavenlyPos: [
            { x: (width / 1.8), y: (height / 5), radius: 60, mass: 50000},
            { x: (width / 10), y: (height / 1.8), radius: 55, mass: 10000},
            { x: (width - 300), y: (height / 1.7), radius: 40, mass: 9000}
        ],
        allotedHeavenlyBodies: 4
    }
];

// var
let gameOver = false;
let gameStarted = false, launched = false;
let comet, goal;
let placeableHeavenlyBodies = 0;

let currentLevel = 0;

// Const docs
const dnf = document.querySelector('.dnf');
const lvlComplete = document.querySelector('.level-completed');

// hide
dnf.classList.add('hide');
lvlComplete.classList.add('hide');

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
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false
     }
});

Render.run(render);
var runner = Runner.create();
Runner.run(runner, engine);

// Before Render
Matter.Events.on(render, 'beforeRender', function() {
    var context = render.context;
    
    context.shadowBlur = 25;
    context.shadowColor = "#0db4ca60";
});

// ------ Game handler ------ //

// Load info panel
function loadPanel(e) {
    if (e.key === "i") {
        document.querySelector('.info-panel').classList.toggle('hide');
    }
}

// Place
function handlePlace(e) {
    if (placeableHeavenlyBodies !== 0 && !launched) {
        placePlanet(e.clientX, e.clientY, 8000);
    }

    document.querySelector('.count').textContent = placeableHeavenlyBodies;
}

// Launch
function handleLaunch(e) {
    if (e.key === " " && !launched) {
        Composite.add(engine.world, comet);
        launched = true;
        gameStarted = true;
    }
}

// Game over
function handleGameOver() {
    dnf.classList.remove('hide');

    setTimeout(() => {
        dnf.classList.add('hide');
    }, 800);
}

// Level complete
function handleLevelComplete(levelIndex) {
    lvlComplete.classList.toggle('hide');
    document.querySelector('.lvl-count').textContent = currentLevel + 1;    
    document.querySelector('.lvl-count-bar').textContent = currentLevel + 1;

    setTimeout(() => {
        lvlComplete.classList.toggle('hide');
    }, 800);
}

// Restart
function handleRestart(e) {
    if (e.key === "Enter") {
        loadLevel(currentLevel);
        launched = false;
        gameOver = false;
        gameStarted = false;
    }
}

// Register Global event listener once
window.addEventListener('keydown', handleLaunch);
window.addEventListener('keydown', handleRestart);
window.addEventListener('keydown', loadPanel);
window.addEventListener('mousedown', handlePlace);

// Initialize
function initialize() {
    // 0 Gravity 
    engine.gravity.scale = 0;

    loadLevel(currentLevel);
}

// ------ Load levels ------ //
function loadLevel(index) {
    Composite.clear(engine.world, false);

    // Fetch level data
    const levelData = gameLevels[index];

    // Allot the placeable bodies
    placeableHeavenlyBodies = levelData.allotedHeavenlyBodies;
    document.querySelector('.count').textContent = placeableHeavenlyBodies;

    // Comet 
    comet = Bodies.circle(levelData.startPos.x, levelData.startPos.y, 25, {
        label: 'comet',
        mass: 80,
        friction: 0,
        frictionAir: 0,
        shadowColor: '#3155cc5e',
        render: {
            fillStyle: '#3155cc',
            strokeStyle: '#3155cc',
            lineWidth: 3
        }
    });

    // Set comet velocity
    Body.setVelocity(comet, levelData.velocity);

    // Goal sensor
    goal = Bodies.circle(levelData.goalPos.x, levelData.goalPos.y, 50, {
        label: 'goal',
        isSensor: true,
        isStatic: true,
        render: {
            fillStyle: '#286e452f',
            strokeStyle: '#ffffff5b',
            lineWidth: 3
        }
    });

    // Heavenly bodies
    levelData.heavenlyPos.forEach(planet => {
        createHeavenlyBodies(planet.x, planet.y, planet.radius, planet.mass);
    });

    // Add goal
    Composite.add(engine.world, goal);
}

// ------ Heavenly Body ------ //
function createHeavenlyBodies(x, y, radius, mass) {
    let planet = Bodies.circle(x, y, radius, {
        label: 'heavenlybody',
        isStatic: true,
        mass: mass,
        shadowColor: "#c922225d",
        plugin: {
            attractors: [
                MatterAttractors.Attractors.gravity
            ]
        },
        render: {
            fillStyle: "#c92222"
        }
    });

    Composite.add(engine.world, planet);
}

// ------ Place planet ------ //
function placePlanet(x, y, mass) {  
    let planetP = Bodies.circle(x, y, 45, {
        label: 'planet',
        isStatic: true,
        mass: mass,
        shadowColor: '#2fc1db3b',
        plugin: {
            attractors: [
                MatterAttractors.Attractors.gravity
            ]
        },
        render: {
            fillStyle: '#2fc1db',
            strokeStyle: '#2fc1db',
            lineWidth: 3
        }
    });

    // Spawn the planet
    Composite.add(engine.world, planetP);

    placeableHeavenlyBodies--;
    console.log(placeableHeavenlyBodies);
}

// ------ After Updates ------ //
Events.on(engine, 'beforeUpdates', function(event) {
});

// ------ Collision check ------ //
let handlingCollision = false;
Events.on(engine, 'collisionStart', function(event) {
    if (handlingCollision) return;

    const pairs = event.pairs;
    
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];

        if (pair.bodyA === comet && pair.bodyB === goal) {
            handlingCollision = true;
            Body.setStatic(comet, true);

            gameStarted = false;
            launched = false;
            currentLevel++;
            
            handleLevelComplete(currentLevel);
            
            setTimeout(() => {
                loadLevel(currentLevel);
                handlingCollision = false;      
            }, 500);
        } 
        
        if (pair.bodyA === comet && pair.bodyB !== goal) {
            handlingCollision = true;
           Body.setStatic(comet, true);

            setTimeout(() => {
                handlingCollision = false;

                launched = false;
                gameStarted = false;  
                gameOver = true; 
                handleGameOver();

                loadLevel(currentLevel);
            }, 500);
        }
    }
});
 
// Function call
initialize();