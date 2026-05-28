// Remove the init bar
const initWindow = document.querySelector('.init-window');

setInterval(() => {
    initWindow.classList.add('dissapear');
}, 1800);

// --------- Settings ---------- //
const settingsBar = document.querySelector('.settings');
const settingBtn = document.querySelector('.settings-icon');

const toggleBtn = document.querySelector('.toggle-button');
const toggleableBtn = document.querySelector('.toggleable-button');
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

toggleBtn.addEventListener('click', () => {
    console.log('clicked toggle button');
    toggleableBtn.classList.add('clicked');
});
