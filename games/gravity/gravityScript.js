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
    context.shadowColor = "#ffffff60";
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
    window.addEventListener('mousedown', (e) => {
        if (placeableHeavenlyBodies !== 0 && !launched) {
            placePlanet(e.clientX, e.clientY, 6500);
        }
    });

    // Heavenly bodies
    levelData.heavenlyPos.forEach(planet => {
        createHeavenlyBodies(planet.x, planet.y, planet.radius, planet.mass);
    });

    // Add all bodies
    window.addEventListener('keydown', (e) => {
        console.log(e.key);
        if (e.key === " " && !launched) {
            Composite.add(engine.world, comet);

            launched = true;
            gameStarted = true;

            
            window.addEventListener('keydown', (e) => {
                if (e.key === "Enter" && launched && gameStarted) {
                    resetAllotedPlanets(currentLevel);
                    loadLevel(currentLevel);
           
                    setTimeout(() => {
                        launched = false;
                        gameStarted = false;                
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

    // Reduce alloted bodies
    placeableHeavenlyBodies--;

    // Spawn the planet
    Composite.add(engine.world, planetP);
}

function resetAllotedPlanets(levelIndex) {
    const lvlData = gameLevels[levelIndex];

    placeableHeavenlyBodies = lvlData.allotedHeavenlyBodies;
}

Events.on(engine, 'collisionStart', function(event) {
    const pairs = event.pairs;
    
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        
        if (pair.bodyA === comet || pair.bodyB === comet) {
            gameStarted = false;
            launched = false;
            currentLevel++;

            setTimeout(() => {
                loadLevel(currentLevel);        
            }, 1000);
        }
    }
});

// After render
Events.on(render, 'afterRender', function() {
    var context = render.context;
    var bodies = Composite.allBodies(engine.world);

    context.save(); 

    for (var i = 0; i < bodies.length; i++) {
        var body = bodies[i];
        
        // Skip bodies that don't have a custom shadow color defined
        if (!body.plugin || !body.plugin.shadowColor) continue;

        // Skip static boundaries or hidden items if needed
        if (body.isStatic) continue; 

        var vertices = body.vertices;

        // Configure canvas shadow settings for this specific body
        context.shadowColor = body.plugin.shadowColor;
        context.shadowBlur = 15;
        context.shadowOffsetX = 5;
        context.shadowOffsetY = 8;

        // Draw a path tracking the body's physical vertices
        context.beginPath();
        context.moveTo(vertices[0].x, vertices[0].y);
        for (var j = 1; j < vertices.length; j++) {
            context.lineTo(vertices[j].x, vertices[j].y);
        }
        context.closePath();

        // Match the background color of the body to prevent visual clipping
        context.fillStyle = body.render.fillStyle || '#ffffff';
        context.fill();
    }

    context.restore(); 
});

// Functions
initialize();