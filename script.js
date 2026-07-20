// Remove the init bar
const initWindow = document.querySelector('.init-window');

// Load screen disappear
setInterval(() => {
    initWindow.classList.add('disappear');
}, 1800);

// -------- Lenis --------- // 
let lenis;
let rafId;

function initLenis() {
    // Destroy old
    if (lenis) {
        lenis.destroy();
        lenis = null;
    }
    if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }

    // horizontal scroll
    document.body.style.overflowY = '';
    document.body.style.overflowX = '';

    const wrapper = document.querySelector('.game-selection-window');
    const content = document.querySelector('.game-container');
    
    lenis = new Lenis({
        wrapper: wrapper,
        content: content,
        eventsTarget: wrapper,
        orientation: 'horizontal',   
        gestureOrientation: 'both',
        smoothWheel: true,
        wheelMultiplier: 3,
        touchMultiplier: 1.8,
        lerp: 0.1,
        infinite: false,
    });

    // RAF loop
    function raf(time) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);
}

initLenis();

// --------- Settings ---------- //
const settingsBar = document.querySelector('.settings');
const settingBtn = document.querySelector('.settings-icon');

let toggle = 0;

settingsBar.classList.add('hidden');

settingBtn.addEventListener('click', () => {
    // Show side bar
    settingsBar.classList.remove('hidden');

    // Toggle increment
    toggle += 1;

    // Condition
    if (toggle === 1) {
        settingBtn.classList.add('clicked');
        if (settingBtn.classList.contains('clickedRev')) settingBtn.classList.remove('clickedRev');
    } else if (toggle === 2) {
        settingBtn.classList.add('clickedRev');
        settingBtn.classList.remove('clicked');
        settingsBar.classList.add('hidden');
        toggle = 0;
    }
});

// Settings bar
const toggleTrack = document.querySelector('.toggle-button');
const toggleknob = document.querySelector('.toggleable-button');
let toggleTheme = 0;

const storedTheme = localStorage.getItem('theme');
if (storedTheme === '1') {
    toggleTheme = 1;
    document.documentElement.classList.add('dark');
    toggleknob.classList.add('clicked');
} else {
    toggleTheme = 0;
    document.documentElement.classList.remove('dark');
    toggleknob.classList.remove('clicked');
}

updateIcon();

toggleTrack.addEventListener('click', () => {
    if (toggleTheme === 0) {
        toggleknob.classList.add('clicked');
        document.documentElement.classList.add('dark');
        toggleTheme = 1;
    } else {
        toggleknob.classList.remove('clicked');
        document.documentElement.classList.remove('dark');
        toggleTheme = 0;
    }

    localStorage.setItem('theme', toggleTheme ? '1' : '0');
    updateIcon();
});

function updateIcon() {
  const isDark = document.documentElement.classList.contains('dark');

  if (isDark) {
    settingBtn.src = './assets/images/icon/settings-white.svg';
} else {
    settingBtn.src = './assets/images/icon/settings-icon.svg';
}

}

updateIcon();