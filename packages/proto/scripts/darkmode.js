const themeToggle = document.getElementById('theme-toggle');
const isDarkMode = localStorage.getItem('darkMode') === 'true';

// Apply the stored theme immediately when the page loads
document.addEventListener(
    'DOMContentLoaded', () => {
        // Apply the theme to the body
        document.body.classList.toggle('dark-mode', isDarkMode);
        
        // If the toggle exists on this page, sync it with the stored preference
        if (themeToggle) {
            themeToggle.checked = isDarkMode;
        }
    }
)

function toggleDM(event) {
    const target = event.target;
    const check = target.checked;
    const darkmodeEvent = new CustomEvent(
        'darkmode:toggle', {
        detail: { check },
        }
    );
    event.stopPropagation();
    document.dispatchEvent(darkmodeEvent);
}

document.addEventListener(
    'darkmode:toggle', (event) => {
        const check = event.detail.check;
        document.body.classList.toggle("dark-mode", check);
        localStorage.setItem('darkMode', check);
    }
)
