// var
const gameOver = false;

// Plugin
Matter.use(MatterAttractors);

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

const Body = Matter.Body;

// create an engine
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

// global shadow
Matter.Events.on(render, 'beforeRender', function() {
    var context = render.context;
    context.shadowBlur = 25;
});

// create movable body
var circle = Bodies.circle(100, 400, 30, {
    mass: 80, 
    shadowColor: '#3155cc42',
    render: {
        fillStyle: '#3155cc'
    }
});

Body.setVelocity(circle, {x: 10, y: 0})

// create attractive body
var attractiveBody = Bodies.circle(600, 200, 50, {
    isStatic: true,
    plugin: {
        attractors: [
            MatterAttractors.Attractors.gravity
        ]
    },
    shadowColor: '#c92222af',
    render: {
        fillStyle: '#c92222',

    }
});

Matter.Events.on(render, 'afterRender', function() {
    var context = render.context;
    var bodies = Composite.allBodies(engine.world);

    context.save(); 
});


Matter.Body.setMass(attractiveBody, 10000);

// add all of the bodies to the world
Composite.add(engine.world, [attractiveBody, circle]);

Matter.Events.on(engine, 'afterUpdate', function() {

    if (isNaN(circle.position.x) || !isFinite(circle.position.x)) {
                
        Composite.remove(engine.world, circle);

        circle = Bodies.circle(100, 400, 30, {
            mass: 80, 
            shadowColor: '#3155cc42',
            render: {
                fillStyle: '#3155cc'
            }
        });

        Body.setVelocity(circle, {x: 10, y: 0});

        Composite.add(engine.world, circle);
    }
});

// No gravity
engine.gravity.scale = 0;

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);