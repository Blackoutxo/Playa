// Variables
const pi = "15926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989";

let number = "";
let index = 0;
let numpadInput = NaN;

let visibility = false;
let hearts = 3;

let score = 0;
let highScore = 0;

// Documents
const cScore = document.querySelector('.current-score');
const hScore = document.querySelector('.high-score');

const loadingScreen = document.querySelector('.loading-screen');
const sqnceShake = document.querySelector('.sequence');
const visible = document.querySelector('.eye');
const restartbtn = document.querySelector('.cross');
const sequence = document.querySelector('.sequence-before');
const clue = document.querySelector('.clue-text');
const retry = document.querySelector('.display-bg');

// Add initial text contents
sequence.textContent = "3.14";

// Remove screen
setTimeout(() => {
    loadingScreen.classList.toggle('disappear');
}, 4000);

// Sequencing
function numpad() {
    const nums = document.querySelectorAll('.num-0, .num-1, .num-2, .num-3, .num-4, .num-5, .num-6, .num-7, .num-8, .num-9');

    nums.forEach(num => {
        num.addEventListener('click', (e) => {
            num.classList.add('clicked');

            numpadInput = num.textContent;

            if (numpadInput === pi[index]) {
                number += numpadInput.toString();
                score++;
                index++;
            } else if (numpadInput !== 'X' && numpadInput !== 'visibility') {
                hearts--;
            }

            heart();
            displayScore();

            showClue(index);
            sequence.textContent = "3.14" + number;
        
            setTimeout(() => {
                num.classList.remove('clicked');
            }, 300);
        });
    });
}

// Click handler
numpad();

// Keyboard input listner
window.addEventListener('keydown', 
    function handleNumAccept(e) {
        if (e.key === pi[index]) {
            number += e.key;
            score++;
            index++;
        } else {
            hearts--;
        }
        
        displayScore();
        heart();

        showClue(index);
        sequence.textContent = "3.14" + number;
    }
);

// visibility animation
visible.addEventListener('click', () => {
    visible.classList.toggle('clicked');
    visible.classList.toggle('anim');

    // Visibility bool
    visibility = visibility ? false : true;

    // Show clue
    showClue(index);
});

visible.addEventListener('animationend', () => {
    visible.classList.toggle('anim');
});

// Heart animation / docs
const heart_1 = document.querySelector('.heart-1');
const heart_2 = document.querySelector('.heart-2');
const heart_3 = document.querySelector('.heart-3');;

function heart() {
    if (hearts === 2) {
        sqnceShake.classList.toggle('shake');
        heart_1.classList.add('down');
        setTimeout(() => {
            sqnceShake.classList.toggle('shake');
        }, 210);
    }

    if (hearts === 1) {
        heart_2.classList.add('down');
        sqnceShake.classList.toggle('shake');

        setTimeout(() => {
            sqnceShake.classList.toggle('shake');
        }, 210);
    }

    if (hearts === 0) {
        sqnceShake.classList.toggle('shake');
        heart_3.classList.add('down');
        restart();

        setTimeout(() => {
            sqnceShake.classList.toggle('shake');
        }, 210);
    } 
}

// Show score
function displayScore() {
    cScore.textContent = score;
    hScore.textContent = highScore;
}

// Restart Button
function restartButton() {
    // Toggle on
    restartbtn.addEventListener('click', () => {
        restartbtn.classList.toggle('clicked');
        restart();
    });

    // Toggle off on animation end
    restartbtn.addEventListener('animationend', () => {
        restartbtn.classList.toggle('clicked');
    });
}

// Restart
function restart() {
    highScore = score > highScore ? score : highScore;
    score = 0;
    displayScore();

    hearts = 3;
    index = 0;
    number = "";

    sequence.textContent = "3.14";
    clue.textContent = "";
    showClue(index);

    // Retry screen
    retry.classList.toggle('visible');

    setTimeout(() => {
        retry.classList.toggle('visible');
    }, 500);

    // Replenish hearts
    heart_1.classList.remove('down');
    heart_2.classList.remove('down');
    heart_3.classList.remove('down');
}

// Show clue
function showClue(indx) {
    if (visibility) clue.textContent = pi[index];
    else clue.textContent = "";
}

// Functions
restartButton();