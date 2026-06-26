const topicAutomotive = [
    {Q: "What “A” term refers to the rate at which velocity changes over time, and the direction in which that change is acting? In terms of cars, it is used to refer to the act of increasing speed.", A: "ACCELERATION"},
    {Q: "What piece of machinery in automotive makes it able to transmit power a wheel?", A: "TRANSMISSION"},
    {Q: "Which car part stores electrical energy for starting the engine and powering electronics?", A: "BATTERY"},
    {Q: "What component helps a car slow down or stop safely?", A: "BRAKES"},
    {Q: "Which part protects the car's occupants during a collision?", A: "AIRBAGS"},
    {Q: "Which system allows a car to change speed by varying the engine's power output?", A: "DRIVETRAIN"},
    {Q: "What part ensures smooth rotation of wheels by reducing friction?", A: "BEARINGS"},
    {Q: "Which car part filters harmful particles from the air entering the engine?", A: "AIRFILTER"},
    {Q: "Which part allows the driver to engage or disengage the engine from the wheels?", A: "CLUTCH"},
    {Q: "Which part of a car provides traction by gripping the road surface?", A: "TIRES"},
    {Q: "Which engine component compresses air-fuel mixture before ignition?", A: "PISTON"},
    {Q: "Which part of the engine ignites the fuel-air mixture?", A: "SPARK PLUGS"},
    {Q: "Which exterior part of a car protects the front and rear from minor collisions?", A: "BUMPER"},
    {Q: "What part covers the wheels and protects the car from road debris?", A: "FENDER"},
    {Q: "Which exterior component opens to allow passengers to enter or exit the car?", A: "DOOR"},
    {Q: "Which car exterior part helps to improve fuel efficiency and reduce drag?", A: "SPOILER"},
    {Q: "What car part helps prevent mud, rocks, and water from splashing onto the car body?", A: "MUDGUARD"},
    {Q: "What car component regulates engine temperature by controlling coolant flow between the engine and radiator?", A: "THERMOSTAT"},
    {Q: "Which engine part increases efficiency by forcing extra air into the combustion chamber?", A: "TURBOCHARGER"},
    {Q: "What component converts rotational energy into electrical energy to charge the battery?", A: "ALTERNATOR"},
    {Q: "Which car part filters and cleans the engine oil to prevent wear and tear?", A: "OIL FILTER"},
    {Q: "What component in the drivetrain compensates for differences in wheel speed during turns?", A: "DIFFERENTIAL"},
];

const topicComputer = [

];

const topicGeneralGame = [

];

// Field variables
let question = "";
let answer = "";

let topicSize = 0;



function loadQuestion() {
    setUpQuestion(topicAutomotive, 3);
}

function setUpQuestion(topic, ID) {
    const questions = document.querySelector('.question');
    const container = document.querySelector('.box-container');
    container.innerHTML = ``;

    let qRNG = Math.floor(Math.random() * topic.length);

    const topicData = topic[qRNG];

    questions.textContent = topicData.Q;

    let rngLTR = Math.floor(Math.random() * topicData.A.length);
    console.log(rngLTR);

    for(let i = 0; i < topicData.A.length; i++) {
        const input = document.createElement('input');

        input.type = 'none';
        input.inputMode = 'text';
        input.maxLength = 1;
        input.className = 'cell';
    
        container.appendChild(input);
    }
}


loadQuestion();