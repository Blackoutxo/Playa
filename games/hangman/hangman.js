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
    {Q: "Which part of the engine ignites the fuel-air mixture?", A: "SPARKPLUGS"},
    {Q: "Which exterior part of a car protects the front and rear from minor collisions?", A: "BUMPER"},
    {Q: "What part covers the wheels and protects the car from road debris?", A: "FENDER"},
    {Q: "Which exterior component opens to allow passengers to enter or exit the car?", A: "DOOR"},
    {Q: "Which car exterior part helps to improve fuel efficiency and reduce drag?", A: "SPOILER"},
    {Q: "What car part helps prevent mud, rocks, and water from splashing onto the car body?", A: "MUDGUARD"},
    {Q: "What car component regulates engine temperature by controlling coolant flow between the engine and radiator?", A: "THERMOSTAT"},
    {Q: "Which engine part increases efficiency by forcing extra air into the combustion chamber?", A: "TURBOCHARGER"},
    {Q: "What component converts rotational energy into electrical energy to charge the battery?", A: "ALTERNATOR"},
    {Q: "Which car part filters and cleans the engine oil to prevent wear and tear?", A: "OILFILTER"},
    {Q: "What component in the drivetrain compensates for differences in wheel speed during turns?", A: "DIFFERENTIAL"},
];

const topicComputer = [

];

const topicGeneralGame = [

];

// Field variables
let question = "";
let answer = "";
let typed = "";

let strike = 5;

let topicSize = 0;

// Elements
const container = document.querySelector('.box-container');
const head = document.querySelector('.head');
const Larm = document.querySelector('.arm-left');
const Rarm = document.querySelector('.arm-right');
const trunk = document.querySelector('.trunk');
const Lleg = document.querySelector('.leg-left');
const Rleg = document.querySelector('.leg-right');

// Load question
function loadQuestion() {
    setUpQuestion(topicAutomotive);
}

// Set up the question
function setUpQuestion(topic) {
    const questions = document.querySelector('.question');

    let qRNG = Math.floor(Math.random() * topic.length);

    const topicData = topic[qRNG];

    // Setup topic size
    topicSize = topicData.length;

    // Set question
    questions.textContent = topicData.Q;

    // Answer
    const answer = topicData.A.split('');

    // Random clue generator
    let rngLTR = Math.floor(Math.random() * topicData.A.length);

    answer.forEach((letter, i) => {
        const input = document.createElement('input');

        // Define
        input.type = 'text';
        input.inputMode = 'text';
        input.maxLength = 1;
        input.dataset.correct = letter.toUpperCase();
        input.className = "cell";
        input.readOnly = true;

        // Initial clue
        input.value = i === rngLTR ? answer[i] : '';      
    
        container.appendChild(input);
    });
}

// Input log
window.addEventListener('keydown', (e) => {
    typed = e.key.toUpperCase();

    const cells = Array.from(container.querySelectorAll(".cell"));

    cells.forEach((cell) => {
        if (cell.dataset.correct === typed) {
            console.log(typed);
            cell.value = typed; 
        } else {

        }
    });
});

function checkAnswer(cells, answer) {

}

function hideAll() {
    const hangman = document.querySelectorAll('.head, .arm-left, .arm-right, .trunk, .leg-left, .leg-right');
    hangman.forEach((elm) => {
        elm.classList.add('hide');
    });
}

// START THE GAME
hideAll();
loadQuestion();
