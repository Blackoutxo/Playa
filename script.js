// Remove the init bar
const initWindow = document.querySelector('.init-window');

setInterval(() => {
    initWindow.classList.add('dissapear');
}, 1800);

// --------- Settings ---------- //
const settingsBar = document.querySelector('.settings');
const settingBtn = document.querySelector('.settings-icon');

settingsBar.classList.add('hidden');


