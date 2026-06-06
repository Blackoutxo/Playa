// Plugin
Matter.use(MatterAttractors);

// Define game levels
const gameLevels = [
    {
        levelID: 1,
        startPos: { x: 0, y: 300},
        velocity: { x: 6.5, y: 0},
        goalPos: {x: 1000, y: 300},
        heavenlyPos: [
            { x: 1500, y: 300, radius: 60, mass: 15000}
        ],
        allotedHeavenlyBodies: 2
    },

    {
        levelID: 2,
        startPos: { x: 0, y: 300},
        velocity: { x: 6.5, y: 0},
        goalPos: {x: 1000, y: 300},
        heavenlyPos: [
            { x: 500, y: 100, radius: 60, mass: 15000}
        ],
        allotedHeavenlyBodies: 2
    }, 

    {
        levelID: 3,
        startPos: { x: 0, y: 300},
        velocity: { x: 7, y: 0},
        goalPos: {x: 1000, y: 400},
        heavenlyPos: [
            { x: 500, y: 100, radius: 50, mass: 10000},
            { x: 800, y: 500, radius: 40, mass: 1000}
        ],
        allotedHeavenlyBodies: 4
    },

    {
        levelID: 4,
        startPos: { x: 0, y: 300},
        velocity: { x: 7, y: 0},
        goalPos: {x: 1000, y: 350},
        heavenlyPos: [
            { x: 600, y: 300, radius: 50, mass: 10000}
        ],
        allotedHeavenlyBodies: 4
    },

    {
        levelID: 5,
        startPos: { x: 0, y: 300},
        velocity: { x: 5, y: 0},
        goalPos: {x: 1000, y: 400}, 
        heavenlyPos: [
            { x: 600, y: 200, radius: 50, mass: 10000},
            { x: 800, y: 150, radius: 40, mass: 7000}
        ],
        allotedHeavenlyBodies: 4
    },
];

// var
let gameOver = false;
let gameStarted = false, launched = false;
let currentLevel = 4;
let comet, goal;
let placeableHeavenlyBodies = 0;

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
        placePlanet(e.clientX, e.clientY, 6500);
    }

    document.querySelector('.count').textContent = placeableHeavenlyBodies;
}

// Launch
function handleLaunch(e) {
    if (e.key === " ") {
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
    document.querySelector('.count').textContent = placeableHeavenlyBodies;   
}

// ------ Load levels ------ //
function loadLevel(index) {
    Composite.clear(engine.world, false);

    // Fetch level data
    const levelData = gameLevels[index];

    // Allot the placeable bodies
    placeableHeavenlyBodies = levelData.allotedHeavenlyBodies;

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