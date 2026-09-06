// Theme var
const theme = localStorage.getItem('theme');

// Stat vars
const bestTime = document.querySelector('.BMS');
const currentTime = document.querySelector(".CMS");

// General vars
const count = document.querySelector('.count');

// Change theme
if (theme === '1') {
    document.documentElement.classList.add('dark');
}

// Animating timeouts (temporarily unused)
setTimeout(() => {
    document.querySelector('.loading-screen').classList.add('zoom');
}, 3000);

// hide elements that need hiding
count.classList.add('hide');

// Add animation counter
function animateCounter(start, target, elm) {
    const duration = 2000;
    elm.textContent = start;

    function update(now) {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        elm.textContent = Math.round(ease * target);

        if (t < 1) requestAnimationFrame(update);
        else elm.textContent = target;
    }

    requestAnimationFrame(update);
}