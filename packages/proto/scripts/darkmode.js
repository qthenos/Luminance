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

// Only add the toggle listener if the toggle exists on this page
if (themeToggle) {
    themeToggle.addEventListener(
        'change', (event) => {
            const check = themeToggle.checked;
            document.body.classList.toggle("dark-mode", check);
            localStorage.setItem('darkMode', check);
        }
    )
}