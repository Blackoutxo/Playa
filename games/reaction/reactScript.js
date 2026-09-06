const theme = localStorage.getItem('theme');

// Change theme
if (theme === '1') {
    document.documentElement.classList.add('dark');
}

// Animating timeouts (temporarily unused)
setTimeout(() => {
    document.querySelector('.loading-screen').classList.add('zoom');
}, 3000);