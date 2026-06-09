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
    settingsBar.classList.add('hidden');

    // Animation settings icon
    settingBtn.classList.remove('clickedRev');
    settingBtn.classList.add('clicked');
    toggle += 1;

    if(toggle === 2) {
        settingBtn.classList.remove('clicked');
        settingBtn.classList.add('clickedRev');

        settingsBar.classList.remove('hidden');

        toggle = 0;
    }
});

// Settings bar
const toggleTrack = document.querySelector('.toggle-button');
const toggleknob = document.querySelector('.toggleable-button');
let toggleTheme = 0;

toggleTrack.addEventListener('click', () => {
    console.log('clicked toggle button');

    if (toggleTheme === 0) {
        toggleknob.classList.add('clicked');
        document.documentElement.classList.add('dark');
        toggleTheme = 1;
    } else {
        toggleknob.classList.remove('clicked');
        document.documentElement.classList.remove('dark');
        toggleTheme = 0;
    }

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