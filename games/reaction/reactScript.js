// Theme var
const theme = localStorage.getItem('theme');

// Stat vars
const bestTime = document.querySelector('.BMS');
const currentTime = document.querySelector(".CMS");

// General vars
const count = document.querySelector('.count');
const gameArea = document.querySelector(".game-area");
const gameAreaID = document.getElementById('game-area');
const startInfo = document.querySelector('.start-info');

const gameInfo = document.querySelector('.game-info');

let bestRXN = 0;

let startTime;
let timeId;

let state = "idle";

// Change theme
if (theme === '1') {
    document.documentElement.classList.add('dark');
}

// hide elements that need hiding
count.classList.add('hide');

// game area click detection
gameArea.addEventListener('click', () => {
    if (state === "idle") start();
    else if (state === "waiting") triggerPC();
    else if (state === "clickable") end();

});

// Starting game function
function start() {
    const delay = Math.random() * 3000 + 2000;
    startInfo.classList.add('hide');
    gameInfo.textContent = "Wait!";

    state = "waiting";

    timeId = setTimeout(() => {
        state = "clickable";
        gameArea.classList.add('green');
        gameInfo.textContent = "Click now!";
        startTime = performance.now();
    }, delay);
}

// End function
function end() {
    const finishTime = performance.now();
    const reactionTime = Math.round(finishTime - startTime);

    state = "idle";

    if (bestRXN === 0) bestRXN = reactionTime;            // Never letting the best rxn only be 0ms lol
    if (reactionTime < bestRXN) bestRXN = reactionTime;

    bestTime.textContent = bestRXN;
    currentTime.textContent = reactionTime;

    gameInfo.textContent = "Your time was " + reactionTime + "ms";
    gameArea.classList.remove('green');
}

// Premature clicks
function triggerPC() {
    clearTimeout(timeId);
    state = "idle";

    gameInfo.textContent = "Too soon!";
}

// Add animation counter
function animateCounter(start, target, duration, elm) {
    elm.textContent = start;
    let startTime = null;

    function update(now) {
        if (startTime === null) startTime = now;
        const t = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        elm.textContent = Math.round(start + (target - start) * ease);

        if (t < 1) requestAnimationFrame(update);
        else {
            elm.textContent = target;
            elm.classList.add("hide"); 
        }    
    }

    requestAnimationFrame(update);
}