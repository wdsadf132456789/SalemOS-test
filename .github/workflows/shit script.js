let currentIndex = 0;
const items = document.querySelectorAll('.nav-item');
const menu = document.getElementById('links-menu');
let inMenu = false; // Track if we are in the top menu or main menu

// Navigation Logic
document.addEventListener('keydown', (e) => {
    // 1. ESC to toggle Top Menu
    if (e.key === 'Escape') {
        menu.classList.toggle('hidden');
        inMenu = !inMenu;
        return;
    }

    // 2. Q to Exit (Self-close attempt)
    if (e.key === 'q') {
        // This works if the page was opened via window.open()
        window.close();
        // Fallback: If it doesn't close, clear the screen to simulate shutdown
        document.body.innerHTML = '<h1 style="text-align:center; margin-top:20%;">SYSTEM HALTED</h1>';
    }

    // 3. Navigation with Arrows
    if (!inMenu) {
        if (e.key === 'ArrowDown' && currentIndex < items.length - 1) {
            items[currentIndex].classList.remove('focused');
            items[++currentIndex].classList.add('focused');
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            items[currentIndex].classList.remove('focused');
            items[--currentIndex].classList.add('focused');
        }
    }
});

// Real-time Stats Engine
setInterval(() => {
    const cpu = Math.floor(Math.random() * 100);
    document.getElementById('cpu-val').innerText = cpu;
    document.getElementById('cpu-bar').innerText = '|'.repeat(Math.round(cpu / 10)) + '.'.repeat(10 - Math.round(cpu / 10));

    const ram = Math.floor(Math.random() * 100);
    document.getElementById('ram-val').innerText = ram;
    document.getElementById('ram-bar').innerText = '|'.repeat(Math.round(ram / 10)) + '.'.repeat(10 - Math.round(ram / 10));
}, 2000);
