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

const topicAircraft = [

];

const topicAnatomy = [

];

// Field variables
const topics = ["Automotive", "Computer", "Game", "Aircraft", "Human anatomy"];

let QUESTIONS = [""];
let ANSWER = "";
let typed = "";

let strike = 6;
let score = 0;

let topicSize = 0;
let topicsCount = 0;
let selectedTopic = null;

// Elements
const loadingScreen = document.querySelector('.loading-screen');
const header = document.querySelector('.header');

const container = document.querySelector('.box-container');
const buttonContainer = document.getElementById('buttons');

const head = document.querySelector('.head');
const Larm = document.querySelector('.arm-left');
const Rarm = document.querySelector('.arm-right');
const trunk = document.querySelector('.trunk');
const Lleg = document.querySelector('.leg-left');
const Rleg = document.querySelector('.leg-right');

// Load question
function loadQuestion() {
    console.log(selectedTopic);
    setUpQuestion(selectedTopic);
}

// Set up the question
function setUpQuestion(topic) {
    const questions = document.querySelector('.question');
    container.innerHTML = '';

    const topicData = topic[score];

    // Setup topic size
    topicSize = topic.length;

    // Set question
    questions.textContent = topicData.Q;

    // Add asked questions to the array
    QUESTIONS.push(topicData.Q);
    
    console.log(QUESTIONS); 
    
    // Answer
    const answer = topicData.A.split('');

    // Set up local accessible variable
    ANSWER = answer;

    // Random clue generator
    let rngLTR = Math.floor(Math.random() * topicData.A.length);

    answer.forEach((letter, i) => {
        const input = document.createElement('input');

        if (container.contains(input)) container.removeChild(input);

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
    if (strike < 0) return;

    // Fetch input key
    typed = e.key.toUpperCase();

    const cells = Array.from(container.querySelectorAll(".cell"));

    // Strike if incorrect
    if (!ANSWER.includes(typed)) strike--;

    // Check hangman elements
    hangman();

    // Check if every cell is filled
    if (checkAnswer(cells, ANSWER)) {
        score++;
        loadQuestion();
    }

    cells.forEach((cell) => {
        if (cell.dataset.correct === typed) {
            cell.value = typed;
        }
    });
});

// Hangman generation
function hangman() {
    if (strike === 5) Lleg.classList.remove('hide');
    else if (strike === 4) Rleg.classList.remove('hide');
    else if (strike === 3) trunk.classList.remove('hide');
    else if (strike === 2) Larm.classList.remove('hide');
    else if (strike === 1) Rarm.classList.remove('hide');
    else if (strike === 0) head.classList.remove('hide'); 
}

// Buttons
function createButton() {
    topics.forEach((e) => {
        const button = document.createElement('div');

        // Topics count
        topicsCount++;

        // define the element
        button.classList.add('button');
        button.setAttribute = e;
        button.textContent = e;

        buttonContainer.style.gridTemplateColumns = `repeat(${topicsCount}, 10vw)`;
        buttonContainer.style.gridTemplateRows = `repeat(1, 1)`;

        buttonContainer.appendChild(button);
    });
}

function fetchButtonID() {
    buttonContainer.childNodes.forEach((childs) => {
        childs.addEventListener('click', (button) => {
            loadingScreen.classList.add('moveOut');
            header.classList.add('moveIn');

            selectedTopic = clicked(childs.textContent);
        
            loadQuestion();
        });
    });
}

function clicked(button) {
    if (button === "Automotive") return topicAutomotive;
    else if (button === "Computer") return topicComputer;
    else if (button === "Game") return topicGeneralGame;
    else if (button === "Aircraft") return topicAircraft;
    else if (button === "Human Anatomy") return topicAnatomy;

    return null;
}

// Check if the answer in the cell is correct
function checkAnswer(cells, answer) {
    const correct = cells.every(
        (cell, i) => cell.value === answer[i]
    );

    return correct;
}

// Hide da man!
function hideAll() {
    const hangman = document.querySelectorAll('.head, .arm-left, .arm-right, .trunk, .leg-left, .leg-right');
    hangman.forEach((elm) => {
        elm.classList.add('hide');
    });
}

// START THE GAME
hideAll();
createButton();
fetchButtonID();