// Remove the init bar
const initWindow = document.querySelector('.init-window');

// Load screen disappear
setInterval(() => {
    initWindow.classList.add('disappear');
}, 1800);

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