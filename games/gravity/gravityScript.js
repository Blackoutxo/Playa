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
            { x: 500, y: 100, radius: 60, mass: 15000}
        ],
        allotedHeavenlyBodies: 2
    }, 
    {
        levelID: 2,
        startPos: { x: 50, y: 300},
        velocity: { x: 7, y: 0},
        goalPos: {x: 600, y: 200},
        heavenlyPos: [
            { x: 500, y: 100, radius: 50, mass: 10000},
            { x: 800, y: 500, radius: 40, mass: 5000}
        ],
        allotedHeavenlyBodies: 4
    }
];

// var
let gameOver = false;
let gameStarted = false, launched = false;
let currentLevel = 0;
let comet, goal;
let placeableHeavenlyBodies = 0;

// Const docs
const dnf = document.querySelector('.dnf');
const lvlComplete = document.querySelector('.level-completed');

// hide
dnf.classList.add('hide');
lvlComplete.classList.add('hide');

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;
    Events = Matter.Events;

const Body = Matter.Body;

var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false
     }
});

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

// create an engine
function initialize() {
    // 0 Gravity 
    engine.gravity.scale = 0;

    loadLevel(currentLevel);
}

// Before Render
Matter.Events.on(render, 'beforeRender', function() {
    var context = render.context;
    context.shadowBlur = 25;
    context.shadowColor = "#0db4ca60";
});

// Load levels
function loadLevel(index) {
    Composite.clear(engine.world, false);

    const levelData = gameLevels[index];

    // Allot the placeable bodies
    placeableHeavenlyBodies = levelData.allotedHeavenlyBodies;

    // Comet and velocity
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

    // Place down goal sensor
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

    // Place down planets
    let click = levelData.allotedHeavenlyBodies;
    window.addEventListener('mousedown', (e) => {
        if (placeableHeavenlyBodies === 0) return;
            placePlanet(e.clientX, e.clientY, 6500);
        
    });

    // Heavenly bodies
    levelData.heavenlyPos.forEach(planet => {
        createHeavenlyBodies(planet.x, planet.y, planet.radius, planet.mass);
    });

    // Add all bodies
    window.addEventListener('keydown', (e) => {
        if (e.key === " " && !launched) {
            gameOver = false;
        
            Composite.add(engine.world, comet);

            launched = true;
            gameStarted = true;

            
            window.addEventListener('keydown', (e) => {
                if (e.key === "Enter" && launched && gameStarted) {
                    placeableHeavenlyBodies = levelData.allotedHeavenlyBodies;
                    loadLevel(currentLevel);
           
                    setTimeout(() => {
                        launched = false;
                        gameStarted = false;   
                        gameOver = true;             
                    }, 500);
                }
            });
        }
    });

    // Add goal
    Composite.add(engine.world, goal);
}

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
}

Events.on(engine, 'collisionStart', function(event) {
    const pairs = event.pairs;
    
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        
        if (pair.bodyA === comet && pair.bodyB !== goal) {
            setTimeout(() => {
                launched = false;
                gameStarted = false;  
                gameOver = true; 
                handleGameOver();
                
                loadLevel(currentLevel);
            }, 100);
        }

        if (pair.bodyA === comet && pair.bodyB === goal) {
            gameStarted = false;
            launched = false;
            currentLevel++;
            
            handleLevelComplete(currentLevel);
            
            setTimeout(() => {
                loadLevel(currentLevel);        
            }, 2000);
        }
    }
});

function handleGameOver() {
    dnf.classList.remove('hide');

    setTimeout(() => {
        dnf.classList.add('hide');
        gameOver = false;
    }, 500);
}

function handleLevelComplete(levelIndex) {
    lvlComplete.classList.toggle('hide');    
    setTimeout(() => {
        lvlComplete.classList.toggle('hide');
        gameOver = false;
    }, 500);
}

// Functions
initialize();