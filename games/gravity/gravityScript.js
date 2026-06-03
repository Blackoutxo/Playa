// Plugin
Matter.use(MatterAttractors);

// Define game levels
const gameLevels = [
    {
        levelID: 1,
        startPos: { x: 0, y: 300},
        velocity: { x: 6.5, y: 0},
        goalPos: {x: 600, y: 200},
        heavenlyPos: [
            { x: 500, y: 100, radius: 55, mass: 10000}
        ],
        allotedHeavenlyBodies: 2
    }, 
    {
        levelID: 2,
        startPos: { x: 50, y: 300},
        velocity: { x: 7, y: 0},
        goalPos: {x: 600, y: 200},
        heavenlyPos: [
            { x: 500, y: 100, radius: 50, mass: 6500},
            { x: 800, y: 500, radius: 40, mass: 5000}
        ],
        allotedHeavenlyBodies: 4
    }
];

// var
const gameOver = false;
let currentLevel = 0;
let comet;
let placeableHeavenlyBodies = 0;

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

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

function loadLevel(index) {
    Composite.clear(engine.world, false);

    const levelData = gameLevels[index];

    // Comet and velocity
    comet = Bodies.circle(levelData.startPos.x, levelData.startPos.y, 25, {
        mass: 1,
        density: 0.001,
        friction: 0,
        frictionAir: 0,
        render: {
            fillStyle: '#3155cc',
            strokeStyle: '#3155cc',
            lineWidth: 3
        }
    });
    
    Body.setVelocity(comet, levelData.velocity);

    // Heavenly bodies
    levelData.heavenlyPos.forEach(planet => {
        createHeavenlyBodies(planet.x, planet.y, planet.radius, planet.mass);
    });

    // Add all bodies
    Composite.add(engine.world, comet);
}

function createHeavenlyBodies(x, y, radius, mass) {
    // Place down planets
    window.addEventListener('mousedown', (e) => {
        placePlanet(e.clientX, e.clientY);
    });

    let planet = Bodies.circle(x, y, radius, {
        isStatic: true,
        mass: mass,
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

function placePlanet(x, y) {
    let planetP = Bodies.circle(x, y, 45, {
        mass: 5000,
        isStatic: true,
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

    planetP.gravityMass = 5000;

    Composite.add(engine.world, planetP);
}

// Functions
initialize();